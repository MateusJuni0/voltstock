#!/usr/bin/env node
/**
 * aliexpress-scraper.mjs — VoltStock Product Scraper
 *
 * Scrapes product data from AliExpress using Playwright.
 * Extracts: name, price, images, description, specs, ratings.
 * Outputs structured JSON ready for products.ts import.
 *
 * Usage:
 *   node scripts/aliexpress-scraper.mjs --url "https://aliexpress.com/item/XXXXX.html"
 *   node scripts/aliexpress-scraper.mjs --search "RTX 4070 Ti" --category "Placas Gráficas"
 *   node scripts/aliexpress-scraper.mjs --batch products-urls.txt
 *
 * Requirements:
 *   npx playwright install chromium  (first time only)
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTS_FILE = resolve(__dirname, "../src/data/products.ts");
const SCRAPED_DIR = resolve(__dirname, "../scraped-products");

// EUR exchange rate margin (AliExpress prices are in USD/EUR)
const MARGIN_MULTIPLIER = 1.35; // 35% markup for retail

// ── Helpers ──────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { url: null, search: null, category: null, batch: null, dryRun: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--url" && args[i + 1]) parsed.url = args[++i];
    if (args[i] === "--search" && args[i + 1]) parsed.search = args[++i];
    if (args[i] === "--category" && args[i + 1]) parsed.category = args[++i];
    if (args[i] === "--batch" && args[i + 1]) parsed.batch = args[++i];
    if (args[i] === "--dry-run") parsed.dryRun = true;
  }
  return parsed;
}

function log(msg) {
  console.log(`[AliScraper] ${msg}`);
}

function formatPrice(priceUSD, applyMargin = true) {
  const num = typeof priceUSD === "string"
    ? parseFloat(priceUSD.replace(/[^0-9.]/g, ""))
    : priceUSD;

  if (isNaN(num)) return "0,00 \u20ac";
  const final = applyMargin ? num * MARGIN_MULTIPLIER : num;
  return final.toFixed(2).replace(".", ",") + " \u20ac";
}

function sanitizeForTS(str) {
  if (!str) return "";
  return str.replace(/"/g, '\\"').replace(/\n/g, " ").trim();
}

// ── Product page scraper ─────────────────────────────────────────

async function scrapeProductPage(page, url) {
  log(`Navigating to: ${url}`);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for dynamic content
  } catch (err) {
    log(`Navigation failed: ${err.message}`);
    return null;
  }

  const product = await page.evaluate(() => {
    const getText = (sel) => {
      const el = document.querySelector(sel);
      return el ? el.textContent.trim() : null;
    };

    const getAll = (sel) => {
      return Array.from(document.querySelectorAll(sel)).map(el => el.textContent.trim());
    };

    // ── Product Title ──
    const title = getText("h1")
      || getText("[data-pl='product-title']")
      || getText(".product-title-text");

    // ── Price ──
    const priceEl = document.querySelector("[class*='Price'] [class*='current']")
      || document.querySelector("[class*='price--current']")
      || document.querySelector(".product-price-value");
    const price = priceEl ? priceEl.textContent.trim() : null;

    // ── Original/Old Price ──
    const oldPriceEl = document.querySelector("[class*='Price'] [class*='original']")
      || document.querySelector("[class*='price--original']");
    const oldPrice = oldPriceEl ? oldPriceEl.textContent.trim() : null;

    // ── Images ──
    const images = [];
    // Main gallery images
    document.querySelectorAll("[class*='slider--img'] img, [class*='image-view'] img, .images-view-item img").forEach(img => {
      let src = img.src || img.dataset.src || img.getAttribute("data-src") || "";
      // Get high-res version
      src = src.replace(/_\d+x\d+\.(jpg|png|webp)/, ".$1")
              .replace(/\/resize\/.*?\//g, "/kf/");
      if (src && src.includes("alicdn.com") && !images.includes(src)) {
        images.push(src);
      }
    });

    // Thumbnail images as fallback
    if (images.length === 0) {
      document.querySelectorAll("[class*='slider--thumbnails'] img, .images-view-list img").forEach(img => {
        let src = img.src || img.dataset.src || "";
        src = src.replace(/_\d+x\d+/, "").replace(/\/resize\/.*?\//g, "/kf/");
        if (src && src.includes("alicdn.com") && !images.includes(src)) {
          images.push(src);
        }
      });
    }

    // ── Description ──
    const descEl = document.querySelector("[class*='detail--desc']")
      || document.querySelector("[class*='product-description']")
      || document.querySelector("#product-description");
    const description = descEl ? descEl.textContent.trim().slice(0, 500) : null;

    // ── Specifications ──
    const specs = [];
    document.querySelectorAll("[class*='specification'] [class*='property'], [class*='sku-property']").forEach(el => {
      const name = el.querySelector("[class*='name']")?.textContent?.trim();
      const value = el.querySelector("[class*='value'], [class*='desc']")?.textContent?.trim();
      if (name && value) specs.push({ name, value });
    });

    // Also check product attributes/properties table
    document.querySelectorAll("[class*='product-prop'] li, [class*='attribute'] tr").forEach(el => {
      const parts = el.textContent.split(":");
      if (parts.length >= 2) {
        specs.push({ name: parts[0].trim(), value: parts.slice(1).join(":").trim() });
      }
    });

    // ── Rating ──
    const ratingEl = document.querySelector("[class*='overview-rating'] [class*='score']")
      || document.querySelector("[class*='rating'] [class*='value']");
    const rating = ratingEl ? parseFloat(ratingEl.textContent) : 4.5;

    // ── Orders count ──
    const ordersEl = document.querySelector("[class*='trade--count']")
      || document.querySelector("[class*='orders']");
    const orders = ordersEl ? ordersEl.textContent.trim() : null;

    return {
      title,
      price,
      oldPrice,
      images,
      description,
      specs: specs.slice(0, 8), // Max 8 specs
      rating: isNaN(rating) ? 4.5 : rating,
      orders,
      url: window.location.href,
    };
  });

  if (!product || !product.title) {
    log("Failed to extract product data — page may require login or has anti-bot protection");
    return null;
  }

  log(`Scraped: ${product.title} (${product.images.length} images, ${product.specs.length} specs)`);
  return product;
}

// ── Search AliExpress ────────────────────────────────────────────

async function searchProducts(page, query, maxResults = 10) {
  const searchUrl = `https://www.aliexpress.com/w/wholesale-${encodeURIComponent(query)}.html?sortType=total_tranpro_desc`;
  log(`Searching: "${query}"`);

  try {
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000);
  } catch (err) {
    log(`Search navigation failed: ${err.message}`);
    return [];
  }

  const results = await page.evaluate((max) => {
    const items = [];
    document.querySelectorAll("[class*='search-item-card'], [class*='SearchProductFeed'] a, .list--gallery--C2f2tvm a").forEach(el => {
      if (items.length >= max) return;

      const link = el.href || el.querySelector("a")?.href;
      const title = el.querySelector("[class*='title'], h3, h1")?.textContent?.trim();
      const img = el.querySelector("img")?.src;
      const price = el.querySelector("[class*='price']")?.textContent?.trim();

      if (link && link.includes("/item/")) {
        items.push({ url: link, title, img, price });
      }
    });
    return items;
  }, maxResults);

  log(`Found ${results.length} products for "${query}"`);
  return results;
}

// ── Convert scraped data to our Product format ───────────────────

function toVoltStockProduct(scraped, nextId, category, badge) {
  return {
    id: nextId,
    name: sanitizeForTS(scraped.title),
    category,
    price: formatPrice(scraped.price),
    oldPrice: scraped.oldPrice ? formatPrice(scraped.oldPrice) : undefined,
    rating: Math.min(5, Math.max(3.5, scraped.rating || 4.5)),
    img: scraped.images[0] || "",
    gallery: scraped.images.slice(0, 5),
    description: sanitizeForTS(scraped.description || `${scraped.title} — produto premium para setups de alta performance.`),
    badge: badge || undefined,
    features: scraped.specs.slice(0, 4).map(s => ({
      name: sanitizeForTS(s.name),
      value: sanitizeForTS(s.value),
    })),
    supplier_url: scraped.url,
  };
}

// ── Append product to products.ts ────────────────────────────────

function appendProduct(product) {
  if (!existsSync(PRODUCTS_FILE)) {
    log(`Products file not found: ${PRODUCTS_FILE}`);
    return false;
  }

  const content = readFileSync(PRODUCTS_FILE, "utf8");

  // Build the product entry
  const entry = `  {
    "id": ${product.id},
    "name": "${product.name}",
    "category": "${product.category}",
    "price": "${product.price}",${product.oldPrice ? `\n    "oldPrice": "${product.oldPrice}",` : ""}
    "rating": ${product.rating},
    "img": "${product.img}",
    "gallery": ${JSON.stringify(product.gallery)},
    "description": "${product.description}",${product.badge ? `\n    "badge": "${product.badge}",` : ""}
    "features": ${JSON.stringify(product.features)}
  }`;

  // Insert before the closing bracket of the array
  const updatedContent = content.replace(
    /\n\];$/m,
    `,\n${entry}\n];`
  );

  writeFileSync(PRODUCTS_FILE, updatedContent, "utf8");
  log(`Added product #${product.id}: ${product.name}`);
  return true;
}

// ── Get next available ID ────────────────────────────────────────

function getNextId() {
  const content = readFileSync(PRODUCTS_FILE, "utf8");
  const matches = content.match(/"id":\s*(\d+)/g);
  if (!matches) return 1;
  const ids = matches.map(m => parseInt(m.replace(/"id":\s*/, "")));
  return Math.max(...ids) + 1;
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  if (!args.url && !args.search && !args.batch) {
    console.log(`
VoltStock AliExpress Scraper
=============================

Usage:
  # Scrape a single product
  node scripts/aliexpress-scraper.mjs --url "https://aliexpress.com/item/XXXXX.html" --category "Placas Graficas"

  # Search and scrape top results
  node scripts/aliexpress-scraper.mjs --search "RTX 4070 Ti Super" --category "Placas Graficas"

  # Batch scrape from file (one URL per line)
  node scripts/aliexpress-scraper.mjs --batch urls.txt --category "Processadores"

  # Dry run (scrape but don't save)
  node scripts/aliexpress-scraper.mjs --url "..." --dry-run

Categories: Processadores, Placas Graficas, Motherboards, Memoria RAM,
            Armazenamento, Fontes de Alimentacao, Caixas, Refrigeracao,
            Monitores, Teclados e Ratos, Headsets e Audio, Cadeiras Gaming
    `);
    process.exit(0);
  }

  log("Launching browser...");
  const browser = await chromium.launch({
    headless: false, // Show browser for captcha/login
    args: ["--lang=en-US"],
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "en-US",
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();
  const category = args.category || "Sem Categoria";

  try {
    if (args.url) {
      // Single product scrape
      const scraped = await scrapeProductPage(page, args.url);
      if (scraped) {
        const product = toVoltStockProduct(scraped, getNextId(), category);
        console.log("\n--- Scraped Product ---");
        console.log(JSON.stringify(product, null, 2));

        if (!args.dryRun) {
          appendProduct(product);
          log("Product saved to products.ts");
        } else {
          log("Dry run — not saved");
        }
      }
    }

    if (args.search) {
      // Search and show results
      const results = await searchProducts(page, args.search, 15);

      if (results.length === 0) {
        log("No results found. Try different search terms.");
      } else {
        console.log("\n--- Search Results ---");
        results.forEach((r, i) => {
          console.log(`[${i + 1}] ${r.title || "N/A"}`);
          console.log(`    URL: ${r.url}`);
          console.log(`    Price: ${r.price || "N/A"}`);
          console.log("");
        });

        // Scrape first result as sample
        if (results[0]?.url) {
          log("Scraping first result as sample...");
          const scraped = await scrapeProductPage(page, results[0].url);
          if (scraped) {
            const product = toVoltStockProduct(scraped, getNextId(), category);
            console.log("\n--- First Result (Full) ---");
            console.log(JSON.stringify(product, null, 2));

            if (!args.dryRun) {
              appendProduct(product);
            }
          }
        }
      }
    }

    if (args.batch) {
      // Batch scrape from file
      const urls = readFileSync(resolve(args.batch), "utf8")
        .split("\n")
        .map(l => l.trim())
        .filter(l => l && !l.startsWith("#"));

      log(`Batch: ${urls.length} URLs to scrape`);

      for (const url of urls) {
        const scraped = await scrapeProductPage(page, url);
        if (scraped) {
          const product = toVoltStockProduct(scraped, getNextId(), category);
          if (!args.dryRun) {
            appendProduct(product);
          }
          console.log(JSON.stringify(product, null, 2));
        }
        // Respectful delay between requests
        await page.waitForTimeout(2000 + Math.random() * 3000);
      }
    }
  } catch (err) {
    log(`Error: ${err.message}`);
  } finally {
    await browser.close();
    log("Done.");
  }
}

main().catch(console.error);
