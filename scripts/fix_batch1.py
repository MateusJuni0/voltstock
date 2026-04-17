"""
Fix wrong product images - Batch 1
Downloads correct images from Newegg CDN, removes background with rembg,
resizes to max 800x800, and saves as PNG.
"""

import hashlib
import os
import sys
import requests
from io import BytesIO
from PIL import Image

# Try rembg - fall back gracefully
try:
    from rembg import remove as rembg_remove
    HAS_REMBG = True
except ImportError:
    HAS_REMBG = False
    print("WARNING: rembg not available, will skip background removal")

PRODUCTS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "web", "public", "products"
)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

# Product ID -> (name, list of image URLs to try in order)
# Using full-size URLs (replacing nb640 with nb1280 or removing size prefix)
PRODUCTS = {
    31: (
        "Intel Core i5-14600K",
        [
            "https://c1.neweggimages.com/productimage/nb1280/19-118-470-07.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-118-470-07.jpg",
            "https://c1.neweggimages.com/productimage/19-118-470-07.jpg",
            "https://c1.neweggimages.com/productimage/nb1280/19-118-470-V01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-118-470-V01.jpg",
        ],
    ),
    129: (
        "AMD Ryzen 9 9950X",
        [
            "https://c1.neweggimages.com/productimage/nb1280/19-113-841-03.png",
            "https://c1.neweggimages.com/productimage/nb640/19-113-841-03.png",
            "https://c1.neweggimages.com/productimage/nb1280/19-113-841-V01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-113-841-V01.jpg",
        ],
    ),
    130: (
        "Intel Core Ultra 9 285K",
        [
            "https://c1.neweggimages.com/productimage/nb1280/19-118-505-08.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-118-505-08.jpg",
            "https://c1.neweggimages.com/productimage/nb1280/19-118-505-V01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-118-505-V01.jpg",
        ],
    ),
    132: (
        "Intel Core Ultra 7 265K",
        [
            "https://c1.neweggimages.com/productimage/nb1280/19-118-506-06.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-118-506-06.jpg",
            "https://c1.neweggimages.com/productimage/nb1280/19-118-506-V01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-118-506-V01.jpg",
        ],
    ),
    133: (
        "AMD Ryzen 5 9600X",
        [
            "https://c1.neweggimages.com/productimage/nb1280/19-113-844-05.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-113-844-05.jpg",
            "https://c1.neweggimages.com/productimage/nb1280/19-113-844-V01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-113-844-V01.jpg",
        ],
    ),
    140: (
        "ASRock Z890 Taichi",
        [
            "https://c1.neweggimages.com/productimage/nb1280/13-162-169-05.png",
            "https://c1.neweggimages.com/productimage/nb640/13-162-169-05.png",
            "https://c1.neweggimages.com/productimage/nb1280/13-162-169-V01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/13-162-169-V01.jpg",
        ],
    ),
    141: (
        "ASUS ROG Strix B850-F Gaming WiFi",
        [
            "https://c1.neweggimages.com/productimage/nb1280/13-119-702-09.png",
            "https://c1.neweggimages.com/productimage/nb640/13-119-702-09.png",
            "https://c1.neweggimages.com/productimage/nb1280/13-119-702-V01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/13-119-702-V01.jpg",
        ],
    ),
}


def file_md5(path: str) -> str:
    """Compute MD5 hash of a file."""
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def bytes_md5(data: bytes) -> str:
    return hashlib.md5(data).hexdigest()


def download_image(urls: list[str]) -> bytes | None:
    """Try each URL in order; return raw bytes of the first successful download."""
    for url in urls:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=30)
            if resp.status_code == 200 and len(resp.content) > 5000:
                print(f"  Downloaded from: {url} ({len(resp.content)} bytes)")
                return resp.content
            else:
                print(f"  Skipped {url} (status={resp.status_code}, size={len(resp.content)})")
        except Exception as e:
            print(f"  Failed {url}: {e}")
    return None


def process_image(raw_bytes: bytes) -> bytes:
    """Remove background with rembg, resize to max 800x800, return PNG bytes."""
    # Remove background
    if HAS_REMBG:
        print("  Removing background with rembg...")
        clean_bytes = rembg_remove(raw_bytes)
        img = Image.open(BytesIO(clean_bytes)).convert("RGBA")
    else:
        img = Image.open(BytesIO(raw_bytes)).convert("RGBA")

    # Resize to fit within 800x800 while maintaining aspect ratio
    max_size = 800
    if img.width > max_size or img.height > max_size:
        img.thumbnail((max_size, max_size), Image.LANCZOS)
        print(f"  Resized to {img.width}x{img.height}")
    else:
        print(f"  Size OK: {img.width}x{img.height}")

    # Save to PNG bytes
    buf = BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def main():
    results = {"success": [], "failed": []}

    for product_id, (name, urls) in PRODUCTS.items():
        print(f"\n{'='*60}")
        print(f"Product {product_id}: {name}")
        print(f"{'='*60}")

        target_path = os.path.join(PRODUCTS_DIR, f"{product_id}.png")

        # Get current file hash
        old_hash = file_md5(target_path) if os.path.exists(target_path) else None
        print(f"  Current hash: {old_hash}")

        # Download
        raw = download_image(urls)
        if raw is None:
            print(f"  FAILED: Could not download any image for {name}")
            results["failed"].append((product_id, name, "download failed"))
            continue

        # Process (rembg + resize)
        try:
            processed = process_image(raw)
        except Exception as e:
            print(f"  FAILED: Image processing error: {e}")
            results["failed"].append((product_id, name, f"processing error: {e}"))
            continue

        # Check hash changed
        new_hash = bytes_md5(processed)
        print(f"  New hash: {new_hash}")

        if new_hash == old_hash:
            print(f"  WARNING: Hash unchanged! Image may be the same.")
            results["failed"].append((product_id, name, "hash unchanged - same image"))
            continue

        # Save
        with open(target_path, "wb") as f:
            f.write(processed)

        # Verify
        verify_hash = file_md5(target_path)
        print(f"  Saved to {target_path}")
        print(f"  Verified hash: {verify_hash}")
        print(f"  SUCCESS: Image updated ({old_hash[:8]}... -> {verify_hash[:8]}...)")
        results["success"].append((product_id, name))

    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    print(f"Success: {len(results['success'])}/{len(PRODUCTS)}")
    for pid, pname in results["success"]:
        print(f"  [OK] {pid}: {pname}")
    if results["failed"]:
        print(f"Failed: {len(results['failed'])}/{len(PRODUCTS)}")
        for pid, pname, reason in results["failed"]:
            print(f"  [FAIL] {pid}: {pname} - {reason}")

    return 0 if not results["failed"] else 1


if __name__ == "__main__":
    sys.exit(main())
