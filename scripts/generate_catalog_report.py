#!/usr/bin/env python3
"""
Generate a detailed product catalog with financial simulation for VoltStock.
Outputs a formatted Markdown file with costs, margins, shipping, and profit analysis.
"""

import json
import re
import sys
from pathlib import Path
from collections import defaultdict

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PRODUCTS_TS = PROJECT_DIR / "web" / "src" / "data" / "products.ts"
OUTPUT_MD = PROJECT_DIR / "CATALOGO_FINANCEIRO.md"

# ── Exchange rate and costs ──
EUR_USD = 1.08  # 1 EUR = 1.08 USD (April 2026)
PT_VAT = 0.23   # 23% IVA Portugal
CUSTOMS_THRESHOLD = 150  # EUR — above this, customs duties apply

# ── Shipping estimates (AliExpress → Portugal) ──
SHIPPING_COSTS = {
    "Teclados e Ratos": {"small": 3.50, "medium": 5.00},
    "Mouse Pads": {"small": 4.00, "medium": 6.00},
    "Headsets e Audio": {"small": 4.00, "medium": 6.00},
    "Cadeiras Gaming": {"small": 25.00, "medium": 40.00},
    "Monitores": {"small": 15.00, "medium": 25.00},
    # Components — not typically sourced from AliExpress
    "Placas Graficas": {"small": 0, "medium": 0},
    "Processadores": {"small": 0, "medium": 0},
    "Motherboards": {"small": 0, "medium": 0},
    "Memoria RAM": {"small": 0, "medium": 0},
    "Armazenamento": {"small": 0, "medium": 0},
    "Fontes de Alimentacao": {"small": 0, "medium": 0},
    "Caixas": {"small": 0, "medium": 0},
    "Refrigeracao": {"small": 0, "medium": 0},
}

# ── Estimated AliExpress costs (USD) by product type ──
# Based on real research from the AliExpress research document
ALIEXPRESS_COSTS_USD = {
    # Budget peripherals — REAL costs from research
    220: 15.00,   # Redragon M688 Shark
    221: 22.00,   # Attack Shark R1 Pro
    222: 9.00,    # HAVIT MS1006
    223: 12.00,   # Redragon Cobra M711
    224: 25.00,   # Attack Shark X3
    230: 10.00,   # BladeHawks RGB Pad XL
    231: 12.00,   # Redragon P027
    232: 6.00,    # OEM XXL Mouse Pad
    240: 48.00,   # Aula F75
    241: 42.00,   # Royal Kludge RK84
    242: 28.00,   # Redragon K630
    243: 55.00,   # VGN Neon 75 HE
    250: 22.00,   # Redragon H510 Zeus
    251: 15.00,   # HAVIT H2002d
    252: 10.00,   # Onikuma K5 Pro
}

# For existing products (components), estimate cost as % of sale price
# GPUs/CPUs from distributors: ~85-90% of sale price (low margin)
# Peripherals (premium brands): ~70-80% of sale price
COMPONENT_COST_RATIO = {
    "Placas Graficas": 0.88,
    "Processadores": 0.87,
    "Motherboards": 0.82,
    "Memoria RAM": 0.85,
    "Armazenamento": 0.83,
    "Fontes de Alimentacao": 0.78,
    "Caixas": 0.75,
    "Refrigeracao": 0.78,
    "Monitores": 0.80,
    "Teclados e Ratos": 0.72,
    "Headsets e Audio": 0.70,
    "Cadeiras Gaming": 0.68,
    "Mouse Pads": 0.30,  # AliExpress budget — very high margin
}


def parse_price(price_str: str) -> float:
    """Parse '2.199,00 EUR' to float."""
    clean = price_str.replace("EUR", "").replace("€", "").strip()
    clean = clean.replace(".", "").replace(",", ".")
    try:
        return float(clean)
    except ValueError:
        return 0.0


def normalize_category(cat: str) -> str:
    """Remove accents for dict lookup."""
    replacements = {
        "Placas Gráficas": "Placas Graficas",
        "Memória RAM": "Memoria RAM",
        "Fontes de Alimentação": "Fontes de Alimentacao",
        "Refrigeração": "Refrigeracao",
        "Headsets e Áudio": "Headsets e Audio",
    }
    return replacements.get(cat, cat)


