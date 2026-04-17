"""
Download clean product photos from Newegg for CPUs with bad/wrong images.
Resize to max 800x800, save as PNG. No rembg.
"""
import requests
from PIL import Image
from io import BytesIO
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "web" / "public" / "products"

# Newegg CDN image URLs - using ProductImageCompressAll1280 for full size
# Fallback to nb640 thumbnail if 1280 fails
CPUS = {
    29: {
        "name": "AMD Ryzen 5 7600X",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-770-02.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-770-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-770-01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-113-770-02.jpg",
        ],
    },
    32: {
        "name": "Intel Core i7-14700K",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-118-466-04.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-118-466-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-118-466-01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-118-466-04.jpg",
        ],
    },
    35: {
        "name": "AMD Ryzen 9 7900X",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-769-02.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-769-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-769-01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-113-769-02.jpg",
        ],
    },
    129: {
        "name": "AMD Ryzen 9 9950X",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-841-03.png",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-841-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-841-01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-113-841-03.png",
        ],
    },
    131: {
        "name": "AMD Ryzen 7 9700X",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-843-09.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-843-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-843-01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-113-843-09.jpg",
        ],
    },
    134: {
        "name": "AMD Ryzen 9 9900X",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-842-02.png",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-842-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-842-01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-113-842-02.png",
        ],
    },
    136: {
        "name": "AMD Ryzen 7 9800X3D",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-877-01.png",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-877-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/19-113-877-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/19-113-877-01.png",
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
    print(f"Processing {len(CPUS)} CPUs...\n")

    results = {"ok": [], "fail": []}

    for pid, info in CPUS.items():
        print(f"[ID {pid}] {info['name']}")
        if download_and_resize(pid, info):
            results["ok"].append((pid, info["name"]))
        else:
            results["fail"].append((pid, info["name"]))
        print()

    print("=" * 50)
    print(f"SUCCESS: {len(results['ok'])}/{len(CPUS)}")
    for pid, name in results["ok"]:
        print(f"  {pid}.png - {name}")

    if results["fail"]:
        print(f"\nFAILED: {len(results['fail'])}/{len(CPUS)}")
        for pid, name in results["fail"]:
            print(f"  {pid}.png - {name}")


if __name__ == "__main__":
    main()
