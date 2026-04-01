#!/usr/bin/env node
/**
 * batch-image-fix.mjs — Batch fix product images
 *
 * Searches AliExpress for each product, extracts the first product image,
 * downloads it to public/products/, and outputs a JSON mapping.
 *
 * Usage: node scripts/batch-image-fix.mjs
 */

import { chromium } from "playwright";
import { writeFileSync, mkdirSync, existsSync, createWriteStream } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "../public/products");
const MAPPING_FILE = resolve(__dirname, "../scripts/image-mapping.json");

// Products that need images (IDs 21-120)
const products = [
  // Placas Gráficas
  { id: 21, query: "RTX 4070 Ti Super 16GB graphics card" },
  { id: 22, query: "RTX 4060 Ti 8GB graphics card" },
  { id: 23, query: "RTX 4060 8GB graphics card" },
  { id: 24, query: "RX 7900 XTX 24GB graphics card" },
  { id: 25, query: "RX 7800 XT 16GB graphics card" },
  { id: 26, query: "RX 7600 8GB graphics card" },
  { id: 27, query: "RTX 4070 Super 12GB graphics card" },
  { id: 28, query: "RTX 3060 12GB graphics card" },
  // Processadores
  { id: 29, query: "AMD Ryzen 5 7600X processor" },
  { id: 30, query: "AMD Ryzen 9 7950X3D processor" },
  { id: 31, query: "Intel Core i5-14600K processor" },
  { id: 32, query: "Intel Core i7-14700K processor" },
  { id: 33, query: "AMD Ryzen 5 5600X processor" },
  { id: 34, query: "Intel Core i5-13400F processor" },
  { id: 35, query: "AMD Ryzen 9 7900X processor" },
  { id: 36, query: "Intel Core i3-12100F processor" },
  // Motherboards
  { id: 37, query: "MSI MPG B760M Edge WiFi motherboard" },
  { id: 38, query: "ASUS TUF Gaming B650-PLUS WiFi motherboard" },
  { id: 39, query: "Gigabyte B550 Aorus Pro V2 motherboard" },
  { id: 40, query: "ASRock B660M Steel Legend motherboard" },
  { id: 41, query: "ASUS ROG Strix X670E-E Gaming WiFi motherboard" },
  { id: 42, query: "MSI MEG Z790 ACE motherboard" },
  { id: 43, query: "Gigabyte X670E Aorus Master motherboard" },
  { id: 44, query: "ASRock B760M Pro RS WiFi motherboard" },
  // Memória RAM
  { id: 45, query: "Kingston Fury Beast DDR5 32GB RAM" },
  { id: 46, query: "Corsair Dominator Platinum RGB DDR5 32GB" },
  { id: 47, query: "Kingston Fury Renegade DDR5 32GB" },
  { id: 48, query: "TeamGroup T-Force Delta RGB DDR5 32GB" },
  { id: 49, query: "Corsair Vengeance DDR5 16GB" },
  { id: 50, query: "G.Skill Ripjaws S5 DDR5 32GB" },
  { id: 51, query: "Kingston Fury Beast DDR4 32GB" },
  { id: 52, query: "Crucial DDR5 32GB 4800MHz RAM" },
  // Armazenamento
  { id: 53, query: "WD Blue SN580 1TB NVMe SSD" },
  { id: 54, query: "Kingston NV2 2TB NVMe SSD" },
  { id: 55, query: "Crucial P3 Plus 2TB NVMe SSD" },
  { id: 56, query: "Samsung 870 EVO 1TB SATA SSD" },
  { id: 57, query: "Seagate FireCuda 530 2TB NVMe SSD" },
  { id: 58, query: "Crucial T500 2TB NVMe SSD" },
  { id: 59, query: "SK Hynix Platinum P41 2TB NVMe" },
  { id: 60, query: "Kingston KC3000 2TB NVMe SSD" },
  // Fontes
  { id: 61, query: "Corsair RM850x power supply" },
  { id: 62, query: "Seasonic Focus GX-750 power supply" },
  { id: 63, query: "be quiet Pure Power 12 M 850W" },
  { id: 64, query: "EVGA SuperNOVA 1000 G7 power supply" },
  { id: 65, query: "Corsair SF750 SFX power supply" },
  { id: 66, query: "MSI MEG Ai1300P power supply" },
  { id: 67, query: "Seasonic Prime TX-1000 power supply" },
  { id: 68, query: "NZXT C850 power supply" },
  { id: 69, query: "Thermaltake Toughpower GF3 850W" },
  // Caixas
  { id: 70, query: "NZXT H7 Flow RGB case" },
  { id: 71, query: "Corsair 4000D Airflow case" },
  { id: 72, query: "Phanteks Eclipse G360A case" },
  { id: 73, query: "be quiet Pure Base 500DX case" },
  { id: 74, query: "Cooler Master HAF 700 EVO case" },
  { id: 75, query: "HYTE Y60 case" },
  { id: 76, query: "Corsair 5000D Airflow case" },
  { id: 77, query: "Lian Li O11 Dynamic EVO case" },
  // Refrigeração
  { id: 78, query: "Corsair iCUE H150i Elite LCD XT cooler" },
  { id: 79, query: "Arctic Liquid Freezer II 360 A-RGB" },
  { id: 80, query: "DeepCool AK620 Digital cooler" },
  { id: 81, query: "Noctua NH-D15 chromax black cooler" },
  { id: 82, query: "Corsair A115 Air Cooler" },
  { id: 83, query: "EK-AIO 280 D-RGB cooler" },
  { id: 84, query: "Arctic Freezer 36 A-RGB cooler" },
  { id: 85, query: "Thermalright Peerless Assassin 120 SE" },
  // Monitores
  { id: 86, query: "LG 27GP850-B UltraGear monitor" },
  { id: 87, query: "Dell S2722DGM monitor curved" },
  { id: 88, query: "Samsung Odyssey G7 32 240Hz monitor" },
  { id: 89, query: "ASUS TUF Gaming VG27AQ1A monitor" },
  { id: 90, query: "BenQ MOBIUZ EX2710Q monitor" },
  { id: 91, query: "LG UltraGear 27GR95QE OLED monitor" },
  { id: 92, query: "Gigabyte M27Q X 240Hz monitor" },
  { id: 93, query: "AOC 24G2SP 165Hz monitor" },
  { id: 94, query: "MSI MAG 274QRF-QD monitor" },
  // Teclados e Ratos
  { id: 95, query: "Razer DeathAdder V3 mouse" },
  { id: 96, query: "SteelSeries Apex Pro TKL keyboard" },
  { id: 97, query: "Corsair K70 RGB PRO keyboard" },
  { id: 98, query: "Razer Viper V3 Pro mouse" },
  { id: 99, query: "Logitech MX Master 3S mouse" },
  { id: 100, query: "HyperX Alloy Origins 65 keyboard" },
  { id: 101, query: "Razer Huntsman V3 Pro keyboard" },
  { id: 102, query: "SteelSeries Aerox 5 Wireless mouse" },
  // Headsets
  { id: 103, query: "HyperX Cloud III Wireless headset" },
  { id: 104, query: "Logitech G Pro X 2 Lightspeed headset" },
  { id: 105, query: "Corsair Virtuoso RGB XT headset" },
  { id: 106, query: "Razer Kraken V4 headset" },
  { id: 107, query: "Sony WH-1000XM5 headphones" },
  { id: 108, query: "JBL Quantum 910 Wireless headset" },
  { id: 109, query: "Corsair HS80 Max Wireless headset" },
  { id: 110, query: "Razer BlackShark V2 Pro headset" },
  { id: 111, query: "Audio-Technica ATH-M50x headphones" },
  // Cadeiras
  { id: 112, query: "Razer Iskur V2 gaming chair" },
  { id: 113, query: "Corsair TC200 gaming chair" },
  { id: 114, query: "noblechairs HERO ST gaming chair" },
  { id: 115, query: "DXRacer Craft Series gaming chair" },
  { id: 116, query: "AndaSeat Kaiser 3 XL gaming chair" },
  { id: 117, query: "Cougar Armor Elite gaming chair" },
  { id: 118, query: "AKRacing Masters Pro gaming chair" },
  { id: 119, query: "Herman Miller Logitech Embody gaming chair" },
  { id: 120, query: "Autonomous ErgoChair Pro chair" },
];

