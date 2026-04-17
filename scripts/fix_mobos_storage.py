"""
Download clean product photos from Newegg for motherboards and storage
with wrong/bad images. Resize to max 800x800, save as PNG. No rembg.
"""
import requests
from PIL import Image
from io import BytesIO
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "web" / "public" / "products"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Referer": "https://www.newegg.com/",
}

MAX_SIZE = 800

# Newegg CDN codes extracted from product pages
PRODUCTS = {
    # === MOTHERBOARDS ===
    9: {
        "name": "MSI MAG B650 Tomahawk WiFi",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/13-144-557-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/13-144-557-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/13-144-557-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/13-144-557-V01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/13-144-557-01.jpg",
        ],
    },
    44: {
        "name": "ASRock B760M Pro RS WiFi",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/13-162-228-04.png",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/13-162-228-01.png",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/13-162-228-06.png",
            "https://c1.neweggimages.com/productimage/nb640/13-162-228-04.png",
            "https://c1.neweggimages.com/productimage/nb640/13-162-228-01.png",
        ],
    },
    138: {
        "name": "MSI MEG Z890 ACE",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/13-144-673-27.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/13-144-673-14.png",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/13-144-673-15.png",
            "https://c1.neweggimages.com/productimage/nb640/13-144-673-27.jpg",
            "https://c1.neweggimages.com/productimage/nb640/13-144-673-14.png",
        ],
    },
    # === STORAGE ===
    53: {
        "name": "WD Blue SN580 1TB NVMe",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-250-254-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-250-254-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-250-254-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-250-254-V01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-250-254-01.jpg",
        ],
    },
    54: {
        "name": "Kingston NV2 2TB NVMe",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-242-729-05.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-242-729-06.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-242-729-07.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-242-729-05.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-242-729-06.jpg",
        ],
    },
    55: {
        "name": "Crucial P3 Plus 2TB NVMe",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-156-301-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-156-301-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-156-299-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-156-299-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-156-301-01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-156-299-01.jpg",
        ],
    },
    153: {
        "name": "Samsung 990 EVO Plus 2TB",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-147-900-02.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-147-900-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-147-900-03.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-147-900-02.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-147-900-01.jpg",
        ],
    },
    155: {
        "name": "Crucial T700 2TB NVMe",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-156-330-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-156-330-01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-156-329-15.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-156-329-16.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-156-330-01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-156-329-15.jpg",
        ],
    },
    158: {
        "name": "Samsung 870 EVO 4TB",
        "urls": [
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-147-795-V01.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-147-795-V02.jpg",
            "https://c1.neweggimages.com/ProductImageCompressAll1280/20-147-795-V03.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-147-795-V01.jpg",
            "https://c1.neweggimages.com/productimage/nb640/20-147-795-V02.jpg",
        ],
    },
}


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
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Processing {len(PRODUCTS)} products...\n")

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
