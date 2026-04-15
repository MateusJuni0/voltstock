#!/usr/bin/env python3
"""
Reprice all VoltStock products to ensure minimum profitability.
Uses line-by-line approach to avoid regex matching issues with nested objects.
"""

import re
import sys
from pathlib import Path
from collections import defaultdict

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PRODUCTS_TS = PROJECT_DIR / "web" / "src" / "data" / "products.ts"

EUR_USD = 1.08
PT_VAT = 0.23
MIN_MARGIN_EU = 0.08
MIN_MARGIN_ALI = 0.30

ALIEXPRESS_COSTS_USD = {
    220: 15.00, 221: 22.00, 222: 9.00, 223: 12.00, 224: 25.00,
    230: 10.00, 231: 12.00, 232: 6.00,
    240: 48.00, 241: 42.00, 242: 28.00, 243: 55.00,
    250: 22.00, 251: 15.00, 252: 10.00,
}

SHIPPING = {
    "Teclados e Ratos": 3.50, "Mouse Pads": 4.00, "Headsets e \u00c1udio": 4.00,
}

COST_RATIOS = {
    "Placas Gr\u00e1ficas": 0.88, "Processadores": 0.87, "Motherboards": 0.82,
    "Mem\u00f3ria RAM": 0.85, "Armazenamento": 0.83, "Fontes de Alimenta\u00e7\u00e3o": 0.78,
    "Caixas": 0.75, "Refrigera\u00e7\u00e3o": 0.78, "Monitores": 0.80,
    "Teclados e Ratos": 0.72, "Headsets e \u00c1udio": 0.70, "Cadeiras Gaming": 0.68,
    "Mouse Pads": 0.30,
}


def parse_price(s: str) -> float:
    c = s.replace("EUR", "").replace("\u20ac", "").strip().replace(".", "").replace(",", ".")
    try:
        return float(c)
    except ValueError:
        return 0.0


def format_price(val: float) -> str:
    """Format to Portuguese price ending in ,99 or ,00."""
    # Round to a nice value
    if val < 30:
        nice = int(val) + 0.99
    elif val < 100:
        # Round to nearest 5 ending in 9.99
        nice = round(val / 5) * 5 - 0.01
        if nice < val:
            nice += 5
    elif val < 500:
        nice = round(val / 10) * 10 - 0.01
        if nice < val:
            nice += 10
    else:
        nice = round(val / 50) * 50 - 0.01
        if nice < val:
            nice += 50

    if nice <= 0:
        nice = val

    whole = int(nice)
    cents = round((nice - whole) * 100)

    if whole >= 1000:
        thousands = whole // 1000
        remainder = whole % 1000
        return f"{thousands}.{remainder:03d},{cents:02d} \u20ac"
    return f"{whole},{cents:02d} \u20ac"


def calc_min_price(cost_eur: float, shipping: float, min_margin: float) -> float:
    """Calculate minimum sale price (incl. IVA) for target margin."""
    total_cost = cost_eur + shipping
    return total_cost * (1 + PT_VAT) / (1 - min_margin)


