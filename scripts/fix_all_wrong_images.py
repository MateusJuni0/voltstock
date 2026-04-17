#!/usr/bin/env python3
"""
Fix all wrong/duplicate product images by downloading from gallery URLs.
Downloads the first gallery URL for each product, processes through rembg,
and saves as the product PNG.
"""

import io
import re
import sys
import time
from pathlib import Path

import requests
from PIL import Image
from rembg import remove

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PROJECT_DIR = Path(__file__).parent.parent
PRODUCTS_DIR = PROJECT_DIR / "web" / "public" / "products"
PRODUCTS_TS = PROJECT_DIR / "web" / "src" / "data" / "products.ts"

# Product ID -> gallery URL (first gallery image for each)
FIXES: dict[int, str] = {
    12: "https://ae01.alicdn.com/kf/Hd947c23e50a045f8be0ce6da7a33143dM.jpg",
    22: "https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4060-4060ti/geforce-rtx-4060-ti-hero-100vp-d.jpg",
    31: "https://c1.neweggimages.com/productimage/nb640/19-118-462-03.jpg",
    58: "https://assets.micron.com/adobe/assets/urn:aaid:aem:d7a2c5ff-b9ff-4a6a-b511-4481a20ebddc/renditions/transformpng-1024-1024.png/as/crucial-ssd-t500-topdown.png",
    59: "https://ae01.alicdn.com/kf/S57f0ef96f6114e69b46daf8756ced039M.jpg",
    64: "https://ae01.alicdn.com/kf/S08b632a4ee074f00bb9a778e111ea92dg.jpg",
    66: "https://c1.neweggimages.com/productimage/nb640/17-701-018-04.jpg",
    78: "https://ae01.alicdn.com/kf/Sa74c4fee91aa4ce1a4c0254f600b1b94o.jpg",
    82: "https://c1.neweggimages.com/productimage/nb640/35-181-400-24.png",
    84: "https://c1.neweggimages.com/productimage/nb640/35-186-285-02.png",
    85: "https://c1.neweggimages.com/productimage/nb640/BCKGS23071212TI5LE2.jpg",
    95: "https://www.razer.com/newsroom/wp-content/uploads/2023/02/daV3-pressrelease-img.png",
    118: "https://c1.neweggimages.com/productimage/nb640/26-930-047-S01.jpg",
    119: "https://images.hermanmiller.group/asset/521e115b-9214-402a-92d2-2b8529a5a228/W/HMG_2517590_100698359_Embody_Gaming_Ignite_OnBlkF34R_68477_PDP_v7.png",
    123: "https://ae01.alicdn.com/kf/S1326e3dd137648c7b7b03f33869ec973H.jpg",
    124: "https://ae01.alicdn.com/kf/A6f880ada71fd4e4aa5405d160678b418I.jpg",
    125: "https://ae01.alicdn.com/kf/S101011f7f6df4006ba69af896e76f2f8W.jpg",
    129: "https://ae01.alicdn.com/kf/Sc9ee44bfbe2e44d38e925d948916ec84o.jpg",
    130: "https://ae01.alicdn.com/kf/Sfc4d0ac50cd540b6a3bd02032ac6c4f7f.jpg",
    131: "https://ae01.alicdn.com/kf/S5adb6bdfc0894c36a5c7214a0cbbb4f9I.jpg",
    132: "https://ae01.alicdn.com/kf/S3136044a78284c93b35cc362fec337b3R.jpg",
    133: "https://ae01.alicdn.com/kf/S199979d21ef54b629421756c4c89dfb8n.jpg",
    140: "https://c1.neweggimages.com/productimage/nb640/13-162-169-05.png",
    141: "https://c1.neweggimages.com/productimage/nb640/13-119-702-09.png",
    162: "https://c1.neweggimages.com/productimage/nb640/17-151-195-S09.jpg",
    166: "https://c1.neweggimages.com/productimage/nb640/17-701-018-04.jpg",
    167: "https://c1.neweggimages.com/productimage/nb640/17-153-438-13.png",
    181: "https://c1.neweggimages.com/productimage/nb640/35-856-208-V01.jpg",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
}


def download_image(url: str) -> bytes | None:
    """Download image from URL."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        return resp.content
    except Exception as e:
        print(f"  FAIL download: {e}")
        return None


def process_image(img_bytes: bytes, needs_rembg: bool = True) -> bytes | None:
    """Process image: remove background if needed, resize, save as PNG."""
    try:
        img = Image.open(io.BytesIO(img_bytes))

        # Check if already has transparency (PNG with alpha)
        has_alpha = img.mode == "RGBA" and any(
            px[3] < 200 for px in list(img.getdata())[:1000] if len(px) == 4
        )

        if needs_rembg and not has_alpha:
            # Remove background
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
        print(f"  FAIL process: {e}")
        return None


def main() -> None:
    print("=" * 60)
    print("FIX ALL WRONG PRODUCT IMAGES")
    print("=" * 60)

    success = 0
    failed = 0
    skipped = 0

    for pid, url in sorted(FIXES.items()):
        print(f"\n[{pid}] Downloading from: {url[:80]}...")

        img_bytes = download_image(url)
        if not img_bytes:
            print(f"  SKIP {pid}: download failed")
            failed += 1
            continue

        # Newegg PNGs on white bg need rembg, transparent PNGs don't
        needs_bg_removal = not url.endswith(".png") or "newegg" in url.lower()

        result = process_image(img_bytes, needs_rembg=needs_bg_removal)
        if not result:
            # Try without rembg as fallback
            print(f"  Retrying without rembg...")
            result = process_image(img_bytes, needs_rembg=False)

        if result:
            out_path = PRODUCTS_DIR / f"{pid}.png"
            out_path.write_bytes(result)
            size_kb = len(result) / 1024
            print(f"  OK {pid}.png ({size_kb:.0f} KB)")
            success += 1
        else:
            print(f"  FAIL {pid}: processing failed")
            failed += 1

        # Small delay to be polite
        time.sleep(0.3)

    print(f"\n{'=' * 60}")
    print(f"Results: {success} fixed, {failed} failed, {skipped} skipped")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