def extract_products(ts_path: Path) -> list[dict]:
    """Extract all products from products.ts by splitting into blocks first."""
    content = ts_path.read_text(encoding="utf-8")
    products = []

    # Split content into individual product blocks by finding { "id": N patterns
    # Each block runs from one "id" to the next
    block_starts = [m.start() for m in re.finditer(r'\{\s*\n?\s*"id"\s*:', content)]

    for i, start in enumerate(block_starts):
        end = block_starts[i + 1] if i + 1 < len(block_starts) else len(content)
        block = content[start:end]

        pid_m = re.search(r'"id"\s*:\s*(\d+)', block)
        name_m = re.search(r'"name"\s*:\s*"([^"]+)"', block)
        cat_m = re.search(r'"category"\s*:\s*"([^"]+)"', block)
        price_m = re.search(r'"price"\s*:\s*"([^"]+)"', block)
        old_m = re.search(r'"oldPrice"\s*:\s*"([^"]+)"', block)
        brand_m = re.search(r'"brand"\s*:\s*"([^"]+)"', block)

        if pid_m and name_m and cat_m and price_m:
            products.append({
                "id": int(pid_m.group(1)),
                "name": name_m.group(1),
                "category": cat_m.group(1),
                "price": price_m.group(1),
                "oldPrice": old_m.group(1) if old_m else "",
                "brand": brand_m.group(1) if brand_m else "N/A",
            })

    return products


def load_fixed_costs() -> dict:
    """Load fixed product costs from JSON (anchored to original market prices)."""
    costs_file = SCRIPT_DIR / "product_costs.json"
    if costs_file.exists():
        import json
        data = json.loads(costs_file.read_text(encoding="utf-8"))
        return {int(k): v for k, v in data.items()}
    return {}


FIXED_COSTS = load_fixed_costs()


def calculate_financials(product: dict) -> dict:
    """Calculate cost, margin, shipping, profit for a product."""
    pid = product["id"]
    cat = normalize_category(product["category"])
    sale_price = parse_price(product["price"])
    old_price = parse_price(product["oldPrice"]) if product["oldPrice"] else None

    # Determine cost — use FIXED costs if available (anchored to original market prices)
    if pid in FIXED_COSTS:
        fc = FIXED_COSTS[pid]
        cost_eur = fc["cost_eur"]
        shipping = fc["shipping"]
        source = fc["source"]
    elif pid in ALIEXPRESS_COSTS_USD:
        cost_usd = ALIEXPRESS_COSTS_USD[pid]
        cost_eur = cost_usd / EUR_USD
        source = "AliExpress"
        shipping_data = SHIPPING_COSTS.get(cat, {"small": 5.00})
        shipping = shipping_data.get("small", 5.00)
    else:
        ratio = COMPONENT_COST_RATIO.get(cat, 0.80)
        cost_eur = sale_price * ratio
        source = "Distribuidor EU"
        shipping = 0

    # IVA (already included in sale price in Portugal)
    sale_without_vat = sale_price / (1 + PT_VAT)

    # Total cost
    total_cost = cost_eur + shipping

    # Profit
    gross_profit = sale_without_vat - total_cost
    margin_pct = (gross_profit / sale_without_vat * 100) if sale_without_vat > 0 else 0

    # Discount from oldPrice
    discount = 0
    if old_price and old_price > sale_price:
        discount = round((1 - sale_price / old_price) * 100)

    return {
        **product,
        "sale_price": sale_price,
        "cost_eur": round(cost_eur, 2),
        "shipping": round(shipping, 2),
        "total_cost": round(total_cost, 2),
        "sale_without_vat": round(sale_without_vat, 2),
        "gross_profit": round(gross_profit, 2),
        "margin_pct": round(margin_pct, 1),
        "discount": discount,
        "source": source,
    }


