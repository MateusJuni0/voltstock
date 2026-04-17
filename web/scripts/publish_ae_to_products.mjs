#!/usr/bin/env node
// Convert 22 ae_products → products.ts entries + download hero images + link back local_product_id.
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

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

// --- Category mapping by ae_product_id prefix via lookup ---
const CATEGORY_BY_ID = {
  // Attack Shark Mouse
  "1005009132541297": { cat: "Teclados e Ratos", brand: "Attack Shark", name: "Attack Shark X11 Tri-Mode Gaming" },
  "1005009917048224": { cat: "Teclados e Ratos", brand: "Attack Shark", name: "Attack Shark X3 Bluetooth Lightweight" },
  "1005009389582350": { cat: "Teclados e Ratos", brand: "Attack Shark", name: "Attack Shark X11 PAW3311 Wireless" },
  "1005009455340246": { cat: "Teclados e Ratos", brand: "Attack Shark", name: "Attack Shark R5 Ultra Fiber Wireless" },
  "1005007061847291": { cat: "Teclados e Ratos", brand: "Attack Shark", name: "Attack Shark X6 RGB Touch Base" },
  // Aula Keyboard
  "1005009845590858": { cat: "Teclados e Ratos", brand: "Aula", name: "Aula F108 PRO Teclado Mecânico" },
  "1005010130792831": { cat: "Teclados e Ratos", brand: "Aula", name: "Aula HERO 68HE Magnetic Switch" },
  "1005007099240050": { cat: "Teclados e Ratos", brand: "Aula", name: "Aula F75 Wireless Bluetooth Mecânico" },
  "1005008274420900": { cat: "Teclados e Ratos", brand: "Aula", name: "Epomaker x Aula F75 MAX 75% ANSI" },
  "1005010361382463": { cat: "Teclados e Ratos", brand: "Aula", name: "Aula F99 ISO-ES QWERTY Gamer" },
  // Royal Kludge
  "1005006537039533": { cat: "Teclados e Ratos", brand: "Royal Kludge", name: "RK Royal Kludge S98 TFT Display" },
  "1005008843508905": { cat: "Teclados e Ratos", brand: "Royal Kludge", name: "RK Royal Kludge PBT Colorblock Keycaps" },
  // Redragon Mouse
  "1005004662195682": { cat: "Teclados e Ratos", brand: "Redragon", name: "Redragon M913 16000 DPI Wireless" },
  "1005006911655686": { cat: "Teclados e Ratos", brand: "Redragon", name: "Redragon M612 PRO BT RGB Wireless" },
  "1005009524597949": { cat: "Teclados e Ratos", brand: "Redragon", name: "Redragon M991 26000 DPI Wireless" },
  "1005009884734578": { cat: "Teclados e Ratos", brand: "Redragon", name: "Redragon M693 LIT Wireless" },
  "1005008783738245": { cat: "Teclados e Ratos", brand: "Redragon", name: "Redragon Hana M694 RGB Wireless" },
  // Mouse Pads
  "1005007781334616": { cat: "Mouse Pads", brand: "Generic", name: "Mouse Pad DIY RGB XXL Personalizado" },
  "1005007996190317": { cat: "Mouse Pads", brand: "Generic", name: "Mouse Pad XXL RGB Geometria 3D" },
  "1005005996727145": { cat: "Mouse Pads", brand: "Generic", name: "Mouse Pad XXL RGB Dragon HD Preto" },
  "1005010242416102": { cat: "Mouse Pads", brand: "MSI Style", name: "Mouse Pad RGB MSI Gaming Speed" },
  "1005008960508924": { cat: "Mouse Pads", brand: "Asus Style", name: "Mouse Pad Asus RGB Anime XXL" },
};

const START_ID = 260;

function toPriceStr(n) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (e) => {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        reject(e);
      });
  });
}