def main():
    lines = PRODUCTS_TS.read_text(encoding="utf-8").split("\n")

    # Phase 1: Parse products — find each product's line ranges and current data
    products = []
    current_product = None
    current_id = None
    brace_depth = 0
    in_products_array = False

    for i, line in enumerate(lines):
        stripped = line.strip()

        if "export const products" in line:
            in_products_array = True
            continue

        if not in_products_array:
            continue

        # Track product boundaries
        if re.match(r'\s*"id"\s*:\s*(\d+)', stripped):
            m = re.search(r'"id"\s*:\s*(\d+)', stripped)
            current_id = int(m.group(1))
            current_product = {
                "id": current_id,
                "start_line": i - 1,  # the { line before id
                "id_line": i,
                "price_line": None,
                "oldPrice_line": None,
                "category": None,
                "price": None,
                "oldPrice": None,
            }

        if current_product:
            if '"category"' in stripped:
                m = re.search(r'"category"\s*:\s*"([^"]+)"', stripped)
                if m:
                    current_product["category"] = m.group(1)

            if '"price"' in stripped and '"oldPrice"' not in stripped:
                m = re.search(r'"price"\s*:\s*"([^"]+)"', stripped)
                if m:
                    current_product["price_line"] = i
                    current_product["price"] = m.group(1)

            if '"oldPrice"' in stripped:
                m = re.search(r'"oldPrice"\s*:\s*"([^"]+)"', stripped)
                if m:
                    current_product["oldPrice_line"] = i
                    current_product["oldPrice"] = m.group(1)

            # Detect end of product (line that is just `},`)
            if stripped in ('},', '}') and current_product.get("price"):
                current_product["end_line"] = i
                products.append(current_product)
                current_product = None

    print(f"Parsed {len(products)} products\n")

    # Phase 2: Calculate new prices
    changes = []
    stats = defaultdict(lambda: {"count": 0, "repriced": 0, "kept": 0})

    for p in products:
        pid = p["id"]
        cat = p["category"]
        current_price = parse_price(p["price"])

        if pid in ALIEXPRESS_COSTS_USD:
            cost_eur = ALIEXPRESS_COSTS_USD[pid] / EUR_USD
            shipping = SHIPPING.get(cat, 5.00)
            min_price = calc_min_price(cost_eur, shipping, MIN_MARGIN_ALI)
            source = "AliExpress"
        else:
            ratio = COST_RATIOS.get(cat, 0.80)
            cost_eur = current_price * ratio
            shipping = 0
            min_price = calc_min_price(cost_eur, shipping, MIN_MARGIN_EU)
            source = "EU"

        stats[cat]["count"] += 1

        if min_price <= current_price * 1.005:  # within 0.5% tolerance
            stats[cat]["kept"] += 1
        else:
            increase_pct = (min_price - current_price) / current_price * 100
            new_price_str = format_price(min_price)
            new_price_val = parse_price(new_price_str)

            # Old price = ~18% above new price
            old_price_val = new_price_val * 1.18
            new_old_str = format_price(old_price_val)

            changes.append({
                "id": pid,
                "name": p.get("name", ""),
                "cat": cat,
                "old_price": current_price,
                "new_price": new_price_val,
                "new_price_str": new_price_str,
                "new_old_str": new_old_str,
                "price_line": p["price_line"],
                "oldPrice_line": p["oldPrice_line"],
                "increase": increase_pct,
                "source": source,
            })
            stats[cat]["repriced"] += 1

    # Phase 3: Apply changes to lines (from bottom to top to preserve line numbers)
    changes.sort(key=lambda c: c["price_line"] or 0, reverse=True)

    for c in changes:
        # Replace price line
        if c["price_line"] is not None:
            old_line = lines[c["price_line"]]
            new_line = re.sub(
                r'"price"\s*:\s*"[^"]+"',
                f'"price": "{c["new_price_str"]}"',
                old_line
            )
            lines[c["price_line"]] = new_line

        # Replace oldPrice line
        if c["oldPrice_line"] is not None:
            old_line = lines[c["oldPrice_line"]]
            new_line = re.sub(
                r'"oldPrice"\s*:\s*"[^"]+"',
                f'"oldPrice": "{c["new_old_str"]}"',
                old_line
            )
            lines[c["oldPrice_line"]] = new_line

    PRODUCTS_TS.write_text("\n".join(lines), encoding="utf-8")

    # Print summary
    total_repriced = sum(s["repriced"] for s in stats.values())
    total_kept = sum(s["kept"] for s in stats.values())

    print(f"{'='*60}")
    print(f"REPRICING SUMMARY")
    print(f"{'='*60}")
    print(f"\nProducts repriced: {total_repriced}")
    print(f"Products kept as-is: {total_kept}")
    print(f"Total: {len(products)}")

    print(f"\n{'Category':<30} {'Total':>5} {'Repriced':>8} {'Kept':>6}")
    print("-" * 55)
    for cat in sorted(stats):
        s = stats[cat]
        print(f"{cat:<30} {s['count']:>5} {s['repriced']:>8} {s['kept']:>6}")

    # Show changes sorted by increase %
    changes.sort(key=lambda c: c["increase"], reverse=True)
    print(f"\nTop 25 repriced products:")
    for c in changes[:25]:
        print(f"  ID {c['id']:>3} {c['old_price']:>8.0f}\u20ac -> {c['new_price']:>8.0f}\u20ac (+{c['increase']:.0f}%) {c['source']}")


if __name__ == "__main__":
    main()
