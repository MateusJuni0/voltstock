export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  rating: number | string;
  img: string;
  gallery?: string[];
  description?: string;
  badge?: string;
  features?: { name: string; value: string }[];
  supplier_url?: string;
  brand?: string;
  inStock?: boolean;
  stockCount?: number;
}

export const categories = [
  "Processadores",
  "Placas Gráficas",
  "Motherboards",
  "Memória RAM",
  "Armazenamento",
  "Fontes de Alimentação",
  "Caixas",
  "Refrigeração",
  "Monitores",
  "Teclados e Ratos",
  "Headsets e Áudio",
  "Cadeiras Gaming",
  "Mouse Pads"
];

export const products: Product[] = [
{
  "id": 220,
  "name": "Redragon Shark M688 RGB",
  "category": "Teclados e Ratos",
  "price": "34,99 €",
  "oldPrice": "44,99 €",
  "rating": 4.5,
  "img": "/products/220.png",
  "gallery": [
    "https://redragonadria.com/wp-content/uploads/2021/03/M688-1.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AWATS22081807LTZ5C2.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AWATS22081807LTZW36.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AWATS22081807LU6DE4.jpg"
  ],
  "description": "Rato gaming com sensor óptico de 12400 DPI, 8 botões programáveis, iluminação RGB e design ergonómico para gaming prolongado.",
  "badge": "Mais Vendido",
  "features": [
    {
      "name": "DPI",
      "value": "12400 DPI"
    },
    {
      "name": "Botões",
      "value": "8 Programáveis"
    },
    {
      "name": "Iluminação",
      "value": "RGB Chroma"
    },
    {
      "name": "Conexão",
      "value": "USB Com Fio"
    },
    {
      "name": "Peso",
      "value": "85g"
    },
    {
      "name": "Sensor",
      "value": "PAW3212"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/Redragon-M688-Shark",
  "brand": "Redragon",
  "inStock": true,
  "stockCount": 100
},
{
  "id": 221,
  "name": "Attack Shark R1 Pro Wireless",
  "category": "Teclados e Ratos",
  "price": "44,99 €",
  "oldPrice": "54,99 €",
  "rating": 4.6,
  "img": "/products/221.png",
  "gallery": [
    "https://attackshark.com/cdn/shop/files/R1_8747f811-5ede-47a6-8b88-4b992277d196.jpg",
    "https://c1.neweggimages.com/productimage/nb640/C0A0D2509130QTY2DD1.jpg",
    "https://c1.neweggimages.com/productimage/nb640/C0A0D2509130QTY9P49.jpg",
    "https://c1.neweggimages.com/productimage/nb640/C0A0D2509130QU564B2.jpg"
  ],
  "description": "Rato gaming wireless tri-mode (2.4G/Bluetooth/USB-C) com sensor PAW3311, design ultra-leve de 55g e bateria de longa duração.",
  "badge": "Wireless",
  "features": [
    {
      "name": "DPI",
      "value": "26000 DPI"
    },
    {
      "name": "Conexão",
      "value": "Tri-Mode 2.4G/BT/USB-C"
    },
    {
      "name": "Peso",
      "value": "55g Ultra-Leve"
    },
    {
      "name": "Sensor",
      "value": "PAW3311"
    },
    {
      "name": "Bateria",
      "value": "60h"
    },
    {
      "name": "Polling Rate",
      "value": "1000Hz"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/Attack-Shark-R1-Pro",
  "brand": "Attack Shark",
  "inStock": true,
  "stockCount": 80
},
{
  "id": 222,
  "name": "HAVIT MS1006 Gaming Mouse",
  "category": "Teclados e Ratos",
  "price": "20,99 €",
  "oldPrice": "24,99 €",
  "rating": 4.3,
  "img": "/products/222.png",
  "gallery": [
    "https://havitsmart.com/cdn/shop/files/havit-gaming-mouse-ms1006havit-business-762678.jpg",
    "https://havitsmart.com/cdn/shop/files/havit-gaming-mouse-ms1006havit-business-762678.jpg?v=1749802186",
    "https://havitsmart.com/cdn/shop/files/havit-gaming-mouse-ms1006havit-business-747610.jpg?v=1749802186",
    "https://havitsmart.com/cdn/shop/files/havit-gaming-mouse-ms1006havit-business-212255.jpg?v=1749802186"
  ],
  "description": "Rato gaming acessível com iluminação RGB, 6 botões programáveis e sensor de 6400 DPI ajustável.",
  "features": [
    {
      "name": "DPI",
      "value": "6400 DPI"
    },
    {
      "name": "Botões",
      "value": "6 Programáveis"
    },
    {
      "name": "Iluminação",
      "value": "RGB"
    },
    {
      "name": "Conexão",
      "value": "USB Com Fio"
    },
    {
      "name": "Peso",
      "value": "95g"
    },
    {
      "name": "Cabo",
      "value": "1.5m Nylon"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/HAVIT-MS1006",
  "brand": "HAVIT",
  "inStock": true,
  "stockCount": 120
},
{
  "id": 223,
  "name": "Redragon Cobra M711 RGB",
  "category": "Teclados e Ratos",
  "price": "25,99 €",
  "oldPrice": "34,99 €",
  "rating": 4.7,
  "img": "/products/223.png",
  "gallery": [
    "https://redragonshop.com/cdn/shop/files/M711wiredgamingmouse.png",
    "https://c1.neweggimages.com/productimage/nb640/AWATS22021805CRY93B.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AWATS22021805D5KM9D.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AWATS22021805D2V17C.jpg"
  ],
  "description": "Rato gaming FPS com sensor Pixart 3325, 10000 DPI, switches Huano de 10M de cliques e peso ajustável.",
  "badge": "Best Seller",
  "features": [
    {
      "name": "DPI",
      "value": "10000 DPI"
    },
    {
      "name": "Sensor",
      "value": "Pixart PMW3325"
    },
    {
      "name": "Switches",
      "value": "Huano 10M"
    },
    {
      "name": "Conexão",
      "value": "USB Com Fio"
    },
    {
      "name": "Peso",
      "value": "Ajustável 85-115g"
    },
    {
      "name": "Polling Rate",
      "value": "1000Hz"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/Redragon-Cobra-M711",
  "brand": "Redragon",
  "inStock": true,
  "stockCount": 90
},
{
  "id": 224,
  "name": "Attack Shark X3 Wireless",
  "category": "Teclados e Ratos",
  "price": "49,99 €",
  "oldPrice": "59,99 €",
  "rating": 4.5,
  "img": "/products/224.png",
  "gallery": [
    "https://attackshark.com/cdn/shop/files/attackshark_x3_gaming_mouse_0055.jpg",
    "https://c1.neweggimages.com/productimage/nb640/C0JYD2506110PRW2594.jpg",
    "https://c1.neweggimages.com/productimage/nb640/C0JYD2506110PRWAU6E.jpg",
    "https://c1.neweggimages.com/productimage/nb640/C0JYD2506110PRWEH2E.jpg"
  ],
  "description": "Rato gaming wireless ergonómico com sensor PAW3395, 26000 DPI, design de 49g ultra-leve e switch magnético.",
  "badge": "Ultra-Leve",
  "features": [
    {
      "name": "DPI",
      "value": "26000 DPI"
    },
    {
      "name": "Sensor",
      "value": "PAW3395"
    },
    {
      "name": "Peso",
      "value": "49g Ultra-Leve"
    },
    {
      "name": "Conexão",
      "value": "Tri-Mode 2.4G/BT/USB-C"
    },
    {
      "name": "Bateria",
      "value": "70h"
    },
    {
      "name": "Switch",
      "value": "Magnético"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/Attack-Shark-X3",
  "brand": "Attack Shark",
  "inStock": true,
  "stockCount": 70
},
{
  "id": 230,
  "name": "Large RGB Gaming Mouse Pad 90x40cm",
  "category": "Mouse Pads",
  "price": "23,99 €",
  "oldPrice": "28,99 €",
  "rating": 4.4,
  "img": "/products/230.png",
  "gallery": [
    "https://tiltednation.com/cdn/shop/products/tnfireblackrgbmousepad.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AMA6S200527DKUf3.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AMA6S200527e7F2k.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AMA6S200527RON8A.jpg"
  ],
  "description": "Tapete gaming XXL 900x400mm com iluminação LED RGB perimetral, 14 modos de cor, base antiderrapante e superfície de micro-textura.",
  "badge": "Popular",
  "features": [
    {
      "name": "Tamanho",
      "value": "900 x 400 x 4mm"
    },
    {
      "name": "Iluminação",
      "value": "RGB LED 14 Modos"
    },
    {
      "name": "Base",
      "value": "Borracha Antiderrapante"
    },
    {
      "name": "Superfície",
      "value": "Micro-Textura Speed"
    },
    {
      "name": "Conexão",
      "value": "USB"
    },
    {
      "name": "Material",
      "value": "Tecido + Borracha"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/RGB-Gaming-Mouse-Pad-90x40",
  "brand": "Genérico",
  "inStock": true,
  "stockCount": 150
},
{
  "id": 231,
  "name": "Redragon P027 RGB Mouse Pad XL",
  "category": "Mouse Pads",
  "price": "26,99 €",
  "oldPrice": "34,99 €",
  "rating": 4.6,
  "img": "/products/231.png",
  "gallery": [
    "https://redragonadria.com/wp-content/uploads/2021/03/P027RGB-1.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AMA6S200527BsjrN.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AMA6S200527cAjvt.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AMA6S200527M57zi.jpg"
  ],
  "description": "Tapete gaming Redragon com iluminação RGB, tamanho XL 800x300mm, superfície otimizada para speed e control.",
  "badge": "Marca Premium",
  "features": [
    {
      "name": "Tamanho",
      "value": "800 x 300 x 3mm"
    },
    {
      "name": "Iluminação",
      "value": "RGB LED"
    },
    {
      "name": "Base",
      "value": "Borracha Natural"
    },
    {
      "name": "Superfície",
      "value": "Speed/Control Dual"
    },
    {
      "name": "Conexão",
      "value": "USB"
    },
    {
      "name": "Borda",
      "value": "Costurada Anti-Desgaste"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/Redragon-P027-RGB",
  "brand": "Redragon",
  "inStock": true,
  "stockCount": 100
},
{
  "id": 232,
  "name": "Black XXL Mouse Pad 90x40cm",
  "category": "Mouse Pads",
  "price": "16,99 €",
  "oldPrice": "20,99 €",
  "rating": 4.3,
  "img": "/products/232.png",
  "gallery": [
    "https://ultimatecustommousepads.com/cdn/shop/files/xl-large-all-black-blackout-gaming-mousepad-deskmat-5.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AMA6S23060706V4WHEE.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AMA6S200527DKUf3.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AMA6S200527e7F2k.jpg"
  ],
  "description": "Tapete de mesa XXL todo preto 900x400mm, minimalista, com base antiderrapante e bordas costuradas. Ideal para setup clean.",
  "features": [
    {
      "name": "Tamanho",
      "value": "900 x 400 x 3mm"
    },
    {
      "name": "Cor",
      "value": "Preto Total"
    },
    {
      "name": "Base",
      "value": "Borracha Antiderrapante"
    },
    {
      "name": "Borda",
      "value": "Costurada"
    },
    {
      "name": "Superfície",
      "value": "Speed Cloth"
    },
    {
      "name": "Peso",
      "value": "350g"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/Black-XXL-Mouse-Pad",
  "brand": "Genérico",
  "inStock": true,
  "stockCount": 200
},
{
  "id": 240,
  "name": "Aula F75 Mechanical Keyboard 75%",
  "category": "Teclados e Ratos",
  "price": "84,99 €",
  "oldPrice": "109,99 €",
  "rating": 4.7,
  "img": "/products/240.png",
  "gallery": [
    "https://cdn.shopify.com/s/files/1/0280/3931/5529/files/1_9d9bc2f1-6106-4a74-9396-9086cd5edffc.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AJXJD25102403APSYC8.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AJXJD25102403APXQ8F.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AJXJD25102403AQ2Z6C.jpg"
  ],
  "description": "Teclado mecânico 75% com switches Gateron, hot-swappable, gasket mount, iluminação RGB per-key e conexão tri-mode.",
  "badge": "Top Value",
  "features": [
    {
      "name": "Layout",
      "value": "75% (82 teclas)"
    },
    {
      "name": "Switches",
      "value": "Gateron Hot-Swap"
    },
    {
      "name": "Conexão",
      "value": "Tri-Mode 2.4G/BT/USB-C"
    },
    {
      "name": "Bateria",
      "value": "4000mAh"
    },
    {
      "name": "RGB",
      "value": "Per-Key Backlight"
    },
    {
      "name": "Montagem",
      "value": "Gasket Mount"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/Aula-F75",
  "brand": "Aula",
  "inStock": true,
  "stockCount": 60
},
{
  "id": 241,
  "name": "Royal Kludge RK84 Wireless",
  "category": "Teclados e Ratos",
  "price": "74,99 €",
  "oldPrice": "89,99 €",
  "rating": 4.6,
  "img": "/products/241.png",
  "gallery": [
    "https://rkgamingstore.com/cdn/shop/files/RK8475_WirelessMechanicalKeyboard_2_grande.png",
    "https://c1.neweggimages.com/productimage/nb640/C2BSD2509060FSJVBEF.jpg",
    "https://c1.neweggimages.com/productimage/nb640/C2BSD2509060FSJXCFF.jpg",
    "https://c1.neweggimages.com/productimage/nb640/C2BSD2509060FSJUI44.jpg"
  ],
  "description": "Teclado mecânico 75% com hot-swap, bateria de 3750mAh, Bluetooth 5.0, 2.4G e USB-C. Perfeito para produtividade e gaming.",
  "features": [
    {
      "name": "Layout",
      "value": "75% (84 teclas)"
    },
    {
      "name": "Switches",
      "value": "Hot-Swappable"
    },
    {
      "name": "Conexão",
      "value": "Tri-Mode BT/2.4G/USB-C"
    },
    {
      "name": "Bateria",
      "value": "3750mAh"
    },
    {
      "name": "RGB",
      "value": "South-Facing LEDs"
    },
    {
      "name": "Compatibilidade",
      "value": "Win/Mac/Linux"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/Royal-Kludge-RK84",
  "brand": "Royal Kludge",
  "inStock": true,
  "stockCount": 50
},
{
  "id": 243,
  "name": "VGN Neon 75 HE Magnetic",
  "category": "Teclados e Ratos",
  "price": "99,99 €",
  "oldPrice": "119,99 €",
  "rating": 4.8,
  "img": "/products/243.png",
  "gallery": [
    "https://vgnlab.com/cdn/shop/files/VGN-Neon-he-Elven-White.jpg",
    "https://c1.neweggimages.com/productimage/nb640/C21AD2602010JZSZPA7.jpg",
    "https://c1.neweggimages.com/productimage/nb640/C21AD2602010JZT0ZF4.jpg",
    "https://c1.neweggimages.com/productimage/nb640/C21AD2602010JZT1X95.jpg"
  ],
  "description": "Teclado mecânico com switches magnéticos Hall Effect, actuation ajustável 0.1-4mm, rapid trigger e gasket mount premium.",
  "badge": "Hall Effect",
  "features": [
    {
      "name": "Layout",
      "value": "75% (82 teclas)"
    },
    {
      "name": "Switches",
      "value": "Hall Effect Magnético"
    },
    {
      "name": "Actuation",
      "value": "Ajustável 0.1-4mm"
    },
    {
      "name": "Rapid Trigger",
      "value": "Sim"
    },
    {
      "name": "Conexão",
      "value": "USB-C"
    },
    {
      "name": "Montagem",
      "value": "Gasket Mount"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/VGN-Neon-75-HE",
  "brand": "VGN",
  "inStock": true,
  "stockCount": 40
},
{
  "id": 250,
  "name": "Redragon H510 Zeus Pro 7.1",
  "category": "Headsets e Áudio",
  "price": "44,99 €",
  "oldPrice": "54,99 €",
  "rating": 4.6,
  "img": "/products/250.png",
  "gallery": [
    "https://redragonshop.com/cdn/shop/products/h510.png",
    "https://c1.neweggimages.com/productimage/nb640/AWATS2301050IJ2RQB5.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AWATS2301050IJ2WO30.jpg",
    "https://c1.neweggimages.com/productimage/nb640/AWATS2301050IJ2XMA2.jpg"
  ],
  "description": "Headset gaming com drivers de 53mm, som surround 7.1 virtual, microfone destacavel com cancelamento de ruído e almofadas de memória.",
  "badge": "Best Seller",
  "features": [
    {
      "name": "Drivers",
      "value": "53mm Neodymium"
    },
    {
      "name": "Áudio",
      "value": "7.1 Surround Virtual"
    },
    {
      "name": "Microfone",
      "value": "Destacável Noise Cancel"
    },
    {
      "name": "Conexão",
      "value": "USB + 3.5mm"
    },
    {
      "name": "Almofadas",
      "value": "Memory Foam"
    },
    {
      "name": "Peso",
      "value": "310g"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/Redragon-H510-Zeus",
  "brand": "Redragon",
  "inStock": true,
  "stockCount": 80
}
];