def generate_report(products_data: list[dict]) -> str:
    """Generate the formatted Markdown report."""
    lines = []
    lines.append("# VoltStock — Catálogo Financeiro Completo")
    lines.append(f"**Data:** Abril 2026 | **Total Produtos:** {len(products_data)}")
    lines.append(f"**Taxa EUR/USD:** {EUR_USD} | **IVA PT:** {int(PT_VAT*100)}%")
    lines.append("")
    lines.append("---")
    lines.append("")

    # ── Summary by category ──
    lines.append("## Resumo por Categoria")
    lines.append("")
    lines.append("| Categoria | Qtd | Preço Médio | Margem Média | Lucro Total Estimado/mês* |")
    lines.append("|-----------|-----|-------------|--------------|--------------------------|")

    by_cat = defaultdict(list)
    for p in products_data:
        by_cat[p["category"]].append(p)

    total_monthly = 0
    for cat in sorted(by_cat.keys()):
        prods = by_cat[cat]
        avg_price = sum(p["sale_price"] for p in prods) / len(prods)
        avg_margin = sum(p["margin_pct"] for p in prods) / len(prods)
        # Estimate monthly sales: budget items sell more
        est_monthly_units = 3 if avg_price > 200 else (8 if avg_price > 50 else 15)
        monthly_profit = sum(p["gross_profit"] * est_monthly_units / len(prods) for p in prods)
        total_monthly += monthly_profit
        lines.append(f"| {cat} | {len(prods)} | {avg_price:.0f} € | {avg_margin:.1f}% | {monthly_profit:.0f} € |")

    lines.append(f"| **TOTAL** | **{len(products_data)}** | | | **{total_monthly:.0f} €** |")
    lines.append("")
    lines.append("*\\*Estimativa conservadora baseada em 3-15 vendas/mês por categoria*")
    lines.append("")
    lines.append("---")
    lines.append("")

    # ── TOP 20 Most Profitable Products ──
    lines.append("## Top 20 Produtos Mais Lucrativos (por margem %)")
    lines.append("")
    lines.append("| # | ID | Produto | Preço Venda | Custo | Frete | Lucro | Margem | Fonte |")
    lines.append("|---|----|---------|-----------:|------:|------:|------:|-------:|-------|")

    top_margin = sorted(products_data, key=lambda x: x["margin_pct"], reverse=True)[:20]
    for i, p in enumerate(top_margin, 1):
        lines.append(
            f"| {i} | {p['id']} | {p['name'][:45]} | {p['sale_price']:.0f} € | "
            f"{p['cost_eur']:.0f} € | {p['shipping']:.0f} € | "
            f"**{p['gross_profit']:.0f} €** | **{p['margin_pct']:.0f}%** | {p['source']} |"
        )

    lines.append("")
    lines.append("---")
    lines.append("")

    # ── Detailed by category ──
    lines.append("## Catálogo Detalhado por Categoria")
    lines.append("")

    for cat in sorted(by_cat.keys()):
        prods = sorted(by_cat[cat], key=lambda x: x["margin_pct"], reverse=True)
        lines.append(f"### {cat} ({len(prods)} produtos)")
        lines.append("")
        lines.append("| ID | Produto | Marca | Preço | Desconto | Custo | Frete | Lucro Bruto | Margem | Fonte |")
        lines.append("|----|---------|-------|------:|---------:|------:|------:|------------:|-------:|-------|")

        for p in prods:
            disc = f"{p['discount']}%" if p['discount'] else "-"
            lines.append(
                f"| {p['id']} | {p['name'][:40]} | {p['brand']} | "
                f"{p['sale_price']:.0f} € | {disc} | {p['cost_eur']:.0f} € | "
                f"{p['shipping']:.0f} € | {p['gross_profit']:.0f} € | "
                f"{p['margin_pct']:.0f}% | {p['source']} |"
            )

        lines.append("")

    # ── Shipping simulation ──
    lines.append("---")
    lines.append("")
    lines.append("## Simulação de Custos de Envio")
    lines.append("")
    lines.append("### AliExpress → Portugal")
    lines.append("| Tipo Produto | Peso Estimado | Custo Envio | Tempo | Armazém EU? |")
    lines.append("|-------------|---------------|-------------|-------|-------------|")
    lines.append("| Rato gaming | 100-200g | 3-5 € | 7-15 dias | Alguns |")
    lines.append("| Mouse pad XL | 300-500g | 4-6 € | 10-20 dias | Raro |")
    lines.append("| Teclado mecânico | 700-1200g | 5-8 € | 10-20 dias | Alguns |")
    lines.append("| Headset gaming | 300-500g | 4-6 € | 7-15 dias | Alguns |")
    lines.append("| Monitor 32\" | 8-12kg | 15-25 € | 15-30 dias | Não |")
    lines.append("| Cadeira gaming | 15-25kg | 25-40 € | 20-40 dias | Não |")
    lines.append("")
    lines.append("### VoltStock → Cliente (Envio Nacional PT)")
    lines.append("| Método | Custo | Tempo | Nota |")
    lines.append("|--------|-------|-------|------|")
    lines.append("| CTT Expresso | 4,99 € (cliente paga) | 1-2 dias úteis | Grátis acima de 50€ |")
    lines.append("| DPD/GLS | 3,99-5,99 € | 1-3 dias úteis | Mais barato para pesados |")
    lines.append("| Ponto de recolha | 2,99 € | 2-3 dias úteis | Mais económico |")
    lines.append("")

    # ── Import duties ──
    lines.append("### Impostos e Alfândega")
    lines.append("| Cenário | IVA | Direitos Aduaneiros | Nota |")
    lines.append("|---------|-----|--------------------|----- |")
    lines.append("| Encomenda < 150€ | 23% IVA (IOSS) | 0% | AliExpress cobra IVA na compra |")
    lines.append("| Encomenda > 150€ | 23% IVA | 2.5-6.5% | Alfândega retém, paga na entrega |")
    lines.append("| Armazém EU (Espanha/FR) | 0% extra | 0% | Já inclui IVA |")
    lines.append("")
    lines.append("**NOTA:** Desde Julho 2021, AliExpress cobra IVA automaticamente via IOSS para encomendas < 150€. Para encomendas > 150€, há risco de retenção na alfândega.")
    lines.append("")

    # ── Recommendations ──
    lines.append("---")
    lines.append("")
    lines.append("## Recomendações de Negócio")
    lines.append("")
    lines.append("### Produtos a Manter (alta margem, boa rotação)")
    high_margin = [p for p in products_data if p["margin_pct"] > 40]
    for p in sorted(high_margin, key=lambda x: x["margin_pct"], reverse=True)[:10]:
        lines.append(f"- **ID {p['id']}** {p['name'][:50]} — Margem {p['margin_pct']:.0f}%, Lucro {p['gross_profit']:.0f}€/unidade")

    lines.append("")
    lines.append("### Produtos a Considerar Remover (margem < 10%)")
    low_margin = [p for p in products_data if p["margin_pct"] < 10]
    for p in sorted(low_margin, key=lambda x: x["margin_pct"])[:10]:
        lines.append(f"- **ID {p['id']}** {p['name'][:50]} — Margem {p['margin_pct']:.0f}%, Lucro {p['gross_profit']:.0f}€/unidade")

    lines.append("")
    lines.append("### Estratégia de Descontos Recomendada")
    lines.append("| Tipo | Desconto | Quando | Porquê |")
    lines.append("|------|---------|--------|--------|")
    lines.append("| Bundle (rato + pad) | 10% | Sempre | Aumenta ticket médio |")
    lines.append("| Primeira compra | 5% | Código WELCOME5 | Conversão de novos clientes |")
    lines.append("| Flash Sale semanal | 15-20% | Sexta-feira | Urgência + rotação de stock |")
    lines.append("| Loyalty (>2 compras) | 8% | Automático | Retenção de clientes |")
    lines.append("| Clearance | 30-50% | Stock antigo | Libertar capital |")
    lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("*Documento gerado automaticamente por CLAUDE — CEO de Engenharia CMTecnologia*")
    lines.append(f"*Baseado em pesquisa AliExpress, dados de mercado PT, e análise de 202 produtos.*")

    return "\n".join(lines)


def main():
    print("Extracting products...")
    products = extract_products(PRODUCTS_TS)
    print(f"Found {len(products)} products")

    print("Calculating financials...")
    financials = [calculate_financials(p) for p in products]

    print("Generating report...")
    report = generate_report(financials)

    OUTPUT_MD.write_text(report, encoding="utf-8")
    print(f"\nReport saved to {OUTPUT_MD}")
    print(f"Total products: {len(financials)}")

    # Quick stats
    avg_margin = sum(p["margin_pct"] for p in financials) / len(financials)
    top = max(financials, key=lambda x: x["margin_pct"])
    bottom = min(financials, key=lambda x: x["margin_pct"])
    print(f"Average margin: {avg_margin:.1f}%")
    print(f"Best margin: ID {top['id']} {top['name'][:30]} at {top['margin_pct']:.0f}%")
    print(f"Worst margin: ID {bottom['id']} {bottom['name'][:30]} at {bottom['margin_pct']:.0f}%")


if __name__ == "__main__":
    main()
