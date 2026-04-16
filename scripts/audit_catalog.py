#!/usr/bin/env python3
"""
Full audit of VoltStock product catalog:
1. Main image: exists, not placeholder, reasonable size
2. Gallery: has 3+ images, URLs accessible, not duplicates
3. Features/specs: has at least 3 features
4. Description: exists and has reasonable length
5. Image quality: check if rembg over-cropped (tiny transparent image)
"""

import json
import os
import re
import sys
from pathlib import Path
from collections import defaultdict

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PRODUCTS_TS = PROJECT_DIR / "web" / "src" / "data" / "products.ts"
PRODUCTS_DIR = PROJECT_DIR / "web" / "public" / "products"


def extract_products(ts_path: Path) -> list[dict]:
    content = ts_path.read_text(encoding="utf-8")
    products = []
    block_starts = [m.start() for m in re.finditer(r'\{\s*\n?\s*"id"\s*:', content)]

    for i, start in enumerate(block_starts):
        end = block_starts[i + 1] if i + 1 < len(block_starts) else len(content)
        block = content[start:end]

        pid_m = re.search(r'"id"\s*:\s*(\d+)', block)
        name_m = re.search(r'"name"\s*:\s*"([^"]+)"', block)
        cat_m = re.search(r'"category"\s*:\s*"([^"]+)"', block)
        desc_m = re.search(r'"description"\s*:\s*"([^"]+)"', block)

        # Count features
        features = re.findall(r'\{\s*"name"\s*:\s*"[^"]+"\s*,\s*"value"\s*:\s*"[^"]+"\s*\}', block)

        # Extract gallery URLs
        gallery_m = re.search(r'"gallery"\s*:\s*\[(.*?)\]', block, re.DOTALL)
        gallery_urls = []
        if gallery_m:
            gallery_urls = re.findall(r'"(https?://[^"]+)"', gallery_m.group(1))

        if pid_m and name_m and cat_m:
            products.append({
                "id": int(pid_m.group(1)),
                "name": name_m.group(1),
                "category": cat_m.group(1),
                "description": desc_m.group(1) if desc_m else "",
                "features_count": len(features),
                "gallery": gallery_urls,
                "gallery_count": len(gallery_urls),
            })

    return products


def check_image(pid: int) -> dict:
    """Check main product image quality."""
    path = PRODUCTS_DIR / f"{pid}.png"
    result = {"exists": False, "size_kb": 0, "issue": None}

    if not path.exists():
        result["issue"] = "MISSING"
        return result

    result["exists"] = True
    size = path.stat().st_size
    result["size_kb"] = size // 1024

    if size < 2000:
        result["issue"] = "PLACEHOLDER (<2KB)"
    elif size < 10000:
        result["issue"] = "VERY_SMALL (<10KB) - may be over-cropped"

    # Check actual image content
    try:
        from PIL import Image
        img = Image.open(path)
        if img.mode == "RGBA":
            # Check how much of the image is actually visible (non-transparent)
            pixels = list(img.getdata())
            visible = sum(1 for p in pixels if p[3] > 20)
            total = len(pixels)
            visible_pct = visible / total * 100

            if visible_pct < 5:
                result["issue"] = f"OVER-CROPPED (only {visible_pct:.1f}% visible)"
            elif visible_pct < 15:
                result["issue"] = f"POSSIBLY_OVER-CROPPED ({visible_pct:.1f}% visible)"

            result["visible_pct"] = round(visible_pct, 1)
        elif img.mode == "RGB":
            result["issue"] = "NO_TRANSPARENCY (RGB, not RGBA)"
    except Exception as e:
        result["issue"] = f"ERROR: {e}"

    return result