// Pre-collected REAL working URLs (verified)
const knownUrls = {
  21: "https://ae01.alicdn.com/kf/S050adaac6c4f4d98a19028b2fba8cba8j.jpg",
  24: "https://ae01.alicdn.com/kf/Sd85ec321ac7c4487a5b0249035d7de13y.jpg",
  27: "https://c1.neweggimages.com/ProductImage/14-932-681-11.jpg",
  29: "https://ae01.alicdn.com/kf/Sae8958cccc4b48cba872f2083c9ead22L.jpg",
  30: "https://ae01.alicdn.com/kf/S700c05dab59c420788fa3279e4e82ab5n.jpg",
  31: "https://c1.neweggimages.com/ProductImage/19-118-470-07.jpg",
  32: "https://c1.neweggimages.com/ProductImage/19-118-466-04.jpg",
  45: "https://ae01.alicdn.com/kf/S415c528c95314df69711a1e0c0ef042fB.png",
};

function log(msg) {
  console.log(`[ImageFix] ${msg}`);
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const ws = createWriteStream(filepath);
      res.pipe(ws);
      ws.on("finish", () => { ws.close(); resolve(true); });
      ws.on("error", reject);
    }).on("error", reject);
  });
}

async function extractImageFromSearch(page, query) {
  const searchUrl = `https://www.aliexpress.com/w/wholesale-${encodeURIComponent(query)}.html?sortType=total_tranpro_desc`;

  try {
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(3000);

    // Try to get the first product image
    const imgUrl = await page.evaluate(() => {
      const imgs = document.querySelectorAll("img[src*='alicdn.com']");
      for (const img of imgs) {
        const src = img.src || img.dataset.src || "";
        if (src.includes("/kf/") && (src.includes(".jpg") || src.includes(".png") || src.includes(".webp"))) {
          // Get full-size version
          return src.replace(/_\d+x\d+\.\w+$/, "").replace(/\.\w+_\d+x\d+\.\w+$/, "");
        }
      }
      return null;
    });

    return imgUrl;
  } catch (err) {
    return null;
  }
}

