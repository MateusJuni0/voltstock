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
},
{
  "id": 260,
  "name": "Redragon M913 16000 DPI Wireless",
  "category": "Teclados e Ratos",
  "price": "92,99 €",
  "oldPrice": "116,24 €",
  "rating": 4.7,
  "img": "/products/260.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S19e50940ab6c4aa0a40fbb1068b51732G.png",
    "https://ae01.alicdn.com/kf/S7edb985486c04b44b6bc09bd656d530fz.jpg",
    "https://ae01.alicdn.com/kf/Sffb87916f3294f80ad456facb2547e00z.jpg",
    "https://ae01.alicdn.com/kf/S8622719d7f2c42369c5140b7023b545dx.jpg",
    "https://ae01.alicdn.com/kf/S47515115b5234a7cafbc62b63f736fdeI.jpg",
    "https://ae01.alicdn.com/kf/S3fccb22583e449e09cdc3f8cfb2b0952P.jpg"
  ],
  "description": "Redragon M913 Gaming 16000 DPI com fio 2,4 Ghz sem fio RGB Mouse óptico para jogadores 16 botões programáveis, mouse preto/branco",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Redragon"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005004662195682.html",
  "brand": "Redragon",
  "inStock": true,
  "stockCount": 128
},
{
  "id": 261,
  "name": "Mouse Pad XXL RGB Dragon HD Preto",
  "category": "Mouse Pads",
  "price": "18,42 €",
  "oldPrice": "23,03 €",
  "rating": 4.7,
  "img": "/products/261.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S91aa1e69b44e4153af71b9642b3e16bbi.jpg",
    "https://ae01.alicdn.com/kf/S46052c2b1f064fe4998e94a00634bf65E.jpg",
    "https://ae01.alicdn.com/kf/S7ed62eded88e41f8a0b1370536f71a63v.jpg",
    "https://ae01.alicdn.com/kf/S533ef93c7ad647749f447fe93ba3edcdI.jpg",
    "https://ae01.alicdn.com/kf/Sff229d7d2bfb444a97eac6280544bae5Q.jpg",
    "https://ae01.alicdn.com/kf/S4bb9a7fd71f34d21a995ba6c75cad7c97.jpg"
  ],
  "description": "XXL RGB Gaming Mouse Pad Dragon Desk Mat HD Preto Gamer Acessórios Grande Luz LED MousePads PC Computer Carpet Com Backlit",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Generic"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005005996727145.html",
  "brand": "Generic",
  "inStock": true,
  "stockCount": 5
},
{
  "id": 262,
  "name": "RK Royal Kludge S98 TFT Display",
  "category": "Teclados e Ratos",
  "price": "270,79 €",
  "oldPrice": "338,49 €",
  "rating": 4.7,
  "img": "/products/262.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S74a631ecdabf44f690a8d77b87ec5238d.jpg",
    "https://ae01.alicdn.com/kf/S68d6e05f51594d69a9b99d4df8eeebc09.jpg",
    "https://ae01.alicdn.com/kf/S873b1f57ffc64853a5ee6d93b0b9b17bl.jpg",
    "https://ae01.alicdn.com/kf/S2cc533182e0843cdb49cb51ad8e2fda5K.jpg",
    "https://ae01.alicdn.com/kf/S7885d73ce258454aa0fd4fa245887be9P.jpg",
    "https://ae01.alicdn.com/kf/Sa30207e82d71402898755aee90d7868by.jpg"
  ],
  "description": "Teclado Mecânico RK ROYAL KLUDGE S98 com Tela TFT Montada na Parte Superior, 98 Teclas, RGB, BT5.0/2.4G/USB-C, Teclado Gamer Sem Fio Hot Swappable",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Royal Kludge"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005006537039533.html",
  "brand": "Royal Kludge",
  "inStock": true,
  "stockCount": 20557
},
{
  "id": 263,
  "name": "Redragon M612 PRO BT RGB Wireless",
  "category": "Teclados e Ratos",
  "price": "51,23 €",
  "oldPrice": "64,04 €",
  "rating": 4.7,
  "img": "/products/263.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S27c1495cc45a496a898ea6d3710af376U.png",
    "https://ae01.alicdn.com/kf/Sb24f6b96b6554ccdaa4fc8be301a95c3p.jpg",
    "https://ae01.alicdn.com/kf/S05d8c7fc3fad4ff4a45d4a8b825d2d71t.jpg",
    "https://ae01.alicdn.com/kf/Sa68a612758aa4304bae3020972713029h.jpg",
    "https://ae01.alicdn.com/kf/S2571116e1bcc4ca7bea46f353f6483a4h.jpg",
    "https://ae01.alicdn.com/kf/S74e0746095224048967cda732570d5dcq.jpg"
  ],
  "description": "Mouse para jogos Redragon M612 PRO BT e 2,4RGB, mouse óptico com fio/sem fio de 8000 DPI, 11 botões programáveis e 6 modos retroiluminados",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Redragon"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005006911655686.html",
  "brand": "Redragon",
  "inStock": true,
  "stockCount": 34
},
{
  "id": 264,
  "name": "Attack Shark X6 RGB Touch Base",
  "category": "Teclados e Ratos",
  "price": "86,92 €",
  "oldPrice": "108,65 €",
  "rating": 4.7,
  "img": "/products/264.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/Sa3dbb0cab00d451c87719d938f1e76e23.jpg",
    "https://ae01.alicdn.com/kf/S10a98a715a6b4511b4f8af8b421b43d9u.jpg",
    "https://ae01.alicdn.com/kf/S9f69795366cd4e0eb3d3c734f9cf8188f.jpg",
    "https://ae01.alicdn.com/kf/S40ec2827b13c47e4891a9ea39e9f1aebj.jpg",
    "https://ae01.alicdn.com/kf/S782ecde2899f40e7bc66b6e939683630c.jpg",
    "https://ae01.alicdn.com/kf/Sed1d60327f414bfab86a5e98f0aec2b9B.jpg"
  ],
  "description": "Attack Shark X6 Mouse Sem Fio RGB Touch Base de Carregamento Magnético PAW3395 Conexão Tri-Mode Macro Gaming Mouse",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Attack Shark"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005007061847291.html",
  "brand": "Attack Shark",
  "inStock": true,
  "stockCount": 23
},
{
  "id": 265,
  "name": "Aula F75 Wireless Bluetooth Mecânico",
  "category": "Teclados e Ratos",
  "price": "145,13 €",
  "oldPrice": "181,41 €",
  "rating": 4.7,
  "img": "/products/265.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S9d0c285127124820ae8fda27a0cc0b34k.jpg",
    "https://ae01.alicdn.com/kf/S10039688d0ec4750a5296ebe5d28a6f41.jpg",
    "https://ae01.alicdn.com/kf/S0e5cd5860eee4d1ea0bd16123dbbd872v.jpg",
    "https://ae01.alicdn.com/kf/Sf7d1fe3e8fe14013abd98ed26701aea6s.jpg",
    "https://ae01.alicdn.com/kf/S58d14530854b45d680f76a51fed814f9J.jpg",
    "https://ae01.alicdn.com/kf/S5dbbb69e6de249e3ab4edd228d40ac49x.jpg"
  ],
  "description": "AULA-F75 Teclado mecânico sem fio Gaming, Bluetooth, Com fio, RGB personalizado, 75% Layout Profile, Estrutura Junta, 2.4G",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Aula"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005007099240050.html",
  "brand": "Aula",
  "inStock": true,
  "stockCount": 298
},
{
  "id": 266,
  "name": "Mouse Pad DIY RGB XXL Personalizado",
  "category": "Mouse Pads",
  "price": "8,01 €",
  "oldPrice": "10,01 €",
  "rating": 4.7,
  "img": "/products/266.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S0a91db3f4b814379b64405d0ef9b994aB.jpg",
    "https://ae01.alicdn.com/kf/S52c819583e514c74a4e54ef0a7f2fec9n.jpg",
    "https://ae01.alicdn.com/kf/Se896e2228e1d4ca29e7e4475c0a7d0fbk.jpg",
    "https://ae01.alicdn.com/kf/Sef8a91ed7a1143328e3a82dfe557cf21g.jpg",
    "https://ae01.alicdn.com/kf/Se38d8edbe6e346b38821eb8a2900a7e2i.jpg",
    "https://ae01.alicdn.com/kf/S6917196c157b46dea1e04e8e7841b00b6.jpg"
  ],
  "description": "Diy personalizado mouse pad mesa tapete grande jogo mousepad diy rgb iluminação portátil tapete de borracha gamer almofada tapete",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Generic"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005007781334616.html",
  "brand": "Generic",
  "inStock": true,
  "stockCount": 5880
},
{
  "id": 267,
  "name": "Mouse Pad XXL RGB Geometria 3D",
  "category": "Mouse Pads",
  "price": "25,59 €",
  "oldPrice": "31,99 €",
  "rating": 4.7,
  "img": "/products/267.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S94f48c1474e44cf0bebef9db9ceab2cbD.jpg",
    "https://ae01.alicdn.com/kf/S1115cce80c72434e8fc33e9f2911fb0fJ.jpg",
    "https://ae01.alicdn.com/kf/S8a104dfaa0c149d6bac5b025c5230203K.jpg",
    "https://ae01.alicdn.com/kf/S0eaa1a8b8dc444f592d0169071f825cdI.jpg",
    "https://ae01.alicdn.com/kf/S107f50b6ddd04754a76e31456c7200c5Y.jpg",
    "https://ae01.alicdn.com/kf/S1c130b4d05e043acbc4d42842e5648c8J.jpg"
  ],
  "description": "Xxl rgb gaming mouse pad nova geometria 3d tapete de mesa hd gamer acessórios grande luz led mousepads pc computador tapete com retroiluminado",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Generic"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005007996190317.html",
  "brand": "Generic",
  "inStock": true,
  "stockCount": 126482
},
{
  "id": 268,
  "name": "Epomaker x Aula F75 MAX 75% ANSI",
  "category": "Teclados e Ratos",
  "price": "174,88 €",
  "oldPrice": "218,60 €",
  "rating": 4.7,
  "img": "/products/268.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/Sa642b5eec556483bb0ec64f878073af2v.jpg",
    "https://ae01.alicdn.com/kf/Sce70435ff92d448fa52ef8d8c360661am.jpg",
    "https://ae01.alicdn.com/kf/S5580573dcb654fb4b84524fde8fc36761.jpg",
    "https://ae01.alicdn.com/kf/S26dcfb8fd5e74140be71e837f7201c21c.jpg",
    "https://ae01.alicdn.com/kf/S32ee0600c262403880958462a16327022.jpg",
    "https://ae01.alicdn.com/kf/Saeb8b72dda924b098e5de0ac2e7c2829W.jpg"
  ],
  "description": "EPOMAKER X AULA F75 MAX Compact 75% ANSI Layout Teclado mecânico sem fio com fio/Bluetooth/2,4 GHz com tela TFT e botão",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Aula"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005008274420900.html",
  "brand": "Aula",
  "inStock": true,
  "stockCount": 32
},
{
  "id": 269,
  "name": "Redragon Hana M694 RGB Wireless",
  "category": "Teclados e Ratos",
  "price": "49,86 €",
  "oldPrice": "62,33 €",
  "rating": 4.7,
  "img": "/products/269.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S4eb91d9d54ed415b9239f4d6b0b42847L.jpg",
    "https://ae01.alicdn.com/kf/Sa9f4956244844b29b95cb5e75877048cK.jpg",
    "https://ae01.alicdn.com/kf/S0cdd8c326d9543d98cc2a3cad7e8d0b1r.jpg",
    "https://ae01.alicdn.com/kf/S6d05af1af2614448a031436eca603b80u.jpg",
    "https://ae01.alicdn.com/kf/Sb50126ce23c44502a000d5ad41e6ca030.jpg",
    "https://ae01.alicdn.com/kf/S807debf463f84e4d955d920335930b40h.jpg"
  ],
  "description": "REDRAGON HANA M694 RGB USB 2.4G Suporte sem fio Bluetooth Wired Gaming Mouse 7200 DPI 7 botões para mouse gamer computador laptop",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Redragon"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005008783738245.html",
  "brand": "Redragon",
  "inStock": true,
  "stockCount": 7
},
{
  "id": 270,
  "name": "RK Royal Kludge PBT Colorblock Keycaps",
  "category": "Teclados e Ratos",
  "price": "22,94 €",
  "oldPrice": "28,68 €",
  "rating": 4.7,
  "img": "/products/270.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S42fc50773b894ce09dddac72021b23c7k.png",
    "https://ae01.alicdn.com/kf/Sc1554d2b7dad4480bee5a5da9b45d6c3n.jpg",
    "https://ae01.alicdn.com/kf/S6e0497855b1542ebab3c4e286ca4bb0aP.jpg",
    "https://ae01.alicdn.com/kf/S8bcc417581b74ed5b3d7fa69653d81f0X.jpg",
    "https://ae01.alicdn.com/kf/S2ffd9d3482cc4e91a4b0526c9ddd5ecfn.jpg",
    "https://ae01.alicdn.com/kf/Sefa1dc2fb4444388bdb796b0d10997a6i.jpg"
  ],
  "description": "Rk royal kludge inglês russo pbt colorblock keycaps 98 teclas pbt material sublimação adequado para teclado de jogos mecânico",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Royal Kludge"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005008843508905.html",
  "brand": "Royal Kludge",
  "inStock": true,
  "stockCount": 2348
},
{
  "id": 271,
  "name": "Mouse Pad Asus RGB Anime XXL",
  "category": "Mouse Pads",
  "price": "21,96 €",
  "oldPrice": "27,45 €",
  "rating": 4.7,
  "img": "/products/271.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S0d94db8df4fc4df283122946bdb5e83c3.jpg",
    "https://ae01.alicdn.com/kf/S70ad0236a7e54759b04444f41e5c410aN.jpg",
    "https://ae01.alicdn.com/kf/S12441d0b0abd4220b224503a87b3b8bc2.jpg",
    "https://ae01.alicdn.com/kf/S252e5cf9f4a847c7b4a2db0896f83ba6c.jpg",
    "https://ae01.alicdn.com/kf/S49aef8b1c1a9474d86bac32fed76b566E.jpg",
    "https://ae01.alicdn.com/kf/S85f49d00cbd44db68c781cee57f6934aa.jpg"
  ],
  "description": "Preto mouse pad asus rgb gaming mause tapete anime tapetes gamer pc xxl bonito almofadas grande jogo teclado tapete backlight mousepad",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Asus Style"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005008960508924.html",
  "brand": "Asus Style",
  "inStock": true,
  "stockCount": 229512
},
{
  "id": 272,
  "name": "Attack Shark X11 Tri-Mode Gaming",
  "category": "Teclados e Ratos",
  "price": "61,66 €",
  "oldPrice": "77,07 €",
  "rating": 4.7,
  "img": "/products/272.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S875873a64c19424484b2f1e6198a9c1em.png",
    "https://ae01.alicdn.com/kf/S3ee2b891b8b94f91b6cdc8940651ad68r.png",
    "https://ae01.alicdn.com/kf/S50a9461e9a4c4840979cb98656d26864Q.png",
    "https://ae01.alicdn.com/kf/Sc7ca81fa560b4d1c8dd69018c72f3291d.png",
    "https://ae01.alicdn.com/kf/S52f2439fa9e64d40b592657d7c73140ei.png",
    "https://ae01.alicdn.com/kf/Sdac7e2d391a24f878b0a6d6937744329U.png"
  ],
  "description": "Mouse para jogos tri-mode Attack Shark X11 com base de carregamento magnética, sensor PixArt PAW3311, 22K DPI, BT/2,4 Ghz/com fio, para PC/MAC",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Attack Shark"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005009132541297.html",
  "brand": "Attack Shark",
  "inStock": true,
  "stockCount": 478
},
{
  "id": 273,
  "name": "Attack Shark X11 PAW3311 Wireless",
  "category": "Teclados e Ratos",
  "price": "60,95 €",
  "oldPrice": "76,19 €",
  "rating": 4.7,
  "img": "/products/273.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/Sf153ecfc702b4ec48fed1bee01936543Z.jpg",
    "https://ae01.alicdn.com/kf/Sd717a6419ea441c9b2cdd58074a949a4B.jpg",
    "https://ae01.alicdn.com/kf/S2f315c25ae3449b48a5110f34dc6bd7fi.jpg",
    "https://ae01.alicdn.com/kf/S039f06cb3d8c4ccfb71ff2e3dad80b0d4.jpg",
    "https://ae01.alicdn.com/kf/S17140bbce88c4894857b729d8381dc288.jpg",
    "https://ae01.alicdn.com/kf/S3ea677a95ec84ffcb957b525efbe40fdL.jpg"
  ],
  "description": "Mouse Bluetooth sem fio Attack Shark X11 PAW3311, mouse para jogos para PC 2.4G 400IPS RGB",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Attack Shark"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005009389582350.html",
  "brand": "Attack Shark",
  "inStock": true,
  "stockCount": 264
},
{
  "id": 274,
  "name": "Attack Shark R5 Ultra Fiber Wireless",
  "category": "Teclados e Ratos",
  "price": "144,42 €",
  "oldPrice": "180,52 €",
  "rating": 4.7,
  "img": "/products/274.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S016aa58d1cd44bd6b4b7159efde5f48bC.png",
    "https://ae01.alicdn.com/kf/S3631c2de7ac54c4eaf48a895ce8fa5ceo.jpg",
    "https://ae01.alicdn.com/kf/S919cbfd64dcb45dc8c577209a0daf6edo.jpg",
    "https://ae01.alicdn.com/kf/Se873e16550924d51b2186dc03ca59c11O.jpg",
    "https://ae01.alicdn.com/kf/Sa02ea2d6ad104a75b0165b166b32096dE.jpg",
    "https://ae01.alicdn.com/kf/S71242a11575144179f1264991d835ff2U.jpg"
  ],
  "description": "Mouse para jogos sem fio ATTACK SHARK R5 ultra fibra de carbono, sensor de jogos PixArt PAW3950MAX, 42000DPI, 8000Hz, MCU Nordic 52840",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Attack Shark"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005009455340246.html",
  "brand": "Attack Shark",
  "inStock": true,
  "stockCount": 118
},
{
  "id": 275,
  "name": "Redragon M991 26000 DPI Wireless",
  "category": "Teclados e Ratos",
  "price": "79,97 €",
  "oldPrice": "99,96 €",
  "rating": 4.7,
  "img": "/products/275.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S8e911225257e4d40a7c063d59d6d0ab0s.png",
    "https://ae01.alicdn.com/kf/Se5e27a05ae5342ceaa15890125e2dad82.jpg",
    "https://ae01.alicdn.com/kf/S5764ed7dcc91420dbb2cf5c1c9f777c55.jpg",
    "https://ae01.alicdn.com/kf/S02b3605cf03d45d895181864ad3afb3aa.jpg",
    "https://ae01.alicdn.com/kf/Sc46d459e2b384465944edecf026e01bcu.jpg",
    "https://ae01.alicdn.com/kf/S21c59e62b0304bbf914ac5913f2191aec.jpg"
  ],
  "description": "Mouse para jogos sem fio Redragon M991 26000 DPI 3 modos Gamer 9 botões macro RGB Backlight Mouse, preto",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Redragon"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005009524597949.html",
  "brand": "Redragon",
  "inStock": true,
  "stockCount": 59
},
{
  "id": 276,
  "name": "Aula F108 PRO Teclado Mecânico",
  "category": "Teclados e Ratos",
  "price": "154,69 €",
  "oldPrice": "193,36 €",
  "rating": 4.7,
  "img": "/products/276.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S5383646c4ed04d9089802c42f5b60e3cF.jpg",
    "https://ae01.alicdn.com/kf/S8f5d584731ef4f6898137f36ad630546t.jpg",
    "https://ae01.alicdn.com/kf/S70cc73a515d94e708259552620a239bbj.jpg",
    "https://ae01.alicdn.com/kf/S9f84ea9835ba41459c828cd7005ed75aZ.jpg",
    "https://ae01.alicdn.com/kf/S6418778ce57b4855a832fd3a5f29b9d8I.jpg",
    "https://ae01.alicdn.com/kf/S4db0fed2e30d464bbd1530c2cad4dde92.png"
  ],
  "description": "AULA F108 PRO/F108 Teclado Mecânico Personalizado 100% Layout RGB Backlight Sem Fio Bluetooth Interruptor Hifi Teclado para Jogos",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Aula"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005009845590858.html",
  "brand": "Aula",
  "inStock": true,
  "stockCount": 144
},
{
  "id": 277,
  "name": "Redragon M693 LIT Wireless",
  "category": "Teclados e Ratos",
  "price": "42,62 €",
  "oldPrice": "53,28 €",
  "rating": 4.7,
  "img": "/products/277.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S86ed1098f9eb4e33ac757ce02af43f6cD.png",
    "https://ae01.alicdn.com/kf/S00e6f80dd8914162b5ba69de6c176aa6l.jpg",
    "https://ae01.alicdn.com/kf/S17ec6076dbaf4e4e8a3a25d40dfbe046m.jpg",
    "https://ae01.alicdn.com/kf/S1d36a6d7d83848f29a497fbf199521daP.jpg",
    "https://ae01.alicdn.com/kf/S65e34e1619b042eaa6b14103a66c267ay.jpg",
    "https://ae01.alicdn.com/kf/S2ad6951cbee248f092b964d3a1994dc8m.jpg"
  ],
  "description": "Mouse para jogos sem fio Redragon M693 LIT, mouse de 12800 DPI com conexão de 3 modos, BT e 2.4G sem fio, 7 botões macro",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Redragon"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005009884734578.html",
  "brand": "Redragon",
  "inStock": false,
  "stockCount": 0
},
{
  "id": 278,
  "name": "Attack Shark X3 Bluetooth Lightweight",
  "category": "Teclados e Ratos",
  "price": "78,07 €",
  "oldPrice": "97,59 €",
  "rating": 4.7,
  "img": "/products/278.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S04eaa7b578474799b4c3bb1cec99974cC.jpg",
    "https://ae01.alicdn.com/kf/Sf9e777d9654549b88e891704f8c2b136O.jpg",
    "https://ae01.alicdn.com/kf/Sc8a5b4970e47481ebddd85dc8b4abcded.jpg",
    "https://ae01.alicdn.com/kf/S9c3a84edb6fe4e4cb4535f5d89e16535v.jpg",
    "https://ae01.alicdn.com/kf/Sd2345c0767074acfa4a766e328a527c66.jpg",
    "https://ae01.alicdn.com/kf/S29b0e1701f0147ad91c7f3728702fcb5C.jpg"
  ],
  "description": "ATTACK SHARK X3 Mouse leve sem fio Bluetooth conexão tri-mode, PAW3395, mouse Macro Bluetooth para jogos",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Attack Shark"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005009917048224.html",
  "brand": "Attack Shark",
  "inStock": true,
  "stockCount": 214
},
{
  "id": 279,
  "name": "Aula HERO 68HE Magnetic Switch",
  "category": "Teclados e Ratos",
  "price": "143,05 €",
  "oldPrice": "178,81 €",
  "rating": 4.7,
  "img": "/products/279.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/Sa9097aa6dd2f496f918cd0bea8869dd1i.jpg",
    "https://ae01.alicdn.com/kf/S27a6ba71cbd441cc9b1831a4f10e37635.jpg",
    "https://ae01.alicdn.com/kf/S9f99155678ad403f8d1809bef5a056a3E.jpg",
    "https://ae01.alicdn.com/kf/Sa6fa20c955f34de8ab45286358f88bd8B.jpg",
    "https://ae01.alicdn.com/kf/S723071a449ae4ab6bde3830fda708598p.jpg",
    "https://ae01.alicdn.com/kf/S2a8e18b1df324834910a18d13dbd8183B.jpg"
  ],
  "description": "AULA HERO 68HE Teclado para jogos com interruptor magnético RT0.01 E-sports Personalizar RGB Teclado mecânico com fio Acessórios ergonômicos",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Aula"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005010130792831.html",
  "brand": "Aula",
  "inStock": true,
  "stockCount": 107
},
{
  "id": 280,
  "name": "Mouse Pad RGB MSI Gaming Speed",
  "category": "Mouse Pads",
  "price": "44,04 €",
  "oldPrice": "55,05 €",
  "rating": 4.7,
  "img": "/products/280.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/Sb3921e3de93c489dac8083be6bc7bfabA.jpg",
    "https://ae01.alicdn.com/kf/Sc4f7bd08119c4719b77edb97ccbc84b8f.jpg",
    "https://ae01.alicdn.com/kf/S6ccb0d45747b4cef989e936a98efaaee0.jpg",
    "https://ae01.alicdn.com/kf/S81bb01b61413436ea3f156dc4e730107s.jpg",
    "https://ae01.alicdn.com/kf/S139abab4d8dc4615bb098d38f0f60ae0t.jpg",
    "https://ae01.alicdn.com/kf/S7aeca651109345daa62344a3182558bbm.jpg"
  ],
  "description": "Grande rgb mouse pad msi gaming speed mousepad colorido led luminoso tapetes de mesa xxl gamer computador backlight teclado acessórios",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "MSI Style"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005010242416102.html",
  "brand": "MSI Style",
  "inStock": true,
  "stockCount": 248886
},
{
  "id": 281,
  "name": "Aula F99 ISO-ES QWERTY Gamer",
  "category": "Teclados e Ratos",
  "price": "153,25 €",
  "oldPrice": "191,56 €",
  "rating": 4.7,
  "img": "/products/281.png",
  "gallery": [
    "https://ae01.alicdn.com/kf/S4ed0157916a446f5bba094b3a4dea607h.png",
    "https://ae01.alicdn.com/kf/S0350ea6bee4646b6809bf2aba686997ay.png",
    "https://ae01.alicdn.com/kf/S4071b0f40c664d9daea26e920eb14769A.png",
    "https://ae01.alicdn.com/kf/S5191a6df53b34b999e317db2deb93d63A.png",
    "https://ae01.alicdn.com/kf/S0fb84ee1157f40ab9b8e99f58d2aeb244.png",
    "https://ae01.alicdn.com/kf/S1abcce4d2bc14e1786b9c448b396d182E.png"
  ],
  "description": "Teclado Gamer Espanhol AULA F99 ISO-ES 96% QWERTY com Hot-Swap, Retroiluminação RGB e Switches Lineares Pré-lubrificados",
  "badge": "Novo",
  "features": [
    {
      "name": "Marca",
      "value": "Aula"
    },
    {
      "name": "Origem",
      "value": "AliExpress"
    },
    {
      "name": "Envio",
      "value": "Para PT"
    }
  ],
  "supplier_url": "https://www.aliexpress.com/item/1005010361382463.html",
  "brand": "Aula",
  "inStock": true,
  "stockCount": 9
}
];
