#!/usr/bin/env python3
"""
VoltStock — Fix GPU Product Images
===================================
Downloads correct images for 10 GPUs with wrong/bad product images.
- Downloads from Newegg full-size or manufacturer sites
- Resizes to max 800x800 (preserving aspect ratio)
- Saves as PNG
- Uses rembg ONLY for bare product photos (no box) on white backgrounds
- Does NOT use rembg for box images

Usage: python fix_gpus.py
"""

import sys
from pathlib import Path
from io import BytesIO
from urllib.parse import urlparse

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import requests
from PIL import Image

# ── Paths ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
OUTPUT_DIR = SCRIPT_DIR.parent / "web" / "public" / "products"
BACKUP_DIR = OUTPUT_DIR / "backup_originals"
MAX_SIZE = 800

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    ),
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.google.com/",
}

REFERER_OVERRIDES = {
    "c1.neweggimages.com": "https://www.newegg.com/",
    "asset.msi.com": "https://www.msi.com/",
    "storage-asset.msi.com": "https://www.msi.com/",
    "www.nvidia.com": "https://www.nvidia.com/",
    "press.asus.com": "https://www.asus.com/",
    "dlcdnwebimgs.asus.com": "https://www.asus.com/",
    "www.sapphiretech.com": "https://www.sapphiretech.com/",
}

# ── GPU Fix Definitions ──────────────────────────────────────────────────────
# Each entry: (id, name, use_rembg, [list of image URLs to try])
#
# Newegg full-size pattern: https://c1.neweggimages.com/ProductImageCompressAll1280/XXXXX.jpg
# Gallery nb640 pattern: https://c1.neweggimages.com/productimage/nb640/XXXXX.jpg
#
# For Newegg images, the product code from gallery URLs can be upgraded to full-size:
#   nb640/14-137-918-04.png -> ProductImageCompressAll1280/14-137-918-04.png

GPU_FIXES = [
    # ID 1: MSI GeForce RTX 5090 SUPRIM X 32G - overcropped edges
    # Newegg item 14-137-918, verified good product shot
    (1, "MSI GeForce RTX 5090 SUPRIM X 32G", True, [
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-137-918-04.png",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-137-918-01.png",
    ]),

    # ID 21: NVIDIA GeForce RTX 4070 Ti Super 16GB
    # No FE exists for 4070 Ti Super. Newegg 14-932-676 = Gigabyte Gaming OC (partner card acceptable).
    # Image -01 is a clean front shot on white background.
    (21, "NVIDIA GeForce RTX 4070 Ti Super 16GB (Gigabyte)", True, [
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-932-676-01.jpg",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-932-676-02.jpg",
    ]),

    # ID 23: NVIDIA GeForce RTX 4060 8GB
    # No standalone FE on Newegg. Newegg 14-137-805 = MSI RTX 4060 (partner card acceptable).
    # Image -01 is a clean front shot on white background.
    (23, "NVIDIA GeForce RTX 4060 8GB (MSI partner)", True, [
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-137-805-01.jpg",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-137-805-02.jpg",
    ]),

    # ID 27: NVIDIA GeForce RTX 4070 Super 12GB - shows Gigabyte GPU
    # RTX 4070 Super FE exists! Newegg listing 1FT-0004-008P2, user photo B9ZZS240125165H9V62
    # Verified: perfect FE front shot with "RTX 4070 SUPER" label, white background
    (27, "NVIDIA GeForce RTX 4070 Super 12GB FE", True, [
        "https://c1.neweggimages.com/ProductImageCompressAll1280/B9ZZS240125165H9V62.jpg",
    ]),

    # ID 121: NVIDIA GeForce RTX 5090 FE - AliExpress watermarks
    # Newegg listing 1FT-0004-008V4, user photo B9ZZS250616104P0YAB
    # Verified: perfect FE front shot with dual fans, white background
    (121, "NVIDIA GeForce RTX 5090 FE", True, [
        "https://c1.neweggimages.com/ProductImageCompressAll1280/B9ZZS250616104P0YAB.jpg",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/B9ZZS250616104PFOAD.jpg",
    ]),

    # ID 123: NVIDIA GeForce RTX 5070 Ti - AliExpress watermarks, backplate only
    # Newegg item 14-137-993 = MSI VENTUS 3X OC (correct model, partner card)
    (123, "NVIDIA GeForce RTX 5070 Ti (MSI VENTUS)", True, [
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-137-993-03.jpg",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-137-993-14.jpg",
    ]),

    # ID 124: ASUS ROG Strix RTX 5080 OC - tiny, shows 4080 not 5080
    # Newegg item 14-126-742. Verified: correct ASUS ROG Strix 5080 design
    (124, "ASUS ROG Strix RTX 5080 OC", True, [
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-126-742-04.jpg",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-126-742-05.jpg",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-126-742-03.png",
    ]),

    # ID 125: MSI Gaming Trio RTX 5070 - AliExpress watermarks
    # Newegg item 14-137-938. Verified: correct MSI Gaming Trio design
    (125, "MSI Gaming Trio RTX 5070", True, [
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-137-938-04.jpg",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-137-938-13.jpg",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-137-938-05.jpg",
    ]),

    # ID 126: Sapphire Nitro+ RX 9070 - shows XFX RX 7900 XTX instead
    # Newegg item 14-202-451. Image -04 = proper side angle with triple fans (verified)
    # Image -01 was top-down fan view only, -04 is the correct side product shot
    (126, "Sapphire Nitro+ RX 9070", True, [
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-202-451-04.png",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-202-451-01.png",
    ]),

    # ID 128: Intel Arc B580 - AliExpress "NEW" badge
    # Newegg item 14-883-006. Verified: correct Intel Arc B580 Limited Edition
    (128, "Intel Arc B580", True, [
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-883-006-16.png",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-883-006-17.png",
        "https://c1.neweggimages.com/ProductImageCompressAll1280/14-883-006-18.png",
    ]),
]