async function extractImageFromProductPage(page, url) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    const imgUrl = await page.evaluate(() => {
      // Try multiple selectors for product images
      const selectors = [
        "img[src*='alicdn.com/kf/']",
        "[class*='gallery'] img",
        "[class*='slider'] img",
        "[class*='image-view'] img",
      ];
      for (const sel of selectors) {
        const img = document.querySelector(sel);
        if (img) {
          const src = img.src || img.dataset.src || "";
          if (src && src.includes("alicdn.com")) {
            return src.replace(/_\d+x\d+\.\w+$/, "");
          }
        }
      }
      return null;
    });

    return imgUrl;
  } catch (err) {
    return null;
  }
}

async function main() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const mapping = {};
  const failed = [];

  // Phase 1: Use known URLs
  log("Phase 1: Downloading known working images...");
  for (const [id, url] of Object.entries(knownUrls)) {
    const ext = url.endsWith(".png") ? "png" : "jpg";
    const filename = `product-${id}.${ext}`;
    const filepath = resolve(OUTPUT_DIR, filename);

    try {
      await downloadImage(url, filepath);
      mapping[id] = `/products/${filename}`;
      log(`  ✓ ID ${id}: Downloaded from known URL`);
    } catch (err) {
      log(`  ✗ ID ${id}: Failed to download (${err.message})`);
      failed.push(parseInt(id));
    }
  }

  // Phase 2: Search AliExpress for remaining products
  const remaining = products.filter(p => !mapping[p.id] && !knownUrls[p.id]);

  if (remaining.length > 0) {
    log(`\nPhase 2: Searching AliExpress for ${remaining.length} remaining products...`);

    const browser = await chromium.launch({
      headless: true,
      args: ["--lang=en-US", "--no-sandbox"],
    });

    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      locale: "en-US",
      viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();

    for (const product of remaining) {
      log(`  Searching: ID ${product.id} (${product.query})`);
      const imgUrl = await extractImageFromSearch(page, product.query);

      if (imgUrl) {
        const ext = imgUrl.includes(".png") ? "png" : "jpg";
        const filename = `product-${product.id}.${ext}`;
        const filepath = resolve(OUTPUT_DIR, filename);

        try {
          await downloadImage(imgUrl, filepath);
          mapping[product.id] = `/products/${filename}`;
          log(`    ✓ Downloaded: ${imgUrl.substring(0, 60)}...`);
        } catch (err) {
          log(`    ✗ Download failed: ${err.message}`);
          failed.push(product.id);
        }
      } else {
        log(`    ✗ No image found`);
        failed.push(product.id);
      }

      // Respectful delay
      await page.waitForTimeout(1500 + Math.random() * 1500);
    }

    await browser.close();
  }

  // Save mapping
  writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), "utf8");
  log(`\n=== Results ===`);
  log(`Success: ${Object.keys(mapping).length} / ${products.length}`);
  log(`Failed: ${failed.length} (IDs: ${failed.join(", ")})`);
  log(`Mapping saved to: ${MAPPING_FILE}`);

  // Output the mapping for use in updating products.ts
  console.log("\n--- Image Mapping (for products.ts update) ---");
  console.log(JSON.stringify(mapping, null, 2));
}

main().catch(console.error);
