#!/usr/bin/env node
// Extract real specs from ae_item_properties + SKU attrs and rewrite features[] in products.ts.
import fs from "node:fs";
import path from "node:path";

const env = Object.fromEntries(
  fs
    .readFileSync(path.join(process.cwd(), ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;

// Attrs to keep (by normalized name), in priority order
const PRIORITY = [
  "Nome da marca",
  "Marca",
  "Modelo",
  "Número do modelo",
  "Tipo de interface",
  "Tipo",
  "Resolução DPI",
  "DPI",
  "Sensor",
  "Tipo de sensor",
  "Estilo",
  "Conectividade",
  "Interface",
  "Tipo de conexão",
  "Sem fio",
  "Tipo de chave",
  "Switch",
  "Layout do teclado",
  "Tamanho",
  "Número de teclas",
  "Iluminação",
  "Cor da luz",
  "Cor de fundo",
  "Material",
  "Peso",
  "Compatível com",
  "Polling Rate",
  "Taxa de polling",
];

// Map Portuguese labels to clean site labels
const LABEL_MAP = {
  "Nome da marca": "Marca",
  "Número do modelo": "Modelo",
  "Tipo de interface": "Interface",
  "Resolução DPI": "DPI",
  "Tipo de sensor": "Sensor",
  "Tipo de chave": "Switches",
  "Tipo de conexão": "Conexão",
  "Layout do teclado": "Layout",
  "Número de teclas": "Teclas",
  "Cor da luz": "Iluminação",
  "Taxa de polling": "Polling",
  "Compatível com": "Compatibilidade",
};

function clean(v) {
  if (typeof v !== "string") return String(v ?? "");
  return v
    .replace(/\s+/g, " ")
    .replace(/^[,.;:\s-]+|[,.;:\s-]+$/g, "")
    .slice(0, 60);
}

function extractFeatures(raw) {
  const result = raw?.aliexpress_ds_product_get_response?.result ?? raw?.result ?? raw ?? {};
  const props = result?.ae_item_properties?.ae_item_property ?? [];
  const seen = new Set();
  const out = [];

  // First pass: PRIORITY order
  for (const key of PRIORITY) {
    if (out.length >= 6) break;
    const found = props.find(
      (p) => p.attr_name?.trim().toLowerCase() === key.toLowerCase(),
    );
    if (found && found.attr_value) {
      const value = clean(found.attr_value);
      // Skip useless filler values
      if (/^(padrão|standard|sim|não|yes|no|other)$/i.test(value)) continue;
      const label = LABEL_MAP[key] || key;
      if (seen.has(label.toLowerCase()) || seen.has(key.toLowerCase())) continue;
      seen.add(label.toLowerCase());
      seen.add(key.toLowerCase());
      out.push({ name: label, value });
    }
  }

  // Second pass: any remaining useful props (if we have room)
  for (const p of props) {
    if (out.length >= 6) break;
    if (!p.attr_name || !p.attr_value) continue;
    const k = p.attr_name.toLowerCase();
    if (seen.has(k)) continue;
    // Skip useless/customer-unfriendly attrs
    if (
      /package|embalagem|peso da embalagem|dimensões da embalagem|certifica|origem|lugar de|place of|produto químico|chemical|svhc|número do item|item number|quantidade da caixa|caixa contém/i.test(
        p.attr_name,
      )
    )
      continue;
    // Skip useless values in second pass too
    if (/^(nenhum|none|n\/a|--|other|outro)$/i.test(p.attr_value)) continue;
    seen.add(k);
    out.push({ name: clean(p.attr_name), value: clean(p.attr_value) });
  }

  // Fallback to minimum 3 features
  if (out.length < 3) {
    out.push({ name: "Origem", value: "AliExpress" });
    out.push({ name: "Envio", value: "Para PT" });
  }

  return out.slice(0, 6);
}

function extractSizes(raw) {
  const result = raw?.aliexpress_ds_product_get_response?.result ?? raw?.result ?? raw ?? {};
  const skus = result?.ae_item_sku_info_dtos?.ae_item_sku_info_d_t_o ?? [];
  const sizes = new Set();
  for (const s of skus) {
    // sku_attr examples: "5:144764155#350x600x3mm" or "14:193#Black"
    const val = s.sku_attr?.split("#")?.[1];
    if (val && val.length < 40) sizes.add(val);
  }
  return [...sizes];
}

// 1. Fetch all ae_products with raw
const r = await fetch(
  `${URL}/rest/v1/ae_products?select=ae_product_id,local_product_id,raw_ae_response`,
  { headers: { apikey: KEY, authorization: `Bearer ${KEY}` } },
);
const rows = await r.json();
console.log(`Fetched ${rows.length} ae_products`);

const featureMap = new Map(); // local_product_id → features[]
for (const row of rows) {
  if (!row.local_product_id) continue;
  const features = extractFeatures(row.raw_ae_response);
  const sizes = extractSizes(row.raw_ae_response);
  if (sizes.length > 0 && !features.find((f) => /tamanho|size/i.test(f.name))) {
    features.push({
      name: "Variantes",
      value: sizes.slice(0, 3).join(" / "),
    });
  }
  featureMap.set(row.local_product_id, features.slice(0, 6));
}
console.log(`Computed features for ${featureMap.size} products`);

// 2. Patch products.ts — replace features[] array per product block
const prodPath = path.join(process.cwd(), "src", "data", "products.ts");
let src = fs.readFileSync(prodPath, "utf8");

fs.writeFileSync(
  path.join(process.cwd(), "src", "data", `products.backup.pre-features-${Date.now()}.ts`),
  src,
);

let patched = 0;
for (const [pid, features] of featureMap) {
  // Match `"id": <pid>,` block, then replace its "features": [...]
  // Build a regex that captures from "id": pid up through the features array end
  const re = new RegExp(
    `("id":\\s*${pid},[\\s\\S]*?"features":\\s*\\[)[\\s\\S]*?(\\s*\\])`,
    "m",
  );

  const serialized = features
    .map(
      (f) => `\n    {\n      "name": "${f.name}",\n      "value": "${f.value}"\n    }`,
    )
    .join(",");

  const before = src;
  src = src.replace(re, `$1${serialized}\n  $2`);
  if (src !== before) patched++;
}

fs.writeFileSync(prodPath, src);
console.log(`products.ts patched: ${patched}/${featureMap.size}`);

// Sample
console.log("\n=== Sample new features ===");
let i = 0;
for (const [pid, features] of featureMap) {
  if (i++ >= 3) break;
  console.log(
    `\n[${pid}]\n  ` + features.map((f) => `${f.name}: ${f.value}`).join("\n  "),
  );
}
