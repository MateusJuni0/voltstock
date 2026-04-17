#!/usr/bin/env node
// Re-normalize all ae_products from their stored raw_ae_response, without re-hitting AE.
// Uses the real nested paths: ae_item_base_info_dto, ae_item_sku_info_dtos, ae_multimedia_info_dto.
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

function getP(root, path) {
  let cur = root;
  for (const k of path) {
    if (cur && typeof cur === "object") cur = cur[k];
    else return undefined;
  }
  return cur;
}
function num(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^0-9.,-]/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
function str(v) {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return null;
}

function normalize(raw, aeId) {
  const result = getP(raw, ["aliexpress_ds_product_get_response", "result"]) ?? raw ?? {};
  const base = result.ae_item_base_info_dto ?? {};
  const mm = result.ae_multimedia_info_dto ?? {};
  const skuArr = result.ae_item_sku_info_dtos?.ae_item_sku_info_d_t_o ?? [];

  const title = str(base.subject) ?? "AE Product";
  const category = str(base.category_name) ?? str(base.category_id) ?? null;

  let cost = 0,
    currency = "EUR";
  for (const s of skuArr) {
    const p = num(s.offer_sale_price) ?? num(s.offer_bulk_sale_price) ?? num(s.sku_price);
    if (p != null && p > 0 && (cost === 0 || p < cost)) {
      cost = p;
      currency = str(s.currency_code) ?? currency;
    }
  }

  let gallery = [];
  if (typeof mm.image_urls === "string") {
    gallery = mm.image_urls.split(/[;,\n]/).map((s) => s.trim()).filter(Boolean);
  }
  const mainImage = gallery[0] ?? null;

  let stock = 0;
  for (const s of skuArr) stock += num(s.sku_available_stock) ?? 0;

  return {
    name: title,
    category,
    cost_price: cost,
    currency,
    main_image: mainImage,
    gallery,
    stock_quantity: Math.max(0, Math.round(stock)),
    sku_list: skuArr,
    description: str(base.detail),
  };
}

const MARGIN = 80;

const r = await fetch(
  `${URL}/rest/v1/ae_products?select=id,ae_product_id,raw_ae_response,margin_percentage,selling_price`,
  { headers: { apikey: KEY, authorization: `Bearer ${KEY}` } },
);
const rows = await r.json();
console.log(`Fetched ${rows.length} ae_products`);

const updates = [];
for (const row of rows) {
  if (!row.raw_ae_response) {
    console.log(`skip ${row.ae_product_id} — no raw`);
    continue;
  }
  const n = normalize(row.raw_ae_response, row.ae_product_id);
  const margin = row.margin_percentage ?? MARGIN;
  const selling = n.cost_price > 0
    ? Math.round(n.cost_price * (1 + margin / 100) * 100) / 100
    : row.selling_price ?? 0;
  updates.push({
    id: row.id,
    ae_product_id: row.ae_product_id,
    ...n,
    selling_price: selling,
  });
}

// PATCH each row
let ok = 0,
  fail = 0;
for (const u of updates) {
  const { id, ae_product_id, ...patch } = u;
  const r2 = await fetch(`${URL}/rest/v1/ae_products?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: KEY,
      authorization: `Bearer ${KEY}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify(patch),
  });
  if (r2.ok) {
    ok++;
    console.log(
      `✓ ${ae_product_id}  ${patch.name?.slice(0, 50)}  cost=${patch.cost_price}${patch.currency}  stock=${patch.stock_quantity}  img=${patch.main_image ? "y" : "n"}`,
    );
  } else {
    fail++;
    const t = await r2.text();
    console.log(`✗ ${ae_product_id}  ${r2.status}  ${t.slice(0, 200)}`);
  }
}
console.log(`\nOK: ${ok}  FAIL: ${fail}`);
