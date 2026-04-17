#!/usr/bin/env python3
"""
Fix batch 2: Download correct product images for products showing wrong images.

Products:
  64: EVGA SuperNOVA 1000 G7 80+ Gold PSU
  82: Corsair A115 Air Cooler
  84: Arctic Freezer 36 A-RGB
  85: Thermalright Peerless Assassin 120 SE
 162: Seasonic PRIME TX-1000 PSU
 167: Thermaltake Toughpower GF3 750W PSU
"""

import hashlib
import io
import sys
import time
from pathlib import Path
from typing import Optional

import requests
from PIL import Image
from rembg import remove

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PROJECT_DIR = Path(__file__).parent.parent
PRODUCTS_DIR = PROJECT_DIR / "web" / "public" / "products"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
    ),
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
}

# Product ID -> list of fallback URLs (try in order)
FIXES: dict[int, list[str]] = {
    # 64: EVGA SuperNOVA 1000 G7 - official EVGA product gallery
    64: [
        "https://images.evga.com/products/gallery/png/220-G7-1000-X1_LG_1.png",
        "https://images.evga.com/products/gallery/png/220-G7-1000-X1_LG_2.png",
        "https://images.evga.com/products/gallery/png/220-G7-1000-X1_LG_3.png",
        "https://c1.neweggimages.com/productimage/nb640/17-438-238-V01.jpg",
    ],
    # 82: Corsair A115 Air Cooler - use a different angle than the current -24
    82: [
        "https://c1.neweggimages.com/productimage/nb640/35-181-400-01.png",
        "https://c1.neweggimages.com/productimage/nb640/35-181-400-22.png",
        "https://c1.neweggimages.com/productimage/nb640/35-181-400-23.png",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/35-181-400-01.png",
    ],
    # 84: Arctic Freezer 36 A-RGB (black) - correct cooler images
    84: [
        "https://c1.neweggimages.com/productimage/nb640/35-186-285-01.png",
        "https://c1.neweggimages.com/productimage/nb640/35-186-285-03.png",
        "https://c1.neweggimages.com/productimage/nb640/35-186-285-04.png",
    ],
    # 85: Thermalright Peerless Assassin 120 SE - correct cooler images
    85: [
        "https://c1.neweggimages.com/productimage/nb640/BFKMS2209050JF0TKB2.jpg",
        "https://c1.neweggimages.com/productimage/nb640/BFKMS2209050JF1QN87.jpg",
        "https://c1.neweggimages.com/productimage/nb640/BFKMS2209050JF2RY57.jpg",
    ],
    # 162: Seasonic PRIME TX-1000 - correct PSU images
    162: [
        "https://c1.neweggimages.com/productimage/nb640/17-151-195-S10.jpg",
        "https://c1.neweggimages.com/productimage/nb640/17-151-195-S11.jpg",
        "https://c1.neweggimages.com/productimage/nb640/17-151-195-S09.jpg",
    ],
    # 167: Thermaltake Toughpower GF3 750W - 750W specific (not 850W)
    # NOTE: Use direct catalog path, NOT /cache/ URLs (cache returns tiny 60x60 images)
    167: [
        "https://www.thermaltake.com/media/catalog/product/t/o/toughpower_gf3_750_01.jpg",
        "https://www.thermaltake.com/media/catalog/product/t/o/toughpower_gf3_750_02.jpg",
        "https://www.thermaltake.com/media/catalog/product/t/o/toughpower_gf3_750_03.jpg",
    ],
}

PRODUCT_NAMES: dict[int, str] = {
    64: "EVGA SuperNOVA 1000 G7 80+ Gold PSU",
    82: "Corsair A115 Air Cooler",
    84: "Arctic Freezer 36 A-RGB",
    85: "Thermalright Peerless Assassin 120 SE",
    162: "Seasonic PRIME TX-1000 PSU",
    167: "Thermaltake Toughpower GF3 750W PSU",
}


def file_hash(path: Path) -> str:
    """Return MD5 hex digest of a file."""
    return hashlib.md5(path.read_bytes()).hexdigest()


def download_image(url: str) -> Optional[bytes]:
    """Download image from URL with retries."""
    for attempt in range(3):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=30, allow_redirects=True)
            resp.raise_for_status()
            content_type = resp.headers.get("content-type", "")
            if "image" in content_type or len(resp.content) > 10000:
                return resp.content
            print(f"    Not an image (content-type: {content_type}, size: {len(resp.content)})")
            return None
        except requests.RequestException as e:
            if attempt < 2:
                print(f"    Retry {attempt + 1}: {e}")
                time.sleep(1)
            else:
                print(f"    FAIL download after 3 attempts: {e}")
                return None
    return None


def process_image(img_bytes: bytes, needs_rembg: bool = True) -> Optional[bytes]:
    """Process image: remove background if needed, resize to max 800x800, save as PNG."""
    try:
        img = Image.open(io.BytesIO(img_bytes))

        # Check if already has transparency
        has_alpha = False
        if img.mode == "RGBA":
            sample = list(img.getdata())[:1000]
            has_alpha = any(px[3] < 200 for px in sample if len(px) == 4)

        if needs_rembg and not has_alpha:
            result_bytes = remove(img_bytes)
            img = Image.open(io.BytesIO(result_bytes))

        # Convert to RGBA
        img = img.convert("RGBA")

        # Resize to max 800x800 maintaining aspect ratio
        img.thumbnail((800, 800), Image.Resampling.LANCZOS)

        # Save as PNG
        buf = io.BytesIO()
        img.save(buf, format="PNG", optimize=True)
        return buf.getvalue()
    except Exception as e:
        print(f"    FAIL process: {e}")
        return None


def main() -> None:
    print("=" * 60)
    print("FIX BATCH 2 — Wrong Product Images")
    print("=" * 60)

    success = 0
    failed = 0

    for pid, urls in sorted(FIXES.items()):
        name = PRODUCT_NAMES.get(pid, "Unknown")
        out_path = PRODUCTS_DIR / f"{pid}.png"
        old_hash = file_hash(out_path) if out_path.exists() else ""

        print(f"\n[{pid}] {name}")
        print(f"  Current hash: {old_hash}")

        result = None
        for i, url in enumerate(urls):
            print(f"  Trying URL {i + 1}/{len(urls)}: {url[:80]}...")

            img_bytes = download_image(url)
            if not img_bytes:
                continue

            print(f"    Downloaded {len(img_bytes) / 1024:.0f} KB")

            # Newegg images on white bg and JPGs need rembg
            needs_bg_removal = True
            # PNGs from EVGA gallery already have transparent bg
            if url.endswith(".png") and "evga.com" in url:
                needs_bg_removal = False

            result = process_image(img_bytes, needs_rembg=needs_bg_removal)
            if result:
                break

            # Fallback: try without rembg
            print("    Retrying without rembg...")
            result = process_image(img_bytes, needs_rembg=False)
            if result:
                break

        if result:
            new_hash = hashlib.md5(result).hexdigest()
            if new_hash == old_hash:
                print(f"  WARNING: New image hash matches old — same image!")
                print(f"  Saving anyway (may need manual check)")

            out_path.write_bytes(result)
            size_kb = len(result) / 1024
            print(f"  SAVED {pid}.png ({size_kb:.0f} KB)")
            print(f"  New hash: {new_hash}")
            print(f"  Hash changed: {new_hash != old_hash}")
            success += 1
        else:
            print(f"  FAILED — all URLs failed for {pid}")
            failed += 1

        time.sleep(0.5)

    print(f"\n{'=' * 60}")
    print(f"Results: {success} fixed, {failed} failed")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
