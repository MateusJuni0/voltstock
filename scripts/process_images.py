#!/usr/bin/env python3
"""
VoltStock Product Image Pipeline
=================================
1. Extracts all product IDs + image URLs from products.ts
2. Downloads each image
3. Removes background using rembg
4. Saves as transparent PNG to web/public/products/{id}.png
5. Generates a report of successes/failures

Usage: python process_images.py
"""

import json
import os
import re
import sys
import time
from pathlib import Path
from io import BytesIO

# Fix encoding for Windows console
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import requests
from PIL import Image
from rembg import remove

# ── Paths ──
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PRODUCTS_TS = PROJECT_DIR / "web" / "src" / "data" / "products.ts"
OUTPUT_DIR = PROJECT_DIR / "web" / "public" / "products"

# ── Config ──
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    "Referer": "https://www.google.com/",
}
TIMEOUT = 30
MAX_SIZE = (1024, 1024)  # Resize to max 1024x1024 before processing


def extract_products(ts_path: Path) -> list[dict]:
    """Parse products.ts and extract id + img + name for each product."""
    content = ts_path.read_text(encoding="utf-8")

    # Find the array content
    array_match = re.search(r"export const products:\s*Product\[\]\s*=\s*\[", content)
    if not array_match:
        print("ERROR: Could not find products array in products.ts")
        sys.exit(1)

    products = []
    # Match each product object with id, img, and name
    pattern = re.compile(
        r'"id"\s*:\s*(\d+).*?"name"\s*:\s*"([^"]+)".*?"img"\s*:\s*"([^"]+)"',
        re.DOTALL,
    )

    # Split by product objects
    for match in pattern.finditer(content):
        products.append({
            "id": int(match.group(1)),
            "name": match.group(2),
            "img": match.group(3),
        })

    return products


def download_image(url: str) -> Image.Image | None:
    """Download an image from URL and return as PIL Image."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT, stream=True)
        resp.raise_for_status()
        img = Image.open(BytesIO(resp.content))
        # Convert to RGBA for transparency support
        if img.mode != "RGBA":
            img = img.convert("RGBA")
        return img
    except Exception as e:
        print(f"  DOWNLOAD FAIL: {e}")
        return None


def resize_if_needed(img: Image.Image, max_size: tuple[int, int]) -> Image.Image:
    """Resize image if larger than max_size, preserving aspect ratio."""
    if img.width <= max_size[0] and img.height <= max_size[1]:
        return img
    img.thumbnail(max_size, Image.LANCZOS)
    return img


def remove_background(img: Image.Image) -> Image.Image:
    """Remove background using rembg."""
    # Convert to bytes for rembg
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    result_bytes = remove(buf.read())
    result = Image.open(BytesIO(result_bytes))
    return result


def process_single(product: dict, output_dir: Path) -> dict:
    """Process a single product image. Returns status dict."""
    pid = product["id"]
    name = product["name"]
    url = product["img"]
    out_path = output_dir / f"{pid}.png"

    result = {"id": pid, "name": name, "url": url, "status": "unknown", "path": str(out_path)}

    # Skip if already processed
    if out_path.exists():
        print(f"  [SKIP] #{pid} already exists")
        result["status"] = "skipped"
        return result

    print(f"  [DL] #{pid} {name[:50]}...")

    # Download
    img = download_image(url)
    if img is None:
        result["status"] = "download_failed"
        return result

    # Resize
    img = resize_if_needed(img, MAX_SIZE)
    print(f"  [REMBG] #{pid} ({img.width}x{img.height})...")

    # Remove background
    try:
        processed = remove_background(img)
    except Exception as e:
        print(f"  [REMBG FAIL] #{pid}: {e}")
        result["status"] = "rembg_failed"
        return result

    # Save
    processed.save(out_path, "PNG", optimize=True)
    size_kb = out_path.stat().st_size / 1024
    print(f"  [OK] #{pid} saved ({size_kb:.0f} KB)")
    result["status"] = "success"
    result["size_kb"] = round(size_kb)
    return result


def main():
    print("=" * 60)
    print("VoltStock Product Image Pipeline")
    print("=" * 60)

    # Extract products
    print(f"\n[1/3] Extracting products from {PRODUCTS_TS}...")
    products = extract_products(PRODUCTS_TS)
    print(f"  Found {len(products)} products")

    # Create output dir
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\n[2/3] Output dir: {OUTPUT_DIR}")

    # Process each
    print(f"\n[3/3] Processing {len(products)} images...\n")
    results = []
    for i, product in enumerate(products):
        print(f"-- Product {i+1}/{len(products)} --")
        result = process_single(product, OUTPUT_DIR)
        results.append(result)

    # Report
    print("\n" + "=" * 60)
    print("REPORT")
    print("=" * 60)
    success = [r for r in results if r["status"] == "success"]
    skipped = [r for r in results if r["status"] == "skipped"]
    failed = [r for r in results if r["status"] in ("download_failed", "rembg_failed")]

    print(f"  OK: {len(success)}")
    print(f"  SKIP: {len(skipped)}")
    print(f"  FAIL: {len(failed)}")

    if failed:
        print("\n  Failed products:")
        for r in failed:
            print(f"    #{r['id']} {r['name'][:40]} — {r['status']} — {r['url'][:60]}")

    # Save report
    report_path = SCRIPT_DIR / "image_report.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\n  Report saved to {report_path}")


if __name__ == "__main__":
    main()
