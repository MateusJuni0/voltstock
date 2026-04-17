"""
Fix monitor product images for VoltStock e-commerce.
Downloads from Newegg, resizes to max 800x800, saves as PNG.
NO rembg - monitors need their screen content preserved.
"""

import requests
from PIL import Image
from io import BytesIO
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "web" / "public" / "products"

# Monitor image sources: (product_id, newegg_image_url, description)
MONITORS = [
    (
        185,
        "https://c1.neweggimages.com/ProductImageCompressAll1280/24-027-330-01.jpg",
        "Samsung Odyssey OLED G8 32 S32DG80",
    ),
    (
        187,
        "https://c1.neweggimages.com/ProductImageCompressAll1280/24-281-235-29.png",
        "ASUS ROG Swift PG27AQN 27 360Hz",
    ),
    (
        189,
        "https://c1.neweggimages.com/ProductImageCompressAll1280/24-014-880-10.jpg",
        "BenQ MOBIUZ EX3210U 32 4K",
    ),
    (
        190,
        "https://c1.neweggimages.com/ProductImageCompressAll1280/24-012-061-10.jpg",
        "Gigabyte M27U 27 4K 160Hz",
    ),
    (
        191,
        "https://c1.neweggimages.com/ProductImageCompressAll1280/24-475-350-11.jpg",
        "MSI MAG 341CQP 34 QD-OLED",
    ),
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Referer": "https://www.newegg.com/",
}

MAX_SIZE = 800


def download_and_process(product_id: int, url: str, description: str) -> bool:
    """Download image, resize to max 800x800, save as PNG."""
    print(f"\n[{product_id}] {description}")
    print(f"  URL: {url}")

    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        print(f"  Downloaded: {len(resp.content)} bytes")

        img = Image.open(BytesIO(resp.content))
        print(f"  Original size: {img.size[0]}x{img.size[1]}, mode: {img.mode}")

        # Convert to RGBA to preserve any existing transparency
        if img.mode == "RGBA":
            pass  # Already has alpha
        elif img.mode == "P" and "transparency" in img.info:
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        # Resize to fit within 800x800 maintaining aspect ratio
        w, h = img.size
        if w > MAX_SIZE or h > MAX_SIZE:
            ratio = min(MAX_SIZE / w, MAX_SIZE / h)
            new_w = int(w * ratio)
            new_h = int(h * ratio)
            img = img.resize((new_w, new_h), Image.LANCZOS)
            print(f"  Resized to: {new_w}x{new_h}")
        else:
            print(f"  No resize needed (already within {MAX_SIZE}x{MAX_SIZE})")

        # Save as PNG
        out_path = OUTPUT_DIR / f"{product_id}.png"
        img.save(str(out_path), "PNG", optimize=True)
        file_size = out_path.stat().st_size
        print(f"  Saved: {out_path} ({file_size:,} bytes)")
        return True

    except requests.RequestException as e:
        print(f"  DOWNLOAD FAILED: {e}")
        return False
    except Exception as e:
        print(f"  PROCESSING FAILED: {e}")
        return False


def main():
    print(f"Output directory: {OUTPUT_DIR}")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    results = {}
    for product_id, url, description in MONITORS:
        results[product_id] = download_and_process(product_id, url, description)

    print("\n" + "=" * 60)
    print("RESULTS SUMMARY")
    print("=" * 60)
    succeeded = []
    failed = []
    for product_id, url, description in MONITORS:
        status = "OK" if results[product_id] else "FAILED"
        if results[product_id]:
            succeeded.append(product_id)
        else:
            failed.append(product_id)
        print(f"  [{status}] ID {product_id}: {description}")

    print(f"\nSucceeded: {len(succeeded)}/{len(MONITORS)}")
    if failed:
        print(f"Failed IDs: {failed}")


if __name__ == "__main__":
    main()
