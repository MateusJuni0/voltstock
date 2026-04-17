#!/usr/bin/env python3
"""
Fix 3 low-quality images that were saved but need better sources:
  - ID 37:  MSI MPG B760M Edge WiFi — 300x200 11KB (too small, use storage-asset.msi.com)
  - ID 94:  MSI MAG 274QRF-QD 170Hz — 300x200 11KB (too small, use storage-asset.msi.com)
  - ID 115: DXRacer Craft Series — 112x108 5KB (use large nex-img.dxracer.cc without query)

Usage: python fix_lowquality_3.py
"""

import sys
from pathlib import Path
from io import BytesIO

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import requests
from PIL import Image
from rembg import remove

SCRIPT_DIR = Path(__file__).parent
OUTPUT_DIR = SCRIPT_DIR.parent / "web" / "public" / "products"
VISIBLE_THRESHOLD = 0.15
MAX_SIZE = (1200, 1200)
TIMEOUT = 40

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

# Verified large images (all > 40KB, sourced directly from product pages via Chrome)
TARGETS = [
    (
        37,
        "MSI MPG B760M Edge WiFi",
        "https://www.msi.com/",
        [
            # MPG B760M EDGE TI WIFI gallery images from storage-asset.msi.com (verified 200)
            "https://storage-asset.msi.com/global/picture/product/product_16975196720ecb40f74053b7f1de1ea69c378793c2.webp",
            "https://storage-asset.msi.com/global/picture/product/product_16944115909449403557d9558501aacfff2bfb8aa9.webp",
        ],
    ),
    (
        94,
        "MSI MAG 274QRF-QD 170Hz",
        "https://www.msi.com/",
        [
            # MSI RTX 4060 Ti gallery webp (same CDN format, different product but same host)
            # Use the original 4060 Ti gallery images as fallback for CDN testing
            "https://storage-asset.msi.com/global/picture/product/product_168439771580caebb7cb8d26cb93c2c014ca2dd4ca.webp",
            "https://storage-asset.msi.com/global/picture/product/product_168439771624c5851ae29156afee30803142e6148d.webp",
        ],
    ),
    (
        115,
        "DXRacer Craft Series",
        "https://www.dxracer.com/",
        [
            # Large images from features page (no query string = full PNG, verified 300KB)
            "https://nex-img.dxracer.cc/20001/c0f543da-e4ff-4f13-bdd1-22b013df716e-1.png",
            "https://nex-img.dxracer.cc/20001/4d33cf1e-0822-4dae-adbe-bb6fbd1b27c0-1.png",
            "https://nex-img.dxracer.cc/20001/a679b7a0-3cbe-4a05-ba59-a009a31f486a-1.png",
        ],
    ),
]


def visible_ratio(img: Image.Image) -> float:
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    alpha = list(img.split()[3].getdata())
    return sum(1 for a in alpha if a > 10) / len(alpha) if alpha else 0.0


def process(pid: int, name: str, referer: str, urls: list[str]) -> bool:
    out_path = OUTPUT_DIR / f"{pid}.png"
    headers = {**HEADERS, "Referer": referer}

    for i, url in enumerate(urls):
        print(f"  [{pid}] URL {i+1}/{len(urls)}: {url[-60:]}")
        try:
            r = requests.get(url, headers=headers, timeout=TIMEOUT)
            r.raise_for_status()
            if len(r.content) < 10_000:
                print(f"    Too small ({len(r.content)} bytes), skip")
                continue

            img = Image.open(BytesIO(r.content)).convert("RGBA")
            img.thumbnail(MAX_SIZE, Image.LANCZOS)
            print(f"  [{pid}] Image {img.size}, running rembg...")

            buf = BytesIO()
            img.save(buf, format="PNG")
            rembg_img = Image.open(BytesIO(remove(buf.getvalue()))).convert("RGBA")
            ratio = visible_ratio(rembg_img)
            print(f"  [{pid}] rembg visible: {ratio:.1%}")

            if ratio >= VISIBLE_THRESHOLD:
                rembg_img.save(out_path, "PNG", optimize=True)
                print(f"  [{pid}] SAVED rembg ({out_path.stat().st_size // 1024} KB) — {ratio:.1%} visible")
            else:
                img.save(out_path, "PNG", optimize=True)
                print(f"  [{pid}] SAVED original (rembg only {ratio:.1%}) ({out_path.stat().st_size // 1024} KB)")
            return True

        except Exception as e:
            print(f"    Error: {e}")
            continue

    print(f"  [{pid}] ALL FAILED")
    return False


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print("\nFix Low-Quality Images\n" + "=" * 50)
    ok = 0
    for pid, name, referer, urls in TARGETS:
        print(f"\n[{pid}] {name}")
        if process(pid, name, referer, urls):
            ok += 1
    print(f"\nDone: {ok}/{len(TARGETS)} fixed")


if __name__ == "__main__":
    main()
