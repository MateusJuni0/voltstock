#!/usr/bin/env python3
"""
VoltStock — Fix Over-Cropped Product Images
============================================
Re-downloads product images for the 16 products identified as over-cropped by rembg.
Strategy:
  1. Download a fresh image from manufacturer/retailer sources (multiple fallbacks).
  2. Run rembg background removal.
  3. Check if result has >= 15% visible (non-transparent) pixels.
     - If yes: save the rembg result.
     - If no:  keep the original downloaded image (white bg is better than nearly invisible).
  4. Save to web/public/products/{id}.png

Usage: python fix_overcropped.py
"""

import sys
from pathlib import Path
from io import BytesIO

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import requests
from PIL import Image
from rembg import remove

# ── Paths ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
OUTPUT_DIR = SCRIPT_DIR.parent / "web" / "public" / "products"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    ),
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.google.com/",
}

# Per-host Referer overrides (some CDNs check Referer strictly)
REFERER_OVERRIDES = {
    "media.kingston.com": "https://www.kingston.com/",
    "storage-asset.msi.com": "https://www.msi.com/",
    "nex-img.dxracer.cc": "https://www.dxracer.com/",
    "medias-p1.phoenix.razer.com": "https://www.razer.com/",
    "assets.micron.com": "https://www.crucial.com/",
    "media.us.lg.com": "https://www.lg.com/",
    "images.samsung.com": "https://www.samsung.com/",
    "cdn.autonomous.ai": "https://www.autonomous.ai/",
    "www.hermanmiller.com": "https://www.hermanmiller.com/",
    "i.rtings.com": "https://www.rtings.com/",
}

TIMEOUT = 40
MAX_SIZE = (1200, 1200)
VISIBLE_THRESHOLD = 0.15  # 15% visible pixels required to keep rembg result

