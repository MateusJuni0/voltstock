#!/usr/bin/env python3
"""
Fix the 3 remaining over-cropped products that failed in fix_overcropped.py:
  - ID 60: Kingston KC3000 2TB — image already downloaded to Downloads folder
  - ID 232: Black XXL Mouse Pad — fetch from Amazon (verified 200)
  - ID 115: DXRacer Craft Series — fetch from dxracer CDN without query string

Usage: python fix_remaining_3.py
"""

import sys
from pathlib import Path
from io import BytesIO
import shutil

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import requests
from PIL import Image
from rembg import remove

SCRIPT_DIR = Path(__file__).parent
OUTPUT_DIR = SCRIPT_DIR.parent / "web" / "public" / "products"
DOWNLOADS_DIR = Path.home() / "Downloads"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    ),
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
TIMEOUT = 40
MAX_SIZE = (1200, 1200)
VISIBLE_THRESHOLD = 0.15


def visible_ratio(img: Image.Image) -> float:
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    alpha = img.split()[3]
    pixels = list(alpha.getdata())
    visible = sum(1 for a in pixels if a > 10)
    return visible / len(pixels) if pixels else 0.0


def process_img(img: Image.Image, pid: int) -> str:
    """Run rembg and decide whether to keep result. Returns 'rembg' or 'original'."""
    img = img.convert("RGBA")
    img.thumbnail(MAX_SIZE, Image.LANCZOS)
    out_path = OUTPUT_DIR / f"{pid}.png"

    print(f"  [{pid}] Running rembg...")
    buf = BytesIO()
    img.save(buf, format="PNG")
    rembg_img = Image.open(BytesIO(remove(buf.getvalue()))).convert("RGBA")
    ratio = visible_ratio(rembg_img)
    print(f"  [{pid}] rembg visible ratio: {ratio:.1%}")

    if ratio >= VISIBLE_THRESHOLD:
        rembg_img.save(out_path, "PNG", optimize=True)
        print(f"  [{pid}] SAVED rembg result ({out_path.stat().st_size // 1024} KB) — {ratio:.1%} visible")
        return "rembg"
    else:
        img.save(out_path, "PNG", optimize=True)
        print(f"  [{pid}] SAVED original (rembg only {ratio:.1%}) ({out_path.stat().st_size // 1024} KB)")
        return "original"


def fix_kingston() -> bool:
    """ID 60: use the image downloaded from Chrome to Downloads folder."""
    src = DOWNLOADS_DIR / "kingston_kc3000.jpg"
    if not src.exists():
        print(f"  [60] SKIP — {src} not found in Downloads")
        return False
    print(f"  [60] Loading from {src}")
    img = Image.open(src)
    process_img(img, 60)
    return True


def fix_mousepad() -> bool:
    """ID 232: Black XXL Mouse Pad — Amazon images confirmed 200 from curl."""
    urls = [
        "https://m.media-amazon.com/images/I/719Wr2tQO4L._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71A6WHPy4SL._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71ePPFBO1bL._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/61FHaLsFXZL._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71Fpiq8NY2L._AC_SL1500_.jpg",
    ]
    for url in urls:
        print(f"  [232] Trying: {url[:80]}")
        try:
            r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
            r.raise_for_status()
            if len(r.content) < 5000:
                print(f"  [232] Too small ({len(r.content)} bytes), skip")
                continue
            img = Image.open(BytesIO(r.content))
            process_img(img, 232)
            return True
        except Exception as e:
            print(f"  [232] Failed: {e}")
    return False


def fix_dxracer() -> bool:
    """ID 115: DXRacer Craft Series — fetch without imageView2 query string."""
    urls = [
        # Without the webp transform query - returns full PNG
        "https://nex-img.dxracer.cc/20001/9dc9f13e-e6bc-4ee3-9cb2-240a04fa578b-1.png",
        "https://nex-img.dxracer.cc/20001/ed31f020-649c-4c09-94be-622db1eed46b-1.png",
        "https://nex-img.dxracer.cc/20001/a050ffcf-6cbf-44ae-a8d0-d688acfad132-2.png",
    ]
    headers = {**HEADERS, "Referer": "https://www.dxracer.com/"}
    for url in urls:
        print(f"  [115] Trying: {url[:80]}")
        try:
            r = requests.get(url, headers=headers, timeout=TIMEOUT)
            r.raise_for_status()
            if len(r.content) < 5000:
                print(f"  [115] Too small ({len(r.content)} bytes), skip")
                continue
            img = Image.open(BytesIO(r.content))
            process_img(img, 115)
            return True
        except Exception as e:
            print(f"  [115] Failed: {e}")
    return False


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print("\nFix Remaining 3 Products\n" + "=" * 50)

    results = {}

    print("\n[60] Kingston KC3000 2TB NVMe Gen4")
    results[60] = fix_kingston()

    print("\n[232] Black XXL Mouse Pad 90x40cm")
    results[232] = fix_mousepad()

    print("\n[115] DXRacer Craft Series")
    results[115] = fix_dxracer()

    print("\n" + "=" * 50)
    ok = sum(1 for v in results.values() if v)
    fail = sum(1 for v in results.values() if not v)
    print(f"Done: {ok}/3 fixed, {fail} failed")
    for pid, success in results.items():
        status = "OK" if success else "FAILED"
        print(f"  [{pid}] {status}")


if __name__ == "__main__":
    main()
