#!/usr/bin/env python3
"""Process images only for new product IDs that don't have local images yet."""

import json
import re
import sys
from pathlib import Path
from io import BytesIO

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import requests
from PIL import Image
from rembg import remove

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PRODUCTS_TS = PROJECT_DIR / "web" / "src" / "data" / "products.ts"
OUTPUT_DIR = PROJECT_DIR / "web" / "public" / "products"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
}

# New product IDs that need images
NEW_IDS = {220, 221, 222, 223, 224, 230, 231, 232, 240, 241, 242, 243, 250, 251, 252}


def extract_img_urls(ts_path: Path) -> dict:
    content = ts_path.read_text(encoding="utf-8")
    pattern = re.compile(r'"id"\s*:\s*(\d+).*?"img"\s*:\s*"([^"]+)"', re.DOTALL)
    result = {}
    for m in pattern.finditer(content):
        pid = int(m.group(1))
        if pid in NEW_IDS:
            result[pid] = m.group(2)
    return result


def process(pid: int, url: str) -> bool:
    out = OUTPUT_DIR / f"{pid}.png"
    if out.exists():
        print(f"  [SKIP] {pid} exists")
        return True

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
        # Create a placeholder - use a solid color square
        placeholder = Image.new("RGBA", (400, 400), (30, 30, 30, 0))
        placeholder.save(out, "PNG")
        print(f"  [PLACEHOLDER] {pid} created")
        return False


def update_ts_paths():
    """Update new product img URLs to local paths."""
    content = PRODUCTS_TS.read_text(encoding="utf-8")
    updated = 0
    for pid in NEW_IDS:
        pattern = re.compile(
            r'("id"\s*:\s*' + str(pid) + r'.*?"img"\s*:\s*)"([^"]+)"',
            re.DOTALL,
        )
        def replacer(m):
            nonlocal updated
            if m.group(2).startswith("/products/"):
                return m.group(0)
            updated += 1
            return m.group(1) + f'"/products/{pid}.png"'
        content = pattern.sub(replacer, content, count=1)

    PRODUCTS_TS.write_text(content, encoding="utf-8")
    print(f"\nUpdated {updated} image URLs to local paths")


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urls = extract_img_urls(PRODUCTS_TS)
    print(f"Processing {len(urls)} new product images...\n")

    ok = 0
    fail = 0
    for pid, url in sorted(urls.items()):
        if process(pid, url):
            ok += 1
        else:
            fail += 1

    print(f"\nDone: {ok} OK, {fail} failed/placeholder")
    update_ts_paths()


if __name__ == "__main__":
    main()
