#!/usr/bin/env node
// Classifies each product in src/data/products.ts as BLOCKED / POSSIBLE / AMBIGUOUS
// for AliExpress sourcing, based on brand + category heuristics.
//
// Run: node scripts/classify_ae_sourcing.mjs
// Output: docs/ae_sourcing_classification.json  +  stdout summary

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PRODUCTS_PATH = path.join(ROOT, "src", "data", "products.ts");
const OUT_DIR = path.join(ROOT, "docs");
const OUT_PATH = path.join(OUT_DIR, "ae_sourcing_classification.json");

const raw = fs.readFileSync(PRODUCTS_PATH, "utf8");

// Extract the products array literal: from `export const products: Product[] = [`
// to the matching closing `];`
const startMarker = "export const products: Product[] = [";
const startIdx = raw.indexOf(startMarker);
if (startIdx < 0) {
  console.error("Could not find products array in products.ts");
  process.exit(1);
}
// Skip past `Product[]` — find the `=` then the `[` after it
const eqIdx = raw.indexOf("=", startIdx);
const arrayOpenIdx = raw.indexOf("[", eqIdx);
// String-aware bracket-balanced scan for matching `]`
let depth = 0;
let arrayCloseIdx = -1;
let inStr = null; // '"' | "'" | '`' | null
let escape = false;
for (let i = arrayOpenIdx; i < raw.length; i++) {
  const c = raw[i];
  if (inStr) {
    if (escape) { escape = false; continue; }
    if (c === "\\") { escape = true; continue; }
    if (c === inStr) inStr = null;
    continue;
  }
  if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
  // skip single-line comments
  if (c === "/" && raw[i + 1] === "/") {
    const nl = raw.indexOf("\n", i);
    i = nl < 0 ? raw.length : nl;
    continue;
  }
  // skip block comments
  if (c === "/" && raw[i + 1] === "*") {
    const end = raw.indexOf("*/", i + 2);
    i = end < 0 ? raw.length : end + 1;
    continue;
  }
  if (c === "[") depth++;
  else if (c === "]") {
    depth--;
    if (depth === 0) {
      arrayCloseIdx = i;
      break;
    }
  }
}
if (arrayCloseIdx < 0) {
  console.error("Could not find end of products array");
  process.exit(1);
}
const arrayLiteral = raw.slice(arrayOpenIdx, arrayCloseIdx + 1);

// Evaluate as JSON-ish — the file is already JSON-compatible object literals.
// But it uses TS-style keys without quotes sometimes? Let's try direct eval first.
let products;
try {
  // Use Function constructor — safer than eval and works with unquoted keys.
  products = new Function(`return ${arrayLiteral};`)();
} catch (e) {
  console.error("Failed to parse products array:", e.message);
  process.exit(1);
}

console.log(`Loaded ${products.length} products`);

// -------------- Classification rules --------------

const lc = (s) => (s || "").toLowerCase();

// Categories automatically BLOCKED (retail exclusivity / not on AE)
const BLOCKED_CATEGORIES = new Set([
  "Processadores",      // Intel / AMD CPUs — not sold raw on AE
  "Placas Gráficas",    // NVIDIA / AMD GPUs — retail exclusive
]);

