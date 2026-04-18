#!/usr/bin/env node
// Recompute selling_price with IVA 23% included, so net margin after IVA = 80%.
// Formula: selling = cost × 1.80 × 1.23
// Updates ae_products.selling_price AND rewrites prices in src/data/products.ts.
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

const MARGIN = 0.80;
const IVA = 0.23;
const FACTOR = (1 + MARGIN) * (1 + IVA); // 1.8 * 1.23 = 2.214

function toPriceStr(n) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}
function round2(n) {
  return Math.round(n * 100) / 100;
}

// 1. Fetch all ae_products
const r = await fetch(
  `${URL}/rest/v1/ae_products?select=id,ae_product_id,cost_price,local_product_id`,
  { headers: { apikey: KEY, authorization: `Bearer ${KEY}` } },
);
const rows = await r.json();
console.log(`Fetched ${rows.length} ae_products`);

// 2. Build new price map (local_product_id → {price, oldPrice})
const priceMap = new Map();
for (const row of rows) {
  const cost = Number(row.cost_price) || 0;
  if (cost === 0 || !row.local_product_id) continue;
  const selling = round2(cost * FACTOR);
  const oldPrice = round2(selling * 1.25);
  priceMap.set(row.local_product_id, { selling, oldPrice, row });
}
console.log(`Computed prices for ${priceMap.size} products`);

// 3. Update ae_products.selling_price in Supabase
let ok = 0;
for (const [pid, { selling, row }] of priceMap) {
  const r2 = await fetch(`${URL}/rest/v1/ae_products?id=eq.${row.id}`, {
    method: "PATCH",
    headers: {
      apikey: KEY,
      authorization: `Bearer ${KEY}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify({ selling_price: selling }),
  });
  if (r2.ok) ok++;
  else console.log(`✗ ${pid}  ${r2.status}`);
}
console.log(`Supabase updated: ${ok}/${priceMap.size}`);

// 4. Rewrite prices in products.ts
const prodPath = path.join(process.cwd(), "src", "data", "products.ts");
let src = fs.readFileSync(prodPath, "utf8");

// Backup
fs.writeFileSync(
  path.join(process.cwd(), "src", "data", `products.backup.pre-iva-${Date.now()}.ts`),
  src,
);

let patches = 0;
for (const [pid, { selling, oldPrice }] of priceMap) {
  // Match the product block by "id": <pid>, then update price + oldPrice within the next ~20 lines
  const idRe = new RegExp(`("id":\\s*${pid},[\\s\\S]*?)("price":\\s*)"[^"]*"`, "m");
  const oldRe = new RegExp(`("id":\\s*${pid},[\\s\\S]*?)("oldPrice":\\s*)"[^"]*"`, "m");

  const newSrc1 = src.replace(idRe, `$1$2"${toPriceStr(selling)}"`);
  if (newSrc1 !== src) patches++;
  src = newSrc1;
  src = src.replace(oldRe, `$1$2"${toPriceStr(oldPrice)}"`);
}

fs.writeFileSync(prodPath, src);
console.log(`products.ts patched: ${patches} price blocks updated`);

// 5. Show sample
console.log("\n=== Sample new prices ===");
let i = 0;
for (const [pid, { selling, oldPrice, row }] of priceMap) {
  if (i++ >= 5) break;
  const cost = Number(row.cost_price);
  const net = selling / 1.23;
  const profit = net - cost;
  console.log(
    `${pid} | cost=${cost.toFixed(2)} → net=${net.toFixed(2)} → display=${toPriceStr(selling)} (old=${toPriceStr(oldPrice)}) | lucro=${profit.toFixed(2)}€ (${((profit / cost) * 100).toFixed(0)}%)`,
  );
}