def main():
    products = extract_products(PRODUCTS_TS)
    print(f"Auditing {len(products)} products...\n")

    issues = defaultdict(list)  # category -> list of issues
    all_issues = []

    for p in products:
        pid = p["id"]
        product_issues = []

        # 1. Check main image
        img_check = check_image(pid)
        if img_check["issue"]:
            product_issues.append(f"IMG: {img_check['issue']}")

        # 2. Check gallery
        if p["gallery_count"] == 0:
            product_issues.append("GALLERY: No gallery images")
        elif p["gallery_count"] < 3:
            product_issues.append(f"GALLERY: Only {p['gallery_count']} image(s), need 3+")

        # Check for duplicate gallery URLs
        if len(set(p["gallery"])) < len(p["gallery"]):
            product_issues.append("GALLERY: Has duplicate URLs")

        # 3. Check features
        if p["features_count"] == 0:
            product_issues.append("FEATURES: No specs at all")
        elif p["features_count"] < 3:
            product_issues.append(f"FEATURES: Only {p['features_count']} specs, need 3+")

        # 4. Check description
        if not p["description"]:
            product_issues.append("DESC: No description")
        elif len(p["description"]) < 50:
            product_issues.append(f"DESC: Too short ({len(p['description'])} chars)")

        if product_issues:
            all_issues.append({
                "id": pid,
                "name": p["name"],
                "category": p["category"],
                "issues": product_issues,
                "img_size_kb": img_check.get("size_kb", 0),
                "visible_pct": img_check.get("visible_pct", None),
                "gallery_count": p["gallery_count"],
                "features_count": p["features_count"],
            })
            for issue in product_issues:
                issues[p["category"]].append(f"ID {pid}: {issue}")

    # Print report
    print(f"{'='*70}")
    print(f"AUDIT REPORT — VoltStock Catalog")
    print(f"{'='*70}")
    print(f"\nTotal products: {len(products)}")
    print(f"Products with issues: {len(all_issues)}")
    print(f"Products clean: {len(products) - len(all_issues)}")

    # Summary by issue type
    img_issues = [i for i in all_issues if any("IMG:" in x for x in i["issues"])]
    gallery_issues = [i for i in all_issues if any("GALLERY:" in x for x in i["issues"])]
    feature_issues = [i for i in all_issues if any("FEATURES:" in x for x in i["issues"])]
    desc_issues = [i for i in all_issues if any("DESC:" in x for x in i["issues"])]

    print(f"\nIssue summary:")
    print(f"  Image problems: {len(img_issues)}")
    print(f"  Gallery < 3 photos: {len(gallery_issues)}")
    print(f"  Features < 3: {len(feature_issues)}")
    print(f"  Description missing/short: {len(desc_issues)}")

    # Detailed issues by category
    print(f"\n{'='*70}")
    print(f"IMAGE ISSUES (need attention)")
    print(f"{'='*70}")
    for item in img_issues:
        img_issue = [x for x in item["issues"] if "IMG:" in x][0]
        print(f"  ID {item['id']:>3} | {item['name'][:45]:<45} | {img_issue}")

    print(f"\n{'='*70}")
    print(f"GALLERY ISSUES (need more photos)")
    print(f"{'='*70}")
    for item in gallery_issues:
        gal_issue = [x for x in item["issues"] if "GALLERY:" in x][0]
        print(f"  ID {item['id']:>3} | {item['name'][:45]:<45} | {gal_issue}")

    print(f"\n{'='*70}")
    print(f"FEATURE ISSUES (need more specs)")
    print(f"{'='*70}")
    for item in feature_issues:
        feat_issue = [x for x in item["issues"] if "FEATURES:" in x][0]
        print(f"  ID {item['id']:>3} | {item['name'][:45]:<45} | {feat_issue}")

    # Save full report as JSON
    report_path = SCRIPT_DIR / "audit_report.json"
    report_data = {
        "total": len(products),
        "with_issues": len(all_issues),
        "clean": len(products) - len(all_issues),
        "summary": {
            "image_problems": len(img_issues),
            "gallery_under_3": len(gallery_issues),
            "features_under_3": len(feature_issues),
            "desc_issues": len(desc_issues),
        },
        "issues": all_issues,
    }
    report_path.write_text(json.dumps(report_data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nFull report saved to {report_path}")


if __name__ == "__main__":
    main()
