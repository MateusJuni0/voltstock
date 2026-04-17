#!/usr/bin/env node
// Fetch raw_ae_response for a specific ae_product_id and dump its structure.
import fs from "node:fs";
import path from "node:path";

const envRaw = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
const env = Object.fromEntries(
  envRaw
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const AE_ID = process.argv[2] || "1005007781334616";

const r = await fetch(
  `${URL}/rest/v1/ae_products?ae_product_id=eq.${AE_ID}&select=ae_product_id,name,cost_price,selling_price,currency,main_image,gallery,stock_quantity,raw_ae_response`,
  { headers: { apikey: KEY, authorization: `Bearer ${KEY}` } },
);
const rows = await r.json();
if (!rows[0]) {
  console.log("no row");
  process.exit(1);
}
const row = rows[0];
console.log("Name:", row.name);
console.log("Cost:", row.cost_price, "Selling:", row.selling_price, "Currency:", row.currency);
console.log("Stock:", row.stock_quantity, "Main image:", row.main_image);
console.log("Gallery count:", (row.gallery || []).length);
console.log("\n=== raw_ae_response TOP-LEVEL KEYS ===");
const raw = row.raw_ae_response;
console.log(Object.keys(raw || {}));

// Dump nested keys to find where pricing lives
function walk(obj, prefix = "", depth = 0, out = []) {
  if (depth > 4 || !obj || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out.push(p + " {}");
      walk(v, p, depth + 1, out);
    } else if (Array.isArray(v)) {
      out.push(`${p} [${v.length}]`);
      if (v[0] && typeof v[0] === "object") walk(v[0], `${p}[0]`, depth + 1, out);
    } else {
      const vs = String(v).slice(0, 80);
      out.push(`${p} = ${JSON.stringify(vs)}`);
    }
  }
  return out;
}
const paths = walk(raw);
fs.writeFileSync("raw_ae_dump.txt", paths.join("\n"));
console.log(`\nDumped ${paths.length} paths -> raw_ae_dump.txt`);

// Search for pricing/image signals
const hits = paths.filter((p) =>
  /price|image|stock|currency|sku|url|pic/i.test(p),
);
console.log("\n=== PRICING/IMAGE/STOCK HITS ===");
console.log(hits.slice(0, 80).join("\n"));
