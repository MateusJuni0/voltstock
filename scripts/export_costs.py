#!/usr/bin/env python3
"""Export fixed product costs to JSON (based on original market prices before repricing)."""

import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PRODUCTS_TS = PROJECT_DIR / "web" / "src" / "data" / "products.ts"
COSTS_JSON = SCRIPT_DIR / "product_costs.json"

EUR_USD = 1.08

# Known AliExpress costs (USD)
ALIEXPRESS_COSTS_USD = {
    220: 15.00, 221: 22.00, 222: 9.00, 223: 12.00, 224: 25.00,
    230: 10.00, 231: 12.00, 232: 6.00,
    240: 48.00, 241: 42.00, 242: 28.00, 243: 55.00,
    250: 22.00, 251: 15.00, 252: 10.00,
}

SHIPPING = {
    "Teclados e Ratos": 3.50, "Mouse Pads": 4.00, "Headsets e Áudio": 4.00,
}

# Original market reference prices (BEFORE repricing) — used to anchor costs
# These are the prices from the original products.ts at commit 09cb795
# For AliExpress products, we use the known USD costs directly
ORIGINAL_PRICES = {}  # Will be populated from git

# Cost ratios for EU distributor products
COST_RATIOS = {
    "Placas Gráficas": 0.88, "Processadores": 0.87, "Motherboards": 0.82,
    "Memória RAM": 0.85, "Armazenamento": 0.83, "Fontes de Alimentação": 0.78,
    "Caixas": 0.75, "Refrigeração": 0.78, "Monitores": 0.80,
    "Teclados e Ratos": 0.72, "Headsets e Áudio": 0.70, "Cadeiras Gaming": 0.68,
    "Mouse Pads": 0.30,
}


def parse_price(s: str) -> float:
    c = s.replace("EUR", "").replace("€", "").strip().replace(".", "").replace(",", ".")
    try:
        return float(c)
    except ValueError:
        return 0.0


def main():
    content = PRODUCTS_TS.read_text(encoding="utf-8")
    costs = {}

    block_starts = [m.start() for m in re.finditer(r'\{\s*\n?\s*"id"\s*:', content)]

    for i, start in enumerate(block_starts):
        end = block_starts[i + 1] if i + 1 < len(block_starts) else len(content)
        block = content[start:end]

        pid_m = re.search(r'"id"\s*:\s*(\d+)', block)
        cat_m = re.search(r'"category"\s*:\s*"([^"]+)"', block)
        price_m = re.search(r'"price"\s*:\s*"([^"]+)"', block)

        if not (pid_m and cat_m and price_m):
            continue

        pid = int(pid_m.group(1))
        cat = cat_m.group(1)
        price = parse_price(price_m.group(1))

        if pid in ALIEXPRESS_COSTS_USD:
            cost_eur = ALIEXPRESS_COSTS_USD[pid] / EUR_USD
            shipping = SHIPPING.get(cat, 5.00)
            costs[str(pid)] = {
                "cost_eur": round(cost_eur, 2),
                "shipping": round(shipping, 2),
                "source": "AliExpress",
            }
        else:
            ratio = COST_RATIOS.get(cat, 0.80)
            # Use CURRENT price for cost anchoring (this is the original market price)
            cost_eur = price * ratio
            costs[str(pid)] = {
                "cost_eur": round(cost_eur, 2),
                "shipping": 0,
                "source": "Distribuidor EU",
                "ratio": ratio,
            }

    COSTS_JSON.write_text(json.dumps(costs, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Exported costs for {len(costs)} products to {COSTS_JSON}")


if __name__ == "__main__":
    main()
