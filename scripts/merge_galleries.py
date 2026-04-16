#!/usr/bin/env python3
"""
Merge gallery JSON files from parallel agents into products.ts.

Each agent produces a JSON file: {"id": ["url1", "url2", "url3"], ...}
This script reads all of them, merges with existing gallery URLs,
and updates products.ts with the combined galleries (deduped, max 5 per product).
"""

import json
import os
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PRODUCTS_TS = PROJECT_DIR / "web" / "src" / "data" / "products.ts"

# All gallery JSON files from agents
GALLERY_FILES = [
    "gallery_gpus.json",
    "gallery_cpus_mobos.json",
    "gallery_ram_storage.json",
    "gallery_psu_case_cooler.json",
    "gallery_monitors.json",
    "gallery_peripherals.json",
    "gallery_headsets_chairs.json",
]


def load_all_galleries() -> dict[str, list[str]]:
    """Load and merge all gallery JSON files."""
    merged: dict[str, list[str]] = {}

    for fname in GALLERY_FILES:
        fpath = SCRIPT_DIR / fname
        if not fpath.exists():
            print(f"  ⚠ {fname} not found, skipping")
            continue

        try:
            with open(fpath, encoding="utf-8") as f:
                data = json.load(f)

            count = 0
            for pid_str, urls in data.items():
                pid = str(pid_str)
                if pid not in merged:
                    merged[pid] = []

                for url in urls:
                    url = url.strip()
                    if url and url not in merged[pid]:
                        merged[pid].append(url)
                        count += 1

            print(f"  ✓ {fname}: {len(data)} products, {count} new URLs")
        except Exception as e:
            print(f"  ✗ {fname}: {e}")

    return merged


def update_products_ts(new_galleries: dict[str, list[str]]) -> int:
    """Update products.ts with new gallery URLs, preserving existing ones."""
    content = PRODUCTS_TS.read_text(encoding="utf-8")
    lines = content.split("\n")

    updated_count = 0
    i = 0

    while i < len(lines):
        # Find product ID lines
        id_match = re.match(r'^(\s*)"id"\s*:\s*(\d+)', lines[i])
        if id_match:
            pid = id_match.group(2)

            if pid in new_galleries and new_galleries[pid]:
                # Find the gallery line for this product
                # Search forward within this product block
                j = i + 1
                gallery_start = None
                gallery_end = None

                while j < len(lines) and not re.match(r'^\s*\}\s*,?\s*$', lines[j]):
                    if '"gallery"' in lines[j]:
                        gallery_start = j
                        # Find the end of the gallery array
                        if "]" in lines[j]:
                            gallery_end = j
                        else:
                            k = j + 1
                            while k < len(lines) and "]" not in lines[k]:
                                k += 1
                            gallery_end = k
                        break
                    j += 1

                if gallery_start is not None and gallery_end is not None:
                    # Extract existing gallery URLs
                    gallery_text = "\n".join(lines[gallery_start:gallery_end + 1])
                    existing_urls = re.findall(r'"(https?://[^"]+)"', gallery_text)

                    # Merge: existing + new, deduped, max 5
                    all_urls = list(existing_urls)
                    for url in new_galleries[pid]:
                        if url not in all_urls:
                            all_urls.append(url)
                    all_urls = all_urls[:5]  # Cap at 5

                    if len(all_urls) > len(existing_urls):
                        # Build new gallery lines
                        indent = "    "
                        if len(all_urls) == 1:
                            new_gallery = f'{indent}"gallery": [\n'
                            new_gallery += f'{indent}  "{all_urls[0]}"\n'
                            new_gallery += f'{indent}]'
                        else:
                            new_gallery = f'{indent}"gallery": [\n'
                            for idx, url in enumerate(all_urls):
                                comma = "," if idx < len(all_urls) - 1 else ""
                                new_gallery += f'{indent}  "{url}"{comma}\n'
                            new_gallery += f'{indent}]'

                        # Replace the gallery lines
                        new_lines = new_gallery.split("\n")
                        lines[gallery_start:gallery_end + 1] = new_lines

                        updated_count += 1

                        # Adjust i to account for changed line count
                        diff = len(new_lines) - (gallery_end - gallery_start + 1)
                        i += diff

        i += 1

    # Write back
    new_content = "\n".join(lines)
    PRODUCTS_TS.write_text(new_content, encoding="utf-8")

    return updated_count


def main():
    print("=" * 60)
    print("GALLERY MERGE — VoltStock Catalog")
    print("=" * 60)

    print("\nLoading gallery files...")
    galleries = load_all_galleries()

    total_products = len(galleries)
    total_urls = sum(len(urls) for urls in galleries.values())
    print(f"\nTotal: {total_products} products with {total_urls} gallery URLs")

    # Show distribution
    from collections import Counter
    url_counts = Counter(len(urls) for urls in galleries.values())
    print("URL count distribution:")
    for count, num_products in sorted(url_counts.items()):
        print(f"  {count} URLs: {num_products} products")

    if total_products == 0:
        print("\n⚠ No gallery data found. Nothing to merge.")
        return

    print(f"\nUpdating products.ts...")
    updated = update_products_ts(galleries)
    print(f"\n✓ Updated {updated} products with new gallery URLs")

    # Save merge report
    report = {
        "total_products_with_new_urls": total_products,
        "total_new_urls": total_urls,
        "products_updated_in_ts": updated,
        "galleries": {k: v for k, v in galleries.items()},
    }
    report_path = SCRIPT_DIR / "gallery_merge_report.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Report saved to {report_path}")


if __name__ == "__main__":
    main()