// Fetch all 22 ae_products
const r = await fetch(
  `${URL}/rest/v1/ae_products?select=id,ae_product_id,name,cost_price,selling_price,currency,main_image,gallery,stock_quantity,supplier_url,description`,
  { headers: { apikey: KEY, authorization: `Bearer ${KEY}` } },
);
const rows = await r.json();
console.log(`Fetched ${rows.length} ae_products`);

const IMG_DIR = path.join(process.cwd(), "public", "products");
fs.mkdirSync(IMG_DIR, { recursive: true });

// Sort for deterministic ID assignment
rows.sort((a, b) => a.ae_product_id.localeCompare(b.ae_product_id));

const newProducts = [];
let curId = START_ID;

for (const row of rows) {
  const meta = CATEGORY_BY_ID[row.ae_product_id];
  if (!meta) {
    console.log(`skip ${row.ae_product_id} — no meta`);
    continue;
  }
  const id = curId++;
  const imgPath = `/products/${id}.png`;
  const localImg = path.join(IMG_DIR, `${id}.png`);

  if (row.main_image) {
    try {
      await download(row.main_image, localImg);
      console.log(`✓ image ${id}  ${row.ae_product_id}`);
    } catch (e) {
      console.log(`✗ image ${id}  ${e.message}`);
    }
  }

  const cost = Number(row.cost_price) || 0;
  const selling = Number(row.selling_price) || Math.round(cost * 1.8 * 100) / 100;
  const oldPrice = Math.round(selling * 1.25 * 100) / 100;

  const product = {
    id,
    name: meta.name,
    category: meta.cat,
    price: toPriceStr(selling),
    oldPrice: toPriceStr(oldPrice),
    rating: 4.7,
    img: imgPath,
    gallery: (row.gallery || []).slice(0, 6),
    description: (row.name || meta.name).slice(0, 220),
    badge: "Novo",
    features: [
      { name: "Marca", value: meta.brand },
      { name: "Origem", value: "AliExpress" },
      { name: "Envio", value: "Para PT" },
    ],
    supplier_url: row.supplier_url,
    brand: meta.brand,
    inStock: (row.stock_quantity ?? 0) > 0,
    stockCount: row.stock_quantity ?? 0,
    ae_product_id: row.ae_product_id,
    _ae_row_id: row.id,
  };
  newProducts.push(product);
}

console.log(`\nBuilt ${newProducts.length} new products (IDs ${START_ID}..${curId - 1})`);

// --- Append to products.ts ---
const productsPath = path.join(process.cwd(), "src", "data", "products.ts");
const raw = fs.readFileSync(productsPath, "utf8");

// Find the last `];` that closes the products array
// We'll insert before the closing `];`
const closingIdx = raw.lastIndexOf("];");
if (closingIdx < 0) throw new Error("Could not find closing `];`");

const before = raw.slice(0, closingIdx).trimEnd();
const after = raw.slice(closingIdx);

// Serialize each product without the _ae_row_id helper
const serialized = newProducts
  .map((p) => {
    const { _ae_row_id, ae_product_id, ...clean } = p;
    return JSON.stringify(clean, null, 2);
  })
  .join(",\n");

const needsComma = !before.endsWith(",") && !before.endsWith("[");
const newFile = before + (needsComma ? ",\n" : "\n") + serialized + "\n" + after;
fs.writeFileSync(productsPath, newFile);
console.log(`\nAppended to products.ts (${newFile.length} bytes)`);

// --- Link back local_product_id in ae_products ---
let linked = 0;
for (const p of newProducts) {
  const r2 = await fetch(`${URL}/rest/v1/ae_products?id=eq.${p._ae_row_id}`, {
    method: "PATCH",
    headers: {
      apikey: KEY,
      authorization: `Bearer ${KEY}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify({ local_product_id: p.id }),
  });
  if (r2.ok) linked++;
  else console.log(`✗ link ${p.id}  ${r2.status}`);
}
console.log(`\nLinked ${linked}/${newProducts.length} ae_products → products.ts IDs`);
