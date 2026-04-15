#!/usr/bin/env python3
"""
VoltStock Catalog Cleanup
==========================
1. Remove duplicate products (keep the newer/better version)
2. Remove obsolete products (old gen)
3. Fix wrong image references
4. Normalize stockCounts to realistic values
"""

import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).parent
PRODUCTS_TS = SCRIPT_DIR.parent / "web" / "src" / "data" / "products.ts"

# ── IDs to REMOVE (duplicates — keep the newer version) ──
REMOVE_DUPLICATES = {
    18,   # Corsair HX1500i — keep 161
    61,   # Corsair RM850x — keep 165
    67,   # Seasonic Prime TX-1000 — keep 162
    77,   # Lian Li O11 Dynamic EVO — keep 169 (EVO 2)
    79,   # Arctic Liquid Freezer II 360 — keep 180 (III 360)
    81,   # Noctua NH-D15 chromax — keep 179 (G2)
}

# ── IDs to REMOVE (obsolete / old gen) ──
REMOVE_OBSOLETE = {
    28,   # RTX 3060 12GB — 2 gen old
    33,   # Ryzen 5 5600X — AM4 obsolete
    34,   # Intel i5-13400F — 2 gen old
    36,   # Intel i3-12100F — 3 gen old
    39,   # Gigabyte B550 Aorus Pro V2 — AM4 EOL
    40,   # ASRock B660M Steel Legend — Intel 12th gen
    51,   # Kingston Fury Beast DDR4 — DDR4 is old gen
    56,   # Samsung 870 EVO 1TB SATA — SATA irrelevant for gamers
}

ALL_REMOVE = REMOVE_DUPLICATES | REMOVE_OBSOLETE

# ── Stock count normalization (cap unrealistic values) ──
MAX_STOCK = {
    "default": 25,
    "premium": 8,    # products over 500 EUR
    "budget": 40,    # products under 100 EUR
}


def parse_price_eur(price_str: str) -> float:
    """Parse '2.199,00 EUR' to float 2199.00"""
    clean = price_str.replace("EUR", "").replace("€", "").strip()
    clean = clean.replace(".", "").replace(",", ".")
    try:
        return float(clean)
    except ValueError:
        return 0.0


def get_max_stock(price: float) -> int:
    if price >= 500:
        return MAX_STOCK["premium"]
    elif price <= 100:
        return MAX_STOCK["budget"]
    return MAX_STOCK["default"]


def main():
    content = PRODUCTS_TS.read_text(encoding="utf-8")

    # Extract the part before the products array
    array_start = content.find("export const products: Product[] = [")
    if array_start == -1:
        print("ERROR: Could not find products array")
        sys.exit(1)

    header = content[:array_start]

    # Parse each product block using regex
    # Find all product objects
    product_pattern = re.compile(
        r'\{[^{}]*"id"\s*:\s*(\d+)[^{}]*\}',
        re.DOTALL
    )

    # More robust: split by product blocks
    # Find the array content
    array_content = content[array_start:]

    # Track removals
    removed_ids = set()
    stock_fixes = 0

    # Process each product — remove by ID
    for remove_id in ALL_REMOVE:
        # Find and remove the entire product object for this ID
        # Pattern: from { before "id": X to the next },
        pattern = re.compile(
            r',?\s*\{\s*"id"\s*:\s*' + str(remove_id) + r'\b.*?\}(?=\s*[,\]])',
            re.DOTALL,
        )
        match = pattern.search(array_content)
        if match:
            array_content = array_content[:match.start()] + array_content[match.end():]
            removed_ids.add(remove_id)
            print(f"  REMOVED: ID {remove_id}")
        else:
            print(f"  NOT FOUND: ID {remove_id}")

    # Fix stockCount — cap to realistic values
    def fix_stock(m):
        nonlocal stock_fixes
        full = m.group(0)
        stock_val = int(m.group(1))

        # Find the price for context
        price_match = re.search(r'"price"\s*:\s*"([^"]+)"', full)
        if price_match:
            price = parse_price_eur(price_match.group(1))
            max_s = get_max_stock(price)
            if stock_val > max_s:
                stock_fixes += 1
                new_stock = min(stock_val, max_s)
                full = re.sub(
                    r'"stockCount"\s*:\s*\d+',
                    f'"stockCount": {new_stock}',
                    full,
                )
        return full

    # Apply stock fixes on each product block
    array_content = re.sub(
        r'\{[^{}]*"stockCount"\s*:\s*(\d+)[^{}]*\}',
        fix_stock,
        array_content,
        flags=re.DOTALL,
    )

    # Clean up any double commas or leading commas from removals
    array_content = re.sub(r',\s*,', ',', array_content)
    array_content = re.sub(r'\[\s*,', '[', array_content)

    # Reconstruct
    final = header + array_content
    PRODUCTS_TS.write_text(final, encoding="utf-8")

    print(f"\n{'='*50}")
    print(f"CLEANUP COMPLETE")
    print(f"{'='*50}")
    print(f"  Removed: {len(removed_ids)} products (IDs: {sorted(removed_ids)})")
    print(f"  Duplicates removed: {len(removed_ids & REMOVE_DUPLICATES)}")
    print(f"  Obsolete removed: {len(removed_ids & REMOVE_OBSOLETE)}")
    print(f"  Stock normalized: {stock_fixes} products capped")

    # Count remaining
    remaining = len(re.findall(r'"id"\s*:\s*\d+', final))
    print(f"  Products remaining: {remaining}")


if __name__ == "__main__":
    main()