def download_image(url: str) -> Image.Image | None:
    """Download image from URL and return as PIL Image, or None on failure."""
    host = urlparse(url).hostname or ""
    headers = dict(HEADERS)
    if host in REFERER_OVERRIDES:
        headers["Referer"] = REFERER_OVERRIDES[host]

    try:
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        content_type = resp.headers.get("Content-Type", "")
        if "text/html" in content_type:
            print(f"    SKIP (got HTML instead of image): {url}")
            return None
        img = Image.open(BytesIO(resp.content))
        img.load()  # Force decode
        print(f"    OK   {img.size[0]}x{img.size[1]} {img.mode} from {url}")
        return img
    except Exception as e:
        print(f"    FAIL {e.__class__.__name__}: {e} — {url}")
        return None


def resize_to_max(img: Image.Image, max_px: int = MAX_SIZE) -> Image.Image:
    """Resize image so the longest edge is max_px, preserving aspect ratio."""
    w, h = img.size
    if w <= max_px and h <= max_px:
        return img
    scale = max_px / max(w, h)
    new_w = int(w * scale)
    new_h = int(h * scale)
    return img.resize((new_w, new_h), Image.LANCZOS)


def try_rembg(img: Image.Image) -> Image.Image:
    """Try background removal. Returns processed image or original if rembg fails."""
    try:
        from rembg import remove
        result = remove(img)
        # Check if result has enough visible pixels (>15%)
        if result.mode == "RGBA":
            import numpy as np
            arr = np.array(result)
            alpha = arr[:, :, 3]
            visible_ratio = (alpha > 10).sum() / alpha.size
            if visible_ratio < 0.05:
                print(f"    WARN rembg removed too much ({visible_ratio:.1%} visible), keeping original")
                return img
            print(f"    rembg OK — {visible_ratio:.1%} visible pixels")
        return result
    except Exception as e:
        print(f"    WARN rembg failed: {e}, keeping original")
        return img


def ensure_rgba(img: Image.Image) -> Image.Image:
    """Convert image to RGBA for PNG saving."""
    if img.mode == "RGBA":
        return img
    return img.convert("RGBA")


def process_gpu(
    product_id: int,
    name: str,
    use_rembg: bool,
    urls: list[str],
) -> bool:
    """Process a single GPU image fix. Returns True on success."""
    print(f"\n{'='*60}")
    print(f"ID {product_id}: {name}")
    print(f"{'='*60}")

    output_path = OUTPUT_DIR / f"{product_id}.png"

    # Backup original if it exists
    if output_path.exists():
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)
        backup_path = BACKUP_DIR / f"{product_id}_original.png"
        if not backup_path.exists():
            import shutil
            shutil.copy2(output_path, backup_path)
            print(f"  Backed up original to {backup_path.name}")

    # Try each URL until one works
    img = None
    for url in urls:
        img = download_image(url)
        if img is not None:
            # Check minimum quality: at least 200x200
            if img.size[0] >= 200 and img.size[1] >= 200:
                break
            else:
                print(f"    TOO SMALL {img.size[0]}x{img.size[1]}, trying next...")
                img = None

    if img is None:
        print(f"  FAILED — no valid image found for ID {product_id}")
        return False

    # Apply rembg if requested (only for bare product photos, no boxes)
    if use_rembg:
        img = try_rembg(img)

    # Convert and resize
    img = ensure_rgba(img)
    img = resize_to_max(img)

    # Save
    img.save(output_path, "PNG", optimize=True)
    print(f"  SAVED {output_path.name} — {img.size[0]}x{img.size[1]}")
    return True


def main() -> None:
    print("VoltStock GPU Image Fix")
    print("=" * 60)
    print(f"Output: {OUTPUT_DIR}")
    print(f"Max size: {MAX_SIZE}x{MAX_SIZE}")
    print(f"GPUs to fix: {len(GPU_FIXES)}")

    success = 0
    failed = 0

    for product_id, name, use_rembg, urls in GPU_FIXES:
        ok = process_gpu(product_id, name, use_rembg, urls)
        if ok:
            success += 1
        else:
            failed += 1

    print(f"\n{'='*60}")
    print(f"RESULTS: {success} fixed, {failed} failed out of {len(GPU_FIXES)}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
