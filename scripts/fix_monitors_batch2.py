"""
Fix monitor product images for VoltStock - Batch 2
Downloads from Newegg, resizes to max 800x800, saves as PNG.
NO rembg - monitors need their screen content preserved.
"""

import requests
import sys
from pathlib import Path
from PIL import Image
from io import BytesIO

PRODUCTS_DIR = Path(r"C:\Users\mjnol\.openclaw\workspace\projects\cm-ecommerce-tech\web\public\products")

# Each monitor has multiple candidate URLs (full-size variants)
MONITORS = {
    88: {
        "name": "Samsung Odyssey G7 32\"",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-022-816-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-022-816-S01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-022-816V01.jpg",
            "https://c1.neweggimages.com/ProductImage/24-022-816-V01.jpg",
            "https://c1.neweggimages.com/ProductImage/24-022-816-S01.jpg",
            # From the fetched page - thumbnail path, try full size variants
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-027-066-V15.jpg",
            "https://c1.neweggimages.com/ProductImage/24-027-066-V15.jpg",
            # Direct from page
            "https://c1.neweggimages.com/productimage/nb640/24-027-066-V15.jpg",
            # Try the G70D model (newer G7)
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-027-348-V01.jpg",
            "https://c1.neweggimages.com/ProductImage/24-027-348-V01.jpg",
            "https://c1.neweggimages.com/ProductImage/24-027-348-S01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-027-348-S01.jpg",
        ],
    },
    90: {
        "name": "BenQ MOBIUZ EX2710Q 165Hz",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-014-865-S01.jpg",
            "https://c1.neweggimages.com/ProductImage/24-014-865-S01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-014-865-V01.jpg",
            "https://c1.neweggimages.com/ProductImage/24-014-865-V01.jpg",
        ],
    },
    92: {
        "name": "Gigabyte M27Q X 240Hz",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-012-048-13.jpg",
            "https://c1.neweggimages.com/ProductImage/24-012-048-13.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-012-048-V01.jpg",
            "https://c1.neweggimages.com/ProductImage/24-012-048-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-012-048-S01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/24-012-048-13.jpg",
        ],
    },
    94: {
        "name": "MSI MAG 274QRF-QD 170Hz",
        "urls": [
            # The page returned 24-475-127 which might be wrong product, try 24-475-096 (correct item)
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-475-096-V01.jpg",
            "https://c1.neweggimages.com/ProductImage/24-475-096-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-475-096-S01.jpg",
            "https://c1.neweggimages.com/ProductImage/24-475-096-S01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-475-096-01.jpg",
            "https://c1.neweggimages.com/ProductImage/24-475-096-01.jpg",
            # Fallback to what the page gave
            "https://c1.neweggimages.com/ProductImageCompressAll1280/24-475-127-S05.jpg",
            "https://c1.neweggimages.com/productimage/nb640/24-475-127-S05.jpg",
        ],
    },
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Referer": "https://www.newegg.com/",
}


def download_first_working(urls: list[str], name: str) -> bytes | None:
    """Try each URL until one works, return image bytes."""
    for url in urls:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code == 200 and len(resp.content) > 5000:
                print(f"  OK: {url} ({len(resp.content)} bytes)")
                return resp.content
            else:
                print(f"  SKIP: {url} (status={resp.status_code}, size={len(resp.content)})")
        except Exception as e:
            print(f"  FAIL: {url} ({e})")
    return None


def resize_and_save(img_bytes: bytes, output_path: Path) -> bool:
    """Resize to max 800x800 maintaining aspect ratio, save as PNG."""
    try:
        img = Image.open(BytesIO(img_bytes))
        # Convert to RGBA if needed for PNG
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA")

        # Resize maintaining aspect ratio
        max_size = 800
        w, h = img.size
        if w > max_size or h > max_size:
            ratio = min(max_size / w, max_size / h)
            new_w = int(w * ratio)
            new_h = int(h * ratio)
            img = img.resize((new_w, new_h), Image.LANCZOS)
            print(f"  Resized: {w}x{h} -> {new_w}x{new_h}")
        else:
            print(f"  Size OK: {w}x{h} (no resize needed)")

        img.save(output_path, "PNG", optimize=True)
        print(f"  Saved: {output_path} ({output_path.stat().st_size} bytes)")
        return True
    except Exception as e:
        print(f"  ERROR saving: {e}")
        return False


def main():
    results = {}

    for product_id, info in MONITORS.items():
        name = info["name"]
        urls = info["urls"]
        output = PRODUCTS_DIR / f"{product_id}.png"

        print(f"\n{'='*60}")
        print(f"ID {product_id}: {name}")
        print(f"{'='*60}")

        img_bytes = download_first_working(urls, name)
        if img_bytes is None:
            print(f"  FAILED: No working URL found for {name}")
            results[product_id] = False
            continue

        success = resize_and_save(img_bytes, output)
        results[product_id] = success

    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    for product_id, success in results.items():
        name = MONITORS[product_id]["name"]
        status = "SUCCESS" if success else "FAILED"
        print(f"  ID {product_id}: {name} -> {status}")

    failed = sum(1 for s in results.values() if not s)
    if failed:
        print(f"\n{failed} monitor(s) failed!")
        return 1
    else:
        print(f"\nAll {len(results)} monitors fixed successfully!")
        return 0


if __name__ == "__main__":
    sys.exit(main())
