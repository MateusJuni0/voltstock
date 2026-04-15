#!/usr/bin/env python3
"""
Update products.ts to use local transparent images.
Replaces external img URLs with /products/{id}.png for each product
that has a processed image in web/public/products/.
"""

import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PRODUCTS_TS = PROJECT_DIR / "web" / "src" / "data" / "products.ts"
IMAGES_DIR = PROJECT_DIR / "web" / "public" / "products"


def main():
    # Find which product IDs have local images
    local_ids = set()
    if IMAGES_DIR.exists():
        for f in IMAGES_DIR.glob("*.png"):
            try:
                pid = int(f.stem)
                local_ids.add(pid)
            except ValueError:
                pass

    print(f"Found {len(local_ids)} local product images")

    if not local_ids:
        print("No local images found. Run process_images.py first.")
        sys.exit(1)

    # Read products.ts
    content = PRODUCTS_TS.read_text(encoding="utf-8")
    original = content

    # For each product with a local image, replace the img URL
    updated = 0
    for pid in sorted(local_ids):
        # Match: "id": <pid>, ... "img": "<any-url>"
        # We need to be careful to only match the img within the right product block
        pattern = re.compile(
            r'("id"\s*:\s*' + str(pid) + r'\s*,.*?"img"\s*:\s*)"([^"]+)"',
            re.DOTALL,
        )

        def replacer(m):
            nonlocal updated
            old_url = m.group(2)
            if old_url.startswith("/products/"):
                return m.group(0)  # Already local
            updated += 1
            return m.group(1) + f'"/products/{pid}.png"'

        content = pattern.sub(replacer, content, count=1)

    if updated > 0:
        PRODUCTS_TS.write_text(content, encoding="utf-8")
        print(f"Updated {updated} product image URLs to local paths")
    else:
        print("No URLs needed updating")

    # Verify
    local_refs = content.count("/products/")
    print(f"Total local image references in products.ts: {local_refs}")


if __name__ == "__main__":
    main()
