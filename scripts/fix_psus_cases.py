"""
Download clean product photos from Newegg for PSUs and Cases with wrong images.
Resize to max 800x800, save as PNG. No rembg.
"""
import requests
from PIL import Image
from io import BytesIO
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "web" / "public" / "products"

# Newegg CDN image URLs - using ProductImageCompressAll1280 for full size
# Fallback to nb640 thumbnail if 1280 fails
PRODUCTS = {
    # === PSUs ===
    62: {
        "name": "Seasonic Focus GX-750 80+ Gold",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-151-187-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-151-187-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-151-187-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/17-151-187-V01.jpg",
        ],
    },
    63: {
        "name": "be quiet! Pure Power 12 M 850W",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/1HU-004H-000S2-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/1HU-004H-000S2-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/1HU-004H-000S2-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/1HU-004H-000S2-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-222-037-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-222-037-01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/17-222-037-V01.jpg",
        ],
    },
    65: {
        "name": "Corsair SF750 80+ Platinum SFX",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-080-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-080-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-080-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/17-139-080-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-330-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-330-01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/17-139-330-V01.jpg",
        ],
    },
    168: {
        "name": "Fractal Design Ion+ 2 860W Platinum",
        "urls": [
            # 860W listing shares images with 17-580-034 (Ion+ 2 family)
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-580-034-V17.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-580-034-V80.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/17-580-034-V15.jpg",
            "https://c1.neweggimages.com/productimage/nb640/17-580-034-V17.jpg",
        ],
    },
    # === Cases ===
    71: {
        "name": "Corsair 4000D Airflow",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/11-139-156-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/11-139-156-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/11-139-156-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/11-139-156-V01.jpg",
        ],
    },
    73: {
        "name": "be quiet! Pure Base 500DX",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/2AM-0037-00071-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/2AM-0037-00071-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/2AM-0037-00071-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/2AM-0037-00071-V01.jpg",
        ],
    },
    76: {
        "name": "Corsair 5000D Airflow",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/11-139-161-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/11-139-161-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/11-139-161-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/11-139-161-V01.jpg",
        ],
    },
    173: {
        "name": "Phanteks NV7",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/11-854-122-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/11-854-122-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/11-854-122-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/11-854-122-V01.jpg",
        ],
    },
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Referer": "https://www.newegg.com/",
}

MAX_SIZE = 800


def download_and_resize(product_id: int, info: dict) -> bool:
    name = info["name"]
    urls = info["urls"]

    for url in urls:
        try:
            print(f"  Trying: {url}")
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                print(f"    HTTP {resp.status_code}, skipping")
                continue

            # Check minimum size - skip tiny/placeholder images
            if len(resp.content) < 5000:
                print(f"    Too small ({len(resp.content)} bytes), skipping")
                continue

            img = Image.open(BytesIO(resp.content))
            print(f"    Downloaded: {img.size[0]}x{img.size[1]}, {img.mode}")

            # Convert to RGBA for PNG output
            if img.mode != "RGBA":
                img = img.convert("RGBA")

            # Resize to fit within 800x800 maintaining aspect ratio
            w, h = img.size
            if w > MAX_SIZE or h > MAX_SIZE:
                ratio = min(MAX_SIZE / w, MAX_SIZE / h)
                new_w = int(w * ratio)
                new_h = int(h * ratio)
                img = img.resize((new_w, new_h), Image.LANCZOS)
                print(f"    Resized to: {new_w}x{new_h}")

            out_path = OUTPUT_DIR / f"{product_id}.png"
            img.save(str(out_path), "PNG", optimize=True)
            size_kb = out_path.stat().st_size / 1024
            print(f"  OK: {name} -> {out_path.name} ({size_kb:.0f} KB)")
            return True

        except Exception as e:
            print(f"    Error: {e}")
            continue

    print(f"  FAILED: {name} - no working URL found")
    return False


def main():
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Processing {len(PRODUCTS)} products (PSUs + Cases)...\n")

    results = {"ok": [], "fail": []}

    for pid, info in PRODUCTS.items():
        print(f"[ID {pid}] {info['name']}")
        if download_and_resize(pid, info):
            results["ok"].append((pid, info["name"]))
        else:
            results["fail"].append((pid, info["name"]))
        print()

    print("=" * 50)
    print(f"SUCCESS: {len(results['ok'])}/{len(PRODUCTS)}")
    for pid, name in results["ok"]:
        print(f"  {pid}.png - {name}")

    if results["fail"]:
        print(f"\nFAILED: {len(results['fail'])}/{len(PRODUCTS)}")
        for pid, name in results["fail"]:
            print(f"  {pid}.png - {name}")


if __name__ == "__main__":
    main()
