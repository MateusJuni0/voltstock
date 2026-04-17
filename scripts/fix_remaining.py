#!/usr/bin/env python3
"""
Fix 10 product images with wrong/watermarked/incorrect images.
Downloads from Newegg (c1.neweggimages.com), resizes to max 800x800, saves as PNG.
Uses rembg ONLY for bare products on white backgrounds (NOT for boxed products).

Usage: python fix_remaining.py
"""

import sys
import time
from io import BytesIO
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import requests
from PIL import Image
from rembg import remove

SCRIPT_DIR = Path(__file__).parent
OUTPUT_DIR = SCRIPT_DIR.parent / "web" / "public" / "products"
MAX_SIZE = (800, 800)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    ),
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.newegg.com/",
}
TIMEOUT = 45

# Newegg full-size URL pattern
NEWEGG_BASE = "https://c1.neweggimages.com/ProductImageCompressAll1280"

# Product definitions:
#   id, name, image_code, use_rembg (True only for bare products on white bg)
PRODUCTS = [
    {
        "id": 7,
        "name": "Razer BlackWidow V4 Pro keyboard",
        "url": f"{NEWEGG_BASE}/26J-05FW-00002-01.jpg",
        "use_rembg": False,  # keyboard in box/promo shot
    },
    {
        "id": 11,
        "name": "SteelSeries Arctis Nova Pro Wireless headset",
        "url": f"{NEWEGG_BASE}/26-249-269-01.jpg",
        "use_rembg": False,  # headset product shot (not bare on white)
    },
    {
        "id": 47,
        "name": "Kingston Fury Renegade DDR5 32GB 6400MHz RAM",
        "url": f"{NEWEGG_BASE}/A4YUD23052206SYWO60.jpg",
        "use_rembg": False,  # RAM in packaging
    },
    {
        "id": 52,
        "name": "Crucial DDR5 32GB 4800MHz desktop DIMM",
        "url": f"{NEWEGG_BASE}/20-156-285-V01.jpg",
        "use_rembg": False,  # RAM stick - boxed product
    },
    {
        "id": 78,
        "name": "Corsair iCUE H150i Elite LCD XT AIO cooler",
        "url": f"{NEWEGG_BASE}/35-181-337-01.png",
        "use_rembg": False,  # AIO cooler product shot
    },
    {
        "id": 115,
        "name": "DXRacer Craft Series chair",
        "url": f"{NEWEGG_BASE}/AS58S2506200WNA4PA3.jpg",
        "use_rembg": True,  # bare chair on white background
    },
    {
        "id": 117,
        "name": "Cougar Armor Elite chair",
        "url": f"{NEWEGG_BASE}/26-567-066-01.png",
        "use_rembg": True,  # bare chair on white background
    },
    {
        "id": 181,
        "name": "Deepcool Assassin IV air cooler",
        "url": f"{NEWEGG_BASE}/A4RES23061903OVY950.jpg",
        "use_rembg": False,  # cooler product shot
    },
    {
        "id": 230,
        "name": "Large RGB Gaming Mouse Pad 90x40cm",
        "url": f"{NEWEGG_BASE}/AMA6S200527DKUf3.jpg",
        "use_rembg": False,  # mouse pad product photo
    },
    {
        "id": 240,
        "name": "Aula F75 Mechanical Keyboard 75%",
        "url": f"{NEWEGG_BASE}/ARZZD24072509CGTYE7.jpg",
        "use_rembg": False,  # keyboard product shot
    },
]


def download_image(url: str) -> Image.Image | None:
    """Download image from URL and return PIL Image."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
        return Image.open(BytesIO(resp.content))
    except Exception as e:
        print(f"    DOWNLOAD FAILED: {e}")
        return None


def process_and_save(img: Image.Image, product_id: int, use_rembg: bool) -> bool:
    """Resize to max 800x800, optionally remove background, save as PNG."""
    out_path = OUTPUT_DIR / f"{product_id}.png"

    # Convert to RGBA for consistency
    img = img.convert("RGBA")

    # Resize to max 800x800 keeping aspect ratio
    img.thumbnail(MAX_SIZE, Image.LANCZOS)
    print(f"    Resized to {img.size[0]}x{img.size[1]}")

    if use_rembg:
        print(f"    Running rembg (bare product on white bg)...")
        buf = BytesIO()
        img.save(buf, format="PNG")
        result = Image.open(BytesIO(remove(buf.getvalue()))).convert("RGBA")
        result.save(out_path, "PNG", optimize=True)
        print(f"    Saved with background removed: {out_path.stat().st_size // 1024} KB")
    else:
        img.save(out_path, "PNG", optimize=True)
        print(f"    Saved as-is: {out_path.stat().st_size // 1024} KB")

    return True


def main() -> None:
    if not OUTPUT_DIR.exists():
        print(f"ERROR: Output directory does not exist: {OUTPUT_DIR}")
        sys.exit(1)

    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Processing {len(PRODUCTS)} products...\n")

    success = 0
    failed = 0

    for product in PRODUCTS:
        pid = product["id"]
        name = product["name"]
        url = product["url"]
        use_rembg = product["use_rembg"]

        print(f"[{pid}] {name}")
        print(f"    URL: {url}")

        img = download_image(url)
        if img is None:
            print(f"    FAILED - could not download\n")
            failed += 1
            continue

        print(f"    Downloaded: {img.size[0]}x{img.size[1]} {img.mode}")

        try:
            if process_and_save(img, pid, use_rembg):
                success += 1
                print(f"    OK\n")
        except Exception as e:
            print(f"    PROCESSING ERROR: {e}\n")
            failed += 1

        # Small delay between downloads
        time.sleep(0.5)

    print(f"\n{'='*50}")
    print(f"RESULTS: {success} success, {failed} failed out of {len(PRODUCTS)}")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