# ── Product image URLs (primary + fallbacks) ──────────────────────────────────
# Each entry: (product_id, product_name, [url1, url2, ...])
# All URLs verified accessible (200) via browser/curl testing 2026-04-16
OVERCROPPED_PRODUCTS = [
    (
        60,
        "Kingston KC3000 2TB NVMe Gen4",
        [
            # Verified 200 with Referer: kingston.com — same physical SSD, 512gb in URL is correct
            "https://media.kingston.com/kingston/product/ktc-product-ssd-kc3000-512gb-1-sm.jpg",
            "https://media.kingston.com/kingston/product/ktc-product-ssd-kc3000-512gb-1-lg.jpg",
            "https://media.kingston.com/kingston/product/ktc-product-ssd-kc3000-512gb-2-sm.jpg",
        ],
    ),
    (
        37,
        "MSI MPG B760M Edge WiFi",
        [
            # Already fixed in first run (original kept) — re-run with better source
            "https://asset.msi.com/resize/image/global/product/product_1674632813c79dc4b2c1e7a4d4e5ca0d09ec3e2e10.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
            "https://storage-asset.msi.com/global/picture/image/feature/mb/MPG-B760M-EDGE-WIFI/kv.png",
        ],
    ),
    (
        232,
        "Black XXL Mouse Pad 90x40cm",
        [
            # Generic black XXL desk pad — original product was a plain black mousepad
            "https://havitsmart.com/cdn/shop/files/HAVIT-MP860-Gaming-Mouse-Pad-XXL-1.jpg",
            "https://www.gloriousgaming.com/cdn/shop/products/XXL-Extended_top.jpg",
            "https://m.media-amazon.com/images/I/71Rtu2HKiAL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61GjAHnRnEL._AC_SL1500_.jpg",
        ],
    ),
    (
        91,
        "LG UltraGear 27GR95QE OLED 240Hz",
        [
            # Verified 200 — LG PDP gallery image
            "https://media.us.lg.com/transform/ecomm-PDPGallery-1100x730/c6fc912d-f378-4972-83f7-852672fa11bd/Monitor_27GR95QE-B_gallery_01_5000x5000",
            "https://media.us.lg.com/transform/ecomm-PDPGallery-1100x730/f23fe2b3-9087-4386-b832-b5cfba6b69fa/Monitor-27GR95QE-B-OLED-Gallery_3000x3000",
            "https://i.rtings.com/assets/products/HDgt1zaQ/dell-s2722dgm/design-medium.jpg?format=auto",
        ],
    ),
    (
        158,
        "Samsung 870 EVO 4TB",
        [
            # Verified 200 — Samsung IS image server
            "https://images.samsung.com/is/image/samsung/p6pim/us/mz-77e4t0b-am/gallery/us-sata-ssd-mz-77e4t0b-am-----evo-sata-iii-----inch-ssd-black-551115857",
            "https://images.samsung.com/is/image/samsung/p6pim/us/mz-77e4t0b-am/gallery/us-sata-ssd-mz-77e4t0b-am-----evo-sata-iii-----inch-ssd-black-551115857?$650_519_PNG$",
        ],
    ),
    (
        95,
        "Razer DeathAdder V3",
        [
            # Verified 200 — Razer Phoenix media server (direct, no proxy)
            "https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/hc4/h47/9481236021278/230221-da-v3-1500X1000-1.jpg",
            "https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h72/h48/9481236086814/230221-da-v3-1500X1000-2.jpg",
        ],
    ),
    (
        87,
        "Dell S2722DGM 165Hz Curved",
        [
            # Verified 200 — rtings review page product image
            "https://i.rtings.com/assets/products/HDgt1zaQ/dell-s2722dgm/design-medium.jpg?format=auto",
            "https://i.rtings.com/assets/products/mK9HlXJh/dell-s2722dgm/in-test-large.jpg?format=auto",
        ],
    ),
    (
        22,
        "NVIDIA GeForce RTX 4060 Ti 8GB",
        [
            # Verified 200 — NVIDIA thumbnail from content/dam
            "https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4090/2737470-geforce-rtx-4060ti-thumbnail-02(1).png",
            # MSI RTX 4060 Ti GAMING 8G gallery — verified 200
            "https://storage-asset.msi.com/global/picture/product/product_168439771580caebb7cb8d26cb93c2c014ca2dd4ca.webp",
            "https://storage-asset.msi.com/global/picture/product/product_168439771624c5851ae29156afee30803142e6148d.webp",
        ],
    ),
    (
        23,
        "NVIDIA GeForce RTX 4060 8GB",
        [
            # MSI RTX 4060 GAMING X 8G gallery — verified 200
            "https://storage-asset.msi.com/global/picture/product/product_1689818386ac068f120cf48b695864a745ea4fe414.webp",
            "https://storage-asset.msi.com/global/picture/product/product_16897560151f73fdc26933cacda7488ae8d85a6039.webp",
        ],
    ),
    (
        52,
        "Crucial DDR5 32GB 4800MHz",
        [
            # Verified 200 — Micron/Crucial official product image
            "https://assets.micron.com/adobe/assets/urn:aaid:aem:0ed42dc0-830d-407d-b62f-0bdf14777b30/renditions/transformpng-1024-1024.png/as/crucial-ddr5-SODIMM-iso-4.png",
            "https://assets.micron.com/adobe/assets/urn:aaid:aem:0ed42dc0-830d-407d-b62f-0bdf14777b30/renditions/cq5dam.thumbnail.319.319.png/as/crucial-ddr5-SODIMM-iso-4.png",
        ],
    ),
    (
        94,
        "MSI MAG 274QRF-QD 170Hz",
        [
            # Already fixed in first run (original kept) — re-run with asset.msi.com
            "https://asset.msi.com/resize/image/global/product/product_1641888040c79dc4b2c1e7a4d4e5ca0d09ec3e2e10.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
        ],
    ),
    (
        222,
        "HAVIT MS1006 Gaming Mouse",
        [
            # Already fixed in first run (original kept) — re-run
            "https://havitsmart.com/cdn/shop/files/havit-gaming-mouse-ms1006havit-business-762678.jpg?v=1749802186",
        ],
    ),
    (
        119,
        "Herman Miller x Logitech Embody Gaming",
        [
            # Verified 200 — HermanMiller official product page image
            "https://www.hermanmiller.com/content/dam/hmicom/page_assets/products/embody_chairs/mh_prd_ovw_embody_chairs.jpg.rendition.480.360.jpg",
            "https://www.hermanmiller.com/content/dam/hmicom/page_assets/products/embody_chairs/ig_prd_ovw_embody_chairs_02.jpg.rendition.480.480.jpg",
        ],
    ),
    (
        186,
        "LG UltraGear 27GS95QE 27",
        [
            # Verified 200 — LG PDP gallery image
            "https://media.us.lg.com/transform/ecomm-PDPGallery-1100x730/fe609118-7858-438c-9fd9-b6ce3d017714/Monitor_27GS95QE-B_gallery_01_5804x4354",
            "https://media.us.lg.com/transform/ecomm-PDPGallery-1100x730/ebb82051-a91a-4bf6-a95b-567fd58abc32/Monitor-27GS95QE-B-OLED-Gallery_3000x3000",
        ],
    ),
    (
        120,
        "Autonomous ErgoChair Pro",
        [
            # Verified 200 — Autonomous CDN product images
            "https://cdn.autonomous.ai/production/ecm/240715/1(1).jpg",
            "https://cdn.autonomous.ai/production/ecm/240715/2(1).jpg",
            "https://cdn.autonomous.ai/production/ecm/240115/6(2).jpg",
        ],
    ),
    (
        115,
        "DXRacer Craft Series",
        [
            # Verified 200 — DXRacer new CDN
            "https://nex-img.dxracer.cc/20001/9dc9f13e-e6bc-4ee3-9cb2-240a04fa578b-1.png?imageView2/2/format/webp/interlace/1",
            "https://nex-img.dxracer.cc/20001/ed31f020-649c-4c09-94be-622db1eed46b-1.png?imageView2/2/format/webp/interlace/1",
        ],
    ),
]


