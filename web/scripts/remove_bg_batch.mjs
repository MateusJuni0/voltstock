#!/usr/bin/env node
// Threshold-based bg removal for AE product images.
// AE product photos have near-white backgrounds → turn them transparent.
// Works on pure-white backdrops; not perfect for products with very light colors.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");
const IDS = Array.from({ length: 22 }, (_, i) => 260 + i);

// Threshold: RGB channels above this → background (transparent)
const BG_THRESHOLD = 235;
// Edge softness — feather pixels just below threshold to avoid hard edges
const SOFT_START = 215;

async function removeBg(inPath, outPath) {
  const img = sharp(inPath);
  const meta = await img.metadata();
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  const { width, height, channels } = info;
  // channels is now 4 (RGBA) because of ensureAlpha

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const origA = data[i + 3];

    const minChan = Math.min(r, g, b);
    let alpha = origA;

    if (minChan >= BG_THRESHOLD) {
      // Pure-ish white → transparent
      alpha = 0;
    } else if (minChan >= SOFT_START) {
      // Feather
      const t = (minChan - SOFT_START) / (BG_THRESHOLD - SOFT_START);
      alpha = Math.round(origA * (1 - t));
    }

    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = alpha;
  }

  await sharp(out, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  return { width, height };
}

// Sample 4 corners — if they're NOT near-white, skip bg removal (image already has bg or is stylized)
async function shouldProcess(imgPath) {
  const { data, info } = await sharp(imgPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const sample = (x, y) => {
    const i = (y * width + x) * channels;
    return Math.min(data[i], data[i + 1], data[i + 2]);
  };
  const corners = [
    sample(2, 2),
    sample(width - 3, 2),
    sample(2, height - 3),
    sample(width - 3, height - 3),
  ];
  const whiteCorners = corners.filter((v) => v >= BG_THRESHOLD).length;
  return whiteCorners >= 3; // 3 of 4 corners are white
}

let processed = 0,
  skipped = 0,
  errors = 0;
for (const id of IDS) {
  const inPath = path.join(PRODUCTS_DIR, `${id}.png`);
  const bakPath = path.join(PRODUCTS_DIR, `${id}.orig.png`);
  if (!fs.existsSync(inPath)) {
    console.log(`- ${id}: no file`);
    continue;
  }
  try {
    // Backup original (once)
    if (!fs.existsSync(bakPath)) fs.copyFileSync(inPath, bakPath);

    const should = await shouldProcess(bakPath);
    if (!should) {
      console.log(`- ${id}: skipped (no white bg detected)`);
      skipped++;
      continue;
    }

    const tmp = inPath + ".tmp.png";
    const dims = await removeBg(bakPath, tmp);
    fs.renameSync(tmp, inPath);
    console.log(`✓ ${id}: bg removed (${dims.width}x${dims.height})`);
    processed++;
  } catch (e) {
    console.log(`✗ ${id}: ${e.message}`);
    errors++;
  }
}

console.log(`\nProcessed: ${processed}  Skipped: ${skipped}  Errors: ${errors}`);
