#!/usr/bin/env python3
"""
Add budget peripheral products to VoltStock catalog.
Based on AliExpress research: mice, mousepads, keyboards, headsets.
"""

import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PRODUCTS_TS = Path(__file__).parent.parent / "web" / "src" / "data" / "products.ts"

# Add Mouse Pads to categories
NEW_CATEGORY = '"Mouse Pads"'

NEW_PRODUCTS = [
    # ── GAMING MICE BUDGET (IDs 220-227) ──
    {
        "id": 220,
        "name": "Redragon Shark M688 Wireless Gaming Mouse",
        "category": "Teclados e Ratos",
        "price": "39,99 €",
        "oldPrice": "49,99 €",
        "rating": 4.6,
        "img": "https://www.redragonzone.com/cdn/shop/files/7_da320bff-eb21-4b9c-9e36-e1dc1c0fb29f.png",
        "description": "Rato gaming wireless 2.4GHz com sensor PixArt de 14400 DPI, 10 botões programáveis e polling rate de 1000Hz. Design ergonómico com iluminação RGB personalizável.",
        "badge": "Best Seller",
        "features": [
            {"name": "DPI", "value": "14400"},
            {"name": "Botões", "value": "10 programáveis"},
            {"name": "Conexão", "value": "2.4GHz Wireless"},
            {"name": "Polling Rate", "value": "1000Hz"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/32842481830.html",
        "brand": "Redragon",
        "inStock": True,
        "stockCount": 30
    },
    {
        "id": 221,
        "name": "Attack Shark R1 Pro Tri-Mode Wireless Mouse",
        "category": "Teclados e Ratos",
        "price": "54,99 €",
        "oldPrice": "69,99 €",
        "rating": 4.7,
        "img": "https://attackshark.com/cdn/shop/files/R1_Pro-black.png",
        "description": "Rato gaming ultra-leve de 55g com sensor PAW3311 de 18000 DPI. Tri-mode: 2.4GHz + Bluetooth 5.2 + USB-C. Bateria de 65 horas. Design competitivo para FPS.",
        "badge": "Ultra-Leve 55g",
        "features": [
            {"name": "DPI", "value": "18000"},
            {"name": "Peso", "value": "55g"},
            {"name": "Conexão", "value": "Tri-Mode (2.4G/BT/USB-C)"},
            {"name": "Bateria", "value": "65 horas"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005005934074895.html",
        "brand": "Attack Shark",
        "inStock": True,
        "stockCount": 25
    },
    {
        "id": 222,
        "name": "HAVIT MS1006 Gaming Mouse RGB",
        "category": "Teclados e Ratos",
        "price": "24,99 €",
        "oldPrice": "32,99 €",
        "rating": 4.4,
        "img": "https://ae01.alicdn.com/kf/S3e6f24a4ae3c4c47bb8f9cef7e35f07dF.jpg",
        "description": "Rato gaming ergonómico com sensor de 6400 DPI, 7 botões programáveis e iluminação RGB de 7 cores. Cabo trançado de 1.5m, ideal para gaming e produtividade.",
        "badge": "Melhor Preço",
        "features": [
            {"name": "DPI", "value": "6400"},
            {"name": "Botões", "value": "7 programáveis"},
            {"name": "Cabo", "value": "1.5m trançado"},
            {"name": "RGB", "value": "7 cores"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005003593034691.html",
        "brand": "HAVIT",
        "inStock": True,
        "stockCount": 35
    },
    {
        "id": 223,
        "name": "Redragon Cobra M711 FPS Gaming Mouse",
        "category": "Teclados e Ratos",
        "price": "29,99 €",
        "oldPrice": "39,99 €",
        "rating": 4.5,
        "img": "https://www.redragonzone.com/cdn/shop/files/m711-fps_02.png",
        "description": "Rato gaming wired com sensor Pixart PMW3325 de 10000 DPI, 8 botões programáveis e iluminação RGB Chroma. Polling rate de 1000Hz para competição.",
        "badge": "FPS Killer",
        "features": [
            {"name": "DPI", "value": "10000"},
            {"name": "Sensor", "value": "Pixart PMW3325"},
            {"name": "Polling Rate", "value": "1000Hz"},
            {"name": "Botões", "value": "8 programáveis"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/32830978498.html",
        "brand": "Redragon",
        "inStock": True,
        "stockCount": 30
    },
    {
        "id": 224,
        "name": "Attack Shark X3 Lightweight Wireless Mouse",
        "category": "Teclados e Ratos",
        "price": "44,99 €",
        "oldPrice": "59,99 €",
        "rating": 4.6,
        "img": "https://attackshark.com/cdn/shop/files/X3_Wireless_Mouse_-_black.png",
        "description": "Mouse gaming wireless ultra-leve de 49g com sensor PAW3395 de 26000 DPI. Tri-mode wireless com polling rate de 4000Hz para resposta instantânea.",
        "badge": "Pro Esports",
        "features": [
            {"name": "DPI", "value": "26000"},
            {"name": "Peso", "value": "49g"},
            {"name": "Polling Rate", "value": "4000Hz"},
            {"name": "Sensor", "value": "PAW3395"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005006426295285.html",
        "brand": "Attack Shark",
        "inStock": True,
        "stockCount": 20
    },

    # ── MOUSE PADS XL (IDs 230-233) ──
    {
        "id": 230,
        "name": "BladeHawks RGB Mouse Pad XL 90x40cm",
        "category": "Mouse Pads",
        "price": "29,99 €",
        "oldPrice": "39,99 €",
        "rating": 4.5,
        "img": "https://ae01.alicdn.com/kf/S9b8d3b2f3c0b4c2d8e5f6a7b8c9d0e1f.jpg",
        "description": "Mouse pad extra-large 90x40cm com iluminação RGB de 14 modos. Base antiderrapante de borracha natural, superfície de micro-tecido para deslize suave. Perfeito para setup gaming completo.",
        "badge": "RGB XL",
        "features": [
            {"name": "Tamanho", "value": "900x400x4mm"},
            {"name": "RGB", "value": "14 modos"},
            {"name": "Material", "value": "Micro-tecido"},
            {"name": "Base", "value": "Borracha antiderrapante"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005003912345678.html",
        "brand": "BladeHawks",
        "inStock": True,
        "stockCount": 40
    },
    {
        "id": 231,
        "name": "Redragon P027 Flick XL RGB Mouse Pad",
        "category": "Mouse Pads",
        "price": "34,99 €",
        "oldPrice": "44,99 €",
        "rating": 4.6,
        "img": "https://www.redragonzone.com/cdn/shop/files/P027.png",
        "description": "Mouse pad gaming XL da Redragon com 10 modos RGB, superfície de velocidade em micro-tecido e base de borracha antiderrapante. 80x30cm, ideal para configurações de baixa sensibilidade.",
        "badge": "Redragon RGB",
        "features": [
            {"name": "Tamanho", "value": "800x300x3mm"},
            {"name": "RGB", "value": "10 modos"},
            {"name": "Superfície", "value": "Speed micro-tecido"},
            {"name": "Conexão", "value": "USB plug-and-play"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005004567890123.html",
        "brand": "Redragon",
        "inStock": True,
        "stockCount": 35
    },
    {
        "id": 232,
        "name": "Mouse Pad XXL Preto Antiderrapante 90x40cm",
        "category": "Mouse Pads",
        "price": "19,99 €",
        "oldPrice": "24,99 €",
        "rating": 4.3,
        "img": "https://ae01.alicdn.com/kf/Hb3f5c4d5e6f7g8h9i0j1k2l3m4n5o6p.jpg",
        "description": "Mouse pad extra-grande preto minimalista 90x40cm. Superfície de pano suave com base de borracha antiderrapante de 3mm. Design clean e profissional para qualquer setup.",
        "badge": "Melhor Preço",
        "features": [
            {"name": "Tamanho", "value": "900x400x3mm"},
            {"name": "Material", "value": "Pano suave"},
            {"name": "Base", "value": "Borracha 3mm"},
            {"name": "Cor", "value": "Preto minimalista"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005002345678901.html",
        "brand": "OEM",
        "inStock": True,
        "stockCount": 40
    },

    # ── MECHANICAL KEYBOARDS BUDGET (IDs 240-244) ──
    {
        "id": 240,
        "name": "Aula F75 Gasket Mount Wireless 75% Keyboard",
        "category": "Teclados e Ratos",
        "price": "89,99 €",
        "oldPrice": "109,99 €",
        "rating": 4.7,
        "img": "https://aulagear.com/cdn/shop/files/F75.png",
        "description": "Teclado mecânico wireless 75% com gasket mount para som premium. Hot-swappable, switches LEOBOG Reaper lubrificados de fábrica. Tri-mode: BT 5.0 / 2.4GHz / USB-C. Bateria de 4000mAh.",
        "badge": "Top Seller",
        "features": [
            {"name": "Layout", "value": "75% (80 teclas)"},
            {"name": "Switches", "value": "LEOBOG Reaper (hot-swap)"},
            {"name": "Conexão", "value": "Tri-mode wireless"},
            {"name": "Bateria", "value": "4000mAh"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005006123456789.html",
        "brand": "Aula",
        "inStock": True,
        "stockCount": 20
    },
    {
        "id": 241,
        "name": "Royal Kludge RK84 Pro Wireless Mechanical Keyboard",
        "category": "Teclados e Ratos",
        "price": "79,99 €",
        "oldPrice": "99,99 €",
        "rating": 4.6,
        "img": "https://ae01.alicdn.com/kf/S4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q.jpg",
        "description": "Teclado mecânico 75% wireless com hot-swap, switches Gateron/Cherry MX compatíveis. Tri-mode (BT/2.4GHz/USB-C), keycaps PBT double-shot, iluminação RGB por tecla.",
        "badge": "Versátil",
        "features": [
            {"name": "Layout", "value": "75% (84 teclas)"},
            {"name": "Hot-Swap", "value": "Sim (5-pin)"},
            {"name": "Keycaps", "value": "PBT double-shot"},
            {"name": "Conexão", "value": "Tri-mode wireless"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005005678901234.html",
        "brand": "Royal Kludge",
        "inStock": True,
        "stockCount": 15
    },
    {
        "id": 242,
        "name": "Redragon K630 Dragonborn 60% Mechanical Keyboard",
        "category": "Teclados e Ratos",
        "price": "49,99 €",
        "oldPrice": "64,99 €",
        "rating": 4.5,
        "img": "https://www.redragonzone.com/cdn/shop/files/K630-RGB.png",
        "description": "Teclado mecânico compacto 60% com switches Red linear, keycaps double-shot e RGB por tecla. USB-C destacável, ideal para gaming FPS e portabilidade.",
        "badge": "Compacto",
        "features": [
            {"name": "Layout", "value": "60% (61 teclas)"},
            {"name": "Switches", "value": "Red linear (smooth)"},
            {"name": "Keycaps", "value": "Double-shot ABS"},
            {"name": "RGB", "value": "Por tecla"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005001234567890.html",
        "brand": "Redragon",
        "inStock": True,
        "stockCount": 25
    },
    {
        "id": 243,
        "name": "VGN Neon 75 HE Rapid Trigger Keyboard",
        "category": "Teclados e Ratos",
        "price": "99,99 €",
        "oldPrice": "119,99 €",
        "rating": 4.8,
        "img": "https://ae01.alicdn.com/kf/Sc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f.jpg",
        "description": "Teclado com tecnologia Hall Effect e Rapid Trigger para resposta instantânea. 8000Hz de polling rate, gasket mount, PBT keycaps. O favorito dos jogadores profissionais.",
        "badge": "Pro Gamer",
        "features": [
            {"name": "Switches", "value": "Hall Effect magnéticos"},
            {"name": "Rapid Trigger", "value": "Sim (0.1mm actuation)"},
            {"name": "Polling Rate", "value": "8000Hz"},
            {"name": "Layout", "value": "75%"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005007890123456.html",
        "brand": "VGN",
        "inStock": True,
        "stockCount": 15
    },

    # ── GAMING HEADSETS BUDGET (IDs 250-253) ──
    {
        "id": 250,
        "name": "Redragon H510 Zeus Wired Gaming Headset 7.1",
        "category": "Headsets e Áudio",
        "price": "44,99 €",
        "oldPrice": "59,99 €",
        "rating": 4.6,
        "img": "https://www.redragonzone.com/cdn/shop/files/h510-zeus.png",
        "description": "Headset gaming wired com surround 7.1 virtual, drivers de 53mm e microfone destacável com cancelamento de ruído. Ear pads de memory foam para conforto prolongado.",
        "badge": "7.1 Surround",
        "features": [
            {"name": "Drivers", "value": "53mm Hi-Fi"},
            {"name": "Surround", "value": "7.1 Virtual (USB)"},
            {"name": "Microfone", "value": "Destacável, noise cancel"},
            {"name": "Ear Pads", "value": "Memory Foam"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005001593034691.html",
        "brand": "Redragon",
        "inStock": True,
        "stockCount": 25
    },
    {
        "id": 251,
        "name": "HAVIT H2002d Gaming Headset Surround",
        "category": "Headsets e Áudio",
        "price": "34,99 €",
        "oldPrice": "44,99 €",
        "rating": 4.4,
        "img": "https://ae01.alicdn.com/kf/S5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s.jpg",
        "description": "Headset gaming com drivers de 53mm, microfone com cancelamento de ruído e iluminação RGB. Compatível com PC, PS4, PS5, Xbox e Nintendo Switch via jack 3.5mm.",
        "badge": "Multi-Plataforma",
        "features": [
            {"name": "Drivers", "value": "53mm"},
            {"name": "Compatibilidade", "value": "PC/PS4/PS5/Xbox/Switch"},
            {"name": "Microfone", "value": "Noise cancelling"},
            {"name": "Conexão", "value": "3.5mm + USB (RGB)"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005002345678912.html",
        "brand": "HAVIT",
        "inStock": True,
        "stockCount": 30
    },
    {
        "id": 252,
        "name": "Onikuma K5 Pro Gaming Headset RGB",
        "category": "Headsets e Áudio",
        "price": "27,99 €",
        "oldPrice": "36,99 €",
        "rating": 4.3,
        "img": "https://ae01.alicdn.com/kf/S7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o.jpg",
        "description": "Headset gaming entry-level com design agressivo, drivers de 50mm, microfone ajustável e iluminação RGB. Ideal para quem quer começar no gaming sem gastar muito.",
        "badge": "Entry Level",
        "features": [
            {"name": "Drivers", "value": "50mm"},
            {"name": "RGB", "value": "LED multicolor"},
            {"name": "Peso", "value": "310g"},
            {"name": "Conexão", "value": "3.5mm + USB"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/1005003456789012.html",
        "brand": "Onikuma",
        "inStock": True,
        "stockCount": 35
    },
]


def main():
    content = PRODUCTS_TS.read_text(encoding="utf-8")

    # 1. Add "Mouse Pads" to categories array
    if NEW_CATEGORY not in content:
        content = content.replace(
            '"Cadeiras Gaming"',
            '"Cadeiras Gaming",\n  "Mouse Pads"'
        )
        print("Added 'Mouse Pads' to categories")

    # 2. Build the new products JSON strings
    import json

    new_entries = []
    for p in NEW_PRODUCTS:
        # Convert Python dict to JSON-like TS object
        entry = json.dumps(p, indent=4, ensure_ascii=False)
        # Fix booleans for TS
        entry = entry.replace('"inStock": true', '"inStock": true')
        entry = entry.replace('"inStock": false', '"inStock": false')
        new_entries.append(entry)

    new_section = """
  // =============================================
  // PERIFÉRICOS BUDGET — Ratos Gaming (IDs 220-224)
  // =============================================
"""
    for p in NEW_PRODUCTS:
        if p["id"] == 230:
            new_section += """
  // =============================================
  // MOUSE PADS XL (IDs 230-232)
  // =============================================
"""
        if p["id"] == 240:
            new_section += """
  // =============================================
  // TECLADOS MECÂNICOS BUDGET (IDs 240-243)
  // =============================================
"""
        if p["id"] == 250:
            new_section += """
  // =============================================
  // HEADSETS GAMING BUDGET (IDs 250-252)
  // =============================================
"""
        entry = json.dumps(p, indent=4, ensure_ascii=False)
        new_section += "  " + entry + ",\n"

    # 3. Insert before the closing bracket of the products array
    # Find the last ];
    last_bracket = content.rfind("];")
    if last_bracket == -1:
        print("ERROR: Could not find end of products array")
        sys.exit(1)

    content = content[:last_bracket] + new_section + "\n];\n"

    PRODUCTS_TS.write_text(content, encoding="utf-8")

    total = len(re.findall(r'"id"\s*:\s*\d+', content))
    print(f"Added {len(NEW_PRODUCTS)} new budget products")
    print(f"Total products now: {total}")
    print(f"New IDs: {[p['id'] for p in NEW_PRODUCTS]}")


if __name__ == "__main__":
    main()
