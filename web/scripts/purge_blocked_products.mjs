#!/usr/bin/env node
// Removes AE-unsourceable products from src/data/products.ts,
// keeping only the IDs listed in docs/ae_keep_remove.json (keep[]).
// Preserves file header + footer; rewrites the array literal.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRODUCTS_PATH = path.join(ROOT, "src", "data", "products.ts");
const PLAN_PATH = path.join(ROOT, "docs", "ae_keep_remove.json");
const BACKUP_PATH = path.join(ROOT, "src", "data", `products.backup.${Date.now()}.ts`);

const plan = JSON.parse(fs.readFileSync(PLAN_PATH, "utf8"));
const keepSet = new Set(plan.keep);
console.log(`Keep IDs: ${[...keepSet].join(",")}`);

const raw = fs.readFileSync(PRODUCTS_PATH, "utf8");
fs.writeFileSync(BACKUP_PATH, raw);
console.log(`Backup -> ${path.basename(BACKUP_PATH)}`);

// Locate array
const startMarker = "export const products: Product[] = [";
const startIdx = raw.indexOf(startMarker);
const eqIdx = raw.indexOf("=", startIdx);
const openIdx = raw.indexOf("[", eqIdx);

// String-aware close scan
let depth = 0,
  closeIdx = -1,
  inStr = null,
  esc = false;
for (let i = openIdx; i < raw.length; i++) {
  const c = raw[i];
  if (inStr) {
    if (esc) { esc = false; continue; }
    if (c === "\\") { esc = true; continue; }
    if (c === inStr) inStr = null;
    continue;
  }
  if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
  if (c === "/" && raw[i + 1] === "/") { const nl = raw.indexOf("\n", i); i = nl < 0 ? raw.length : nl; continue; }
  if (c === "/" && raw[i + 1] === "*") { const end = raw.indexOf("*/", i + 2); i = end < 0 ? raw.length : end + 1; continue; }
  if (c === "[") depth++;
  else if (c === "]") {
    depth--;
    if (depth === 0) { closeIdx = i; break; }
  }
}

const arrayLiteral = raw.slice(openIdx, closeIdx + 1);
const header = raw.slice(0, openIdx);
const footer = raw.slice(closeIdx + 1);

const products = new Function(`return ${arrayLiteral};`)();
console.log(`Parsed ${products.length} products`);

const kept = products.filter((p) => keepSet.has(p.id));
const removed = products.filter((p) => !keepSet.has(p.id));
console.log(`Keeping ${kept.length}, removing ${removed.length}`);

// Serialize kept list as TS-compatible object literals (JSON is valid TS).
// Preserve insertion order by id ascending.
kept.sort((a, b) => a.id - b.id);
const serialized = "[\n" + kept.map((p) => JSON.stringify(p, null, 2)).join(",\n") + "\n]";

const newFile = header + serialized + footer;
fs.writeFileSync(PRODUCTS_PATH, newFile);
console.log(`Wrote ${PRODUCTS_PATH} (${newFile.length} bytes)`);
console.log(`Kept IDs: ${kept.map((p) => p.id).join(",")}`);