# ── Helpers ────────────────────────────────────────────────────────────────────

def visible_ratio(img: Image.Image) -> float:
    """Return the fraction of pixels that are not fully transparent."""
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    r, g, b, alpha = img.split()
    alpha_data = list(alpha.getdata())
    total = len(alpha_data)
    if total == 0:
        return 0.0
    visible = sum(1 for a in alpha_data if a > 10)
    return visible / total


def download_image(url: str) -> bytes | None:
    """Download an image URL and return raw bytes, or None on failure."""
    try:
        from urllib.parse import urlparse
        host = urlparse(url).netloc
        headers = {**HEADERS}
        for pattern, referer in REFERER_OVERRIDES.items():
            if pattern in host:
                headers["Referer"] = referer
                break
        resp = requests.get(url, headers=headers, timeout=TIMEOUT)
        resp.raise_for_status()
        content_type = resp.headers.get("content-type", "")
        if "image" not in content_type and "octet-stream" not in content_type:
            print(f"    [SKIP] Not an image ({content_type}): {url[:80]}")
            return None
        if len(resp.content) < 5000:
            print(f"    [SKIP] Too small ({len(resp.content)} bytes): {url[:80]}")
            return None
        return resp.content
    except Exception as e:
        print(f"    [FAIL-DL] {url[:80]}: {e}")
        return None


def process_product(pid: int, name: str, urls: list[str]) -> str:
    """
    Try each URL until one succeeds.
    Returns a status string: 'rembg', 'original', or 'failed'.
    """
    out_path = OUTPUT_DIR / f"{pid}.png"

    for i, url in enumerate(urls):
        print(f"  [{pid}] Trying URL {i+1}/{len(urls)}: {url[:80]}...")
        raw = download_image(url)
        if raw is None:
            continue

        try:
            img = Image.open(BytesIO(raw)).convert("RGBA")
            img.thumbnail(MAX_SIZE, Image.LANCZOS)

            # Attempt rembg
            print(f"  [{pid}] Running rembg...")
            buf = BytesIO()
            img.save(buf, format="PNG")
            rembg_bytes = remove(buf.getvalue())
            rembg_img = Image.open(BytesIO(rembg_bytes)).convert("RGBA")

            ratio = visible_ratio(rembg_img)
            print(f"  [{pid}] rembg visible ratio: {ratio:.1%}")

            if ratio >= VISIBLE_THRESHOLD:
                rembg_img.save(out_path, "PNG", optimize=True)
                size_kb = out_path.stat().st_size // 1024
                print(f"  [{pid}] SAVED rembg result ({size_kb} KB) — {ratio:.1%} visible")
                return "rembg"
            else:
                # rembg removed too much — save the original (converted to RGBA, no bg removal)
                print(f"  [{pid}] rembg over-cropped ({ratio:.1%} < {VISIBLE_THRESHOLD:.0%}) — keeping original image")
                img.save(out_path, "PNG", optimize=True)
                size_kb = out_path.stat().st_size // 1024
                print(f"  [{pid}] SAVED original image ({size_kb} KB)")
                return "original"

        except Exception as e:
            print(f"  [{pid}] Error processing image: {e}")
            continue

    print(f"  [{pid}] ALL URLs FAILED — product not updated")
    return "failed"


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    results = {"rembg": [], "original": [], "failed": []}

    print(f"\nVoltStock — Fix Over-Cropped Images")
    print(f"Products to fix: {len(OVERCROPPED_PRODUCTS)}")
    print(f"Output: {OUTPUT_DIR}\n")
    print("=" * 70)

    for pid, name, urls in OVERCROPPED_PRODUCTS:
        print(f"\n[{pid}] {name}")
        status = process_product(pid, name, urls)
        results[status].append((pid, name))

    # ── Summary ────────────────────────────────────────────────────────────────
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)

    print(f"\n✓ rembg applied ({len(results['rembg'])} products):")
    for pid, name in results["rembg"]:
        print(f"  [{pid}] {name}")

    print(f"\n~ original kept ({len(results['original'])} products — rembg would over-crop):")
    for pid, name in results["original"]:
        print(f"  [{pid}] {name}")

    print(f"\n✗ failed ({len(results['failed'])} products):")
    for pid, name in results["failed"]:
        print(f"  [{pid}] {name}")

    total_ok = len(results["rembg"]) + len(results["original"])
    print(f"\nTotal: {total_ok}/{len(OVERCROPPED_PRODUCTS)} fixed, {len(results['failed'])} failed")


if __name__ == "__main__":
    main()
