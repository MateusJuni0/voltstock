#!/usr/bin/env python3
"""Download real images for new budget products and remove backgrounds."""

import sys
from pathlib import Path
from io import BytesIO

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import requests
from PIL import Image
from rembg import remove

OUTPUT_DIR = Path(__file__).parent.parent / "web" / "public" / "products"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
}

# Verified working URLs from background agent
REAL_URLS = {
    220: "https://redragonadria.com/wp-content/uploads/2021/03/M688-1.jpg",
    221: "https://attackshark.com/cdn/shop/files/R1_8747f811-5ede-47a6-8b88-4b992277d196.jpg?v=1712558386&width=1920",
    222: "https://havitsmart.com/cdn/shop/files/havit-gaming-mouse-ms1006havit-business-762678.jpg?v=1749802186",
    223: "https://redragonshop.com/cdn/shop/files/M711wiredgamingmouse.png?v=1762457093",
    224: "https://attackshark.com/cdn/shop/files/attackshark_x3_gaming_mouse_0055.jpg?v=1750248723&width=1920",
    230: "https://tiltednation.com/cdn/shop/products/tnfireblackrgbmousepad.jpg?v=1715380998",
    231: "https://redragonadria.com/wp-content/uploads/2021/03/P027RGB-1.jpg",
    232: "https://ultimatecustommousepads.com/cdn/shop/files/xl-large-all-black-blackout-gaming-mousepad-deskmat-5.jpg?v=1752202650&width=1200",
    240: "https://cdn.shopify.com/s/files/1/0280/3931/5529/files/1_9d9bc2f1-6106-4a74-9396-9086cd5edffc.jpg?v=1719812070",
    241: "https://rkgamingstore.com/cdn/shop/files/RK8475_WirelessMechanicalKeyboard_2_grande.png?v=1762458960",
    242: "https://redragonshop.com/cdn/shop/products/redragon60keyboard.png?v=1762457801",
    243: "https://vgnlab.com/cdn/shop/files/VGN-Neon-he-Elven-White.jpg?v=1750328084",
    250: "https://redragonshop.com/cdn/shop/products/h510.png?v=1762457096",
    251: "https://www.compume.jo/cdn/shop/files/Havit-H2002D-BO-_3_-1200x1200-1200x1200.jpg",
    252: "https://gamerheadphone.myshopify.com/cdn/shop/products/product-image-782156677.jpg?v=1572140897",
}


def process(pid: int, url: str) -> bool:
    out = OUTPUT_DIR / f"{pid}.png"
    try:
        print(f"  [DL] {pid}...")
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        img = Image.open(BytesIO(resp.content)).convert("RGBA")
        img.thumbnail((1024, 1024), Image.LANCZOS)

        print(f"  [REMBG] {pid}...")
        buf = BytesIO()
        img.save(buf, format="PNG")
        result = Image.open(BytesIO(remove(buf.getvalue())))
        result.save(out, "PNG", optimize=True)

        print(f"  [OK] {pid} ({out.stat().st_size // 1024} KB)")
        return True
    except Exception as e:
        print(f"  [FAIL] {pid}: {e}")
        return False


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    ok = 0
    fail = 0
    for pid, url in sorted(REAL_URLS.items()):
        if process(pid, url):
            ok += 1
        else:
            fail += 1
    print(f"\nDone: {ok} OK, {fail} failed")


if __name__ == "__main__":
    main()
