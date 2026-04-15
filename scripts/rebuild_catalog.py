#!/usr/bin/env python3
"""
Rebuild catalog: single-pass modification of products.ts.
- Remove duplicate/obsolete products
- Add budget peripherals with real image URLs
- Update all image paths to local /products/{id}.png
- Add "Mouse Pads" category
"""

import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PRODUCTS_TS = Path(__file__).parent.parent / "web" / "src" / "data" / "products.ts"

# IDs to remove (duplicates + obsolete)
REMOVE_IDS = {18, 28, 33, 34, 36, 39, 40, 51, 56, 61, 67, 77, 79, 81}

# New budget products to add
NEW_PRODUCTS = [
    {
        "id": 220,
        "name": "Redragon Shark M688 RGB",
        "category": "Teclados e Ratos",
        "price": "18,99 \u20ac",
        "oldPrice": "29,99 \u20ac",
        "rating": 4.5,
        "img": "/products/220.png",
        "gallery": ["https://redragonadria.com/wp-content/uploads/2021/03/M688-1.jpg"],
        "description": "Rato gaming com sensor \u00f3ptico de 12400 DPI, 8 bot\u00f5es program\u00e1veis, ilumina\u00e7\u00e3o RGB e design ergon\u00f3mico para gaming prolongado.",
        "badge": "Mais Vendido",
        "features": [
            {"name": "DPI", "value": "12400 DPI"},
            {"name": "Bot\u00f5es", "value": "8 Program\u00e1veis"},
            {"name": "Ilumina\u00e7\u00e3o", "value": "RGB Chroma"},
            {"name": "Conex\u00e3o", "value": "USB Com Fio"},
            {"name": "Peso", "value": "85g"},
            {"name": "Sensor", "value": "PAW3212"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/Redragon-M688-Shark",
        "brand": "Redragon",
        "inStock": True,
        "stockCount": 100
    },
    {
        "id": 221,
        "name": "Attack Shark R1 Pro Wireless",
        "category": "Teclados e Ratos",
        "price": "22,99 \u20ac",
        "oldPrice": "34,99 \u20ac",
        "rating": 4.6,
        "img": "/products/221.png",
        "gallery": ["https://attackshark.com/cdn/shop/files/R1_8747f811-5ede-47a6-8b88-4b992277d196.jpg"],
        "description": "Rato gaming wireless tri-mode (2.4G/Bluetooth/USB-C) com sensor PAW3311, design ultra-leve de 55g e bateria de longa dura\u00e7\u00e3o.",
        "badge": "Wireless",
        "features": [
            {"name": "DPI", "value": "26000 DPI"},
            {"name": "Conex\u00e3o", "value": "Tri-Mode 2.4G/BT/USB-C"},
            {"name": "Peso", "value": "55g Ultra-Leve"},
            {"name": "Sensor", "value": "PAW3311"},
            {"name": "Bateria", "value": "60h"},
            {"name": "Polling Rate", "value": "1000Hz"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/Attack-Shark-R1-Pro",
        "brand": "Attack Shark",
        "inStock": True,
        "stockCount": 80
    },
    {
        "id": 222,
        "name": "HAVIT MS1006 Gaming Mouse",
        "category": "Teclados e Ratos",
        "price": "12,99 \u20ac",
        "oldPrice": "19,99 \u20ac",
        "rating": 4.3,
        "img": "/products/222.png",
        "gallery": ["https://havitsmart.com/cdn/shop/files/havit-gaming-mouse-ms1006havit-business-762678.jpg"],
        "description": "Rato gaming acess\u00edvel com ilumina\u00e7\u00e3o RGB, 6 bot\u00f5es program\u00e1veis e sensor de 6400 DPI ajust\u00e1vel.",
        "features": [
            {"name": "DPI", "value": "6400 DPI"},
            {"name": "Bot\u00f5es", "value": "6 Program\u00e1veis"},
            {"name": "Ilumina\u00e7\u00e3o", "value": "RGB"},
            {"name": "Conex\u00e3o", "value": "USB Com Fio"},
            {"name": "Peso", "value": "95g"},
            {"name": "Cabo", "value": "1.5m Nylon"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/HAVIT-MS1006",
        "brand": "HAVIT",
        "inStock": True,
        "stockCount": 120
    },
    {
        "id": 223,
        "name": "Redragon Cobra M711 RGB",
        "category": "Teclados e Ratos",
        "price": "19,99 \u20ac",
        "oldPrice": "27,99 \u20ac",
        "rating": 4.7,
        "img": "/products/223.png",
        "gallery": ["https://redragonshop.com/cdn/shop/files/M711wiredgamingmouse.png"],
        "description": "Rato gaming FPS com sensor Pixart 3325, 10000 DPI, switches Huano de 10M de cliques e peso ajust\u00e1vel.",
        "badge": "Best Seller",
        "features": [
            {"name": "DPI", "value": "10000 DPI"},
            {"name": "Sensor", "value": "Pixart PMW3325"},
            {"name": "Switches", "value": "Huano 10M"},
            {"name": "Conex\u00e3o", "value": "USB Com Fio"},
            {"name": "Peso", "value": "Ajust\u00e1vel 85-115g"},
            {"name": "Polling Rate", "value": "1000Hz"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/Redragon-Cobra-M711",
        "brand": "Redragon",
        "inStock": True,
        "stockCount": 90
    },
    {
        "id": 224,
        "name": "Attack Shark X3 Wireless",
        "category": "Teclados e Ratos",
        "price": "24,99 \u20ac",
        "oldPrice": "39,99 \u20ac",
        "rating": 4.5,
        "img": "/products/224.png",
        "gallery": ["https://attackshark.com/cdn/shop/files/attackshark_x3_gaming_mouse_0055.jpg"],
        "description": "Rato gaming wireless ergon\u00f3mico com sensor PAW3395, 26000 DPI, design de 49g ultra-leve e switch magn\u00e9tico.",
        "badge": "Ultra-Leve",
        "features": [
            {"name": "DPI", "value": "26000 DPI"},
            {"name": "Sensor", "value": "PAW3395"},
            {"name": "Peso", "value": "49g Ultra-Leve"},
            {"name": "Conex\u00e3o", "value": "Tri-Mode 2.4G/BT/USB-C"},
            {"name": "Bateria", "value": "70h"},
            {"name": "Switch", "value": "Magn\u00e9tico"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/Attack-Shark-X3",
        "brand": "Attack Shark",
        "inStock": True,
        "stockCount": 70
    },
    {
        "id": 230,
        "name": "Large RGB Gaming Mouse Pad 90x40cm",
        "category": "Mouse Pads",
        "price": "14,99 \u20ac",
        "oldPrice": "24,99 \u20ac",
        "rating": 4.4,
        "img": "/products/230.png",
        "gallery": ["https://tiltednation.com/cdn/shop/products/tnfireblackrgbmousepad.jpg"],
        "description": "Tapete gaming XXL 900x400mm com ilumina\u00e7\u00e3o LED RGB perimetral, 14 modos de cor, base antiderrapante e superf\u00edcie de micro-textura.",
        "badge": "Popular",
        "features": [
            {"name": "Tamanho", "value": "900 x 400 x 4mm"},
            {"name": "Ilumina\u00e7\u00e3o", "value": "RGB LED 14 Modos"},
            {"name": "Base", "value": "Borracha Antiderrapante"},
            {"name": "Superf\u00edcie", "value": "Micro-Textura Speed"},
            {"name": "Conex\u00e3o", "value": "USB"},
            {"name": "Material", "value": "Tecido + Borracha"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/RGB-Gaming-Mouse-Pad-90x40",
        "brand": "Gen\u00e9rico",
        "inStock": True,
        "stockCount": 150
    },
    {
        "id": 231,
        "name": "Redragon P027 RGB Mouse Pad XL",
        "category": "Mouse Pads",
        "price": "17,99 \u20ac",
        "oldPrice": "27,99 \u20ac",
        "rating": 4.6,
        "img": "/products/231.png",
        "gallery": ["https://redragonadria.com/wp-content/uploads/2021/03/P027RGB-1.jpg"],
        "description": "Tapete gaming Redragon com ilumina\u00e7\u00e3o RGB, tamanho XL 800x300mm, superf\u00edcie otimizada para speed e control.",
        "badge": "Marca Premium",
        "features": [
            {"name": "Tamanho", "value": "800 x 300 x 3mm"},
            {"name": "Ilumina\u00e7\u00e3o", "value": "RGB LED"},
            {"name": "Base", "value": "Borracha Natural"},
            {"name": "Superf\u00edcie", "value": "Speed/Control Dual"},
            {"name": "Conex\u00e3o", "value": "USB"},
            {"name": "Borda", "value": "Costurada Anti-Desgaste"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/Redragon-P027-RGB",
        "brand": "Redragon",
        "inStock": True,
        "stockCount": 100
    },
    {
        "id": 232,
        "name": "Black XXL Mouse Pad 90x40cm",
        "category": "Mouse Pads",
        "price": "9,99 \u20ac",
        "oldPrice": "14,99 \u20ac",
        "rating": 4.3,
        "img": "/products/232.png",
        "gallery": ["https://ultimatecustommousepads.com/cdn/shop/files/xl-large-all-black-blackout-gaming-mousepad-deskmat-5.jpg"],
        "description": "Tapete de mesa XXL todo preto 900x400mm, minimalista, com base antiderrapante e bordas costuradas. Ideal para setup clean.",
        "features": [
            {"name": "Tamanho", "value": "900 x 400 x 3mm"},
            {"name": "Cor", "value": "Preto Total"},
            {"name": "Base", "value": "Borracha Antiderrapante"},
            {"name": "Borda", "value": "Costurada"},
            {"name": "Superf\u00edcie", "value": "Speed Cloth"},
            {"name": "Peso", "value": "350g"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/Black-XXL-Mouse-Pad",
        "brand": "Gen\u00e9rico",
        "inStock": True,
        "stockCount": 200
    },
    {
        "id": 240,
        "name": "Aula F75 Mechanical Keyboard 75%",
        "category": "Teclados e Ratos",
        "price": "34,99 \u20ac",
        "oldPrice": "49,99 \u20ac",
        "rating": 4.7,
        "img": "/products/240.png",
        "gallery": ["https://cdn.shopify.com/s/files/1/0280/3931/5529/files/1_9d9bc2f1-6106-4a74-9396-9086cd5edffc.jpg"],
        "description": "Teclado mec\u00e2nico 75% com switches Gateron, hot-swappable, gasket mount, ilumina\u00e7\u00e3o RGB per-key e conex\u00e3o tri-mode.",
        "badge": "Top Value",
        "features": [
            {"name": "Layout", "value": "75% (82 teclas)"},
            {"name": "Switches", "value": "Gateron Hot-Swap"},
            {"name": "Conex\u00e3o", "value": "Tri-Mode 2.4G/BT/USB-C"},
            {"name": "Bateria", "value": "4000mAh"},
            {"name": "RGB", "value": "Per-Key Backlight"},
            {"name": "Montagem", "value": "Gasket Mount"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/Aula-F75",
        "brand": "Aula",
        "inStock": True,
        "stockCount": 60
    },
    {
        "id": 241,
        "name": "Royal Kludge RK84 Wireless",
        "category": "Teclados e Ratos",
        "price": "39,99 \u20ac",
        "oldPrice": "54,99 \u20ac",
        "rating": 4.6,
        "img": "/products/241.png",
        "gallery": ["https://rkgamingstore.com/cdn/shop/files/RK8475_WirelessMechanicalKeyboard_2_grande.png"],
        "description": "Teclado mec\u00e2nico 75% com hot-swap, bateria de 3750mAh, Bluetooth 5.0, 2.4G e USB-C. Perfeito para produtividade e gaming.",
        "features": [
            {"name": "Layout", "value": "75% (84 teclas)"},
            {"name": "Switches", "value": "Hot-Swappable"},
            {"name": "Conex\u00e3o", "value": "Tri-Mode BT/2.4G/USB-C"},
            {"name": "Bateria", "value": "3750mAh"},
            {"name": "RGB", "value": "South-Facing LEDs"},
            {"name": "Compatibilidade", "value": "Win/Mac/Linux"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/Royal-Kludge-RK84",
        "brand": "Royal Kludge",
        "inStock": True,
        "stockCount": 50
    },
    {
        "id": 242,
        "name": "Redragon K630 Dragonborn 60%",
        "category": "Teclados e Ratos",
        "price": "29,99 \u20ac",
        "oldPrice": "39,99 \u20ac",
        "rating": 4.5,
        "img": "/products/242.png",
        "gallery": ["https://redragonshop.com/cdn/shop/products/redragon60keyboard.png"],
        "description": "Teclado mec\u00e2nico compacto 60% com switches Redragon Brown, ilumina\u00e7\u00e3o RGB e constru\u00e7\u00e3o em alum\u00ednio.",
        "badge": "Compacto",
        "features": [
            {"name": "Layout", "value": "60% (61 teclas)"},
            {"name": "Switches", "value": "Redragon Brown"},
            {"name": "Conex\u00e3o", "value": "USB-C"},
            {"name": "Corpo", "value": "Alum\u00ednio + ABS"},
            {"name": "RGB", "value": "Per-Key Backlight"},
            {"name": "Anti-Ghost", "value": "N-Key Rollover"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/Redragon-K630",
        "brand": "Redragon",
        "inStock": True,
        "stockCount": 70
    },
    {
        "id": 243,
        "name": "VGN Neon 75 HE Magnetic",
        "category": "Teclados e Ratos",
        "price": "49,99 \u20ac",
        "oldPrice": "69,99 \u20ac",
        "rating": 4.8,
        "img": "/products/243.png",
        "gallery": ["https://vgnlab.com/cdn/shop/files/VGN-Neon-he-Elven-White.jpg"],
        "description": "Teclado mec\u00e2nico com switches magn\u00e9ticos Hall Effect, actuation ajust\u00e1vel 0.1-4mm, rapid trigger e gasket mount premium.",
        "badge": "Hall Effect",
        "features": [
            {"name": "Layout", "value": "75% (82 teclas)"},
            {"name": "Switches", "value": "Hall Effect Magn\u00e9tico"},
            {"name": "Actuation", "value": "Ajust\u00e1vel 0.1-4mm"},
            {"name": "Rapid Trigger", "value": "Sim"},
            {"name": "Conex\u00e3o", "value": "USB-C"},
            {"name": "Montagem", "value": "Gasket Mount"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/VGN-Neon-75-HE",
        "brand": "VGN",
        "inStock": True,
        "stockCount": 40
    },
    {
        "id": 250,
        "name": "Redragon H510 Zeus Pro 7.1",
        "category": "Headsets e \u00c1udio",
        "price": "29,99 \u20ac",
        "oldPrice": "44,99 \u20ac",
        "rating": 4.6,
        "img": "/products/250.png",
        "gallery": ["https://redragonshop.com/cdn/shop/products/h510.png"],
        "description": "Headset gaming com drivers de 53mm, som surround 7.1 virtual, microfone destacavel com cancelamento de ru\u00eddo e almofadas de mem\u00f3ria.",
        "badge": "Best Seller",
        "features": [
            {"name": "Drivers", "value": "53mm Neodymium"},
            {"name": "\u00c1udio", "value": "7.1 Surround Virtual"},
            {"name": "Microfone", "value": "Destac\u00e1vel Noise Cancel"},
            {"name": "Conex\u00e3o", "value": "USB + 3.5mm"},
            {"name": "Almofadas", "value": "Memory Foam"},
            {"name": "Peso", "value": "310g"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/Redragon-H510-Zeus",
        "brand": "Redragon",
        "inStock": True,
        "stockCount": 80
    },
    {
        "id": 251,
        "name": "HAVIT H2002d Gaming Headset",
        "category": "Headsets e \u00c1udio",
        "price": "19,99 \u20ac",
        "oldPrice": "29,99 \u20ac",
        "rating": 4.4,
        "img": "/products/251.png",
        "gallery": ["https://www.compume.jo/cdn/shop/files/Havit-H2002D-BO-_3_-1200x1200-1200x1200.jpg"],
        "description": "Headset gaming com drivers de 50mm, microfone omnidirecional, almofadas de prote\u00edna e ilumina\u00e7\u00e3o LED.",
        "features": [
            {"name": "Drivers", "value": "50mm"},
            {"name": "Microfone", "value": "Omnidirecional"},
            {"name": "Conex\u00e3o", "value": "USB + 3.5mm"},
            {"name": "Almofadas", "value": "Prote\u00edna Leather"},
            {"name": "LED", "value": "Ilumina\u00e7\u00e3o Ambiente"},
            {"name": "Cabo", "value": "2.2m Nylon"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/HAVIT-H2002d",
        "brand": "HAVIT",
        "inStock": True,
        "stockCount": 100
    },
    {
        "id": 252,
        "name": "Onikuma K5 Pro Gaming Headset",
        "category": "Headsets e \u00c1udio",
        "price": "15,99 \u20ac",
        "oldPrice": "22,99 \u20ac",
        "rating": 4.3,
        "img": "/products/252.png",
        "gallery": ["https://gamerheadphone.myshopify.com/cdn/shop/products/product-image-782156677.jpg"],
        "description": "Headset gaming over-ear com microfone retr\u00e1ctil, drivers de 50mm, LED RGB e compatibilidade universal PS4/PS5/Xbox/PC.",
        "features": [
            {"name": "Drivers", "value": "50mm"},
            {"name": "Microfone", "value": "Retr\u00e1ctil Flex\u00edvel"},
            {"name": "Conex\u00e3o", "value": "3.5mm Universal"},
            {"name": "Compat.", "value": "PS4/PS5/Xbox/PC/Mobile"},
            {"name": "LED", "value": "RGB (via USB)"},
            {"name": "Peso", "value": "280g"}
        ],
        "supplier_url": "https://www.aliexpress.com/item/Onikuma-K5-Pro",
        "brand": "Onikuma",
        "inStock": True,
        "stockCount": 130
    }
]


def main():
    content = PRODUCTS_TS.read_text(encoding="utf-8")

    # 1. Add "Mouse Pads" to categories (target the categories array only)
    if '"Mouse Pads"' not in content:
        content = content.replace(
            '  "Cadeiras Gaming"\n];',
            '  "Cadeiras Gaming",\n  "Mouse Pads"\n];',
            1  # only first occurrence (the categories array)
        )
        print("[OK] Added 'Mouse Pads' to categories")

    # 2. Remove products by ID
    removed = 0
    for pid in sorted(REMOVE_IDS):
        # Match the full product object from { "id": XX to closing },
        # We need to find the exact block for this ID
        pattern = re.compile(
            r'\n\s*\{[^{}]*?"id"\s*:\s*' + str(pid) + r'\b[^{}]*?'
            r'(?:\{[^{}]*?\}[^{}]*?)*'  # nested objects like features
            r'\},?\s*\n',
            re.DOTALL
        )
        new_content = pattern.sub('\n', content, count=1)
        if new_content != content:
            removed += 1
            content = new_content
    print(f"[OK] Removed {removed}/{len(REMOVE_IDS)} products")

    # 3. Update ALL image URLs to local paths
    def img_replacer(m):
        pid = m.group(1)
        return f'"id": {pid},' + m.group(2) + f'"img": "/products/{pid}.png"'

    updated_imgs = 0
    # Pattern to match "id": N ... "img": "URL"
    id_img_pattern = re.compile(
        r'"id"\s*:\s*(\d+),([^}]*?)"img"\s*:\s*"([^"]+)"',
        re.DOTALL
    )

    def count_and_replace(m):
        nonlocal updated_imgs
        pid = m.group(1)
        current_img = m.group(3)
        if not current_img.startswith("/products/"):
            updated_imgs += 1
        return f'"id": {pid},{m.group(2)}"img": "/products/{pid}.png"'

    content = id_img_pattern.sub(count_and_replace, content)
    print(f"[OK] Updated {updated_imgs} image URLs to local paths")

    # 4. Add new products before the closing ];
    products_json_lines = []
    for p in NEW_PRODUCTS:
        lines = json.dumps(p, ensure_ascii=False, indent=2).split("\n")
        # Indent each line by 2 spaces
        indented = "\n".join("  " + line for line in lines)
        products_json_lines.append(indented)

    new_products_str = ",\n\n".join(products_json_lines)

    # Add new products section before closing ];
    # Find the last product's closing }, and the array's ];
    content = content.rstrip()
    if content.endswith("];"):
        # Insert before ];
        content = content[:-2].rstrip()
        if not content.endswith(","):
            content += ","

        content += f"""

  // =============================================
  // PERIF\u00c9RICOS BUDGET (IDs 220-252)
  // =============================================
{new_products_str}
];
"""
    print(f"[OK] Added {len(NEW_PRODUCTS)} new budget products")

    # 5. Write result
    PRODUCTS_TS.write_text(content, encoding="utf-8")
    total_products = len(re.findall(r'"id"\s*:\s*\d+', content))
    print(f"\n[DONE] Total products: {total_products}")
    print(f"[DONE] File: {len(content.splitlines())} lines")


if __name__ == "__main__":
    main()