// Branded items BLOCKED regardless of category
const BRAND_BLOCKLISTS = {
  "Motherboards": [
    "asus rog", "asus tuf", "asus prime", "msi mag", "msi mpg", "msi meg",
    "gigabyte aorus", "gigabyte ultra", "asrock taichi", "asrock steel",
    "nzxt n", "biostar",
  ],
  "Memória RAM": [
    "corsair vengeance", "corsair dominator", "g.skill trident", "g.skill ripjaws",
    "g.skill flare", "kingston fury", "kingston beast", "kingston renegade",
    "crucial ballistix", "crucial pro", "teamgroup t-force", "adata xpg",
    "patriot viper",
  ],
  "Armazenamento": [
    "samsung 9", "samsung 8", "samsung ev", "samsung t", "samsung 870", "samsung 980", "samsung 990",
    "crucial t7", "crucial t5", "crucial mx", "crucial p",
    "wd black", "wd red", "wd blue", "wd_black",
    "seagate firecuda", "seagate barracuda", "seagate ironwolf",
    "sabrent rocket", "kingston kc", "kingston fury", "adata xpg",
    "solidigm", "sandisk extreme",
  ],
  "Fontes de Alimentação": [
    "corsair rm", "corsair hx", "corsair sf", "corsair ax",
    "seasonic prime", "seasonic focus", "seasonic vertex",
    "be quiet", "evga supernova", "evga g", "nzxt c", "asus rog loki",
    "asus rog thor", "msi meg", "msi mpg", "thermaltake toughpower",
    "fsp hydro", "cooler master mwe", "cooler master v",
  ],
  "Caixas": [
    "lian li", "nzxt h", "fractal", "phanteks", "corsair", "hyte", "ssupd",
    "cooler master masterframe", "cooler master nr200", "cooler master haf",
    "thermaltake tower", "thermaltake core", "ek-nucleus", "be quiet",
    "deepcool ch", "asus rog",
  ],
  "Refrigeração": [
    "noctua", "arctic liquid", "arctic freezer", "nzxt kraken",
    "corsair icue h", "corsair icue elite", "corsair h100", "corsair h150",
    "be quiet dark rock", "be quiet pure", "be quiet silent",
    "deepcool ak", "deepcool ls", "thermalright peerless", "thermalright phantom",
    "msi meg coreliquid", "asus rog ryujin", "asus rog strix",
    "ek-aio", "lian li galahad", "cooler master masterliquid",
  ],
  "Monitores": [
    "lg ultragear", "lg oled", "samsung odyssey", "samsung viewfinity",
    "dell alienware", "dell ultrasharp", "dell s",
    "benq mobiuz", "benq zowie", "benq pd",
    "aoc agon", "aoc gaming",
    "msi mag", "msi mpg", "msi optix", "msi oled",
    "acer predator", "acer nitro",
    "asus rog swift", "asus tuf gaming", "asus proart",
    "gigabyte aorus", "gigabyte m",
    "philips evnia", "corsair xeneon", "viewsonic",
  ],
  "Teclados e Ratos": [
    "razer", "logitech g", "logitech mx", "logitech pro", "logitech master",
    "corsair k", "corsair m", "corsair virtuoso", "corsair hs",
    "steelseries", "hyperx", "glorious", "pulsar", "finalmouse",
    "zowie", "keychron", "ducky", "wooting", "asus rog", "roccat",
  ],
  "Headsets e Áudio": [
    "razer", "logitech g", "logitech pro", "corsair virtuoso", "corsair hs",
    "steelseries", "hyperx", "astro a", "sennheiser", "audio-technica",
    "beyerdynamic", "epos", "jbl quantum", "asus rog", "edifier hecate",
  ],
  "Cadeiras Gaming": [
    "secretlab", "dxracer", "noblechairs", "akracing", "herman miller",
    "andaseat", "corsair", "razer iskur", "cougar", "l33t",
  ],
};

// Categories that are POSSIBLE — AE sources generic versions
const POSSIBLE_CATEGORIES = new Set(["Mouse Pads"]);

function classify(p) {
  const cat = p.category;
  const nameL = lc(p.name);
  const brandL = lc(p.brand || "");

  if (BLOCKED_CATEGORIES.has(cat)) {
    return { verdict: "BLOCKED", reason: "category_not_sourceable", category: cat };
  }

  const brandList = BRAND_BLOCKLISTS[cat] || [];
  for (const b of brandList) {
    if (nameL.includes(b) || brandL.includes(b)) {
      return { verdict: "BLOCKED", reason: `brand_retail_exclusive:${b}`, category: cat };
    }
  }

  if (POSSIBLE_CATEGORIES.has(cat)) {
    return { verdict: "POSSIBLE", reason: "generic_category", category: cat };
  }

  // Remaining in branded categories = AMBIGUOUS (needs manual review)
  return { verdict: "AMBIGUOUS", reason: "no_brand_match_in_branded_category", category: cat };
}

// -------------- Run --------------

const results = products.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  brand: p.brand ?? null,
  price: p.price,
  ...classify(p),
}));

// Per-category summary
const byCat = {};
for (const r of results) {
  byCat[r.category] ??= { total: 0, BLOCKED: 0, POSSIBLE: 0, AMBIGUOUS: 0 };
  byCat[r.category].total++;
  byCat[r.category][r.verdict]++;
}

const globals = { BLOCKED: 0, POSSIBLE: 0, AMBIGUOUS: 0 };
for (const r of results) globals[r.verdict]++;

console.log("\n=== Per-category ===");
for (const [cat, s] of Object.entries(byCat)) {
  console.log(
    `${cat.padEnd(22)} total=${String(s.total).padStart(3)}  BLOCKED=${String(s.BLOCKED).padStart(3)}  POSSIBLE=${String(s.POSSIBLE).padStart(3)}  AMBIGUOUS=${String(s.AMBIGUOUS).padStart(3)}`,
  );
}
console.log("\n=== Global ===");
console.log(`TOTAL:     ${results.length}`);
console.log(`BLOCKED:   ${globals.BLOCKED}`);
console.log(`POSSIBLE:  ${globals.POSSIBLE}`);
console.log(`AMBIGUOUS: ${globals.AMBIGUOUS}`);

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  OUT_PATH,
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      total: results.length,
      by_category: byCat,
      globals,
      items: results,
    },
    null,
    2,
  ),
);

console.log(`\nWrote ${OUT_PATH}`);
