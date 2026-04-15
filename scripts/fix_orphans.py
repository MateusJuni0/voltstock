#!/usr/bin/env python3
"""Remove orphaned product fragments left by cleanup_catalog.py regex failures."""

import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PRODUCTS_TS = Path(__file__).parent.parent / "web" / "src" / "data" / "products.ts"


def fix_orphans():
    content = PRODUCTS_TS.read_text(encoding="utf-8")
    lines = content.split("\n")
    total_before = len(lines)

    # Strategy: find lines that are part of orphaned blocks.
    # Orphaned blocks are fragments that have features/supplier_url/brand/inStock/stockCount
    # but NO preceding "id" field within the same product object.
    #
    # We'll scan for product object boundaries and mark orphaned regions.

    # Find all product start positions (lines with "id":)
    product_starts = []
    for i, line in enumerate(lines):
        if re.match(r'\s*"id"\s*:', line):
            product_starts.append(i)

    # Find orphan regions: look for closing `},` that don't belong to a valid product
    # An orphan is a block that has supplier_url but no "id" within its scope

    # Simpler approach: find all supplier_url lines, trace back to find if there's an "id" in the same object
    orphan_ranges = []

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Detect start of potential orphan: features array or supplier_url without preceding "id"
        if (line.startswith('{ "name"') or line.startswith('"supplier_url"')) and i > 0:
            # Look backwards for the nearest "id" or opening brace of a product
            found_id = False
            found_open_brace = False
            scan_start = i

            for j in range(i - 1, max(i - 30, -1), -1):
                jline = lines[j].strip()
                if re.match(r'"id"\s*:', jline):
                    found_id = True
                    break
                if jline == '{' or jline.startswith('{'):
                    # Check if next line has "id"
                    if j + 1 < len(lines) and re.match(r'\s*"id"\s*:', lines[j + 1]):
                        found_id = True
                    break
                if jline == '},':
                    # Hit previous product's end — this block is orphaned
                    scan_start = j + 1
                    break
                if jline == '],':
                    # Could be end of features array from previous product
                    scan_start = j + 1
                    break

            if not found_id and line.startswith('{ "name"'):
                # This is an orphaned features item — find the full orphan range
                # Go forward to find the end (closing `},` of the orphan)
                orphan_start = scan_start
                orphan_end = i

                for k in range(i, min(i + 30, len(lines))):
                    kline = lines[k].strip()
                    orphan_end = k
                    if kline == '},':
                        break

                orphan_ranges.append((orphan_start, orphan_end))
                i = orphan_end + 1
                continue

        i += 1

    # Also use a more robust approach: regex to find orphan patterns directly
    # Pattern: content that starts with features items (no "id" before) and ends with },
    orphan_pattern = re.compile(
        r'(?:^[ \t]*\{ "name".*?"value".*?\}.*?\n)+'  # feature items
        r'[ \t]*\],\n'                                   # close features array
        r'[ \t]*"supplier_url".*?\n'                     # supplier_url
        r'[ \t]*"brand".*?\n'                            # brand
        r'[ \t]*"inStock".*?\n'                          # inStock
        r'[ \t]*"stockCount".*?\n'                       # stockCount
        r'[ \t]*\},?\n?',                                # closing brace
        re.MULTILINE
    )

    # Find all orphans and remove them
    removed = 0

    def replacer(m):
        nonlocal removed
        # Check if this match is preceded by an "id" within the same object
        start = m.start()
        # Look backwards in content for the nearest "id" or "},"
        preceding = content[max(0, start - 500):start]
        # Find last "id" and last "},"
        last_id = preceding.rfind('"id"')
        last_close = preceding.rfind('},')

        if last_id == -1 or (last_close != -1 and last_close > last_id):
            # No "id" found, or the last "id" is from a previous product (before },)
            # This is an orphan!
            removed += 1
            return ""
        return m.group(0)

    cleaned = orphan_pattern.sub(replacer, content)

    # Also handle the large orphans at the end (which have more features)
    # These have 5-6+ feature items
    large_orphan = re.compile(
        r'(?:[ \t]*\{ "name".*?"value".*?\},?\n)+'    # multiple feature items
        r'[ \t]*\],\n'                                  # close features
        r'[ \t]*"supplier_url".*?\n'                    # supplier_url
        r'[ \t]*"brand".*?\n'                           # brand
        r'[ \t]*"inStock".*?\n'                         # inStock
        r'[ \t]*"stockCount".*?\n'                      # stockCount
        r'[ \t]*\},?\n?',                               # closing brace
        re.MULTILINE
    )

    removed2 = 0
    def replacer2(m):
        nonlocal removed2
        start = m.start()
        preceding = cleaned[max(0, start - 500):start]
        last_id = preceding.rfind('"id"')
        last_close = preceding.rfind('},')

        if last_id == -1 or (last_close != -1 and last_close > last_id):
            removed2 += 1
            return ""
        return m.group(0)

    cleaned = large_orphan.sub(replacer2, cleaned)

    # Remove multiple consecutive blank lines (cleanup)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)

    PRODUCTS_TS.write_text(cleaned, encoding="utf-8")

    new_lines = cleaned.count("\n") + 1
    print(f"Removed {removed + removed2} orphan blocks")
    print(f"Lines: {total_before} -> {new_lines} (removed {total_before - new_lines})")


if __name__ == "__main__":
    fix_orphans()
