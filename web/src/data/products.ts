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
  "Cadeiras Gaming"
];

export const products: Product[] = [
  // =============================================
  // PLACAS GRÁFICAS (IDs 1, 14, 21-28)
  // =============================================
  {
    "id": 1,
    "name": "MSI GeForce RTX 5090 SUPRIM X 32G",
    "category": "Placas Gráficas",
    "price": "2.199,00 €",
    "oldPrice": "2.350,00 €",
    "rating": 4.9,
    "img": "https://asset.msi.com/resize/image/global/product/product_1665543166b2a4d38c6bf8dc8e7751ea87d19c30f4.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
    "gallery": [
      "https://asset.msi.com/resize/image/global/product/product_16655431665a8ea2dc3d7c588a44d8cd3ff2d6da61.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png"
    ],
    "description": "A MSI GeForce RTX 5090 SUPRIM X traz o pináculo da arquitetura NVIDIA Blackwell. Desenhada para entusiastas que exigem o máximo de performance em 4K e 8K, com sistema de refrigeração TRI FROZR 3S em alumínio escovado, câmara de vapor e ventoinhas TORX 5.0.",
    "badge": "O Mais Rápido",
    "features": [
      { "name": "VRAM", "value": "32GB GDDR7" },
      { "name": "Cores", "value": "24576 CUDA" },
      { "name": "Clock Boost", "value": "2950 MHz" },
      { "name": "Barramento", "value": "512-bit" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/MSI-RTX-5090-SUPRIM-X",
    "brand": "MSI",
    "inStock": true,
    "stockCount": 5
  },
  {
    "id": 14,
    "name": "ASUS ROG Strix RTX 4090 OC 24GB",
    "category": "Placas Gráficas",
    "price": "1.749,00 €",
    "oldPrice": "1.999,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/A6f880ada71fd4e4aa5405d160678b418I.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Af7f0d9823019480eb9a67ad27d088618U.jpg",
      "https://ae01.alicdn.com/kf/A7406f7d60e13430999123c166d122630m.jpg"
    ],
    "description": "A flagship da geração Ada Lovelace com 24GB GDDR6X e triplo ventilador ROG. Desempenho 4K sem compromissos para jogos, renderização 3D e criação de conteúdo.",
    "badge": "4K Champion",
    "features": [
      { "name": "VRAM", "value": "24GB GDDR6X" },
      { "name": "Boost Clock", "value": "2640 MHz OC" },
      { "name": "TDP", "value": "450W" },
      { "name": "Slots", "value": "3.5 (PCIE 5.0)" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/ASUS-ROG-Strix-RTX-4090-OC",
    "brand": "ASUS",
    "inStock": true,
    "stockCount": 45
  },
  {
    "id": 21,
    "name": "NVIDIA GeForce RTX 4070 Ti Super 16GB",
    "category": "Placas Gráficas",
    "price": "829,00 €",
    "oldPrice": "899,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/S050adaac6c4f4d98a19028b2fba8cba8j.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S050adaac6c4f4d98a19028b2fba8cba8j.jpg"
    ],
    "description": "A RTX 4070 Ti Super oferece desempenho excecional em 1440p e 4K com 16GB GDDR6X e arquitetura Ada Lovelace. DLSS 3 com Frame Generation para FPS extremos.",
    "badge": "1440p Beast",
    "features": [
      { "name": "VRAM", "value": "16GB GDDR6X" },
      { "name": "Cores CUDA", "value": "8448" },
      { "name": "Boost Clock", "value": "2610 MHz" },
      { "name": "TDP", "value": "285W" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/RTX-4070-Ti-Super",
    "brand": "NVIDIA",
    "inStock": true,
    "stockCount": 15
  },
  {
    "id": 22,
    "name": "NVIDIA GeForce RTX 4060 Ti 8GB",
    "category": "Placas Gráficas",
    "price": "429,00 €",
    "oldPrice": "479,00 €",
    "rating": 4.6,
    "img": "https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4060-4060ti/geforce-rtx-4060-ti-hero-100vp-d.jpg",
    "gallery": [
      "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Cases/base-4000d-airflow-config/Gallery/4000D_AF_BLACK_01.webp"
    ],
    "description": "Excelente desempenho 1080p e 1440p com suporte DLSS 3 e ray tracing. Eficiente em consumo energético com apenas 160W TDP, ideal para builds compactas.",
    "badge": "1080p King",
    "features": [
      { "name": "VRAM", "value": "8GB GDDR6" },
      { "name": "Cores CUDA", "value": "4352" },
      { "name": "Boost Clock", "value": "2535 MHz" },
      { "name": "TDP", "value": "160W" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/RTX-4060-Ti",
    "brand": "NVIDIA",
    "inStock": true,
    "stockCount": 28
  },
  {
    "id": 23,
    "name": "NVIDIA GeForce RTX 4060 8GB",
    "category": "Placas Gráficas",
    "price": "309,00 €",
    "rating": 4.5,
    "img": "https://ae01.alicdn.com/kf/Acd527f24f32f45158de3350843064971J.png",
    "gallery": [
      "https://assets.micron.com/adobe/assets/urn:aaid:aem:7f5fc122-7774-417e-9806-59baf7d2569f/renditions/transformpng-1024-1024.png/as/crucial-p3-plus-ssd-flat-front-image.png"
    ],
    "description": "A placa gráfica mais acessível da série RTX 40 com 8GB GDDR6 e suporte completo a DLSS 3. Perfeita para gaming 1080p com ray tracing ativado.",
    "badge": "Melhor Custo-Benefício",
    "features": [
      { "name": "VRAM", "value": "8GB GDDR6" },
      { "name": "Cores CUDA", "value": "3072" },
      { "name": "Boost Clock", "value": "2460 MHz" },
      { "name": "TDP", "value": "115W" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/RTX-4060",
    "brand": "NVIDIA",
    "inStock": true,
    "stockCount": 3
  },
  {
    "id": 24,
    "name": "AMD Radeon RX 7900 XTX 24GB",
    "category": "Placas Gráficas",
    "price": "899,00 €",
    "oldPrice": "1.049,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/Sd85ec321ac7c4487a5b0249035d7de13y.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Sd85ec321ac7c4487a5b0249035d7de13y.jpg"
    ],
    "description": "A flagship da AMD com 24GB GDDR6 e arquitetura RDNA 3. Performance de topo em 4K com excelente rasterização e suporte FSR 3 com Frame Generation.",
    "badge": "AMD Flagship",
    "features": [
      { "name": "VRAM", "value": "24GB GDDR6" },
      { "name": "Stream Processors", "value": "6144" },
      { "name": "Game Clock", "value": "2300 MHz" },
      { "name": "TDP", "value": "355W" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/RX-7900-XTX",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 37
  },
  {
    "id": 25,
    "name": "AMD Radeon RX 7800 XT 16GB",
    "category": "Placas Gráficas",
    "price": "499,00 €",
    "oldPrice": "549,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/S85beb4c564e84bddac8f92d2d3c6f3bab.jpg",
    "gallery": [
      "https://lian-li.com/wp-content/uploads/2021/12/evo-600-000.jpg"
    ],
    "description": "16GB de VRAM GDDR6 para gaming 1440p sem compromissos. Arquitetura RDNA 3 com excelente eficiência energética e suporte FSR 3.",
    "badge": "1440p AMD",
    "features": [
      { "name": "VRAM", "value": "16GB GDDR6" },
      { "name": "Stream Processors", "value": "3840" },
      { "name": "Game Clock", "value": "2124 MHz" },
      { "name": "TDP", "value": "263W" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/RX-7800-XT",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 18
  },
  {
    "id": 26,
    "name": "AMD Radeon RX 7600 8GB",
    "category": "Placas Gráficas",
    "price": "269,00 €",
    "oldPrice": "299,00 €",
    "rating": 4.4,
    "img": "https://ae01.alicdn.com/kf/S17e109f2c90c4c9cbdadc4abb65c690cb.jpg",
    "gallery": [
      "https://images.evga.com/products/gallery/png/220-G7-1000-X1_XL_1.png"
    ],
    "description": "Entrada no gaming 1080p com arquitetura RDNA 3. Suporte FSR 3 e excelente consumo energético com apenas 165W, perfeita para builds budget.",
    "badge": "Budget Pick",
    "features": [
      { "name": "VRAM", "value": "8GB GDDR6" },
      { "name": "Stream Processors", "value": "2048" },
      { "name": "Game Clock", "value": "2250 MHz" },
      { "name": "TDP", "value": "165W" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/RX-7600",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 7
  },
  {
    "id": 27,
    "name": "NVIDIA GeForce RTX 4070 Super 12GB",
    "category": "Placas Gráficas",
    "price": "619,00 €",
    "oldPrice": "679,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/S71f1adb929f84a86bf0542f410f3bcd25.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S71f1adb929f84a86bf0542f410f3bcd25.jpg"
    ],
    "description": "O sweet spot da geração Ada Lovelace com 12GB GDDR6X. Performance 1440p excecional com DLSS 3, ray tracing e eficiência de 220W TDP.",
    "badge": "Sweet Spot",
    "features": [
      { "name": "VRAM", "value": "12GB GDDR6X" },
      { "name": "Cores CUDA", "value": "7168" },
      { "name": "Boost Clock", "value": "2475 MHz" },
      { "name": "TDP", "value": "220W" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/RTX-4070-Super",
    "brand": "NVIDIA",
    "inStock": true,
    "stockCount": 50
  },
  {
    "id": 28,
    "name": "NVIDIA GeForce RTX 3060 12GB",
    "category": "Placas Gráficas",
    "price": "239,00 €",
    "rating": 4.4,
    "img": "https://ae01.alicdn.com/kf/S1b0db5f2eb5d4e47851a3b8e71eaf63eq.jpg",
    "gallery": [
      "https://cdn.deepcool.com/public/ProductFile/DEEPCOOL/Cooling/CPUAirCoolers/AK620_DIGITAL/Gallery/800X800/01.jpg"
    ],
    "description": "12GB de VRAM GDDR6 a um preço imbatível. Ainda relevante para gaming 1080p com ray tracing básico e DLSS 2. Excelente para builds económicas.",
    "badge": "Económica",
    "features": [
      { "name": "VRAM", "value": "12GB GDDR6" },
      { "name": "Cores CUDA", "value": "3584" },
      { "name": "Boost Clock", "value": "1777 MHz" },
      { "name": "TDP", "value": "170W" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/RTX-3060-12GB",
    "brand": "NVIDIA",
    "inStock": true,
    "stockCount": 50
  },

  // =============================================
  // PROCESSADORES (IDs 2, 13, 29-36)
  // =============================================
  {
    "id": 2,
    "name": "AMD Ryzen 7 7800X3D",
    "category": "Processadores",
    "price": "338,45 €",
    "oldPrice": "399,00 €",
    "rating": 5,
    "img": "https://ae01.alicdn.com/kf/S07b70ca7799543a5b8a8dc8f5db63cf69.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S07b70ca7799543a5b8a8dc8f5db63cf69.jpg"
    ],
    "description": "O processador gaming mais rápido do mundo com tecnologia AMD 3D V-Cache para performance extrema em jogos. Plataforma AM5 com suporte DDR5 e PCIe 5.0.",
    "badge": "Top Vendas",
    "features": [
      { "name": "Cache L3", "value": "96MB 3D V-Cache" },
      { "name": "Cores/Threads", "value": "8C / 16T" },
      { "name": "Clock Boost", "value": "5.0 GHz" },
      { "name": "Socket", "value": "AM5" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/AMD-Ryzen-7-7800X3D",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 3
  },
  {
    "id": 13,
    "name": "Intel Core i9-14900K",
    "category": "Processadores",
    "price": "489,00 €",
    "oldPrice": "549,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/S27b0d840e3984c95946b64e2931f3d13w.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S61c4fbbd09ba44cf960f63e7408cd438h.jpg",
      "https://ae01.alicdn.com/kf/S36606863ff4d46abbaf03a3fefd3eac48.jpg"
    ],
    "description": "24 núcleos (8P + 16E), 32 threads e velocidade boost até 6.0 GHz. O processador desktop mais rápido da Intel para workloads extremos, streaming e gaming competitivo.",
    "badge": "Performance Peak",
    "features": [
      { "name": "Núcleos", "value": "24 (8P + 16E)" },
      { "name": "Boost Clock", "value": "6.0 GHz" },
      { "name": "Socket", "value": "LGA1700" },
      { "name": "TDP", "value": "125W (Base)" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Intel-Core-i9-14900K",
    "brand": "Intel",
    "inStock": true,
    "stockCount": 19
  },
  {
    "id": 29,
    "name": "AMD Ryzen 5 7600X",
    "category": "Processadores",
    "price": "199,00 €",
    "oldPrice": "249,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/Sae8958cccc4b48cba872f2083c9ead22L.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S0d0fcd8520494a3181d55edadb8a7b6at.jpg"
    ],
    "description": "6 cores e 12 threads Zen 4 com boost até 5.3 GHz. Entrada na plataforma AM5 com suporte DDR5 e PCIe 5.0 a um preço acessível.",
    "badge": "Melhor Valor AM5",
    "features": [
      { "name": "Cores/Threads", "value": "6C / 12T" },
      { "name": "Boost Clock", "value": "5.3 GHz" },
      { "name": "Cache L3", "value": "32MB" },
      { "name": "Socket", "value": "AM5" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Ryzen-5-7600X",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 25
  },
  {
    "id": 30,
    "name": "AMD Ryzen 9 7950X3D",
    "category": "Processadores",
    "price": "549,00 €",
    "oldPrice": "649,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/S700c05dab59c420788fa3279e4e82ab5n.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S3192ed52f44347d28b7c8b8178aa1535G.jpg"
    ],
    "description": "16 cores Zen 4 com 3D V-Cache de 128MB para o máximo em gaming e produtividade. O processador definitivo para quem não faz compromissos.",
    "badge": "Enthusiast",
    "features": [
      { "name": "Cores/Threads", "value": "16C / 32T" },
      { "name": "Boost Clock", "value": "5.7 GHz" },
      { "name": "Cache L3", "value": "128MB 3D V-Cache" },
      { "name": "Socket", "value": "AM5" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Ryzen-9-7950X3D",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 36
  },
  {
    "id": 31,
    "name": "Intel Core i5-14600K",
    "category": "Processadores",
    "price": "289,00 €",
    "oldPrice": "329,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/S93a4ebb0e0cb4f5cb24d3e64ef84a53db.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S398166ad88d748beb18c9699e1993bb7w.jpg"
    ],
    "description": "14 cores (6P + 8E) e 20 threads com boost até 5.3 GHz. O mid-range da Intel com performance gaming excelente e overclocking desbloqueado.",
    "badge": "Mid-Range Intel",
    "features": [
      { "name": "Núcleos", "value": "14 (6P + 8E)" },
      { "name": "Boost Clock", "value": "5.3 GHz" },
      { "name": "Cache L3", "value": "24MB" },
      { "name": "Socket", "value": "LGA1700" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/i5-14600K",
    "brand": "Intel",
    "inStock": true,
    "stockCount": 21
  },
  {
    "id": 32,
    "name": "Intel Core i7-14700K",
    "category": "Processadores",
    "price": "389,00 €",
    "oldPrice": "449,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/Sc9ee44bfbe2e44d38e925d948916ec84o.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S321c130788b14a53ac8610e9a7553954a.jpg"
    ],
    "description": "20 cores (8P + 12E) e 28 threads com boost até 5.6 GHz. Multitasking extremo para gaming, streaming e criação de conteúdo em simultâneo.",
    "badge": "Produtividade",
    "features": [
      { "name": "Núcleos", "value": "20 (8P + 12E)" },
      { "name": "Boost Clock", "value": "5.6 GHz" },
      { "name": "Cache L3", "value": "33MB" },
      { "name": "Socket", "value": "LGA1700" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/i7-14700K",
    "brand": "Intel",
    "inStock": true,
    "stockCount": 20
  },
  {
    "id": 33,
    "name": "AMD Ryzen 5 5600X",
    "category": "Processadores",
    "price": "129,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/Sfc4d0ac50cd540b6a3bd02032ac6c4f7f.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Sc72cbc783ef1437ba8d8853d23d01a31k.jpg"
    ],
    "description": "6 cores Zen 3 que ainda dão conta de qualquer jogo atual. Excelente custo-benefício para upgrades em plataforma AM4 já existente.",
    "badge": "Budget King",
    "features": [
      { "name": "Cores/Threads", "value": "6C / 12T" },
      { "name": "Boost Clock", "value": "4.6 GHz" },
      { "name": "Cache L3", "value": "32MB" },
      { "name": "Socket", "value": "AM4" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Ryzen-5-5600X",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 33
  },
  {
    "id": 34,
    "name": "Intel Core i5-13400F",
    "category": "Processadores",
    "price": "179,00 €",
    "oldPrice": "209,00 €",
    "rating": 4.6,
    "img": "https://ae01.alicdn.com/kf/S5adb6bdfc0894c36a5c7214a0cbbb4f9I.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Sa52788b9d42746ecaffa2e6f5641045fm.jpg"
    ],
    "description": "10 cores (6P + 4E) sem gráficos integrados para quem usa placa gráfica dedicada. Excelente performance por euro na plataforma LGA1700.",
    "badge": "Valor Imbatível",
    "features": [
      { "name": "Núcleos", "value": "10 (6P + 4E)" },
      { "name": "Boost Clock", "value": "4.6 GHz" },
      { "name": "Cache L3", "value": "20MB" },
      { "name": "Socket", "value": "LGA1700" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/i5-13400F",
    "brand": "Intel",
    "inStock": true,
    "stockCount": 32
  },
  {
    "id": 35,
    "name": "AMD Ryzen 9 7900X",
    "category": "Processadores",
    "price": "379,00 €",
    "oldPrice": "449,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/S3136044a78284c93b35cc362fec337b3R.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S88bfcfb244414f2ea70967f3add907d8l.jpg"
    ],
    "description": "12 cores Zen 4 com boost até 5.6 GHz. Potência bruta para renderização, compilação e gaming de alta performance na plataforma AM5.",
    "badge": "Workstation",
    "features": [
      { "name": "Cores/Threads", "value": "12C / 24T" },
      { "name": "Boost Clock", "value": "5.6 GHz" },
      { "name": "Cache L3", "value": "64MB" },
      { "name": "Socket", "value": "AM5" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Ryzen-9-7900X",
    "brand": "AMD",
    "inStock": false,
    "stockCount": 0
  },
  {
    "id": 36,
    "name": "Intel Core i3-12100F",
    "category": "Processadores",
    "price": "89,00 €",
    "rating": 4.5,
    "img": "https://ae01.alicdn.com/kf/S199979d21ef54b629421756c4c89dfb8n.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S981e6f47735746d39bc5a13f30eb3368J.jpg"
    ],
    "description": "4 cores e 8 threads Alder Lake a um preço de entrada. Surpreendente em gaming 1080p quando combinado com uma placa gráfica dedicada.",
    "badge": "Entry Level",
    "features": [
      { "name": "Cores/Threads", "value": "4C / 8T" },
      { "name": "Boost Clock", "value": "4.3 GHz" },
      { "name": "Cache L3", "value": "12MB" },
      { "name": "Socket", "value": "LGA1700" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/i3-12100F",
    "brand": "Intel",
    "inStock": true,
    "stockCount": 20
  },

  // =============================================
  // MOTHERBOARDS (IDs 9, 15, 37-44)
  // =============================================
  {
    "id": 9,
    "name": "MSI MAG B650 Tomahawk WiFi",
    "category": "Motherboards",
    "price": "198,00 €",
    "oldPrice": "229,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/17-151-272-01.jpg",
    "gallery": [
      "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Power-Supply-Units/base-rmx-2024-config/gallery/black/850/RM850x_2024_01.webp"
    ],
    "description": "A base sólida para o teu setup AM5. VRM robusto de 14+2+1 fases, suporte DDR5 até 6400MHz e WiFi 6E integrado para conectividade sem fios de próxima geração.",
    "badge": "Base Sólida",
    "features": [
      { "name": "Socket", "value": "AM5 (Ryzen 7000)" },
      { "name": "Fases VRM", "value": "14+2+1" },
      { "name": "WiFi", "value": "6E (2.4GHz/5GHz/6GHz)" },
      { "name": "PCIe", "value": "5.0 x16" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/MSI-MAG-B650-Tomahawk-WiFi",
    "brand": "MSI",
    "inStock": true,
    "stockCount": 20
  },
  {
    "id": 15,
    "name": "ASUS ROG Maximus Z790 Hero",
    "category": "Motherboards",
    "price": "599,00 €",
    "oldPrice": "699,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/Sb5c2924e298342ef975884d1a10a6961x.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S28f88bd5d5674915bfeac029a00ae1f8i.jpg",
      "https://ae01.alicdn.com/kf/S789fcc4bdb894d63846a089ee8751b30S.jpg"
    ],
    "description": "A motherboard definitiva para Intel 13ª/14ª geração com 20+1 fases de energia, DDR5-7800+ OC e PCIe 5.0 x16 para builds de alto desempenho sem compromisso.",
    "badge": "Hero Series",
    "features": [
      { "name": "Socket", "value": "LGA1700" },
      { "name": "Fases VRM", "value": "20+1+2" },
      { "name": "WiFi", "value": "6E Tri-Band" },
      { "name": "DDR5", "value": "Até 7800+ MHz OC" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/ASUS-ROG-Maximus-Z790-Hero",
    "brand": "ASUS",
    "inStock": false,
    "stockCount": 0
  },
  {
    "id": 37,
    "name": "MSI MPG B760M Edge WiFi",
    "category": "Motherboards",
    "price": "169,00 €",
    "oldPrice": "199,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-144-648-10.png",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/A4YUD2202020IF4KT28.jpg"
    ],
    "description": "Micro-ATX compacta para Intel 12ª/13ª/14ª geração com WiFi 6E e VRM de 12+1+1 fases. Ideal para builds compactas sem sacrificar funcionalidades.",
    "badge": "Compacta",
    "features": [
      { "name": "Socket", "value": "LGA1700" },
      { "name": "Formato", "value": "Micro-ATX" },
      { "name": "WiFi", "value": "6E integrado" },
      { "name": "M.2", "value": "3 slots (1× PCIe 4.0)" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/MSI-MPG-B760M",
    "brand": "MSI",
    "inStock": true,
    "stockCount": 15
  },
  {
    "id": 38,
    "name": "ASUS TUF Gaming B650-PLUS WiFi",
    "category": "Motherboards",
    "price": "189,00 €",
    "oldPrice": "219,00 €",
    "rating": 4.7,
    "img": "https://dlcdnwebimgs.asus.com/gain/d52e1dd0-6b0b-4c62-a625-01c5e41a8b07/w800",
    "gallery": [
      "https://dlcdnwebimgs.asus.com/gain/d52e1dd0-6b0b-4c62-a625-01c5e41a8b07/w800"
    ],
    "description": "Robustez TUF Gaming com VRM de 12+2 fases para Ryzen 7000. PCIe 5.0, DDR5 e WiFi 6 com a fiabilidade militar certificada da ASUS.",
    "badge": "TUF Durável",
    "features": [
      { "name": "Socket", "value": "AM5" },
      { "name": "Fases VRM", "value": "12+2" },
      { "name": "WiFi", "value": "6 integrado" },
      { "name": "PCIe", "value": "5.0 x16" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/ASUS-TUF-B650-PLUS",
    "brand": "ASUS",
    "inStock": false,
    "stockCount": 0
  },
  {
    "id": 39,
    "name": "Gigabyte B550 Aorus Pro V2",
    "category": "Motherboards",
    "price": "139,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-145-271-V01.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/17-151-195-S09.jpg"
    ],
    "description": "Plataforma AM4 madura e estável com VRM digital de 12+2 fases. Suporte DDR4 até 5400MHz OC e PCIe 4.0 x16 para Ryzen 5000.",
    "badge": "AM4 Clássica",
    "features": [
      { "name": "Socket", "value": "AM4" },
      { "name": "Fases VRM", "value": "12+2 digital" },
      { "name": "DDR4", "value": "Até 5400 MHz OC" },
      { "name": "PCIe", "value": "4.0 x16" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Gigabyte-B550-Aorus-Pro",
    "brand": "Gigabyte",
    "inStock": true,
    "stockCount": 5
  },
  {
    "id": 40,
    "name": "ASRock B660M Steel Legend",
    "category": "Motherboards",
    "price": "119,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/17-701-018-04.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/13-162-228-04.png"
    ],
    "description": "Micro-ATX acessível para Intel 12ª/13ª geração com design Steel Legend icónico. VRM de 8 fases, 2 slots M.2 e saída HDMI 2.1.",
    "badge": "Budget Intel",
    "features": [
      { "name": "Socket", "value": "LGA1700" },
      { "name": "Formato", "value": "Micro-ATX" },
      { "name": "DDR4", "value": "Até 4800 MHz OC" },
      { "name": "M.2", "value": "2 slots PCIe 4.0" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/ASRock-B660M",
    "brand": "ASRock",
    "inStock": false,
    "stockCount": 0
  },
  {
    "id": 41,
    "name": "ASUS ROG Strix X670E-E Gaming WiFi",
    "category": "Motherboards",
    "price": "429,00 €",
    "oldPrice": "499,00 €",
    "rating": 4.8,
    "img": "https://dlcdnwebimgs.asus.com/gain/BADFA920-702B-451B-9592-8279ACD6857B/w800",
    "gallery": [
      "https://dlcdnwebimgs.asus.com/gain/BADFA920-702B-451B-9592-8279ACD6857B/w800"
    ],
    "description": "Topo de gama AM5 com PCIe 5.0 duplo (GPU + M.2), VRM de 18+2 fases e WiFi 6E. Construída para overclockers e entusiastas exigentes.",
    "badge": "ROG Premium",
    "features": [
      { "name": "Socket", "value": "AM5" },
      { "name": "Fases VRM", "value": "18+2" },
      { "name": "PCIe 5.0", "value": "x16 + M.2" },
      { "name": "WiFi", "value": "6E + BT 5.2" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/ROG-Strix-X670E-E",
    "brand": "ASUS",
    "inStock": true,
    "stockCount": 11
  },
  {
    "id": 42,
    "name": "MSI MEG Z790 ACE",
    "category": "Motherboards",
    "price": "549,00 €",
    "oldPrice": "649,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-144-562-10.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/13-119-681-01.jpg"
    ],
    "description": "Motherboard de elite para Intel 14ª geração com VRM de 24+1+2 fases, DDR5-7800+ OC e design premium em preto e dourado. Feita para overclock extremo.",
    "badge": "OC Extreme",
    "features": [
      { "name": "Socket", "value": "LGA1700" },
      { "name": "Fases VRM", "value": "24+1+2 (105A)" },
      { "name": "DDR5", "value": "Até 7800+ MHz" },
      { "name": "Thunderbolt", "value": "4 (40 Gbps)" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/MSI-MEG-Z790-ACE",
    "brand": "MSI",
    "inStock": true,
    "stockCount": 7
  },
  {
    "id": 43,
    "name": "Gigabyte X670E Aorus Master",
    "category": "Motherboards",
    "price": "389,00 €",
    "oldPrice": "459,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/BSTDD2312190WYIKA6A.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S8817ee5c0aaa450d987cb99c8d098f4ez.jpg"
    ],
    "description": "16+2+2 fases VRM twinned com 4 slots M.2 Gen5 e conectividade completa. A Aorus Master para builds AM5 de referência com design térmico Fins-Array III.",
    "badge": "Aorus Master",
    "features": [
      { "name": "Socket", "value": "AM5" },
      { "name": "Fases VRM", "value": "16+2+2 (105A)" },
      { "name": "M.2 Gen5", "value": "4 slots" },
      { "name": "Ethernet", "value": "10GbE + 2.5GbE" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/X670E-Aorus-Master",
    "brand": "Gigabyte",
    "inStock": true,
    "stockCount": 15
  },
  {
    "id": 44,
    "name": "ASRock B760M Pro RS WiFi",
    "category": "Motherboards",
    "price": "129,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-119-702-09.png",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/13-145-545-05.jpg"
    ],
    "description": "Micro-ATX acessível com WiFi 6E para Intel 12ª/13ª/14ª geração. VRM de 8+1+1 fases, DDR5 e 2 slots M.2 a um preço competitivo.",
    "badge": "WiFi Budget",
    "features": [
      { "name": "Socket", "value": "LGA1700" },
      { "name": "Formato", "value": "Micro-ATX" },
      { "name": "WiFi", "value": "6E integrado" },
      { "name": "DDR5", "value": "Até 6800 MHz OC" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/ASRock-B760M-Pro-RS",
    "brand": "ASRock",
    "inStock": false,
    "stockCount": 0
  },

  // =============================================
  // MEMÓRIA RAM (IDs 4, 16, 45-52)
  // =============================================
  {
    "id": 4,
    "name": "Corsair Vengeance DDR5 32GB 6000MHz",
    "category": "Memória RAM",
    "price": "115,20 €",
    "oldPrice": "135,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/S169ee96d265d42e6b601ede75abad71cR.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S169ee96d265d42e6b601ede75abad71cR.jpg"
    ],
    "description": "Memória DDR5 de alta performance com perfil Intel XMP 3.0 para estabilidade e velocidade em plataformas Intel e AMD. Dissipador de calor alumínio anodizado.",
    "badge": "Essencial",
    "features": [
      { "name": "Tipo", "value": "DDR5" },
      { "name": "Frequência", "value": "6000 MT/s" },
      { "name": "Latência", "value": "CL30" },
      { "name": "Kit", "value": "2 x 16GB" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-Vengeance-DDR5-32GB-6000MHz",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 23
  },
  {
    "id": 16,
    "name": "G.Skill Trident Z5 RGB DDR5 64GB",
    "category": "Memória RAM",
    "price": "219,00 €",
    "oldPrice": "279,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/S862dad4860de4ae58ad3cadc6d41ca77u.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Sa582dda67b914af2ad781dc78e7fbdf1o.jpg",
      "https://ae01.alicdn.com/kf/S00234a54a8254d8f8f2dcd96116ff363Y.jpg"
    ],
    "description": "Kit 2×32GB DDR5-6000 CL36 com certificação Intel XMP 3.0. Iluminação RGB de alta precisão com efeito espelho no dissipador de alumínio polido.",
    "badge": "RGB Elite",
    "features": [
      { "name": "Capacidade", "value": "2 × 32GB" },
      { "name": "Frequência", "value": "DDR5-6000 CL36" },
      { "name": "Perfil", "value": "Intel XMP 3.0" },
      { "name": "Tensão", "value": "1.35V" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/G-Skill-Trident-Z5-RGB-DDR5-64GB",
    "brand": "G.Skill",
    "inStock": true,
    "stockCount": 47
  },
  {
    "id": 45,
    "name": "Kingston Fury Beast DDR5 32GB 5600MHz",
    "category": "Memória RAM",
    "price": "89,00 €",
    "oldPrice": "109,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/A4YUD2202020IF4KT28.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Sc454a756e56b4b308618b620b068cf5cN.png"
    ],
    "description": "Kit 2×16GB DDR5-5600 com dissipador de calor preto compacto. Compatível com Intel XMP 3.0 e AMD EXPO para facilidade de overclock.",
    "badge": "Preço/Performance",
    "features": [
      { "name": "Tipo", "value": "DDR5" },
      { "name": "Frequência", "value": "5600 MT/s" },
      { "name": "Latência", "value": "CL36" },
      { "name": "Kit", "value": "2 × 16GB" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Kingston-Fury-Beast-DDR5-32GB",
    "brand": "Kingston",
    "inStock": true,
    "stockCount": 25
  },
  {
    "id": 46,
    "name": "Corsair Dominator Platinum RGB DDR5 32GB 6200MHz",
    "category": "Memória RAM",
    "price": "169,00 €",
    "oldPrice": "199,00 €",
    "rating": 4.8,
    "img": "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Memory/CMT32GX5M2C4800C34/Gallery/DOMINATOR_RGB_PLATINUM_BLACK_DDR5_01.webp",
    "gallery": [
      "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Memory/CMT32GX5M2C4800C34/Gallery/DOMINATOR_RGB_PLATINUM_BLACK_DDR5_01.webp"
    ],
    "description": "A linha premium da Corsair com dissipador Dominator em alumínio anodizado e iluminação Capellix RGB de 12 LEDs. DDR5-6200 CL32 com chips Samsung selecionados.",
    "badge": "Premium",
    "features": [
      { "name": "Tipo", "value": "DDR5" },
      { "name": "Frequência", "value": "6200 MT/s" },
      { "name": "Latência", "value": "CL32" },
      { "name": "Kit", "value": "2 × 16GB" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-Dominator-Platinum-DDR5",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 5
  },
  {
    "id": 47,
    "name": "Kingston Fury Renegade DDR5 32GB 6400MHz",
    "category": "Memória RAM",
    "price": "145,00 €",
    "oldPrice": "175,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/S4ffe778a265a4e9da5f6fa192ae6cf4bV.png",
    "gallery": [
      "https://ae01.alicdn.com/kf/S4ffe778a265a4e9da5f6fa192ae6cf4bV.png"
    ],
    "description": "A topo de gama da Kingston com DDR5-6400 CL32 e dissipador de calor agressivo. Otimizada para overclocking com chips Hynix A-Die selecionados.",
    "badge": "OC Ready",
    "features": [
      { "name": "Tipo", "value": "DDR5" },
      { "name": "Frequência", "value": "6400 MT/s" },
      { "name": "Latência", "value": "CL32" },
      { "name": "Kit", "value": "2 × 16GB" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Kingston-Fury-Renegade-DDR5",
    "brand": "Kingston",
    "inStock": true,
    "stockCount": 43
  },
  {
    "id": 48,
    "name": "TeamGroup T-Force Delta RGB DDR5 32GB 6000MHz",
    "category": "Memória RAM",
    "price": "99,00 €",
    "oldPrice": "119,00 €",
    "rating": 4.5,
    "img": "https://images.teamgroupinc.com/products/memory/u-dimm/ddr5/delta-rgb/black/dual_01.jpg",
    "gallery": [
      "https://images.teamgroupinc.com/products/memory/u-dimm/ddr5/delta-rgb/black/dual_01.jpg"
    ],
    "description": "RGB difusor de zona completa com design futurista Delta. DDR5-6000 CL38 com perfis XMP 3.0 e AMD EXPO. Excelente relação qualidade/preço.",
    "badge": "RGB Acessível",
    "features": [
      { "name": "Tipo", "value": "DDR5" },
      { "name": "Frequência", "value": "6000 MT/s" },
      { "name": "Latência", "value": "CL38" },
      { "name": "Kit", "value": "2 × 16GB" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/TeamGroup-T-Force-Delta-DDR5",
    "brand": "TeamGroup",
    "inStock": true,
    "stockCount": 26
  },
  {
    "id": 49,
    "name": "Corsair Vengeance DDR5 16GB 5600MHz",
    "category": "Memória RAM",
    "price": "49,00 €",
    "rating": 4.5,
    "img": "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Memory/vengeance-ddr5-blk-config/Gallery/Vengeance-DDR5-1UP-16GB-BLACK_01.webp",
    "gallery": [
      "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Memory/vengeance-ddr5-blk-config/Gallery/Vengeance-DDR5-1UP-16GB-BLACK_01.webp"
    ],
    "description": "Kit 2×8GB DDR5-5600 para builds budget. Perfil baixo compatível com qualquer cooler e suporte XMP 3.0 para configuração simples.",
    "badge": "Entry DDR5",
    "features": [
      { "name": "Tipo", "value": "DDR5" },
      { "name": "Frequência", "value": "5600 MT/s" },
      { "name": "Latência", "value": "CL36" },
      { "name": "Kit", "value": "2 × 8GB" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-Vengeance-DDR5-16GB",
    "brand": "Corsair",
    "inStock": false,
    "stockCount": 0
  },
  {
    "id": 50,
    "name": "G.Skill Ripjaws S5 DDR5 32GB 6000MHz",
    "category": "Memória RAM",
    "price": "105,00 €",
    "oldPrice": "125,00 €",
    "rating": 4.6,
    "img": "https://www.gskill.com/_upload/images/168428819510.png",
    "gallery": [
      "https://www.gskill.com/_upload/images/168428819510.png"
    ],
    "description": "Design perfil baixo sem RGB para builds minimalistas. DDR5-6000 CL30 com excelente compatibilidade e estabilidade comprovada.",
    "badge": "Minimalista",
    "features": [
      { "name": "Tipo", "value": "DDR5" },
      { "name": "Frequência", "value": "6000 MT/s" },
      { "name": "Latência", "value": "CL30" },
      { "name": "Kit", "value": "2 × 16GB" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/G-Skill-Ripjaws-S5-DDR5",
    "brand": "G.Skill",
    "inStock": false,
    "stockCount": 0
  },
  {
    "id": 51,
    "name": "Kingston Fury Beast DDR4 32GB 3200MHz",
    "category": "Memória RAM",
    "price": "59,00 €",
    "rating": 4.6,
    "img": "https://ae01.alicdn.com/kf/H3cd821a404864cb287d5959bf547144cT.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Scd2b7aa9ea424d82a5c12bc4e61b4843s.jpg"
    ],
    "description": "Kit 2×16GB DDR4-3200 CL16 para upgrades em plataformas AM4 e LGA1700. Dissipador preto compacto com excelente compatibilidade.",
    "badge": "DDR4 Clássica",
    "features": [
      { "name": "Tipo", "value": "DDR4" },
      { "name": "Frequência", "value": "3200 MT/s" },
      { "name": "Latência", "value": "CL16" },
      { "name": "Kit", "value": "2 × 16GB" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Kingston-Fury-Beast-DDR4-32GB",
    "brand": "Kingston",
    "inStock": true,
    "stockCount": 4
  },
  {
    "id": 52,
    "name": "Crucial DDR5 32GB 4800MHz",
    "category": "Memória RAM",
    "price": "69,00 €",
    "rating": 4.4,
    "img": "https://assets.micron.com/adobe/assets/urn:aaid:aem:10781863-41f2-495a-9613-96e8f995614f/renditions/transformpng-640-640.png/as/crucial-ddr5-UDIMM-iso-3.png",
    "gallery": [
      "https://assets.micron.com/adobe/assets/urn:aaid:aem:10781863-41f2-495a-9613-96e8f995614f/renditions/transformpng-640-640.png/as/crucial-ddr5-UDIMM-iso-3.png"
    ],
    "description": "Kit 2×16GB DDR5-4800 JEDEC sem overclock. Memória fiável e acessível da Micron para quem quer DDR5 ao melhor preço sem complicações.",
    "badge": "DDR5 Básica",
    "features": [
      { "name": "Tipo", "value": "DDR5" },
      { "name": "Frequência", "value": "4800 MT/s" },
      { "name": "Latência", "value": "CL40" },
      { "name": "Kit", "value": "2 × 16GB" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Crucial-DDR5-32GB",
    "brand": "Crucial",
    "inStock": true,
    "stockCount": 15
  },

  // =============================================
  // ARMAZENAMENTO (IDs 3, 17, 53-60)
  // =============================================
  {
    "id": 3,
    "name": "Samsung 990 Pro 2TB NVMe Gen4",
    "category": "Armazenamento",
    "price": "165,00 €",
    "oldPrice": "199,90 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/S4974b91fcb304aa49a3fb76113fe8881C.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S4974b91fcb304aa49a3fb76113fe8881C.jpg"
    ],
    "description": "A velocidade máxima do PCIe 4.0 para o teu setup. Tempos de carregamento instantâneos com até 7,450 MB/s de leitura sequencial. Compatível com PS5.",
    "badge": "Promoção",
    "features": [
      { "name": "Leitura Seq.", "value": "7,450 MB/s" },
      { "name": "Escrita Seq.", "value": "6,900 MB/s" },
      { "name": "Garantia", "value": "5 Anos" },
      { "name": "Interface", "value": "PCIe 4.0 x4" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Samsung-990-Pro-2TB-NVMe",
    "brand": "Samsung",
    "inStock": true,
    "stockCount": 30
  },
  {
    "id": 17,
    "name": "WD Black SN850X 4TB NVMe Gen4",
    "category": "Armazenamento",
    "price": "349,00 €",
    "oldPrice": "419,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/S8b13fe517f9646ed8bddb567708b95d8Y.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Se03e609d6a26460696997a8f3c6f8796Z.jpg",
      "https://ae01.alicdn.com/kf/S8d0093f445e2412baea99a9b456591f7R.jpg"
    ],
    "description": "A NVMe PCIe Gen4 mais rápida do mercado consumer com 7,300 MB/s de leitura. Otimizada para PS5 e PC gaming com GameMode integrado e 4GB de cache DRAM dedicado.",
    "badge": "PS5 Ready",
    "features": [
      { "name": "Leitura Seq.", "value": "7,300 MB/s" },
      { "name": "Escrita Seq.", "value": "6,600 MB/s" },
      { "name": "Cache DRAM", "value": "4GB integrado" },
      { "name": "Interface", "value": "PCIe Gen4 x4 NVMe" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/WD-Black-SN850X-4TB-NVMe",
    "brand": "WD",
    "inStock": true,
    "stockCount": 28
  },
  {
    "id": 53,
    "name": "WD Blue SN580 1TB NVMe Gen4",
    "category": "Armazenamento",
    "price": "59,00 €",
    "oldPrice": "79,00 €",
    "rating": 4.5,
    "img": "https://assets.micron.com/adobe/assets/urn:aaid:aem:d7a2c5ff-b9ff-4a6a-b511-4481a20ebddc/renditions/transformpng-1024-1024.png/as/crucial-ssd-t500-topdown.png",
    "gallery": [
      "https://images.samsung.com/is/image/samsung/p6pim/us/mz-77e1t0b-am/gallery/us-sata-ssd-mz-77e1t0b-am-----evo-sata-iii-----inch-ssd-black-551115818?$172_172_PNG$"
    ],
    "description": "NVMe Gen4 acessível com até 4,150 MB/s de leitura. Perfeita para armazenamento de jogos e sistema operativo com fiabilidade WD comprovada.",
    "badge": "Acessível",
    "features": [
      { "name": "Leitura Seq.", "value": "4,150 MB/s" },
      { "name": "Escrita Seq.", "value": "4,150 MB/s" },
      { "name": "Garantia", "value": "5 Anos" },
      { "name": "Interface", "value": "PCIe Gen4 x4" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/WD-Blue-SN580-1TB",
    "brand": "WD",
    "inStock": true,
    "stockCount": 43
  },
  {
    "id": 54,
    "name": "Kingston NV2 2TB NVMe Gen4",
    "category": "Armazenamento",
    "price": "89,00 €",
    "oldPrice": "109,00 €",
    "rating": 4.4,
    "img": "https://ae01.alicdn.com/kf/S57f0ef96f6114e69b46daf8756ced039M.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/20-248-193-S01.jpg"
    ],
    "description": "2TB de armazenamento NVMe Gen4 ao melhor preço por gigabyte. Até 3,500 MB/s de leitura, ideal como drive secundário ou para bibliotecas de jogos grandes.",
    "badge": "Melhor €/GB",
    "features": [
      { "name": "Leitura Seq.", "value": "3,500 MB/s" },
      { "name": "Escrita Seq.", "value": "2,800 MB/s" },
      { "name": "Garantia", "value": "3 Anos" },
      { "name": "Interface", "value": "PCIe Gen4 x4" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Kingston-NV2-2TB",
    "brand": "Kingston",
    "inStock": true,
    "stockCount": 8
  },
  {
    "id": 55,
    "name": "Crucial P3 Plus 2TB NVMe Gen4",
    "category": "Armazenamento",
    "price": "99,00 €",
    "oldPrice": "129,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/35-181-400-24.png",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/35-181-400-24.png"
    ],
    "description": "NVMe Gen4 da Micron com 5,000 MB/s de leitura. Excelente desempenho para o preço com 2TB de capacidade. Software Crucial Storage Executive incluído.",
    "badge": "Custo-Benefício",
    "features": [
      { "name": "Leitura Seq.", "value": "5,000 MB/s" },
      { "name": "Escrita Seq.", "value": "4,200 MB/s" },
      { "name": "Garantia", "value": "5 Anos" },
      { "name": "Interface", "value": "PCIe Gen4 x4" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Crucial-P3-Plus-2TB",
    "brand": "Crucial",
    "inStock": true,
    "stockCount": 3
  },
  {
    "id": 56,
    "name": "Samsung 870 EVO 1TB SATA SSD",
    "category": "Armazenamento",
    "price": "79,00 €",
    "rating": 4.7,
    "img": "https://images.samsung.com/is/image/samsung/p6pim/us/mz-77e1t0b-am/gallery/us-sata-ssd-mz-77e1t0b-am-----evo-sata-iii-----inch-ssd-black-551115818?$172_172_PNG$",
    "gallery": [
      "https://images.samsung.com/is/image/samsung/p6pim/us/mz-77e1t0b-am/gallery/us-sata-ssd-mz-77e1t0b-am-----evo-sata-iii-----inch-ssd-black-551115818?$172_172_PNG$"
    ],
    "description": "O SSD SATA mais vendido do mundo com 560 MB/s de leitura. Perfeito para upgrade de portáteis e PCs mais antigos sem suporte NVMe.",
    "badge": "SATA Referência",
    "features": [
      { "name": "Leitura Seq.", "value": "560 MB/s" },
      { "name": "Escrita Seq.", "value": "530 MB/s" },
      { "name": "Garantia", "value": "5 Anos" },
      { "name": "Interface", "value": "SATA III 6 Gbps" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Samsung-870-EVO-1TB",
    "brand": "Samsung",
    "inStock": true,
    "stockCount": 36
  },
  {
    "id": 57,
    "name": "Seagate FireCuda 530 2TB NVMe Gen4",
    "category": "Armazenamento",
    "price": "179,00 €",
    "oldPrice": "219,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-248-193-S01.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/20-248-193-S01.jpg"
    ],
    "description": "NVMe Gen4 de topo com 7,300 MB/s e durabilidade extrema de 2,550 TBW. Heatsink incluído para instalação em PS5 ou PC sem preocupações térmicas.",
    "badge": "Durável",
    "features": [
      { "name": "Leitura Seq.", "value": "7,300 MB/s" },
      { "name": "Escrita Seq.", "value": "6,900 MB/s" },
      { "name": "TBW", "value": "2,550 TB" },
      { "name": "Interface", "value": "PCIe Gen4 x4" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Seagate-FireCuda-530-2TB",
    "brand": "Seagate",
    "inStock": true,
    "stockCount": 50
  },
  {
    "id": 58,
    "name": "Crucial T500 2TB NVMe Gen4",
    "category": "Armazenamento",
    "price": "149,00 €",
    "oldPrice": "179,00 €",
    "rating": 4.7,
    "img": "https://assets.micron.com/adobe/assets/urn:aaid:aem:d7a2c5ff-b9ff-4a6a-b511-4481a20ebddc/renditions/transformpng-1024-1024.png/as/crucial-ssd-t500-topdown.png",
    "gallery": [
      "https://assets.micron.com/adobe/assets/urn:aaid:aem:d7a2c5ff-b9ff-4a6a-b511-4481a20ebddc/renditions/transformpng-1024-1024.png/as/crucial-ssd-t500-topdown.png"
    ],
    "description": "A NVMe mais rápida da Crucial com 7,400 MB/s de leitura graças ao controlador Phison E26. Microsoft DirectStorage ready para gaming de próxima geração.",
    "badge": "Gen4 Máximo",
    "features": [
      { "name": "Leitura Seq.", "value": "7,400 MB/s" },
      { "name": "Escrita Seq.", "value": "7,000 MB/s" },
      { "name": "Garantia", "value": "5 Anos" },
      { "name": "Interface", "value": "PCIe Gen4 x4" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Crucial-T500-2TB",
    "brand": "Crucial",
    "inStock": true,
    "stockCount": 34
  },
  {
    "id": 59,
    "name": "SK Hynix Platinum P41 2TB NVMe Gen4",
    "category": "Armazenamento",
    "price": "159,00 €",
    "oldPrice": "189,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/S57f0ef96f6114e69b46daf8756ced039M.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S57f0ef96f6114e69b46daf8756ced039M.jpg"
    ],
    "description": "Controlador e NAND 176-layer da SK Hynix in-house. 7,000 MB/s com eficiência energética superior — ideal para portáteis e desktops.",
    "badge": "Eficiente",
    "features": [
      { "name": "Leitura Seq.", "value": "7,000 MB/s" },
      { "name": "Escrita Seq.", "value": "6,500 MB/s" },
      { "name": "TBW", "value": "1,200 TB" },
      { "name": "Interface", "value": "PCIe Gen4 x4" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/SK-Hynix-P41-2TB",
    "brand": "SK Hynix",
    "inStock": true,
    "stockCount": 44
  },
  {
    "id": 60,
    "name": "Kingston KC3000 2TB NVMe Gen4",
    "category": "Armazenamento",
    "price": "139,00 €",
    "oldPrice": "169,00 €",
    "rating": 4.6,
    "img": "https://cdn.shopify.com/s/files/1/0518/5073/9904/files/KTC-KC3000-KF3.jpg",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0518/5073/9904/files/KTC-KC3000-KF3.jpg"
    ],
    "description": "NVMe Gen4 de alto desempenho com 7,000 MB/s e dissipador de calor de grafeno. Controlador Phison E18 com NAND TLC 3D 176-layer.",
    "badge": "Alto Desempenho",
    "features": [
      { "name": "Leitura Seq.", "value": "7,000 MB/s" },
      { "name": "Escrita Seq.", "value": "7,000 MB/s" },
      { "name": "Garantia", "value": "5 Anos" },
      { "name": "Interface", "value": "PCIe Gen4 x4" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Kingston-KC3000-2TB",
    "brand": "Kingston",
    "inStock": true,
    "stockCount": 21
  },

  // =============================================
  // FONTES DE ALIMENTAÇÃO (IDs 18, 61-69)
  // =============================================
  {
    "id": 18,
    "name": "Corsair HX1500i 80+ Platinum",
    "category": "Fontes de Alimentação",
    "price": "319,00 €",
    "oldPrice": "379,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/S08b632a4ee074f00bb9a778e111ea92dg.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S83b2e9db8dd14a8eac33b3bd51f32046t.jpg",
      "https://ae01.alicdn.com/kf/Se1558c7c6cbe49aba0a3b3d825e2e422t.jpg"
    ],
    "description": "PSU modular ATX 3.0 com conector PCIe 5.0 nativo para RTX 40/50 Series. Controlo e monitorização completa via iCUE. Ventilha zero-RPM abaixo de 30% de carga.",
    "badge": "Future Ready",
    "features": [
      { "name": "Potência", "value": "1500W contínuos" },
      { "name": "Eficiência", "value": "80+ Platinum" },
      { "name": "PCIe", "value": "ATX 3.0 / 12VHPWR" },
      { "name": "Ventilha", "value": "Zero-RPM Mode" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-HX1500i-Platinum",
    "brand": "Corsair",
    "inStock": false,
    "stockCount": 0
  },
  {
    "id": 61,
    "name": "Corsair RM850x 80+ Gold (2024)",
    "category": "Fontes de Alimentação",
    "price": "129,00 €",
    "oldPrice": "149,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/A1K6S2304080POVO5F7.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/A1K6S2304080POVO5F7.jpg"
    ],
    "description": "A fonte mais popular para builds gaming com 850W 80+ Gold e cabos totalmente modulares. Modo zero-RPM e ATX 3.0 com conector 12VHPWR nativo.",
    "badge": "Best Seller",
    "features": [
      { "name": "Potência", "value": "850W contínuos" },
      { "name": "Eficiência", "value": "80+ Gold" },
      { "name": "Cabos", "value": "Full Modular ATX 3.0" },
      { "name": "Garantia", "value": "10 Anos" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-RM850x",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 45
  },
  {
    "id": 62,
    "name": "Seasonic Focus GX-750 80+ Gold",
    "category": "Fontes de Alimentação",
    "price": "99,00 €",
    "oldPrice": "119,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-162-169-05.png",
    "gallery": [
      "https://ae01.alicdn.com/kf/Sdef16c880ddc48d8a41ca0f183c12d8ao.jpg"
    ],
    "description": "Qualidade Seasonic premium com 750W 80+ Gold e cabos modulares. Ventoinha FDB de 120mm com modo Hybrid Fan Control para funcionamento silencioso.",
    "badge": "Fiável",
    "features": [
      { "name": "Potência", "value": "750W contínuos" },
      { "name": "Eficiência", "value": "80+ Gold" },
      { "name": "Cabos", "value": "Full Modular" },
      { "name": "Garantia", "value": "10 Anos" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Seasonic-Focus-GX-750",
    "brand": "Seasonic",
    "inStock": true,
    "stockCount": 21
  },
  {
    "id": 63,
    "name": "be quiet! Pure Power 12 M 850W",
    "category": "Fontes de Alimentação",
    "price": "119,00 €",
    "oldPrice": "139,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/S1326e3dd137648c7b7b03f33869ec973H.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/11-119-433-V01.jpg"
    ],
    "description": "ATX 3.0 com conector 12VHPWR nativo e 80+ Gold. Ventoinha be quiet! 120mm de alta qualidade com operação ultra-silenciosa.",
    "badge": "Silenciosa",
    "features": [
      { "name": "Potência", "value": "850W contínuos" },
      { "name": "Eficiência", "value": "80+ Gold" },
      { "name": "PCIe", "value": "ATX 3.0 / 12VHPWR" },
      { "name": "Ruído", "value": "<15.5 dBA" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/be-quiet-Pure-Power-12-M",
    "brand": "be quiet!",
    "inStock": true,
    "stockCount": 34
  },
  {
    "id": 64,
    "name": "EVGA SuperNOVA 1000 G7 80+ Gold",
    "category": "Fontes de Alimentação",
    "price": "169,00 €",
    "oldPrice": "199,00 €",
    "rating": 4.7,
    "img": "https://images.evga.com/products/gallery/png/220-G7-1000-X1_XL_1.png",
    "gallery": [
      "https://images.evga.com/products/gallery/png/220-G7-1000-X1_XL_1.png"
    ],
    "description": "1000W com certificação 80+ Gold e tamanho compacto de 150mm. Totalmente modular com proteções OVP, UVP, OCP, OPP, SCP e OTP.",
    "badge": "Compacta 1000W",
    "features": [
      { "name": "Potência", "value": "1000W contínuos" },
      { "name": "Eficiência", "value": "80+ Gold" },
      { "name": "Tamanho", "value": "150mm compacta" },
      { "name": "Garantia", "value": "10 Anos" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/EVGA-SuperNOVA-1000-G7",
    "brand": "EVGA",
    "inStock": true,
    "stockCount": 44
  },
  {
    "id": 65,
    "name": "Corsair SF750 80+ Platinum SFX",
    "category": "Fontes de Alimentação",
    "price": "159,00 €",
    "oldPrice": "179,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/S101011f7f6df4006ba69af896e76f2f8W.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Sa48e99245ac043b7963e6e9caf20f8f6B.jpg"
    ],
    "description": "A melhor fonte SFX do mercado com 750W e 80+ Platinum em formato compacto. Perfeita para builds ITX e caixas pequenas sem comprometer potência.",
    "badge": "ITX Champion",
    "features": [
      { "name": "Potência", "value": "750W contínuos" },
      { "name": "Eficiência", "value": "80+ Platinum" },
      { "name": "Formato", "value": "SFX (100mm)" },
      { "name": "Garantia", "value": "7 Anos" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-SF750",
    "brand": "Corsair",
    "inStock": false,
    "stockCount": 0
  },
  {
    "id": 66,
    "name": "MSI MEG Ai1300P PCIE5 80+ Platinum",
    "category": "Fontes de Alimentação",
    "price": "289,00 €",
    "oldPrice": "349,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/17-701-018-04.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/17-701-018-04.jpg"
    ],
    "description": "1300W ATX 3.0 com conector 12VHPWR e monitorização inteligente via MSI Center. Preparada para as GPUs mais exigentes como a RTX 4090/5090.",
    "badge": "Powerhouse",
    "features": [
      { "name": "Potência", "value": "1300W contínuos" },
      { "name": "Eficiência", "value": "80+ Platinum" },
      { "name": "PCIe", "value": "ATX 3.0 / 12VHPWR" },
      { "name": "Monitorização", "value": "MSI Center" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/MSI-MEG-Ai1300P",
    "brand": "MSI",
    "inStock": true,
    "stockCount": 4
  },
  {
    "id": 67,
    "name": "Seasonic Prime TX-1000 80+ Titanium",
    "category": "Fontes de Alimentação",
    "price": "299,00 €",
    "oldPrice": "359,00 €",
    "rating": 4.9,
    "img": "https://c1.neweggimages.com/productimage/nb640/17-151-195-S09.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S40a685b2772445f28dda7ccfe37a9fa2j.jpg"
    ],
    "description": "A eficiência máxima com certificação 80+ Titanium. 1000W de potência premium com 12 anos de garantia e componentes de grau industrial.",
    "badge": "Titanium",
    "features": [
      { "name": "Potência", "value": "1000W contínuos" },
      { "name": "Eficiência", "value": "80+ Titanium" },
      { "name": "Cabos", "value": "Full Modular" },
      { "name": "Garantia", "value": "12 Anos" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Seasonic-Prime-TX-1000",
    "brand": "Seasonic",
    "inStock": true,
    "stockCount": 3
  },
  {
    "id": 68,
    "name": "NZXT C850 80+ Gold (2024)",
    "category": "Fontes de Alimentação",
    "price": "109,00 €",
    "rating": 4.6,
    "img": "https://nzxt.com/cdn/shop/files/power_c_series_gold_c850-vents-up-right.png?v=1762528174",
    "gallery": [
      "https://nzxt.com/cdn/shop/files/power_c_series_gold_c850-vents-up-right.png?v=1762528174"
    ],
    "description": "850W modular com design minimalista NZXT. ATX 3.0 com conector 12VHPWR e cabos pretos flat para cable management limpo.",
    "badge": "Clean Build",
    "features": [
      { "name": "Potência", "value": "850W contínuos" },
      { "name": "Eficiência", "value": "80+ Gold" },
      { "name": "PCIe", "value": "ATX 3.0 / 12VHPWR" },
      { "name": "Garantia", "value": "10 Anos" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/NZXT-C850",
    "brand": "NZXT",
    "inStock": true,
    "stockCount": 38
  },
  {
    "id": 69,
    "name": "Thermaltake Toughpower GF3 850W",
    "category": "Fontes de Alimentação",
    "price": "115,00 €",
    "oldPrice": "135,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/17-153-438-13.png",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/17-153-438-13.png"
    ],
    "description": "ATX 3.0 com conector PCIe 5.0 nativo e 80+ Gold. Ventoinha hidráulica de 120mm com Smart Zero Fan para operação silenciosa em cargas baixas.",
    "badge": "ATX 3.0",
    "features": [
      { "name": "Potência", "value": "850W contínuos" },
      { "name": "Eficiência", "value": "80+ Gold" },
      { "name": "PCIe", "value": "ATX 3.0 / 12VHPWR" },
      { "name": "Garantia", "value": "10 Anos" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Thermaltake-Toughpower-GF3-850W",
    "brand": "Thermaltake",
    "inStock": true,
    "stockCount": 45
  },

  // =============================================
  // CAIXAS (IDs 8, 19, 70-77)
  // =============================================
  {
    "id": 8,
    "name": "Lian Li Lancool 216 RGB White",
    "category": "Caixas",
    "price": "95,00 €",
    "oldPrice": "115,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/A1K6S2304080POVO5F7.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/11-854-117-10.jpg"
    ],
    "description": "Fluxo de ar superior com dois ventoinhas frontais de 160mm PWM incluídos e painel lateral em vidro temperado de 4mm. Design modular e estética clean.",
    "badge": "Airflow King",
    "features": [
      { "name": "Front Fans", "value": "2 × 160mm PWM" },
      { "name": "Suporte", "value": "E-ATX" },
      { "name": "Vidro", "value": "Temperado 4mm" },
      { "name": "Cor", "value": "Branco" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Lian-Li-Lancool-216-RGB",
    "brand": "Lian Li",
    "inStock": true,
    "stockCount": 37
  },
  {
    "id": 19,
    "name": "Fractal Design Torrent RGB Black",
    "category": "Caixas",
    "price": "199,00 €",
    "oldPrice": "239,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/S2ad7bbe195ee438aad9e2b416ba90feaF.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S97f72261851940c4a52aa6dc6211a7f3Q.jpg",
      "https://ae01.alicdn.com/kf/Sb483268d8c0a4a8999bd1b0b2365cd36r.jpg"
    ],
    "description": "Engenharia de airflow extremo com 2 ventoinhas frontais de 180mm e 3 de 140mm incluídos de série. Design minimalista premium em aço com vidro temperado lateral e frontal.",
    "badge": "Airflow Master",
    "features": [
      { "name": "Front Fans", "value": "2 × 180mm RGB" },
      { "name": "Bottom Fans", "value": "3 × 140mm RGB" },
      { "name": "Vidro", "value": "Temperado (2 painéis)" },
      { "name": "Suporte", "value": "ATX / E-ATX" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Fractal-Design-Torrent-RGB",
    "brand": "Fractal Design",
    "inStock": false,
    "stockCount": 0
  },
  {
    "id": 70,
    "name": "NZXT H7 Flow RGB",
    "category": "Caixas",
    "price": "129,00 €",
    "oldPrice": "149,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/11-146-364-01.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/11-734-018-01.jpg"
    ],
    "description": "Design minimalista NZXT com painel frontal perfurado para airflow optimizado. 3 ventoinhas RGB incluídas e espaço para radiadores até 360mm.",
    "badge": "Clean Design",
    "features": [
      { "name": "Fans Incluídos", "value": "3 × 120mm F120 RGB" },
      { "name": "Suporte", "value": "ATX / E-ATX" },
      { "name": "Radiador Top", "value": "360mm" },
      { "name": "Cable Management", "value": "25mm traseiro" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/NZXT-H7-Flow",
    "brand": "NZXT",
    "inStock": true,
    "stockCount": 3
  },
  {
    "id": 71,
    "name": "Corsair 4000D Airflow",
    "category": "Caixas",
    "price": "89,00 €",
    "oldPrice": "109,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/BCKGS23071212TI5LE2.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/BCKGS23071212TI5LE2.jpg"
    ],
    "description": "A caixa mid-tower mais popular da Corsair com frente mesh de alto fluxo. 2 ventoinhas 120mm incluídas e USB-C frontal. O clássico que nunca falha.",
    "badge": "Clássico",
    "features": [
      { "name": "Fans Incluídos", "value": "2 × 120mm AirGuide" },
      { "name": "Suporte", "value": "ATX" },
      { "name": "Radiador Front", "value": "360mm" },
      { "name": "USB-C", "value": "Frontal Type-C" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-4000D-Airflow",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 3
  },
  {
    "id": 72,
    "name": "Phanteks Eclipse G360A",
    "category": "Caixas",
    "price": "79,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/11-854-117-10.jpg",
    "gallery": [
      "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Cases/base-5000d-airflow/Gallery/5000D_AF_WHITE_001.webp"
    ],
    "description": "Excelente airflow a preço budget com frente mesh ultra-fina e 3 ventoinhas D-RGB de 120mm incluídas. Vidro temperado e espaço generoso.",
    "badge": "Budget Airflow",
    "features": [
      { "name": "Fans Incluídos", "value": "3 × 120mm D-RGB" },
      { "name": "Suporte", "value": "ATX" },
      { "name": "GPU Máx.", "value": "400mm" },
      { "name": "Cooler CPU", "value": "Até 163mm" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Phanteks-Eclipse-G360A",
    "brand": "Phanteks",
    "inStock": true,
    "stockCount": 25
  },
  {
    "id": 73,
    "name": "be quiet! Pure Base 500DX",
    "category": "Caixas",
    "price": "109,00 €",
    "oldPrice": "129,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/35-181-337-01.png",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/35-181-337-01.png"
    ],
    "description": "Equilíbrio perfeito entre silêncio e airflow com mesh frontal e 3 Pure Wings 2 de 140mm. Iluminação ARGB discreta no painel frontal.",
    "badge": "Silent Airflow",
    "features": [
      { "name": "Fans Incluídos", "value": "3 × 140mm Pure Wings 2" },
      { "name": "Suporte", "value": "ATX / E-ATX" },
      { "name": "Radiador Top", "value": "360mm" },
      { "name": "Isolamento", "value": "Painéis absorventes" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/be-quiet-Pure-Base-500DX",
    "brand": "be quiet!",
    "inStock": true,
    "stockCount": 38
  },
  {
    "id": 74,
    "name": "Cooler Master HAF 700 EVO",
    "category": "Caixas",
    "price": "399,00 €",
    "oldPrice": "449,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/11-119-433-V01.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/11-119-433-V01.jpg"
    ],
    "description": "Full tower monstruosa com 200mm frontal e ecrã LCD integrado. Suporte para radiadores de 420mm e builds extremas com múltiplas GPUs.",
    "badge": "Enthusiast Tower",
    "features": [
      { "name": "Fans Incluídos", "value": "2 × 200mm + 1 × 120mm" },
      { "name": "Suporte", "value": "E-ATX / SSI-EEB" },
      { "name": "LCD Display", "value": "5.5\" integrado" },
      { "name": "GPU Máx.", "value": "490mm" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Cooler-Master-HAF-700",
    "brand": "Cooler Master",
    "inStock": false,
    "stockCount": 0
  },
  {
    "id": 75,
    "name": "HYTE Y60",
    "category": "Caixas",
    "price": "189,00 €",
    "oldPrice": "219,00 €",
    "rating": 4.8,
    "img": "https://cdn.sanity.io/images/mqc7p4g4/production/82d0db796ef76ffa52ade9761ca1bee0b4b9a9ec-3480x2460.jpg?w=3840&q=75&fit=clip&auto=format",
    "gallery": [
      "https://cdn.sanity.io/images/mqc7p4g4/production/82d0db796ef76ffa52ade9761ca1bee0b4b9a9ec-3480x2460.jpg?w=3840&q=75&fit=clip&auto=format"
    ],
    "description": "Panorâmica com 3 painéis de vidro temperado para showcase total do hardware. Design invertido inovador com GPU montada verticalmente de fábrica.",
    "badge": "Showcase",
    "features": [
      { "name": "Vidro", "value": "3 painéis temperados" },
      { "name": "Suporte", "value": "ATX / E-ATX" },
      { "name": "GPU Mount", "value": "Vertical incluído" },
      { "name": "Radiador", "value": "360mm top + 360mm lateral" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/HYTE-Y60",
    "brand": "HYTE",
    "inStock": true,
    "stockCount": 41
  },
  {
    "id": 76,
    "name": "Corsair 5000D Airflow",
    "category": "Caixas",
    "price": "149,00 €",
    "oldPrice": "169,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/AJ7WD2106261ZYD4.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/37B-000B-00421-01.jpg"
    ],
    "description": "A irmã maior da 4000D com espaço para radiadores até 420mm. Painel frontal high-airflow, cable management RapidRoute e 2 ventoinhas 120mm incluídas.",
    "badge": "Big Brother",
    "features": [
      { "name": "Fans Incluídos", "value": "2 × 120mm AirGuide" },
      { "name": "Suporte", "value": "ATX / E-ATX" },
      { "name": "Radiador Front", "value": "420mm" },
      { "name": "SSD Slots", "value": "4 × 2.5\"" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-5000D-Airflow",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 4
  },
  {
    "id": 77,
    "name": "Lian Li O11 Dynamic EVO",
    "category": "Caixas",
    "price": "159,00 €",
    "oldPrice": "179,00 €",
    "rating": 4.9,
    "img": "https://lian-li.com/wp-content/uploads/2021/12/evo-600-000.jpg",
    "gallery": [
      "https://lian-li.com/wp-content/uploads/2021/12/evo-600-000.jpg"
    ],
    "description": "A icónica O11 reinventada com suporte reversível, mesh frontal opcional e espaço para 3 radiadores de 360mm. A favorita dos custom loops.",
    "badge": "Dual Chamber",
    "features": [
      { "name": "Radiadores", "value": "3 × 360mm" },
      { "name": "Suporte", "value": "ATX / E-ATX" },
      { "name": "Layout", "value": "Dual Chamber reversível" },
      { "name": "USB-C", "value": "Type-C 3.2 Gen2" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Lian-Li-O11-Dynamic-EVO",
    "brand": "Lian Li",
    "inStock": true,
    "stockCount": 25
  },

  // =============================================
  // REFRIGERAÇÃO (IDs 10, 20, 78-85)
  // =============================================
  {
    "id": 10,
    "name": "NZXT Kraken Elite 360 RGB",
    "category": "Refrigeração",
    "price": "245,00 €",
    "oldPrice": "289,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/S1a9a9ce546ed4393b39c310f2e8966724.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S1a9a9ce546ed4393b39c310f2e8966724.jpg"
    ],
    "description": "Arrefecimento líquido AIO premium com ecrã LCD circular de 2.36\" para exibir GIFs, temperatura da CPU ou logos em tempo real. Três ventoinhas F120 RGB incluídas.",
    "badge": "Display Elite",
    "features": [
      { "name": "Radiador", "value": "360mm" },
      { "name": "Ecrã LCD", "value": "640×640px circular" },
      { "name": "Fans", "value": "3 × F120 RGB" },
      { "name": "Compatível", "value": "Intel LGA1700 / AM5" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/NZXT-Kraken-Elite-360-RGB",
    "brand": "NZXT",
    "inStock": true,
    "stockCount": 26
  },
  {
    "id": 20,
    "name": "be quiet! Dark Rock Pro 5",
    "category": "Refrigeração",
    "price": "89,90 €",
    "oldPrice": "109,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/E2166ca745c034c41be6f60c1dff8945cE.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/E0f6b29f2fd08438cb282908523ea8ad18.jpg",
      "https://ae01.alicdn.com/kf/E23440969ef5c40508546688af4fcc43c3.jpg"
    ],
    "description": "O arrefecimento a ar definitivo com capacidade TDP de 270W. Dois ventoinhas be quiet! Dark Wings 135mm incluídas e 7 heatpipes de contacto direto com o CPU.",
    "badge": "Silent Master",
    "features": [
      { "name": "Capacidade TDP", "value": "270W" },
      { "name": "Heatpipes", "value": "7 × 6mm" },
      { "name": "Fans incluídos", "value": "2 × Dark Wings 135mm" },
      { "name": "Compatível", "value": "Intel LGA1700 / AM5" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/be-quiet-Dark-Rock-Pro-5",
    "brand": "be quiet!",
    "inStock": true,
    "stockCount": 20
  },
  {
    "id": 78,
    "name": "Corsair iCUE H150i Elite LCD XT",
    "category": "Refrigeração",
    "price": "229,00 €",
    "oldPrice": "269,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/35-181-337-01.png",
    "gallery": [
      "https://ae01.alicdn.com/kf/Sa74c4fee91aa4ce1a4c0254f600b1b94o.jpg"
    ],
    "description": "AIO 360mm com ecrã IPS LCD de 2.1\" na bomba e 3 ventoinhas AF120 RGB Elite. Controlo total via iCUE com monitorização de temperaturas em tempo real.",
    "badge": "LCD Premium",
    "features": [
      { "name": "Radiador", "value": "360mm" },
      { "name": "Ecrã LCD", "value": "IPS 2.1\" (480×480)" },
      { "name": "Fans", "value": "3 × AF120 RGB Elite" },
      { "name": "Compatível", "value": "LGA1700 / AM5" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-H150i-Elite-LCD",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 12
  },
  {
    "id": 79,
    "name": "Arctic Liquid Freezer II 360 A-RGB",
    "category": "Refrigeração",
    "price": "99,00 €",
    "oldPrice": "119,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/35-186-285-02.png",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/35-186-285-02.png"
    ],
    "description": "A melhor AIO em relação preço/performance com radiador de 360mm e bomba offset integrada. VRM cooling fan na bomba para refrigeração adicional da motherboard.",
    "badge": "Melhor Valor AIO",
    "features": [
      { "name": "Radiador", "value": "360mm (38mm espessura)" },
      { "name": "Fans", "value": "3 × P12 A-RGB" },
      { "name": "Bomba", "value": "Offset com VRM fan" },
      { "name": "Garantia", "value": "6 Anos" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Arctic-Liquid-Freezer-II-360",
    "brand": "Arctic",
    "inStock": true,
    "stockCount": 18
  },
  {
    "id": 80,
    "name": "DeepCool AK620 Digital",
    "category": "Refrigeração",
    "price": "69,00 €",
    "oldPrice": "85,00 €",
    "rating": 4.7,
    "img": "https://cdn.deepcool.com/public/ProductFile/DEEPCOOL/Cooling/CPUAirCoolers/AK620_DIGITAL/Gallery/800X800/01.jpg",
    "gallery": [
      "https://cdn.deepcool.com/public/ProductFile/DEEPCOOL/Cooling/CPUAirCoolers/AK620_DIGITAL/Gallery/800X800/01.jpg"
    ],
    "description": "Dual tower air cooler com ecrã digital de temperatura integrado. 6 heatpipes de cobre e 2 ventoinhas de 120mm com 260W TDP máximo.",
    "badge": "Digital Air",
    "features": [
      { "name": "Capacidade TDP", "value": "260W" },
      { "name": "Heatpipes", "value": "6 × 6mm cobre" },
      { "name": "Display", "value": "LED temperatura" },
      { "name": "Fans", "value": "2 × FK120 120mm" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/DeepCool-AK620",
    "brand": "DeepCool",
    "inStock": true,
    "stockCount": 30
  },
  {
    "id": 81,
    "name": "Noctua NH-D15 chromax.black",
    "category": "Refrigeração",
    "price": "109,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/A6f880ada71fd4e4aa5405d160678b418I.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/A6f880ada71fd4e4aa5405d160678b418I.jpg"
    ],
    "description": "A lenda do arrefecimento a ar em versão all-black. Dual tower com 2 NF-A15 PWM de 140mm, 6 heatpipes e 250W TDP. Silêncio e performance sem rival.",
    "badge": "Lenda Air Cool",
    "features": [
      { "name": "Capacidade TDP", "value": "250W" },
      { "name": "Heatpipes", "value": "6 × 6mm niquelados" },
      { "name": "Fans", "value": "2 × NF-A15 140mm" },
      { "name": "Garantia", "value": "6 Anos" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Noctua-NH-D15-chromax",
    "brand": "Noctua",
    "inStock": true,
    "stockCount": 25
  },
  {
    "id": 82,
    "name": "Corsair A115 Air Cooler",
    "category": "Refrigeração",
    "price": "79,00 €",
    "oldPrice": "99,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/35-181-400-24.png",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/35-181-400-24.png"
    ],
    "description": "O novo air cooler premium da Corsair que rivaliza com AIOs de 240mm. Design de dupla torre com 2 ventoinhas NexFan de 140mm e 270W de capacidade.",
    "badge": "AIO Killer",
    "features": [
      { "name": "Capacidade TDP", "value": "270W" },
      { "name": "Heatpipes", "value": "7 × 6mm" },
      { "name": "Fans", "value": "2 × NexFan 140mm" },
      { "name": "Compatível", "value": "LGA1700 / AM5" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-A115",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 3
  },
  {
    "id": 83,
    "name": "EK-AIO 280 D-RGB",
    "category": "Refrigeração",
    "price": "119,00 €",
    "oldPrice": "139,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/37B-000B-00421-01.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S607f2ce7e4854d8ebb8264178a43da61K.jpg"
    ],
    "description": "AIO 280mm da marca de referência em water cooling custom. Bomba EK de alto desempenho com 2 ventoinhas EK-Vardar de 140mm D-RGB.",
    "badge": "Custom DNA",
    "features": [
      { "name": "Radiador", "value": "280mm" },
      { "name": "Bomba", "value": "EK de alto fluxo" },
      { "name": "Fans", "value": "2 × EK-Vardar 140mm" },
      { "name": "Compatível", "value": "LGA1700 / AM5" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/EK-AIO-280",
    "brand": "EK",
    "inStock": true,
    "stockCount": 5
  },
  {
    "id": 84,
    "name": "Arctic Freezer 36 A-RGB",
    "category": "Refrigeração",
    "price": "39,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/35-186-285-02.png",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/35-186-285-02.png"
    ],
    "description": "Single tower compacto com excelente custo-benefício. 4 heatpipes de contacto direto e ventoinha P12 A-RGB de 120mm. Ideal para Ryzen 5 e i5.",
    "badge": "Budget Air",
    "features": [
      { "name": "Capacidade TDP", "value": "200W" },
      { "name": "Heatpipes", "value": "4 × 6mm" },
      { "name": "Fan", "value": "P12 A-RGB 120mm" },
      { "name": "Compatível", "value": "LGA1700 / AM5" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Arctic-Freezer-36",
    "brand": "Arctic",
    "inStock": true,
    "stockCount": 5
  },
  {
    "id": 85,
    "name": "Thermalright Peerless Assassin 120 SE",
    "category": "Refrigeração",
    "price": "35,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/BCKGS23071212TI5LE2.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/BCKGS23071212TI5LE2.jpg"
    ],
    "description": "Dual tower budget que rivaliza com coolers 2× mais caros. 6 heatpipes e 2 ventoinhas TL-C12C de 120mm com 260W TDP. O segredo dos builds inteligentes.",
    "badge": "Hidden Gem",
    "features": [
      { "name": "Capacidade TDP", "value": "260W" },
      { "name": "Heatpipes", "value": "6 × 6mm niquelados" },
      { "name": "Fans", "value": "2 × TL-C12C 120mm" },
      { "name": "Compatível", "value": "LGA1700 / AM5 / AM4" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Thermalright-Peerless-Assassin-120-SE",
    "brand": "Thermalright",
    "inStock": true,
    "stockCount": 28
  },

  // =============================================
  // MONITORES (IDs 5, 86-94)
  // =============================================
  {
    "id": 5,
    "name": "ASUS ROG Swift OLED PG27AQDM",
    "category": "Monitores",
    "price": "799,00 €",
    "oldPrice": "899,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/Ae24c120588024014ab47a23ecef94a13e.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Ae24c120588024014ab47a23ecef94a13e.jpg"
    ],
    "description": "Ecrã OLED QHD de 27 polegadas com taxa de atualização de 240Hz e tempo de resposta de 0.03ms. Cores perfeitas e contraste infinito com certificação VESA DisplayHDR True Black 400.",
    "badge": "OLED Elite",
    "features": [
      { "name": "Taxa", "value": "240Hz" },
      { "name": "Resposta GTG", "value": "0.03ms" },
      { "name": "Painel", "value": "OLED QHD" },
      { "name": "HDR", "value": "True Black 400" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/ASUS-ROG-Swift-OLED-PG27AQDM",
    "brand": "ASUS",
    "inStock": true,
    "stockCount": 5
  },
  {
    "id": 86,
    "name": "LG 27GP850-B UltraGear 165Hz",
    "category": "Monitores",
    "price": "329,00 €",
    "oldPrice": "399,00 €",
    "rating": 4.7,
    "img": "https://www.lg.com/content/dam/channel/wcms/ca_en/images/desktop-monitors/27gp850-b_aus_enci_ca_en_c/gallery/DZ_01.jpg",
    "gallery": [
      "https://www.lg.com/content/dam/channel/wcms/ca_en/images/desktop-monitors/27gp850-b_aus_enci_ca_en_c/gallery/DZ_01.jpg"
    ],
    "description": "Monitor IPS QHD de 27\" com 165Hz (OC 180Hz) e 1ms GtG. Cobertura DCI-P3 98% e VESA DisplayHDR 400 para cores vivas e gaming responsivo.",
    "badge": "IPS Gaming",
    "features": [
      { "name": "Painel", "value": "Nano IPS QHD" },
      { "name": "Taxa", "value": "165Hz (OC 180Hz)" },
      { "name": "Resposta", "value": "1ms GtG" },
      { "name": "HDR", "value": "DisplayHDR 400" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/LG-27GP850-B",
    "brand": "LG",
    "inStock": true,
    "stockCount": 4
  },
  {
    "id": 87,
    "name": "Dell S2722DGM 165Hz Curved",
    "category": "Monitores",
    "price": "249,00 €",
    "oldPrice": "299,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/AKVHD21080615GNM1.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/AKVHD21080615GNM1.jpg"
    ],
    "description": "Monitor VA curvo de 27\" com 1440p e 165Hz. Curvatura 1500R imersiva com contraste nativo superior a 3000:1 e FreeSync Premium.",
    "badge": "Curvo Acessível",
    "features": [
      { "name": "Painel", "value": "VA Curvo 1500R" },
      { "name": "Taxa", "value": "165Hz" },
      { "name": "Resposta", "value": "1ms MPRT" },
      { "name": "Resolução", "value": "2560×1440 QHD" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Dell-S2722DGM",
    "brand": "Dell",
    "inStock": true,
    "stockCount": 37
  },
  {
    "id": 88,
    "name": "Samsung Odyssey G7 32\" 240Hz",
    "category": "Monitores",
    "price": "549,00 €",
    "oldPrice": "649,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/24-027-066-V15.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/24-027-066-V15.jpg"
    ],
    "description": "VA curvo 1000R de 32\" com QHD e 240Hz. QLED com cobertura de cor de 125% sRGB e DisplayHDR 600 para uma experiência de jogo envolvente.",
    "badge": "240Hz Curvo",
    "features": [
      { "name": "Painel", "value": "VA QLED 1000R" },
      { "name": "Taxa", "value": "240Hz" },
      { "name": "Resposta", "value": "1ms GtG" },
      { "name": "HDR", "value": "DisplayHDR 600" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Samsung-Odyssey-G7-32",
    "brand": "Samsung",
    "inStock": true,
    "stockCount": 10
  },
  {
    "id": 89,
    "name": "ASUS TUF Gaming VG27AQ1A",
    "category": "Monitores",
    "price": "289,00 €",
    "rating": 4.6,
    "img": "https://dlcdnwebimgs.asus.com/gain/d452f143-b494-41d0-9e4b-6d7ae0ff6291/w692",
    "gallery": [
      "https://dlcdnwebimgs.asus.com/gain/d452f143-b494-41d0-9e4b-6d7ae0ff6291/w692"
    ],
    "description": "IPS 27\" QHD com 170Hz e ELMB Sync para clareza de movimento superior. Certificação G-SYNC Compatible e DisplayHDR 400.",
    "badge": "TUF Fiável",
    "features": [
      { "name": "Painel", "value": "IPS QHD 27\"" },
      { "name": "Taxa", "value": "170Hz" },
      { "name": "Resposta", "value": "1ms MPRT" },
      { "name": "Sync", "value": "G-SYNC Compatible" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/ASUS-TUF-VG27AQ1A",
    "brand": "ASUS",
    "inStock": true,
    "stockCount": 39
  },
  {
    "id": 90,
    "name": "BenQ MOBIUZ EX2710Q 165Hz",
    "category": "Monitores",
    "price": "399,00 €",
    "oldPrice": "449,00 €",
    "rating": 4.7,
    "img": "https://image.benq.com/is/image/benqco/ex2710q-2product?$ResponsivePreset$",
    "gallery": [
      "https://image.benq.com/is/image/benqco/ex2710q-2product?$ResponsivePreset$"
    ],
    "description": "IPS 27\" QHD com 165Hz e sistema de som treVolo 2.1 integrado com subwoofer. HDRi inteligente que ajusta automaticamente o HDR ao ambiente.",
    "badge": "Som Integrado",
    "features": [
      { "name": "Painel", "value": "IPS QHD 27\"" },
      { "name": "Taxa", "value": "165Hz" },
      { "name": "Áudio", "value": "treVolo 2.1 (5W sub)" },
      { "name": "HDR", "value": "DisplayHDR 400" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/BenQ-MOBIUZ-EX2710Q",
    "brand": "BenQ",
    "inStock": true,
    "stockCount": 41
  },
  {
    "id": 91,
    "name": "LG UltraGear 27GR95QE OLED 240Hz",
    "category": "Monitores",
    "price": "749,00 €",
    "oldPrice": "849,00 €",
    "rating": 4.9,
    "img": "https://c1.neweggimages.com/productimage/nb640/24-026-351-18.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/24-026-351-18.jpg"
    ],
    "description": "OLED QHD 27\" com 240Hz e tempo de resposta de 0.03ms. Anti-glare low reflection coating e cobertura DCI-P3 98.5% para o gaming definitivo.",
    "badge": "OLED Gaming",
    "features": [
      { "name": "Painel", "value": "OLED QHD 27\"" },
      { "name": "Taxa", "value": "240Hz" },
      { "name": "Resposta", "value": "0.03ms GtG" },
      { "name": "Cor", "value": "DCI-P3 98.5%" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/LG-27GR95QE-OLED",
    "brand": "LG",
    "inStock": true,
    "stockCount": 42
  },
  {
    "id": 92,
    "name": "Gigabyte M27Q X 240Hz",
    "category": "Monitores",
    "price": "349,00 €",
    "oldPrice": "399,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/24-012-048-13.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/24-012-048-13.jpg"
    ],
    "description": "SS IPS 27\" QHD com 240Hz e KVM Switch integrado. Perfeito para quem alterna entre PC gaming e trabalho com um único monitor.",
    "badge": "KVM Switch",
    "features": [
      { "name": "Painel", "value": "SS IPS QHD 27\"" },
      { "name": "Taxa", "value": "240Hz" },
      { "name": "Resposta", "value": "1ms GtG" },
      { "name": "KVM", "value": "Switch integrado" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Gigabyte-M27Q-X",
    "brand": "Gigabyte",
    "inStock": true,
    "stockCount": 13
  },
  {
    "id": 93,
    "name": "AOC 24G2SP 165Hz",
    "category": "Monitores",
    "price": "139,00 €",
    "rating": 4.5,
    "img": "https://cdn.sanity.io/images/hf5b3axp/production/d711ca9aaf71f961f8ab64eff8d6624d4d532839-3840x3840.png?w=1920&fit=max&auto=format",
    "gallery": [
      "https://cdn.sanity.io/images/hf5b3axp/production/d711ca9aaf71f961f8ab64eff8d6624d4d532839-3840x3840.png?w=1920&fit=max&auto=format"
    ],
    "description": "IPS 24\" Full HD com 165Hz e 1ms MPRT. O monitor gaming mais acessível com painel IPS verdadeiro, FreeSync Premium e base ajustável em altura.",
    "badge": "Budget 1080p",
    "features": [
      { "name": "Painel", "value": "IPS FHD 24\"" },
      { "name": "Taxa", "value": "165Hz" },
      { "name": "Resposta", "value": "1ms MPRT" },
      { "name": "Sync", "value": "FreeSync Premium" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/AOC-24G2SP",
    "brand": "AOC",
    "inStock": true,
    "stockCount": 3
  },
  {
    "id": 94,
    "name": "MSI MAG 274QRF-QD 170Hz",
    "category": "Monitores",
    "price": "319,00 €",
    "oldPrice": "369,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/24-475-127-S05.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/24-475-127-S05.jpg"
    ],
    "description": "Rapid IPS com Quantum Dots para 27\" QHD e 170Hz. Cobertura DCI-P3 97% e sRGB 100% com Night Vision AI para visibilidade em cenários escuros.",
    "badge": "Quantum Dot",
    "features": [
      { "name": "Painel", "value": "Rapid IPS QD QHD" },
      { "name": "Taxa", "value": "170Hz" },
      { "name": "Resposta", "value": "1ms GtG" },
      { "name": "Cor", "value": "DCI-P3 97%" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/MSI-MAG-274QRF-QD",
    "brand": "MSI",
    "inStock": true,
    "stockCount": 3
  },

  // =============================================
  // TECLADOS E RATOS (IDs 6, 7, 95-102)
  // =============================================
  {
    "id": 6,
    "name": "Logitech G Pro X Superlight 2",
    "category": "Teclados e Ratos",
    "price": "135,00 €",
    "oldPrice": "169,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/S2f75fdf5c23b433d935978e4a4cbed2dD.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S2f75fdf5c23b433d935978e4a4cbed2dD.jpg"
    ],
    "description": "A evolução do rato mais icónico dos eSports. 60g de peso pluma, sensor HERO 2 com 32K DPI e polling rate de 2000Hz via cabo USB-C.",
    "badge": "Pro Choice",
    "features": [
      { "name": "Peso", "value": "60g" },
      { "name": "Sensor", "value": "HERO 2 / 32K DPI" },
      { "name": "Polling Rate", "value": "2000 Hz" },
      { "name": "Switches", "value": "Lightforce" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Logitech-G-Pro-X-Superlight-2",
    "brand": "Logitech",
    "inStock": true,
    "stockCount": 36
  },
  {
    "id": 7,
    "name": "Razer BlackWidow V4 Pro",
    "category": "Teclados e Ratos",
    "price": "189,50 €",
    "oldPrice": "249,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/S9cc51db9672f46c18a51e324a2cbb70dT.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/S9cc51db9672f46c18a51e324a2cbb70dT.jpg"
    ],
    "description": "Teclado mecânico premium com Razer Command Dial multifunção, 8 teclas macro dedicadas e iluminação Chroma RGB de 3 lados. O centro de comando do teu battlestation.",
    "badge": "Battlestation Hub",
    "features": [
      { "name": "Switches", "value": "Razer Green V3" },
      { "name": "Macros", "value": "8 Teclas Dedicadas" },
      { "name": "Dial", "value": "Command Dial" },
      { "name": "Conectividade", "value": "USB-A + Passthrough" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Razer-BlackWidow-V4-Pro",
    "brand": "Razer",
    "inStock": true,
    "stockCount": 49
  },
  {
    "id": 95,
    "name": "Razer DeathAdder V3",
    "category": "Teclados e Ratos",
    "price": "89,00 €",
    "oldPrice": "99,00 €",
    "rating": 4.8,
    "img": "https://www.razer.com/newsroom/wp-content/uploads/2023/02/daV3-pressrelease-img.png",
    "gallery": [
      "https://www.razer.com/newsroom/wp-content/uploads/2023/02/daV3-pressrelease-img.png"
    ],
    "description": "Ergonomia icónica DeathAdder reinventada com apenas 59g. Sensor Focus Pro 30K e switches ópticos Gen 3 com 90M cliques de durabilidade.",
    "badge": "Ergonómico Pro",
    "features": [
      { "name": "Peso", "value": "59g" },
      { "name": "Sensor", "value": "Focus Pro 30K" },
      { "name": "Switches", "value": "Ópticos Gen 3" },
      { "name": "Cabo", "value": "Speedflex USB-C" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Razer-DeathAdder-V3",
    "brand": "Razer",
    "inStock": true,
    "stockCount": 4
  },
  {
    "id": 96,
    "name": "SteelSeries Apex Pro TKL (2023)",
    "category": "Teclados e Ratos",
    "price": "189,00 €",
    "oldPrice": "219,00 €",
    "rating": 4.8,
    "img": "https://images.ctfassets.net/hmm5mo4qf4mf/5T6OTTzl1B5zaX1nILPFw4/186d8f786745424cdd8770cda23623af/apex_pro_tkl_wl_img_buy_01.png?fm=webp&q=90&fit=scale&w=1920",
    "gallery": [
      "https://images.ctfassets.net/hmm5mo4qf4mf/5T6OTTzl1B5zaX1nILPFw4/186d8f786745424cdd8770cda23623af/apex_pro_tkl_wl_img_buy_01.png?fm=webp&q=90&fit=scale&w=1920"
    ],
    "description": "Switches OmniPoint 2.0 com atuação ajustável de 0.2mm a 3.8mm por tecla. Rapid Trigger para resposta instantânea em FPS competitivos. Ecrã OLED integrado.",
    "badge": "Rapid Trigger",
    "features": [
      { "name": "Switches", "value": "OmniPoint 2.0 ajustável" },
      { "name": "Atuação", "value": "0.2mm – 3.8mm" },
      { "name": "Display", "value": "OLED integrado" },
      { "name": "Formato", "value": "TKL compacto" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/SteelSeries-Apex-Pro-TKL",
    "brand": "SteelSeries",
    "inStock": true,
    "stockCount": 18
  },
  {
    "id": 97,
    "name": "Corsair K70 RGB PRO",
    "category": "Teclados e Ratos",
    "price": "149,00 €",
    "oldPrice": "179,00 €",
    "rating": 4.7,
    "img": "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Gaming-Keyboards/CH-9109410-NA/Gallery/K70_RGB_PRO_PBT_01.webp",
    "gallery": [
      "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Gaming-Keyboards/CH-9109410-NA/Gallery/K70_RGB_PRO_PBT_01.webp"
    ],
    "description": "Chassi de alumínio escovado com Cherry MX Red e polling rate de 8000Hz. Teclas de mídia dedicadas, roda de volume e iluminação RGB per-key via iCUE.",
    "badge": "Alumínio Premium",
    "features": [
      { "name": "Switches", "value": "Cherry MX Red" },
      { "name": "Polling Rate", "value": "8000 Hz" },
      { "name": "Chassis", "value": "Alumínio escovado" },
      { "name": "Formato", "value": "Full Size" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-K70-RGB-PRO",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 30
  },
  {
    "id": 98,
    "name": "Razer Viper V3 Pro",
    "category": "Teclados e Ratos",
    "price": "159,00 €",
    "oldPrice": "179,00 €",
    "rating": 4.9,
    "img": "https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h08/h61/9765618188318/viper-v3-pro-black-500x500.png",
    "gallery": [
      "https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h08/h61/9765618188318/viper-v3-pro-black-500x500.png"
    ],
    "description": "54g ultraleve com sensor Focus Pro 35K e polling rate sem fios de 4000Hz. O rato wireless mais rápido do mundo para eSports profissional.",
    "badge": "eSports Pro",
    "features": [
      { "name": "Peso", "value": "54g" },
      { "name": "Sensor", "value": "Focus Pro 35K" },
      { "name": "Polling Rate", "value": "4000 Hz wireless" },
      { "name": "Bateria", "value": "95 horas" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Razer-Viper-V3-Pro",
    "brand": "Razer",
    "inStock": true,
    "stockCount": 48
  },
  {
    "id": 99,
    "name": "Logitech MX Master 3S",
    "category": "Teclados e Ratos",
    "price": "99,00 €",
    "oldPrice": "119,00 €",
    "rating": 4.8,
    "img": "https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/2025-update/mx-master-3s-bluetooth-edition-top-view-black-new-1.png",
    "gallery": [
      "https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/2025-update/mx-master-3s-bluetooth-edition-top-view-black-new-1.png"
    ],
    "description": "O rato de produtividade mais popular do mundo. Scroll MagSpeed electromagnético, sensor 8K DPI em vidro e ligação a 3 dispositivos em simultâneo.",
    "badge": "Produtividade",
    "features": [
      { "name": "Sensor", "value": "8K DPI em vidro" },
      { "name": "Scroll", "value": "MagSpeed 1000 l/s" },
      { "name": "Multi-Device", "value": "3 dispositivos" },
      { "name": "Bateria", "value": "70 dias USB-C" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Logitech-MX-Master-3S",
    "brand": "Logitech",
    "inStock": true,
    "stockCount": 17
  },
  {
    "id": 100,
    "name": "HyperX Alloy Origins 65",
    "category": "Teclados e Ratos",
    "price": "89,00 €",
    "rating": 4.6,
    "img": "https://hyperx.com/cdn/shop/files/hyperx_alloy_origins_65_english_us_1_top_down.jpg?v=1763563176",
    "gallery": [
      "https://hyperx.com/cdn/shop/files/hyperx_alloy_origins_65_english_us_1_top_down.jpg?v=1763563176"
    ],
    "description": "65% compacto com chassis de alumínio full-body e switches HyperX Red mecânicos. Perfeito para gamers que querem espaço para o rato.",
    "badge": "65% Compacto",
    "features": [
      { "name": "Switches", "value": "HyperX Red linear" },
      { "name": "Formato", "value": "65% compacto" },
      { "name": "Chassis", "value": "Alumínio full-body" },
      { "name": "Cabo", "value": "USB-C destacável" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/HyperX-Alloy-Origins-65",
    "brand": "HyperX",
    "inStock": true,
    "stockCount": 44
  },
  {
    "id": 101,
    "name": "Razer Huntsman V3 Pro",
    "category": "Teclados e Ratos",
    "price": "249,00 €",
    "oldPrice": "279,00 €",
    "rating": 4.9,
    "img": "https://c1.neweggimages.com/productimage/nb640/23-114-132-01.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/23-114-132-01.jpg"
    ],
    "description": "Switches ópticos analógicos de 2ª geração com Rapid Trigger e atuação ajustável de 0.1mm a 4.0mm. Polling rate de 8000Hz para o teclado competitivo definitivo.",
    "badge": "Competitivo",
    "features": [
      { "name": "Switches", "value": "Ópticos Analógicos Gen2" },
      { "name": "Atuação", "value": "0.1mm – 4.0mm" },
      { "name": "Polling Rate", "value": "8000 Hz" },
      { "name": "Rapid Trigger", "value": "Sim (ajustável)" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Razer-Huntsman-V3-Pro",
    "brand": "Razer",
    "inStock": false,
    "stockCount": 0
  },
  {
    "id": 102,
    "name": "SteelSeries Aerox 5 Wireless",
    "category": "Teclados e Ratos",
    "price": "99,00 €",
    "oldPrice": "129,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/V18MD2204270ZODGDCA.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/V18MD2204270ZODGDCA.jpg"
    ],
    "description": "Ultra-leve com 74g e design honeycomb impermeável IP54. 9 botões programáveis incluindo joystick lateral, ideal para MMOs e MOBA.",
    "badge": "Multi-Género",
    "features": [
      { "name": "Peso", "value": "74g" },
      { "name": "Sensor", "value": "TrueMove Air 18K" },
      { "name": "Botões", "value": "9 (com joystick)" },
      { "name": "Bateria", "value": "180h (Bluetooth)" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/SteelSeries-Aerox-5-Wireless",
    "brand": "SteelSeries",
    "inStock": true,
    "stockCount": 36
  },

  // =============================================
  // HEADSETS E ÁUDIO (IDs 11, 103-111)
  // =============================================
  {
    "id": 11,
    "name": "SteelSeries Arctis Nova Pro Wireless",
    "category": "Headsets e Áudio",
    "price": "349,99 €",
    "oldPrice": "399,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/S03b22e370c504978b55a77c1ed0b5704Z.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Sd91129082d03435daf68807c240d1503J.jpg",
      "https://ae01.alicdn.com/kf/S25680262993543adb19dc88e7bdf4145k.jpg"
    ],
    "description": "Headset wireless gaming premium com cancelamento de ruído ativo (ANC), sistema de bateria dupla intercambiável para autonomia infinita e áudio Hi-Res certificado.",
    "badge": "Pro Wireless",
    "features": [
      { "name": "ANC", "value": "Activo" },
      { "name": "Bateria", "value": "Dupla intercambiável" },
      { "name": "Áudio", "value": "Hi-Res / 360° Espacial" },
      { "name": "Conectividade", "value": "2.4GHz + Bluetooth" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/SteelSeries-Arctis-Nova-Pro-Wireless",
    "brand": "SteelSeries",
    "inStock": true,
    "stockCount": 42
  },
  {
    "id": 103,
    "name": "HyperX Cloud III Wireless",
    "category": "Headsets e Áudio",
    "price": "149,00 €",
    "oldPrice": "169,00 €",
    "rating": 4.7,
    "img": "https://row.hyperx.com/cdn/shop/files/hyperx_cloud_iii_wireless_black_77z45aa_main_1.jpg?v=1764893494",
    "gallery": [
      "https://row.hyperx.com/cdn/shop/files/hyperx_cloud_iii_wireless_black_77z45aa_main_1.jpg?v=1764893494"
    ],
    "description": "Drivers de 53mm com 120 horas de bateria wireless a 2.4GHz. Microfone destacável com indicador LED de mute e memory foam ultra-confortável.",
    "badge": "Maratona",
    "features": [
      { "name": "Drivers", "value": "53mm neodímio" },
      { "name": "Bateria", "value": "120 horas" },
      { "name": "Conectividade", "value": "2.4GHz wireless" },
      { "name": "Microfone", "value": "Destacável com LED" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/HyperX-Cloud-III-Wireless",
    "brand": "HyperX",
    "inStock": true,
    "stockCount": 28
  },
  {
    "id": 104,
    "name": "Logitech G Pro X 2 Lightspeed",
    "category": "Headsets e Áudio",
    "price": "219,00 €",
    "oldPrice": "259,00 €",
    "rating": 4.8,
    "img": "https://resource.logitechg.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-2-lightspeed/gallery/gallery-1-pro-x-2-lightspeed-gaming-headset-black.png",
    "gallery": [
      "https://resource.logitechg.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-2-lightspeed/gallery/gallery-1-pro-x-2-lightspeed-gaming-headset-black.png"
    ],
    "description": "Drivers de grafeno PRO-G de 50mm com DTS Headphone:X 2.0. Usado por profissionais de eSports com microfone com Blue VO!CE technology.",
    "badge": "eSports Choice",
    "features": [
      { "name": "Drivers", "value": "50mm PRO-G grafeno" },
      { "name": "Bateria", "value": "50 horas" },
      { "name": "Conectividade", "value": "Lightspeed + BT + 3.5mm" },
      { "name": "Surround", "value": "DTS:X 2.0" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Logitech-G-Pro-X-2",
    "brand": "Logitech",
    "inStock": true,
    "stockCount": 30
  },
  {
    "id": 105,
    "name": "Corsair Virtuoso RGB XT Wireless",
    "category": "Headsets e Áudio",
    "price": "239,00 €",
    "oldPrice": "279,00 €",
    "rating": 4.7,
    "img": "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Headsets/CA-9011188-NA/Gallery/VIRTUOSO_XT_01.webp",
    "gallery": [
      "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Headsets/CA-9011188-NA/Gallery/VIRTUOSO_XT_01.webp"
    ],
    "description": "Drivers de 50mm com Dolby Atmos e áudio espacial. Tripla conectividade (Slipstream 2.4GHz + Bluetooth + USB) e construção premium em alumínio.",
    "badge": "Dolby Atmos",
    "features": [
      { "name": "Drivers", "value": "50mm neodímio" },
      { "name": "Surround", "value": "Dolby Atmos" },
      { "name": "Conectividade", "value": "Slipstream + BT + USB" },
      { "name": "Bateria", "value": "60 horas" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-Virtuoso-RGB-XT",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 30
  },
  {
    "id": 106,
    "name": "Razer Kraken V4",
    "category": "Headsets e Áudio",
    "price": "109,00 €",
    "oldPrice": "129,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/26-153-367-02.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/26-153-367-02.jpg"
    ],
    "description": "Drivers Razer TriForce de 40mm com iluminação Chroma RGB e THX Spatial Audio. Microfone HyperClear Cardioid destacável para voz cristalina.",
    "badge": "Chroma RGB",
    "features": [
      { "name": "Drivers", "value": "40mm TriForce" },
      { "name": "Surround", "value": "THX Spatial Audio" },
      { "name": "RGB", "value": "Chroma per-ear" },
      { "name": "Conectividade", "value": "USB + 3.5mm" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Razer-Kraken-V4",
    "brand": "Razer",
    "inStock": true,
    "stockCount": 49
  },
  {
    "id": 107,
    "name": "Sony WH-1000XM5",
    "category": "Headsets e Áudio",
    "price": "319,00 €",
    "oldPrice": "399,00 €",
    "rating": 4.9,
    "img": "https://c1.neweggimages.com/ProductImageOriginal/ARUXS22052606ACVA3A.jpg",
    "gallery": [
      "https://c1.neweggimages.com/ProductImageOriginal/ARUXS22052606ACVA3A.jpg"
    ],
    "description": "O melhor ANC do mercado com 8 microfones e processador V1. 30 horas de bateria, carga rápida de 3 min para 3 horas e multipoint Bluetooth 5.2.",
    "badge": "ANC Líder",
    "features": [
      { "name": "Drivers", "value": "30mm carbono" },
      { "name": "ANC", "value": "8 microfones + V1" },
      { "name": "Bateria", "value": "30 horas" },
      { "name": "Codec", "value": "LDAC / AAC" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Sony-WH-1000XM5",
    "brand": "Sony",
    "inStock": true,
    "stockCount": 40
  },
  {
    "id": 108,
    "name": "JBL Quantum 910 Wireless",
    "category": "Headsets e Áudio",
    "price": "249,00 €",
    "oldPrice": "299,00 €",
    "rating": 4.6,
    "img": "https://images.samsung.com/is/image/samsung/p6pim/us/jblq910wlblkam/gallery/us-jbl-quantum910-wireless-jblq910wlblkam-551554636",
    "gallery": [
      "https://images.samsung.com/is/image/samsung/p6pim/us/jblq910wlblkam/gallery/us-jbl-quantum910-wireless-jblq910wlblkam-551554636"
    ],
    "description": "Head tracking 3D com JBL QuantumSPHERE 360 para posicionamento espacial real. ANC com modo ambiente e Dual Wireless (2.4GHz + BT).",
    "badge": "Head Tracking",
    "features": [
      { "name": "Drivers", "value": "50mm JBL" },
      { "name": "3D Audio", "value": "QuantumSPHERE 360" },
      { "name": "ANC", "value": "Activo + Modo Ambiente" },
      { "name": "Bateria", "value": "39h (BT) / 37h (2.4GHz)" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/JBL-Quantum-910",
    "brand": "JBL",
    "inStock": true,
    "stockCount": 34
  },
  {
    "id": 109,
    "name": "Corsair HS80 Max Wireless",
    "category": "Headsets e Áudio",
    "price": "149,00 €",
    "oldPrice": "179,00 €",
    "rating": 4.7,
    "img": "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Headsets/hs80-max-wireless/steel-grey/HS80_MAX_WIRELESS_STEEL_GRAY_01.webp",
    "gallery": [
      "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Headsets/hs80-max-wireless/steel-grey/HS80_MAX_WIRELESS_STEEL_GRAY_01.webp"
    ],
    "description": "Drivers de 50mm com Dolby Atmos wireless e SoundID para personalização de perfil sonoro. Slipstream dual wireless com 65 horas de bateria.",
    "badge": "SoundID",
    "features": [
      { "name": "Drivers", "value": "50mm neodímio" },
      { "name": "Surround", "value": "Dolby Atmos" },
      { "name": "Bateria", "value": "65 horas" },
      { "name": "Personalização", "value": "SoundID" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-HS80-Max",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 44
  },
  {
    "id": 110,
    "name": "Razer BlackShark V2 Pro (2023)",
    "category": "Headsets e Áudio",
    "price": "169,00 €",
    "oldPrice": "199,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/APCPD2111150RQFOF3C.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/APCPD2111150RQFOF3C.jpg"
    ],
    "description": "Drivers Razer TriForce Titanium de 50mm com THX Spatial Audio. Microfone HyperClear Super Wideband para a voz mais natural em gaming wireless.",
    "badge": "Wireless Pro",
    "features": [
      { "name": "Drivers", "value": "50mm TriForce Titanium" },
      { "name": "Surround", "value": "THX Spatial Audio" },
      { "name": "Bateria", "value": "70 horas" },
      { "name": "Microfone", "value": "HyperClear Wideband" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Razer-BlackShark-V2-Pro-2023",
    "brand": "Razer",
    "inStock": true,
    "stockCount": 45
  },
  {
    "id": 111,
    "name": "Audio-Technica ATH-M50x",
    "category": "Headsets e Áudio",
    "price": "139,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/A544_1_20190423911868284.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/A544_1_20190423911868284.jpg"
    ],
    "description": "Os auscultadores de estúdio de referência da indústria. Drivers de 45mm com resposta plana para mixing, mastering e gaming audiófilo. Cabo destacável.",
    "badge": "Studio Reference",
    "features": [
      { "name": "Drivers", "value": "45mm de terras raras" },
      { "name": "Impedância", "value": "38 Ohms" },
      { "name": "Resposta Freq.", "value": "15Hz – 28kHz" },
      { "name": "Cabos", "value": "3 incluídos (destacáveis)" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Audio-Technica-ATH-M50x",
    "brand": "Audio-Technica",
    "inStock": true,
    "stockCount": 45
  },

  // =============================================
  // CADEIRAS GAMING (IDs 12, 112-120)
  // =============================================
  {
    "id": 12,
    "name": "Secretlab TITAN Evo 2022 XL",
    "category": "Cadeiras Gaming",
    "price": "549,00 €",
    "oldPrice": "599,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/Sd430c2081eaf4f1fa3afd1e70b0d1f71H.jpg",
    "gallery": [
      "https://ae01.alicdn.com/kf/Hd947c23e50a045f8be0ce6da7a33143dM.jpg",
      "https://ae01.alicdn.com/kf/Sfb15ddafcbb84d828666aecc26ff70ae5.jpg"
    ],
    "description": "A cadeira gaming mais premiada do mundo com couro sintético Neo Hybrid, apoio lombar magnético 4-way e mecanismo de reclinação de corpo inteiro até 165°.",
    "badge": "Editor's Choice",
    "features": [
      { "name": "Lombar", "value": "Magnético 4-way" },
      { "name": "Reclinação", "value": "85° – 165°" },
      { "name": "Material", "value": "Neo Hybrid Leather" },
      { "name": "Carga Máx.", "value": "180 kg" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Secretlab-TITAN-Evo-XL",
    "brand": "Secretlab",
    "inStock": true,
    "stockCount": 21
  },
  {
    "id": 112,
    "name": "Razer Iskur V2",
    "category": "Cadeiras Gaming",
    "price": "499,00 €",
    "oldPrice": "549,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/26-153-375-01.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/26-153-375-01.jpg"
    ],
    "description": "Suporte lombar adaptativo com zona lombar totalmente ajustável e espuma de memória de alta densidade. Apoios de braço 4D e couro sintético EPU premium.",
    "badge": "Lombar Adaptivo",
    "features": [
      { "name": "Lombar", "value": "Adaptativo ajustável" },
      { "name": "Reclinação", "value": "Até 152°" },
      { "name": "Material", "value": "EPU Synthetic Leather" },
      { "name": "Carga Máx.", "value": "136 kg" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Razer-Iskur-V2",
    "brand": "Razer",
    "inStock": true,
    "stockCount": 43
  },
  {
    "id": 113,
    "name": "Corsair TC200 Leatherette",
    "category": "Cadeiras Gaming",
    "price": "349,00 €",
    "oldPrice": "399,00 €",
    "rating": 4.6,
    "img": "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Chairs/CF-9010043-WW/Gallery/CF-9010043-WW_01.webp",
    "gallery": [
      "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Chairs/CF-9010043-WW/Gallery/CF-9010043-WW_01.webp"
    ],
    "description": "Construção wide-seat com assento de 52cm para conforto prolongado. Espuma moldada a frio e apoio lombar externo incluído. Base de aço reforçada.",
    "badge": "Wide Seat",
    "features": [
      { "name": "Assento", "value": "52cm wide-seat" },
      { "name": "Reclinação", "value": "Até 160°" },
      { "name": "Material", "value": "Leatherette premium" },
      { "name": "Carga Máx.", "value": "120 kg" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Corsair-TC200",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 45
  },
  {
    "id": 114,
    "name": "noblechairs HERO ST",
    "category": "Cadeiras Gaming",
    "price": "449,00 €",
    "oldPrice": "499,00 €",
    "rating": 4.7,
    "img": "https://img.noblechairs.com/images/GAGC-255/167c6091e83aee48b4a95a42f9a765ab.jpg",
    "gallery": [
      "https://img.noblechairs.com/images/GAGC-255/167c6091e83aee48b4a95a42f9a765ab.jpg"
    ],
    "description": "Estética elegante com couro PU premium e espuma de frio de alta densidade. Mecanismo de inclinação integrado e apoios de braço 4D em aço.",
    "badge": "Elegante",
    "features": [
      { "name": "Lombar", "value": "Almofada ajustável" },
      { "name": "Reclinação", "value": "Até 135°" },
      { "name": "Material", "value": "PU Leather premium" },
      { "name": "Carga Máx.", "value": "150 kg" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/noblechairs-HERO",
    "brand": "noblechairs",
    "inStock": true,
    "stockCount": 12
  },
  {
    "id": 115,
    "name": "DXRacer Craft Series",
    "category": "Cadeiras Gaming",
    "price": "399,00 €",
    "rating": 4.5,
    "img": "https://nex-img.dxracer.cc/20001/fcda253d-9214-405e-9b6d-b7a1dc5cdbaf-1.png",
    "gallery": [
      "https://nex-img.dxracer.cc/20001/fcda253d-9214-405e-9b6d-b7a1dc5cdbaf-1.png"
    ],
    "description": "Designs temáticos personalizáveis com bordados premium. Estrutura de aço tubular e espuma de frio moldada com mecanismo de 4 posições.",
    "badge": "Custom Design",
    "features": [
      { "name": "Design", "value": "Bordado temático" },
      { "name": "Reclinação", "value": "Até 135°" },
      { "name": "Estrutura", "value": "Aço tubular reforçado" },
      { "name": "Carga Máx.", "value": "136 kg" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/DXRacer-Craft",
    "brand": "DXRacer",
    "inStock": true,
    "stockCount": 49
  },
  {
    "id": 116,
    "name": "AndaSeat Kaiser 3 XL",
    "category": "Cadeiras Gaming",
    "price": "449,00 €",
    "oldPrice": "529,00 €",
    "rating": 4.7,
    "img": "https://www.andaseat.com/cdn/shop/files/andaseat-kasier-3-series-gaming-chair-carbon-black-ign_grande.webp?v=1757903020",
    "gallery": [
      "https://www.andaseat.com/cdn/shop/files/andaseat-kasier-3-series-gaming-chair-carbon-black-ign_grande.webp?v=1757903020"
    ],
    "description": "Suporte lombar magnético DuraXtra com espuma de frio de alta resiliência. Apoios de braço 4D e mecanismo de reclinação até 165° com trava.",
    "badge": "XL Comfort",
    "features": [
      { "name": "Lombar", "value": "DuraXtra magnético" },
      { "name": "Reclinação", "value": "90° – 165°" },
      { "name": "Material", "value": "PVC Leather premium" },
      { "name": "Carga Máx.", "value": "200 kg" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/AndaSeat-Kaiser-3",
    "brand": "AndaSeat",
    "inStock": true,
    "stockCount": 18
  },
  {
    "id": 117,
    "name": "Cougar Armor Elite",
    "category": "Cadeiras Gaming",
    "price": "199,00 €",
    "oldPrice": "249,00 €",
    "rating": 4.4,
    "img": "https://cougargaming.com/_cgrwdr_/wwdpp/wp-content/uploads/2023/03/ARMOR-elite-banner-s.jpg",
    "gallery": [
      "https://cougargaming.com/_cgrwdr_/wwdpp/wp-content/uploads/2023/03/ARMOR-elite-banner-s.jpg"
    ],
    "description": "Cadeira gaming acessível com design agressivo e almofadas lombar e cervical incluídas. Base de aço com rodas silenciosas de 60mm.",
    "badge": "Budget Gaming",
    "features": [
      { "name": "Reclinação", "value": "Até 160°" },
      { "name": "Material", "value": "PVC Leather" },
      { "name": "Almofadas", "value": "Lombar + cervical" },
      { "name": "Carga Máx.", "value": "120 kg" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Cougar-Armor-Elite",
    "brand": "Cougar",
    "inStock": true,
    "stockCount": 40
  },
  {
    "id": 118,
    "name": "AKRacing Masters Pro",
    "category": "Cadeiras Gaming",
    "price": "499,00 €",
    "oldPrice": "549,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/26-930-047-S01.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb640/26-930-047-S01.jpg"
    ],
    "description": "Construção premium com espuma de frio de alta densidade e couro PU durável. Mecanismo de reclinação 4D com apoios de braço metálicos ajustáveis.",
    "badge": "Pro Durável",
    "features": [
      { "name": "Lombar", "value": "Almofada ajustável" },
      { "name": "Reclinação", "value": "Até 180° (flat)" },
      { "name": "Material", "value": "PU Leather durável" },
      { "name": "Carga Máx.", "value": "150 kg" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/AKRacing-Masters-Pro",
    "brand": "AKRacing",
    "inStock": true,
    "stockCount": 38
  },
  {
    "id": 119,
    "name": "Herman Miller x Logitech Embody Gaming",
    "category": "Cadeiras Gaming",
    "price": "1.595,00 €",
    "rating": 5.0,
    "img": "https://images.hermanmiller.group/asset/521e115b-9214-402a-92d2-2b8529a5a228/W/HMG_2517590_100698359_Embody_Gaming_Ignite_OnBlkF34R_68477_PDP_v7.png",
    "gallery": [
      "https://images.hermanmiller.group/asset/521e115b-9214-402a-92d2-2b8529a5a228/W/HMG_2517590_100698359_Embody_Gaming_Ignite_OnBlkF34R_68477_PDP_v7.png"
    ],
    "description": "A cadeira ergonómica definitiva adaptada para gaming. BackFit que se molda à coluna, pixelated support para distribuição de peso e espuma de arrefecimento SCI-engineered.",
    "badge": "Ergonomia Suprema",
    "features": [
      { "name": "Ergonomia", "value": "BackFit + PostureFit" },
      { "name": "Espuma", "value": "Arrefecimento SCI" },
      { "name": "Garantia", "value": "12 Anos" },
      { "name": "Carga Máx.", "value": "136 kg" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Herman-Miller-Embody-Gaming",
    "brand": "Herman Miller",
    "inStock": true,
    "stockCount": 5
  },
  {
    "id": 120,
    "name": "Autonomous ErgoChair Pro",
    "category": "Cadeiras Gaming",
    "price": "449,00 €",
    "oldPrice": "499,00 €",
    "rating": 4.6,
    "img": "https://cdn.autonomous.ai/production/ecm/240715/1(1).jpg",
    "gallery": [
      "https://cdn.autonomous.ai/production/ecm/240715/1(1).jpg"
    ],
    "description": "Cadeira ergonómica com mesh respirável e suporte lombar adaptativo. 11 pontos de ajuste para personalização total da postura durante sessões longas.",
    "badge": "Mesh Ergonómico",
    "features": [
      { "name": "Material", "value": "Mesh respirável" },
      { "name": "Ajustes", "value": "11 pontos" },
      { "name": "Lombar", "value": "Adaptativo ajustável" },
      { "name": "Carga Máx.", "value": "136 kg" }
    ],
    "supplier_url": "https://www.aliexpress.com/item/Autonomous-ErgoChair-Pro",
    "brand": "Autonomous",
    "inStock": true,
    "stockCount": 30
  }
,
  // =============================================
  // PLACAS GRÁFICAS (IDs 121-128)
  // =============================================
  {
    "id": 121,
    "name": "NVIDIA GeForce RTX 5090",
    "category": "Placas Gráficas",
    "price": "2.199,00 €",
    "oldPrice": "2.399,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/Sa74c4fee91aa4ce1a4c0254f600b1b94o.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/Sa74c4fee91aa4ce1a4c0254f600b1b94o.jpg"],
    "description": "A placa gráfica mais poderosa da nova geração NVIDIA. Arquitectura Blackwell com 32 GB GDDR7 para gaming 4K a mais de 120 FPS e workloads de IA local.",
    "badge": "Topo de Gama",
    "features": [
      { "name": "GPU", "value": "Blackwell GB202" },
      { "name": "VRAM", "value": "32 GB GDDR7" },
      { "name": "CUDA Cores", "value": "21760" },
      { "name": "TDP", "value": "575 W" }
    ],
    "supplier_url": "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/",
    "brand": "NVIDIA",
    "inStock": true,
    "stockCount": 2
  },
  {
    "id": 122,
    "name": "AMD Radeon RX 9070 XT",
    "category": "Placas Gráficas",
    "price": "649,00 €",
    "rating": 4.5,
    "img": "https://ae01.alicdn.com/kf/Sdef16c880ddc48d8a41ca0f183c12d8ao.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/Sdef16c880ddc48d8a41ca0f183c12d8ao.jpg"],
    "description": "Placa gráfica AMD RDNA 4 com excelente relação preço/desempenho. 16 GB GDDR6 para gaming 1440p de alta qualidade e ray tracing melhorado.",
    "features": [
      { "name": "GPU", "value": "Navi 48 RDNA 4" },
      { "name": "VRAM", "value": "16 GB GDDR6" },
      { "name": "Stream Processors", "value": "4096" },
      { "name": "TDP", "value": "250 W" }
    ],
    "supplier_url": "https://www.amd.com/en/products/graphics/amd-radeon-rx-9070-xt",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 4
  },
  {
    "id": 123,
    "name": "NVIDIA GeForce RTX 5070 Ti",
    "category": "Placas Gráficas",
    "price": "899,00 €",
    "oldPrice": "949,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/S1326e3dd137648c7b7b03f33869ec973H.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/S1326e3dd137648c7b7b03f33869ec973H.jpg"],
    "description": "Desempenho excepcional para gaming 4K com DLSS 4 e ray tracing de nova geração. 16 GB GDDR7 para os títulos mais exigentes.",
    "badge": "Melhor Valor 4K",
    "features": [
      { "name": "GPU", "value": "Blackwell GB203" },
      { "name": "VRAM", "value": "16 GB GDDR7" },
      { "name": "CUDA Cores", "value": "8960" },
      { "name": "TDP", "value": "300 W" }
    ],
    "supplier_url": "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-ti/",
    "brand": "NVIDIA",
    "inStock": true,
    "stockCount": 5
  },
  {
    "id": 124,
    "name": "ASUS ROG Strix RTX 5080 OC",
    "category": "Placas Gráficas",
    "price": "1.399,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/A6f880ada71fd4e4aa5405d160678b418I.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/A6f880ada71fd4e4aa5405d160678b418I.jpg"],
    "description": "Edição ROG Strix com overclock de fábrica e sistema de arrefecimento de 3 ventoinhas. Design premium com iluminação Aura Sync RGB.",
    "badge": "ROG Premium",
    "features": [
      { "name": "GPU", "value": "Blackwell GB203" },
      { "name": "VRAM", "value": "16 GB GDDR7" },
      { "name": "Arrefecimento", "value": "3 ventoinhas Axial-tech" },
      { "name": "TDP", "value": "360 W" }
    ],
    "supplier_url": "https://www.asus.com/motherboards-components/graphics-cards/rog-strix/",
    "brand": "ASUS",
    "inStock": true,
    "stockCount": 3
  },
  {
    "id": 125,
    "name": "MSI Gaming Trio RTX 5070",
    "category": "Placas Gráficas",
    "price": "699,00 €",
    "oldPrice": "749,00 €",
    "rating": 4.5,
    "img": "https://ae01.alicdn.com/kf/S101011f7f6df4006ba69af896e76f2f8W.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/S101011f7f6df4006ba69af896e76f2f8W.jpg"],
    "description": "RTX 5070 com arrefecimento tri-fan Torx 5.0 e backplate metálico. Ideal para gaming 1440p ultra com DLSS 4 e Frame Generation.",
    "features": [
      { "name": "GPU", "value": "Blackwell GB205" },
      { "name": "VRAM", "value": "12 GB GDDR7" },
      { "name": "Arrefecimento", "value": "Tri Frozr 3S" },
      { "name": "TDP", "value": "250 W" }
    ],
    "supplier_url": "https://www.msi.com/Graphics-Card",
    "brand": "MSI",
    "inStock": true,
    "stockCount": 7
  },
  {
    "id": 126,
    "name": "Sapphire Nitro+ RX 9070",
    "category": "Placas Gráficas",
    "price": "549,00 €",
    "rating": 4.4,
    "img": "https://ae01.alicdn.com/kf/Sa48e99245ac043b7963e6e9caf20f8f6B.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/Sa48e99245ac043b7963e6e9caf20f8f6B.jpg"],
    "description": "A melhor placa AMD para gaming 1440p. Arrefecimento Nitro+ com heatpipes de cobre e ventoinha inteligente que para em idle.",
    "features": [
      { "name": "GPU", "value": "Navi 48 RDNA 4" },
      { "name": "VRAM", "value": "16 GB GDDR6" },
      { "name": "Arrefecimento", "value": "Nitro+ Dual-X" },
      { "name": "TDP", "value": "220 W" }
    ],
    "supplier_url": "https://www.sapphiretech.com/en/consumer/nitro-rx-9070",
    "brand": "Sapphire",
    "inStock": true,
    "stockCount": 6
  },
  
  {
    "id": 128,
    "name": "Intel Arc B580",
    "category": "Placas Gráficas",
    "price": "279,00 €",
    "rating": 4.1,
    "img": "https://ae01.alicdn.com/kf/S40a685b2772445f28dda7ccfe37a9fa2j.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/S40a685b2772445f28dda7ccfe37a9fa2j.jpg"],
    "description": "GPU Intel Battlemage de gama média-baixa com 12 GB VRAM. Excelente opção económica para 1080p com ray tracing e XeSS upscaling.",
    "features": [
      { "name": "GPU", "value": "Battlemage BMG-G21" },
      { "name": "VRAM", "value": "12 GB GDDR6" },
      { "name": "Xe Cores", "value": "20" },
      { "name": "TDP", "value": "150 W" }
    ],
    "supplier_url": "https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html",
    "brand": "Intel",
    "inStock": true,
    "stockCount": 11
  },
  // =============================================
  // PROCESSADORES (IDs 129-136)
  // =============================================
  {
    "id": 129,
    "name": "AMD Ryzen 9 9950X",
    "category": "Processadores",
    "price": "649,00 €",
    "oldPrice": "699,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/Sc9ee44bfbe2e44d38e925d948916ec84o.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/Sc9ee44bfbe2e44d38e925d948916ec84o.jpg"],
    "description": "O processador desktop mais rápido da AMD. 16 cores Zen 5 com boost até 5.7 GHz para produtividade e gaming sem compromissos.",
    "badge": "Flagship AMD",
    "features": [
      { "name": "Cores/Threads", "value": "16C / 32T" },
      { "name": "Clock Base/Boost", "value": "4.3 / 5.7 GHz" },
      { "name": "Cache", "value": "80 MB (L2+L3)" },
      { "name": "TDP", "value": "170 W" }
    ],
    "supplier_url": "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x.html",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 8
  },
  {
    "id": 130,
    "name": "Intel Core Ultra 9 285K",
    "category": "Processadores",
    "price": "599,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/Sfc4d0ac50cd540b6a3bd02032ac6c4f7f.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/Sfc4d0ac50cd540b6a3bd02032ac6c4f7f.jpg"],
    "description": "Processador Intel Arrow Lake com arquitectura híbrida de nova geração. 24 cores com NPU integrada para aceleração de IA local.",
    "features": [
      { "name": "Cores/Threads", "value": "24C (8P+16E) / 24T" },
      { "name": "Clock P-Core Boost", "value": "5.7 GHz" },
      { "name": "Cache", "value": "36 MB L3" },
      { "name": "TDP", "value": "125 W" }
    ],
    "supplier_url": "https://www.intel.com/content/www/us/en/products/sku/241046/intel-core-ultra-9-processor-285k/specifications.html",
    "brand": "Intel",
    "inStock": true,
    "stockCount": 6
  },
  {
    "id": 131,
    "name": "AMD Ryzen 7 9700X",
    "category": "Processadores",
    "price": "359,00 €",
    "oldPrice": "399,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/S5adb6bdfc0894c36a5c7214a0cbbb4f9I.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/S5adb6bdfc0894c36a5c7214a0cbbb4f9I.jpg"],
    "description": "Processador Zen 5 de 8 cores com eficiência energética excepcional. TDP de apenas 65W com desempenho que rivaliza com chips de 170W.",
    "badge": "Eficiência Máxima",
    "features": [
      { "name": "Cores/Threads", "value": "8C / 16T" },
      { "name": "Clock Base/Boost", "value": "3.8 / 5.5 GHz" },
      { "name": "Cache", "value": "40 MB (L2+L3)" },
      { "name": "TDP", "value": "65 W" }
    ],
    "supplier_url": "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9700x.html",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 16
  },
  {
    "id": 132,
    "name": "Intel Core Ultra 7 265K",
    "category": "Processadores",
    "price": "419,00 €",
    "rating": 4.5,
    "img": "https://ae01.alicdn.com/kf/S3136044a78284c93b35cc362fec337b3R.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/S3136044a78284c93b35cc362fec337b3R.jpg"],
    "description": "Processador Arrow Lake de gama alta com 20 cores híbridos. Excelente para gaming e multitasking pesado com DDR5 e PCIe 5.0.",
    "features": [
      { "name": "Cores/Threads", "value": "20C (8P+12E) / 20T" },
      { "name": "Clock P-Core Boost", "value": "5.5 GHz" },
      { "name": "Cache", "value": "30 MB L3" },
      { "name": "TDP", "value": "125 W" }
    ],
    "supplier_url": "https://www.intel.com/content/www/us/en/products/details/processors/core-ultra.html",
    "brand": "Intel",
    "inStock": true,
    "stockCount": 71
  },
  {
    "id": 133,
    "name": "AMD Ryzen 5 9600X",
    "category": "Processadores",
    "price": "249,00 €",
    "oldPrice": "279,00 €",
    "rating": 4.6,
    "img": "https://ae01.alicdn.com/kf/S199979d21ef54b629421756c4c89dfb8n.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/S199979d21ef54b629421756c4c89dfb8n.jpg"],
    "description": "O melhor processador gaming por menos de 300 euros. 6 cores Zen 5 com single-thread excepcional para os jogos mais exigentes.",
    "badge": "Gaming Value King",
    "features": [
      { "name": "Cores/Threads", "value": "6C / 12T" },
      { "name": "Clock Base/Boost", "value": "3.9 / 5.4 GHz" },
      { "name": "Cache", "value": "38 MB (L2+L3)" },
      { "name": "TDP", "value": "65 W" }
    ],
    "supplier_url": "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-5-9600x.html",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 39
  },
  {
    "id": 134,
    "name": "AMD Ryzen 9 9900X",
    "category": "Processadores",
    "price": "479,00 €",
    "rating": 4.8,
    "img": "https://ae01.alicdn.com/kf/Sa52788b9d42746ecaffa2e6f5641045fm.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/Sa52788b9d42746ecaffa2e6f5641045fm.jpg"],
    "description": "12 cores Zen 5 com equilíbrio perfeito entre gaming e produtividade. Cache massiva de 76 MB para workloads profissionais.",
    "features": [
      { "name": "Cores/Threads", "value": "12C / 24T" },
      { "name": "Clock Base/Boost", "value": "4.4 / 5.6 GHz" },
      { "name": "Cache", "value": "76 MB (L2+L3)" },
      { "name": "TDP", "value": "120 W" }
    ],
    "supplier_url": "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9900x.html",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 23
  },
  {
    "id": 135,
    "name": "Intel Core Ultra 5 245K",
    "category": "Processadores",
    "price": "299,00 €",
    "oldPrice": "329,00 €",
    "rating": 4.4,
    "img": "https://ae01.alicdn.com/kf/S88bfcfb244414f2ea70967f3add907d8l.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/S88bfcfb244414f2ea70967f3add907d8l.jpg"],
    "description": "Processador Arrow Lake mainstream desbloqueado. 14 cores híbridos com NPU para IA e excelente desempenho gaming a preço acessível.",
    "badge": "Entrada Premium",
    "features": [
      { "name": "Cores/Threads", "value": "14C (6P+8E) / 14T" },
      { "name": "Clock P-Core Boost", "value": "5.2 GHz" },
      { "name": "Cache", "value": "24 MB L3" },
      { "name": "TDP", "value": "125 W" }
    ],
    "supplier_url": "https://www.intel.com/content/www/us/en/products/details/processors/core-ultra.html",
    "brand": "Intel",
    "inStock": true,
    "stockCount": 12
  },
  {
    "id": 136,
    "name": "AMD Ryzen 7 9800X3D",
    "category": "Processadores",
    "price": "529,00 €",
    "rating": 4.9,
    "img": "https://ae01.alicdn.com/kf/S981e6f47735746d39bc5a13f30eb3368J.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/S981e6f47735746d39bc5a13f30eb3368J.jpg"],
    "description": "O melhor processador gaming do mundo com 3D V-Cache de 104 MB. Desempenho imbatível em jogos graças à cache L3 empilhada verticalmente.",
    "badge": "Rei do Gaming",
    "features": [
      { "name": "Cores/Threads", "value": "8C / 16T" },
      { "name": "Clock Base/Boost", "value": "4.7 / 5.2 GHz" },
      { "name": "Cache", "value": "104 MB 3D V-Cache" },
      { "name": "TDP", "value": "120 W" }
    ],
    "supplier_url": "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html",
    "brand": "AMD",
    "inStock": true,
    "stockCount": 4
  },
  // =============================================
  // MOTHERBOARDS (IDs 137-144)
  // =============================================
  {
    "id": 137,
    "name": "ASUS ROG Crosshair X870E Hero",
    "category": "Motherboards",
    "price": "699,00 €",
    "oldPrice": "749,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-119-681-01.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/13-119-681-01.jpg"],
    "description": "Motherboard AM5 de topo com chipset X870E. VRM de 22+2 fases, Wi-Fi 7, Thunderbolt 4 e suporte DDR5-8000+ para overclock extremo.",
    "badge": "Enthusiast",
    "features": [
      { "name": "Socket", "value": "AM5" },
      { "name": "Chipset", "value": "X870E" },
      { "name": "VRM", "value": "22+2 fases" },
      { "name": "Wi-Fi", "value": "Wi-Fi 7" }
    ],
    "supplier_url": "https://www.asus.com/motherboards-components/motherboards/rog-crosshair/",
    "brand": "ASUS",
    "inStock": true,
    "stockCount": 35
  },
  {
    "id": 138,
    "name": "MSI MEG Z890 ACE",
    "category": "Motherboards",
    "price": "599,00 €",
    "rating": 4.7,
    "img": "https://ae01.alicdn.com/kf/S8817ee5c0aaa450d987cb99c8d098f4ez.jpg",
    "gallery": ["https://ae01.alicdn.com/kf/S8817ee5c0aaa450d987cb99c8d098f4ez.jpg"],
    "description": "Motherboard Intel Z890 premium para processadores Arrow Lake. 24+1+2 fases de VRM, PCIe 5.0 x16 e quatro slots M.2 para armazenamento massivo.",
    "features": [
      { "name": "Socket", "value": "LGA 1851" },
      { "name": "Chipset", "value": "Z890" },
      { "name": "VRM", "value": "24+1+2 fases" },
      { "name": "M.2 Slots", "value": "4x PCIe 5.0/4.0" }
    ],
    "supplier_url": "https://www.msi.com/Motherboard/MEG-Z890-ACE",
    "brand": "MSI",
    "inStock": true,
    "stockCount": 41
  },
  {
    "id": 139,
    "name": "Gigabyte B850 AORUS Elite",
    "category": "Motherboards",
    "price": "249,00 €",
    "oldPrice": "279,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-145-545-05.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/13-145-545-05.jpg"],
    "description": "Motherboard AM5 de gama média com excelente relação preço/desempenho. VRM robusta de 16 fases, Wi-Fi 6E e suporte DDR5.",
    "badge": "Melhor Valor AM5",
    "features": [
      { "name": "Socket", "value": "AM5" },
      { "name": "Chipset", "value": "B850" },
      { "name": "VRM", "value": "16 fases" },
      { "name": "Wi-Fi", "value": "Wi-Fi 6E" }
    ],
    "supplier_url": "https://www.gigabyte.com/Motherboard/B850-AORUS-ELITE",
    "brand": "Gigabyte",
    "inStock": true,
    "stockCount": 44
  },
  {
    "id": 140,
    "name": "ASRock Z890 Taichi",
    "category": "Motherboards",
    "price": "499,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-162-169-05.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/13-162-169-05.png"],
    "description": "Motherboard flagship ASRock para Intel Arrow Lake. Design icónico de engrenagens com VRM de 26 fases e audio Nahimic premium.",
    "features": [
      { "name": "Socket", "value": "LGA 1851" },
      { "name": "Chipset", "value": "Z890" },
      { "name": "VRM", "value": "26 fases SPS" },
      { "name": "Audio", "value": "Nahimic 7.1" }
    ],
    "supplier_url": "https://www.asrock.com/mb/Intel/Z890%20Taichi/",
    "brand": "ASRock",
    "inStock": true,
    "stockCount": 45
  },
  {
    "id": 141,
    "name": "ASUS ROG Strix B850-F Gaming",
    "category": "Motherboards",
    "price": "299,00 €",
    "oldPrice": "329,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-119-702-09.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/13-119-702-09.png"],
    "description": "Motherboard AM5 gaming com VRM de 16+2 fases, USB4 e rede 2.5G LAN. Design ROG Strix com iluminação Aura Sync integrada.",
    "badge": "ROG Gaming",
    "features": [
      { "name": "Socket", "value": "AM5" },
      { "name": "Chipset", "value": "B850" },
      { "name": "VRM", "value": "16+2 fases" },
      { "name": "Rede", "value": "2.5G LAN + Wi-Fi 7" }
    ],
    "supplier_url": "https://www.asus.com/motherboards-components/motherboards/rog-strix/",
    "brand": "ASUS",
    "inStock": true,
    "stockCount": 50
  },
  {
    "id": 142,
    "name": "MSI MAG B850 Tomahawk",
    "category": "Motherboards",
    "price": "229,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-144-697-05.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/13-144-697-05.png"],
    "description": "A motherboard mais popular para builds AM5 de gama média. VRM sólida, design militar e todas as features essenciais sem luxos desnecessários.",
    "features": [
      { "name": "Socket", "value": "AM5" },
      { "name": "Chipset", "value": "B850" },
      { "name": "VRM", "value": "14 fases" },
      { "name": "Rede", "value": "2.5G LAN" }
    ],
    "supplier_url": "https://www.msi.com/Motherboard/MAG-B850-TOMAHAWK",
    "brand": "MSI",
    "inStock": true,
    "stockCount": 47
  },
  {
    "id": 143,
    "name": "Gigabyte Z890 AORUS Master",
    "category": "Motherboards",
    "price": "549,00 €",
    "oldPrice": "599,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-145-523-05.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/13-145-523-05.jpg"],
    "description": "Motherboard Z890 premium com VRM de 22+1+2 fases e back-drilled PCB de 8 camadas. Arrefecimento passivo Fins-Array III para M.2.",
    "badge": "AORUS Master",
    "features": [
      { "name": "Socket", "value": "LGA 1851" },
      { "name": "Chipset", "value": "Z890" },
      { "name": "VRM", "value": "22+1+2 fases" },
      { "name": "PCB", "value": "8 camadas back-drilled" }
    ],
    "supplier_url": "https://www.gigabyte.com/Motherboard/Z890-AORUS-MASTER",
    "brand": "Gigabyte",
    "inStock": true,
    "stockCount": 11
  },
  {
    "id": 144,
    "name": "ASRock B850M Pro RS",
    "category": "Motherboards",
    "price": "149,00 €",
    "rating": 4.2,
    "img": "https://c1.neweggimages.com/productimage/nb640/13-162-195-11.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/13-162-195-11.jpg"],
    "description": "Motherboard Micro-ATX AM5 económica mas capaz. 10 fases de VRM, DDR5, PCIe 5.0 M.2 — tudo o essencial para builds budget.",
    "features": [
      { "name": "Socket", "value": "AM5" },
      { "name": "Chipset", "value": "B850" },
      { "name": "Formato", "value": "Micro-ATX" },
      { "name": "VRM", "value": "10 fases" }
    ],
    "supplier_url": "https://www.asrock.com/mb/AMD/B850M%20Pro%20RS/",
    "brand": "ASRock",
    "inStock": true,
    "stockCount": 63
  },
  // =============================================
  // MEMÓRIA RAM (IDs 145-152)
  // =============================================
  {
    "id": 145,
    "name": "G.Skill Trident Z5 RGB DDR5-7200",
    "category": "Memória RAM",
    "price": "189,00 €",
    "oldPrice": "219,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-374-435-10.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-374-435-10.png"],
    "description": "Kit dual-channel DDR5-7200 CL34 com iluminação RGB cristalina. ICs Samsung selecionados para overclock estável até DDR5-8000+.",
    "badge": "High-End DDR5",
    "features": [
      { "name": "Capacidade", "value": "32 GB (2x16 GB)" },
      { "name": "Velocidade", "value": "DDR5-7200 CL34" },
      { "name": "Tensão", "value": "1.40V" },
      { "name": "RGB", "value": "Trident Z5 RGB" }
    ],
    "supplier_url": "https://www.gskill.com/product/165/390/Trident-Z5-RGB-DDR5",
    "brand": "G.Skill",
    "inStock": true,
    "stockCount": 29
  },
  {
    "id": 146,
    "name": "Corsair Dominator Titanium DDR5-6400",
    "category": "Memória RAM",
    "price": "249,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-982-097-02.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-982-097-02.png"],
    "description": "Módulos DDR5 premium com dissipador de alumínio anodizado e LED bar Corsair DHX. Compatibilidade EXPO e XMP 3.0 para overclock one-click.",
    "features": [
      { "name": "Capacidade", "value": "32 GB (2x16 GB)" },
      { "name": "Velocidade", "value": "DDR5-6400 CL32" },
      { "name": "Tensão", "value": "1.35V" },
      { "name": "Perfis", "value": "XMP 3.0 / EXPO" }
    ],
    "supplier_url": "https://www.corsair.com/us/en/p/memory/dominator-titanium",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 75
  },
  {
    "id": 147,
    "name": "Kingston Fury Beast DDR5-6000",
    "category": "Memória RAM",
    "price": "109,00 €",
    "oldPrice": "129,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-242-737-01.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-242-737-01.jpg"],
    "description": "Memória DDR5 fiável e acessível com dissipador metálico compacto. Ideal para builds equilibrados com perfis EXPO certificados para AMD.",
    "badge": "Budget Champion",
    "features": [
      { "name": "Capacidade", "value": "32 GB (2x16 GB)" },
      { "name": "Velocidade", "value": "DDR5-6000 CL36" },
      { "name": "Tensão", "value": "1.35V" },
      { "name": "Perfil", "value": "EXPO / XMP 3.0" }
    ],
    "supplier_url": "https://www.kingston.com/en/memory/gaming/kingston-fury-beast-ddr5-memory",
    "brand": "Kingston",
    "inStock": true,
    "stockCount": 39
  },
  {
    "id": 148,
    "name": "TeamGroup T-Force Delta RGB DDR5-7600",
    "category": "Memória RAM",
    "price": "169,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-331-810-07.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-331-810-07.jpg"],
    "description": "Kit DDR5-7600 com difusor de luz RGB full-surface e ICs Hynix A-die para timings apertados. Excelente desempenho em 1:1 com IF da AMD.",
    "features": [
      { "name": "Capacidade", "value": "32 GB (2x16 GB)" },
      { "name": "Velocidade", "value": "DDR5-7600 CL36" },
      { "name": "Tensão", "value": "1.40V" },
      { "name": "ICs", "value": "Hynix A-die" }
    ],
    "supplier_url": "https://www.teamgroupinc.com/en/product/delta-rgb-ddr5",
    "brand": "TeamGroup",
    "inStock": true,
    "stockCount": 36
  },
  {
    "id": 149,
    "name": "G.Skill Flare X5 DDR5-6000",
    "category": "Memória RAM",
    "price": "99,00 €",
    "oldPrice": "119,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-374-419-07.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-374-419-07.png"],
    "description": "Memória optimizada para AMD com EXPO certificado. Design low-profile sem RGB para builds limpos e compatibilidade com coolers tower.",
    "badge": "AMD Optimized",
    "features": [
      { "name": "Capacidade", "value": "32 GB (2x16 GB)" },
      { "name": "Velocidade", "value": "DDR5-6000 CL30" },
      { "name": "Tensão", "value": "1.35V" },
      { "name": "Design", "value": "Low-profile sem RGB" }
    ],
    "supplier_url": "https://www.gskill.com/product/165/401/Flare-X5-DDR5",
    "brand": "G.Skill",
    "inStock": true,
    "stockCount": 12
  },
  {
    "id": 150,
    "name": "Corsair Vengeance DDR5-5600",
    "category": "Memória RAM",
    "price": "79,00 €",
    "rating": 4.4,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-236-828-V01.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-236-828-V01.jpg"],
    "description": "Módulos DDR5 de entrada com compatibilidade universal. Perfil compacto, dissipador de alumínio e XMP 3.0 para overclock automático.",
    "features": [
      { "name": "Capacidade", "value": "32 GB (2x16 GB)" },
      { "name": "Velocidade", "value": "DDR5-5600 CL36" },
      { "name": "Tensão", "value": "1.25V" },
      { "name": "Perfil", "value": "XMP 3.0" }
    ],
    "supplier_url": "https://www.corsair.com/us/en/p/memory/vengeance-ddr5",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 21
  },
  {
    "id": 151,
    "name": "G.Skill Trident Z5 Neo DDR5-6400",
    "category": "Memória RAM",
    "price": "159,00 €",
    "oldPrice": "179,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-374-445-11.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-374-445-11.png"],
    "description": "Kit DDR5 optimizado para AMD AM5 com EXPO II. Timings CL30 ultra-apertados para desempenho máximo em Ryzen 9000 series.",
    "badge": "AMD EXPO II",
    "features": [
      { "name": "Capacidade", "value": "32 GB (2x16 GB)" },
      { "name": "Velocidade", "value": "DDR5-6400 CL30" },
      { "name": "Tensão", "value": "1.35V" },
      { "name": "Perfil", "value": "EXPO II certificado" }
    ],
    "supplier_url": "https://www.gskill.com/product/165/393/Trident-Z5-Neo-DDR5",
    "brand": "G.Skill",
    "inStock": true,
    "stockCount": 52
  },
  {
    "id": 152,
    "name": "Kingston Fury Renegade DDR5-8000",
    "category": "Memória RAM",
    "price": "329,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/AFYUD2402090ZFHPO84.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/AFYUD2402090ZFHPO84.jpg"],
    "description": "A memória DDR5 mais rápida do mercado. 8000 MT/s com ICs Hynix M-die selecionados para overclockers e benchmarkers profissionais.",
    "badge": "Velocidade Máxima",
    "features": [
      { "name": "Capacidade", "value": "32 GB (2x16 GB)" },
      { "name": "Velocidade", "value": "DDR5-8000 CL38" },
      { "name": "Tensão", "value": "1.45V" },
      { "name": "ICs", "value": "Hynix M-die selecionados" }
    ],
    "supplier_url": "https://www.kingston.com/en/memory/gaming/kingston-fury-renegade-ddr5",
    "brand": "Kingston",
    "inStock": true,
    "stockCount": 30
  },
  // =============================================
  // ARMAZENAMENTO (IDs 153-160)
  // =============================================
  {
    "id": 153,
    "name": "Samsung 990 EVO Plus 2TB",
    "category": "Armazenamento",
    "price": "179,00 €",
    "oldPrice": "199,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-147-900-02.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-147-900-02.jpg"],
    "description": "SSD NVMe PCIe 5.0 com velocidades de leitura até 10.000 MB/s. V-NAND de 8ª geração com controlador Samsung proprietário.",
    "badge": "PCIe 5.0",
    "features": [
      { "name": "Capacidade", "value": "2 TB" },
      { "name": "Interface", "value": "PCIe 5.0 x4 NVMe 2.0" },
      { "name": "Leitura/Escrita", "value": "10.000 / 9.000 MB/s" },
      { "name": "TBW", "value": "1.200 TB" }
    ],
    "supplier_url": "https://www.samsung.com/semiconductor/minisite/ssd/product/portable/990-evo-plus/",
    "brand": "Samsung",
    "inStock": true,
    "stockCount": 42
  },
  {
    "id": 154,
    "name": "WD Black SN850X 2TB",
    "category": "Armazenamento",
    "price": "149,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-250-247-02.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-250-247-02.jpg"],
    "description": "SSD NVMe PCIe 4.0 de referência para gaming. Até 7.300 MB/s de leitura com Game Mode 2.0 para carregamento preditivo de jogos.",
    "features": [
      { "name": "Capacidade", "value": "2 TB" },
      { "name": "Interface", "value": "PCIe 4.0 x4 NVMe" },
      { "name": "Leitura/Escrita", "value": "7.300 / 6.600 MB/s" },
      { "name": "TBW", "value": "1.200 TB" }
    ],
    "supplier_url": "https://www.westerndigital.com/products/internal-drives/wd-black-sn850x-nvme-ssd",
    "brand": "Western Digital",
    "inStock": true,
    "stockCount": 64
  },
  {
    "id": 155,
    "name": "Crucial T700 2TB",
    "category": "Armazenamento",
    "price": "219,00 €",
    "oldPrice": "259,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-156-329-19.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-156-329-19.jpg"],
    "description": "SSD PCIe 5.0 com dissipador de alumínio incluído. Velocidades até 12.400 MB/s com controlador Phison E26 e NAND Micron 232L.",
    "badge": "Ultra Rápido",
    "features": [
      { "name": "Capacidade", "value": "2 TB" },
      { "name": "Interface", "value": "PCIe 5.0 x4 NVMe 2.0" },
      { "name": "Leitura/Escrita", "value": "12.400 / 11.800 MB/s" },
      { "name": "TBW", "value": "1.200 TB" }
    ],
    "supplier_url": "https://www.crucial.com/ssd/t700/CT2000T700SSD3",
    "brand": "Crucial",
    "inStock": true,
    "stockCount": 10
  },
  {
    "id": 156,
    "name": "Seagate FireCuda 540 2TB",
    "category": "Armazenamento",
    "price": "199,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-248-242-01.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-248-242-01.jpg"],
    "description": "SSD PCIe 5.0 gaming com 10.000 MB/s e 3 anos de Rescue Data Recovery Services incluídos. DirectStorage optimizado.",
    "features": [
      { "name": "Capacidade", "value": "2 TB" },
      { "name": "Interface", "value": "PCIe 5.0 x4 NVMe 2.0" },
      { "name": "Leitura/Escrita", "value": "10.000 / 10.000 MB/s" },
      { "name": "Garantia", "value": "5 anos + Rescue" }
    ],
    "supplier_url": "https://www.seagate.com/products/gaming-drives/firecuda-540-ssd/",
    "brand": "Seagate",
    "inStock": true,
    "stockCount": 45
  },
  {
    "id": 157,
    "name": "Kingston KC3000 4TB",
    "category": "Armazenamento",
    "price": "299,00 €",
    "oldPrice": "349,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-242-661-S01.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-242-661-S01.jpg"],
    "description": "SSD NVMe de alta capacidade para quem precisa de espaço sem comprometer velocidade. 4 TB com leitura até 7.000 MB/s e perfil low-profile.",
    "badge": "Alta Capacidade",
    "features": [
      { "name": "Capacidade", "value": "4 TB" },
      { "name": "Interface", "value": "PCIe 4.0 x4 NVMe" },
      { "name": "Leitura/Escrita", "value": "7.000 / 7.000 MB/s" },
      { "name": "TBW", "value": "3.200 TB" }
    ],
    "supplier_url": "https://www.kingston.com/en/ssd/kc3000-nvme-m2-solid-state-drive",
    "brand": "Kingston",
    "inStock": true,
    "stockCount": 16
  },
  {
    "id": 158,
    "name": "Samsung 870 EVO 4TB",
    "category": "Armazenamento",
    "price": "249,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-147-795-V01.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-147-795-V01.jpg"],
    "description": "SSD SATA III de referência com 4 TB para armazenamento massivo. Ideal como drive secundário com fiabilidade comprovada e 2.400 TBW.",
    "features": [
      { "name": "Capacidade", "value": "4 TB" },
      { "name": "Interface", "value": "SATA III 6Gb/s" },
      { "name": "Leitura/Escrita", "value": "560 / 530 MB/s" },
      { "name": "TBW", "value": "2.400 TB" }
    ],
    "supplier_url": "https://www.samsung.com/semiconductor/minisite/ssd/product/portable/870-evo/",
    "brand": "Samsung",
    "inStock": true,
    "stockCount": 55
  },
  {
    "id": 159,
    "name": "Corsair MP700 PRO 2TB",
    "category": "Armazenamento",
    "price": "239,00 €",
    "oldPrice": "269,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/20-982-117-01.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/20-982-117-01.png"],
    "description": "SSD PCIe 5.0 com dissipador opcional para PS5 ou PC. Até 12.400 MB/s com NAND 3D TLC de alta densidade e DRAM cache.",
    "badge": "PS5 Compatible",
    "features": [
      { "name": "Capacidade", "value": "2 TB" },
      { "name": "Interface", "value": "PCIe 5.0 x4 NVMe 2.0" },
      { "name": "Leitura/Escrita", "value": "12.400 / 11.800 MB/s" },
      { "name": "TBW", "value": "1.400 TB" }
    ],
    "supplier_url": "https://www.corsair.com/us/en/p/data-storage/mp700-pro",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 57
  },
  {
    "id": 160,
    "name": "Sabrent Rocket 5 2TB",
    "category": "Armazenamento",
    "price": "189,00 €",
    "rating": 4.4,
    "img": "https://c1.neweggimages.com/productimage/nb640/BK19D24031310CPTJ37.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/BK19D24031310CPTJ37.jpg"],
    "description": "SSD NVMe PCIe 5.0 acessível com controlador Phison E26. Dissipador de cobre incluído e firmware optimizado para baixas temperaturas.",
    "features": [
      { "name": "Capacidade", "value": "2 TB" },
      { "name": "Interface", "value": "PCIe 5.0 x4 NVMe 2.0" },
      { "name": "Leitura/Escrita", "value": "14.000 / 12.000 MB/s" },
      { "name": "Dissipador", "value": "Cobre incluído" }
    ],
    "supplier_url": "https://www.sabrent.com/products/rocket-5",
    "brand": "Sabrent",
    "inStock": true,
    "stockCount": 33
  },
  // =============================================
  // FONTES DE ALIMENTAÇÃO (IDs 161-168)
  // =============================================
  {
    "id": 161,
    "name": "Corsair HX1500i",
    "category": "Fontes de Alimentação",
    "price": "399,00 €",
    "oldPrice": "449,00 €",
    "rating": 4.9,
    "img": "https://c1.neweggimages.com/productimage/nb640/17-139-343-17.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/17-139-343-17.jpg"],
    "description": "Fonte de alimentação 80 PLUS Platinum de 1500W totalmente modular. Conector 12VHPWR nativo e iCUE para monitorização em tempo real.",
    "badge": "Platinum 1500W",
    "features": [
      { "name": "Potência", "value": "1500 W" },
      { "name": "Eficiência", "value": "80+ Platinum" },
      { "name": "Modular", "value": "Totalmente modular" },
      { "name": "Conector GPU", "value": "12VHPWR nativo" }
    ],
    "supplier_url": "https://www.corsair.com/us/en/p/psu/hx1500i",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 29
  },
  {
    "id": 162,
    "name": "Seasonic PRIME TX-1000",
    "category": "Fontes de Alimentação",
    "price": "349,00 €",
    "rating": 4.9,
    "img": "https://c1.neweggimages.com/productimage/nb640/17-151-195-S09.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/17-151-195-S09.jpg"],
    "description": "Fonte 80 PLUS Titanium com 12 anos de garantia. A eficiência mais elevada do mercado com componentes japoneses de primeira qualidade.",
    "badge": "Titanium",
    "features": [
      { "name": "Potência", "value": "1000 W" },
      { "name": "Eficiência", "value": "80+ Titanium" },
      { "name": "Garantia", "value": "12 anos" },
      { "name": "Ventilação", "value": "Hybrid Fan Control" }
    ],
    "supplier_url": "https://seasonic.com/prime-tx",
    "brand": "Seasonic",
    "inStock": true,
    "stockCount": 34
  },
  {
    "id": 163,
    "name": "be quiet! Dark Power 13 850W",
    "category": "Fontes de Alimentação",
    "price": "229,00 €",
    "oldPrice": "259,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/A68VS23012716ZPU29A.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/A68VS23012716ZPU29A.jpg"],
    "description": "Fonte premium silenciosa com topologia full-bridge e LLC. Modo Overclocking Key para ajuste de tensões e ventoinha Silent Wings 4.",
    "features": [
      { "name": "Potência", "value": "850 W" },
      { "name": "Eficiência", "value": "80+ Titanium" },
      { "name": "Ventilação", "value": "Silent Wings 4 135mm" },
      { "name": "Conector GPU", "value": "12VHPWR nativo" }
    ],
    "supplier_url": "https://www.bequiet.com/en/powersupply/dark-power-13",
    "brand": "be quiet!",
    "inStock": true,
    "stockCount": 34
  },
  {
    "id": 165,
    "name": "Corsair RM850x 2024",
    "category": "Fontes de Alimentação",
    "price": "139,00 €",
    "oldPrice": "159,00 €",
    "rating": 4.6,
    "img": "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Power-Supply-Units/base-rmx-2024-config/gallery/black/850/RM850x_2024_01.webp",
    "gallery": ["https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Power-Supply-Units/base-rmx-2024-config/gallery/black/850/RM850x_2024_01.webp"],
    "description": "A fonte mais popular para gaming. 80 PLUS Gold com ventoinha magnética de levitação que opera em modo Zero RPM a cargas baixas.",
    "badge": "Best Seller",
    "features": [
      { "name": "Potência", "value": "850 W" },
      { "name": "Eficiência", "value": "80+ Gold" },
      { "name": "Modular", "value": "Totalmente modular" },
      { "name": "Ventilação", "value": "Zero RPM Mode" }
    ],
    "supplier_url": "https://www.corsair.com/us/en/p/psu/rm850x",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 52
  },
  {
    "id": 166,
    "name": "MSI MEG Ai1300P PCIE5",
    "category": "Fontes de Alimentação",
    "price": "329,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/17-701-018-04.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/17-701-018-04.jpg"],
    "description": "Fonte ATX 3.1 com 1300W e conector 12V-2x6 nativo. 80 PLUS Platinum com monitorização via app MSI Center para potência em tempo real.",
    "features": [
      { "name": "Potência", "value": "1300 W" },
      { "name": "Eficiência", "value": "80+ Platinum" },
      { "name": "Standard", "value": "ATX 3.1" },
      { "name": "Conector GPU", "value": "12V-2x6 nativo" }
    ],
    "supplier_url": "https://www.msi.com/Power-Supply/MEG-Ai1300P-PCIE5",
    "brand": "MSI",
    "inStock": true,
    "stockCount": 80
  },
  {
    "id": 167,
    "name": "Thermaltake Toughpower GF3 750W",
    "category": "Fontes de Alimentação",
    "price": "109,00 €",
    "oldPrice": "129,00 €",
    "rating": 4.3,
    "img": "https://c1.neweggimages.com/productimage/nb640/17-153-438-13.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/17-153-438-13.png"],
    "description": "Fonte ATX 3.0 acessível com conector 12VHPWR incluído. 80 PLUS Gold com ventoinha de 120mm hidráulica e cabos flat para gestão fácil.",
    "features": [
      { "name": "Potência", "value": "750 W" },
      { "name": "Eficiência", "value": "80+ Gold" },
      { "name": "Standard", "value": "ATX 3.0" },
      { "name": "Cabos", "value": "Flat modulares" }
    ],
    "supplier_url": "https://www.thermaltake.com/toughpower-gf3-750w.html",
    "brand": "Thermaltake",
    "inStock": true,
    "stockCount": 36
  },
  {
    "id": 168,
    "name": "Fractal Design Ion+ 2 860W",
    "category": "Fontes de Alimentação",
    "price": "149,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/17-580-034-V17.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/17-580-034-V17.jpg"],
    "description": "Fonte 80 PLUS Platinum com UltraFlex cables e ventoinha FDB de 140mm. Design escandinavo minimalista com 10 anos de garantia.",
    "features": [
      { "name": "Potência", "value": "860 W" },
      { "name": "Eficiência", "value": "80+ Platinum" },
      { "name": "Ventilação", "value": "FDB 140mm" },
      { "name": "Garantia", "value": "10 anos" }
    ],
    "supplier_url": "https://www.fractal-design.com/products/power-supplies/ion/",
    "brand": "Fractal Design",
    "inStock": true,
    "stockCount": 65
  },
  // =============================================
  // CAIXAS (IDs 169-176)
  // =============================================
  {
    "id": 169,
    "name": "Lian Li O11 Dynamic EVO 2",
    "category": "Caixas",
    "price": "179,00 €",
    "oldPrice": "199,00 €",
    "rating": 4.9,
    "img": "https://c1.neweggimages.com/productimage/nb640/2AM-000Z-000C0-01.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/2AM-000Z-000C0-01.png"],
    "description": "A caixa mais icónica para builds de showcase. Vidro temperado dual-chamber com suporte para radiadores de 360mm no topo e lateral.",
    "badge": "Showcase Icon",
    "features": [
      { "name": "Formato", "value": "Mid-Tower dual-chamber" },
      { "name": "Radiadores", "value": "360mm top + 360mm side" },
      { "name": "GPU Máx.", "value": "422 mm" },
      { "name": "Material", "value": "Alumínio + vidro temperado" }
    ],
    "supplier_url": "https://lian-li.com/product/o11-dynamic-evo-2/",
    "brand": "Lian Li",
    "inStock": true,
    "stockCount": 7
  },
  {
    "id": 170,
    "name": "Fractal Design North",
    "category": "Caixas",
    "price": "139,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/11-352-204-21.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/11-352-204-21.jpg"],
    "description": "Caixa com frente em madeira de nogueira real e mesh de aço. Design escandinavo elegante com fluxo de ar excepcional e filtros removíveis.",
    "badge": "Design Award",
    "features": [
      { "name": "Formato", "value": "Mid-Tower ATX" },
      { "name": "Frente", "value": "Madeira nogueira + mesh" },
      { "name": "Ventoinhas", "value": "2x 140mm incluídas" },
      { "name": "GPU Máx.", "value": "355 mm" }
    ],
    "supplier_url": "https://www.fractal-design.com/products/cases/north/",
    "brand": "Fractal Design",
    "inStock": true,
    "stockCount": 19
  },
  {
    "id": 172,
    "name": "Corsair 6500X",
    "category": "Caixas",
    "price": "219,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/11-139-219-01.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/11-139-219-01.png"],
    "description": "Caixa dual-chamber com vidro temperado em dois painéis para showcase total. Motherboard invertida e layout de cable management oculto.",
    "badge": "Dual Glass",
    "features": [
      { "name": "Formato", "value": "Mid-Tower dual-chamber" },
      { "name": "Vidro", "value": "Duplo painel temperado" },
      { "name": "Radiadores", "value": "360mm top + 360mm bottom" },
      { "name": "GPU Máx.", "value": "400 mm" }
    ],
    "supplier_url": "https://www.corsair.com/us/en/p/pc-cases/6500x",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 60
  },
  {
    "id": 173,
    "name": "Phanteks NV7",
    "category": "Caixas",
    "price": "159,00 €",
    "oldPrice": "179,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/A4RES2303280LL2R2D9.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/A4RES2303280LL2R2D9.jpg"],
    "description": "Full-tower espaçosa com suporte para GPUs até 480mm e radiadores de 420mm. Painéis magnéticos de fácil remoção e amplo espaço interno.",
    "features": [
      { "name": "Formato", "value": "Full-Tower ATX" },
      { "name": "GPU Máx.", "value": "480 mm" },
      { "name": "Radiadores", "value": "420mm top + 360mm front" },
      { "name": "Ventoinhas", "value": "3x 140mm incluídas" }
    ],
    "supplier_url": "https://www.phanteks.com/nv7.html",
    "brand": "Phanteks",
    "inStock": true,
    "stockCount": 6
  },
  {
    "id": 174,
    "name": "be quiet! Dark Base 802",
    "category": "Caixas",
    "price": "189,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/A68VS201113y09Tq.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/A68VS201113y09Tq.jpg"],
    "description": "Caixa modular com frente intercambiável entre mesh e painel sólido silencioso. 3 ventoinhas Silent Wings 4 e painéis com isolamento acústico.",
    "features": [
      { "name": "Formato", "value": "Mid-Tower ATX" },
      { "name": "Ventoinhas", "value": "3x Silent Wings 4" },
      { "name": "Frente", "value": "Intercambiável mesh/sólida" },
      { "name": "Isolamento", "value": "Painéis acústicos" }
    ],
    "supplier_url": "https://www.bequiet.com/en/case/dark-base-802",
    "brand": "be quiet!",
    "inStock": true,
    "stockCount": 25
  },
  {
    "id": 176,
    "name": "SSUPD Meshroom S",
    "category": "Caixas",
    "price": "129,00 €",
    "rating": 4.4,
    "img": "https://ssupd.co/cdn/shop/files/BK-5_13c43442-3cb4-435e-9f85-2675974facc3.png?v=1684638001",
    "gallery": ["https://ssupd.co/cdn/shop/files/BK-5_13c43442-3cb4-435e-9f85-2675974facc3.png?v=1684638001"],
    "description": "Caixa Mini-ITX compacta com mesh em todas as faces para airflow máximo. Apenas 14.7L de volume com suporte para GPU de 3 slots.",
    "features": [
      { "name": "Formato", "value": "Mini-ITX SFF (14.7L)" },
      { "name": "GPU Máx.", "value": "336 mm (3 slots)" },
      { "name": "Cooler Máx.", "value": "70 mm" },
      { "name": "Material", "value": "Mesh total em aço" }
    ],
    "supplier_url": "https://www.ssupd.co/products/meshroom-s",
    "brand": "SSUPD",
    "inStock": true,
    "stockCount": 49
  },
  // =============================================
  // REFRIGERAÇÃO (IDs 177-184)
  // =============================================
  {
    "id": 178,
    "name": "Corsair iCUE H170i Elite LCD XT",
    "category": "Refrigeração",
    "price": "329,00 €",
    "rating": 4.7,
    "img": "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Liquid-Cooling/base-elite-lcd-xt-cooler-config/Gallery/mandatory-configuration/Cooling_Radiator_Size_420mm/H170i_ELITE_LCD_XT_01.webp",
    "gallery": ["https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Liquid-Cooling/base-elite-lcd-xt-cooler-config/Gallery/mandatory-configuration/Cooling_Radiator_Size_420mm/H170i_ELITE_LCD_XT_01.webp"],
    "description": "AIO de 420mm com ecrã IPS no pump head e ventoinhas AF Elite RGB. Controlável via iCUE com widgets de temperatura em tempo real.",
    "features": [
      { "name": "Radiador", "value": "420 mm" },
      { "name": "Display", "value": "IPS LCD no pump" },
      { "name": "Ventoinhas", "value": "3x 140mm AF Elite RGB" },
      { "name": "Software", "value": "iCUE integrado" }
    ],
    "supplier_url": "https://www.corsair.com/us/en/p/cooling/h170i-elite-lcd-xt",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 14
  },
  {
    "id": 179,
    "name": "Noctua NH-D15 G2",
    "category": "Refrigeração",
    "price": "119,00 €",
    "oldPrice": "129,00 €",
    "rating": 4.9,
    "img": "https://c1.neweggimages.com/productimage/nb640/AADYS2407010JFQIKFA.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/AADYS2407010JFQIKFA.jpg"],
    "description": "O melhor air cooler do mundo, segunda geração. Dual-tower com 8 heatpipes e duas ventoinhas NF-A15 G2 PWM para silêncio absoluto.",
    "badge": "Rei do Air Cooling",
    "features": [
      { "name": "Tipo", "value": "Dual-tower air cooler" },
      { "name": "Heatpipes", "value": "8x cobre niquelado" },
      { "name": "Ventoinhas", "value": "2x NF-A15 G2 PWM" },
      { "name": "TDP", "value": "Até 300W+" }
    ],
    "supplier_url": "https://noctua.at/en/nh-d15-g2",
    "brand": "Noctua",
    "inStock": true,
    "stockCount": 11
  },
  {
    "id": 180,
    "name": "Arctic Liquid Freezer III 360 A-RGB",
    "category": "Refrigeração",
    "price": "99,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/A623D2412180WPFL385.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/A623D2412180WPFL385.jpg"],
    "description": "AIO 360mm com melhor relação preço/desempenho do mercado. VRM contact frame integrado no pump e ventoinhas P12 A-RGB PWM.",
    "badge": "Value King AIO",
    "features": [
      { "name": "Radiador", "value": "360 mm" },
      { "name": "Ventoinhas", "value": "3x P12 A-RGB PWM" },
      { "name": "Pump", "value": "Com VRM contact frame" },
      { "name": "Garantia", "value": "6 anos" }
    ],
    "supplier_url": "https://www.arctic.de/en/Liquid-Freezer-III-360-A-RGB",
    "brand": "Arctic",
    "inStock": true,
    "stockCount": 38
  },
  {
    "id": 181,
    "name": "Deepcool Assassin IV",
    "category": "Refrigeração",
    "price": "89,00 €",
    "oldPrice": "99,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/35-856-208-V01.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/35-856-208-V01.jpg"],
    "description": "Air cooler dual-tower premium com 7 heatpipes e cobertura metálica elegante. Desempenho próximo de AIO 360mm a preço de air cooler.",
    "features": [
      { "name": "Tipo", "value": "Dual-tower air cooler" },
      { "name": "Heatpipes", "value": "7x cobre niquelado" },
      { "name": "Ventoinhas", "value": "1x 120mm + 1x 140mm" },
      { "name": "TDP", "value": "Até 280W" }
    ],
    "supplier_url": "https://www.deepcool.com/products/Cooling/cpuaircoolers/Assassin-IV",
    "brand": "Deepcool",
    "inStock": true,
    "stockCount": 45
  },
  {
    "id": 182,
    "name": "EK-Nucleus AIO CR360 Dark",
    "category": "Refrigeração",
    "price": "179,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/A2W0S2410090A4OTIF0.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/A2W0S2410090A4OTIF0.jpg"],
    "description": "AIO 360mm da EK com design dark minimalista sem RGB. Pump de sexta geração e tubos de borracha premium anti-evaporação.",
    "features": [
      { "name": "Radiador", "value": "360 mm" },
      { "name": "Pump", "value": "EK 6ª geração" },
      { "name": "Design", "value": "Dark sem RGB" },
      { "name": "Tubos", "value": "Premium anti-evaporação" }
    ],
    "supplier_url": "https://www.ekwb.com/shop/ek-nucleus-aio-cr360-dark",
    "brand": "EKWB",
    "inStock": true,
    "stockCount": 41
  },
  {
    "id": 184,
    "name": "Lian Li Galahad II Trinity 360",
    "category": "Refrigeração",
    "price": "159,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/AFSTS230713zSCOJ.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/AFSTS230713zSCOJ.jpg"],
    "description": "AIO 360mm com pump Asetek de 8ª geração e ventoinhas Trinity Infinity Mirror RGB. Design minimalista com performance de topo.",
    "features": [
      { "name": "Radiador", "value": "360 mm" },
      { "name": "Pump", "value": "Asetek 8ª geração" },
      { "name": "Ventoinhas", "value": "3x Trinity Infinity RGB" },
      { "name": "Socket", "value": "LGA 1851 / AM5 / AM4" }
    ],
    "supplier_url": "https://lian-li.com/product/galahad-ii-trinity-360/",
    "brand": "Lian Li",
    "inStock": true,
    "stockCount": 23
  },
  // =============================================
  // MONITORES (IDs 185-192)
  // =============================================
  {
    "id": 185,
    "name": "Samsung Odyssey OLED G8 32\"",
    "category": "Monitores",
    "price": "999,00 €",
    "oldPrice": "1.099,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/24-027-327-23.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/24-027-327-23.jpg"],
    "description": "Monitor OLED 4K 240Hz com 0.03ms de tempo de resposta. Samsung Gaming Hub integrado e DisplayHDR True Black 400 para pretos perfeitos.",
    "badge": "4K OLED 240Hz",
    "features": [
      { "name": "Painel", "value": "QD-OLED 32\" 4K" },
      { "name": "Refresh", "value": "240 Hz" },
      { "name": "Resposta", "value": "0.03 ms GtG" },
      { "name": "HDR", "value": "DisplayHDR True Black 400" }
    ],
    "supplier_url": "https://www.samsung.com/us/monitors/gaming/odyssey-oled-g8/",
    "brand": "Samsung",
    "inStock": true,
    "stockCount": 77
  },
  {
    "id": 186,
    "name": "LG UltraGear 27GS95QE 27\" OLED",
    "category": "Monitores",
    "price": "799,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/24-026-405-08.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/24-026-405-08.jpg"],
    "description": "Monitor WOLED 1440p 240Hz com anti-glare coating e pixel refresh automático. Cores DCI-P3 98.5% para criadores e gamers exigentes.",
    "features": [
      { "name": "Painel", "value": "WOLED 27\" 1440p" },
      { "name": "Refresh", "value": "240 Hz" },
      { "name": "Cor", "value": "DCI-P3 98.5%" },
      { "name": "Resposta", "value": "0.03 ms GtG" }
    ],
    "supplier_url": "https://www.lg.com/us/monitors/gaming-monitors/27gs95qe-b/",
    "brand": "LG",
    "inStock": true,
    "stockCount": 15
  },
  {
    "id": 187,
    "name": "ASUS ROG Swift PG27AQN 27\"",
    "category": "Monitores",
    "price": "999,00 €",
    "oldPrice": "1.099,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/24-281-235-29.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/24-281-235-29.png"],
    "description": "O monitor IPS mais rápido do mundo: 360Hz nativo a 1440p. Painel AU Optronics com NVIDIA Reflex Analyzer integrado para esports.",
    "badge": "360Hz Esports",
    "features": [
      { "name": "Painel", "value": "IPS 27\" 1440p" },
      { "name": "Refresh", "value": "360 Hz" },
      { "name": "Resposta", "value": "1 ms GtG" },
      { "name": "G-Sync", "value": "NVIDIA G-Sync Ultimate" }
    ],
    "supplier_url": "https://www.asus.com/displays-desktops/monitors/rog/rog-swift-pg27aqn/",
    "brand": "ASUS",
    "inStock": true,
    "stockCount": 50
  },
  {
    "id": 188,
    "name": "Dell Alienware AW3225QF 32\" 4K",
    "category": "Monitores",
    "price": "1.099,00 €",
    "rating": 4.9,
    "img": "https://c1.neweggimages.com/productimage/nb640/A8X5S2407090QW0JX8A.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/A8X5S2407090QW0JX8A.jpg"],
    "description": "Monitor QD-OLED 4K 240Hz curvo com Infinity Edge. O melhor monitor gaming do mercado com Dolby Vision, HDR True Black 400 e HDMI 2.1.",
    "badge": "Best in Class",
    "features": [
      { "name": "Painel", "value": "QD-OLED 32\" 4K curvo" },
      { "name": "Refresh", "value": "240 Hz" },
      { "name": "HDR", "value": "Dolby Vision + True Black 400" },
      { "name": "Conectividade", "value": "HDMI 2.1 + DP 2.1" }
    ],
    "supplier_url": "https://www.dell.com/en-us/shop/alienware-32-4k-qd-oled-gaming-monitor-aw3225qf/apd/210-blmq/",
    "brand": "Dell",
    "inStock": true,
    "stockCount": 63
  },
  {
    "id": 189,
    "name": "BenQ MOBIUZ EX3210U 32\" 4K",
    "category": "Monitores",
    "price": "699,00 €",
    "oldPrice": "799,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/24-014-880-10.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/24-014-880-10.jpg"],
    "description": "Monitor IPS 4K 144Hz com sistema de som treVolo integrado. HDRi automático e Light Tuner para ajuste preciso em jogos escuros.",
    "features": [
      { "name": "Painel", "value": "IPS 32\" 4K" },
      { "name": "Refresh", "value": "144 Hz" },
      { "name": "Som", "value": "treVolo 2.1ch integrado" },
      { "name": "HDR", "value": "DisplayHDR 600" }
    ],
    "supplier_url": "https://www.benq.com/en-us/monitor/gaming/ex3210u.html",
    "brand": "BenQ",
    "inStock": true,
    "stockCount": 73
  },
  {
    "id": 190,
    "name": "Gigabyte M27U 27\" 4K",
    "category": "Monitores",
    "price": "449,00 €",
    "rating": 4.4,
    "img": "https://c1.neweggimages.com/productimage/nb640/24-012-061-10.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/24-012-061-10.jpg"],
    "description": "Monitor 4K 160Hz com KVM switch integrado para alternar entre PC e consola. Painel SS IPS com 95% DCI-P3 e HDMI 2.1.",
    "badge": "KVM Integrado",
    "features": [
      { "name": "Painel", "value": "SS IPS 27\" 4K" },
      { "name": "Refresh", "value": "160 Hz" },
      { "name": "KVM", "value": "Switch integrado" },
      { "name": "Cor", "value": "DCI-P3 95%" }
    ],
    "supplier_url": "https://www.gigabyte.com/Monitor/M27U",
    "brand": "Gigabyte",
    "inStock": true,
    "stockCount": 48
  },
  {
    "id": 191,
    "name": "MSI MAG 341CQP 34\" OLED",
    "category": "Monitores",
    "price": "799,00 €",
    "oldPrice": "899,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/24-475-350-11.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/24-475-350-11.jpg"],
    "description": "Ultrawide OLED 34\" 3440x1440 a 175Hz curvo. Imersão cinematográfica com pretos perfeitos e campo de visão expandido para simuladores e RPGs.",
    "badge": "Ultrawide OLED",
    "features": [
      { "name": "Painel", "value": "OLED 34\" UWQHD curvo" },
      { "name": "Refresh", "value": "175 Hz" },
      { "name": "Resposta", "value": "0.03 ms GtG" },
      { "name": "Curvatura", "value": "1800R" }
    ],
    "supplier_url": "https://www.msi.com/Monitor/MAG-341CQP-QD-OLED",
    "brand": "MSI",
    "inStock": true,
    "stockCount": 80
  },
  {
    "id": 192,
    "name": "AOC AGON AG275QXL 27\"",
    "category": "Monitores",
    "price": "349,00 €",
    "rating": 4.3,
    "img": "https://c1.neweggimages.com/productimage/nb640/3D4-001B-00063-07.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/3D4-001B-00063-07.jpg"],
    "description": "Monitor gaming 1440p 170Hz com painel IPS de alta gama a preço acessível. G-Sync Compatible e sRGB 117% para cores vibrantes.",
    "features": [
      { "name": "Painel", "value": "IPS 27\" 1440p" },
      { "name": "Refresh", "value": "170 Hz" },
      { "name": "Resposta", "value": "1 ms GtG" },
      { "name": "Sync", "value": "G-Sync Compatible" }
    ],
    "supplier_url": "https://eu.aoc.com/en/gaming-monitors/ag275qxl",
    "brand": "AOC",
    "inStock": true,
    "stockCount": 33
  },
  // =============================================
  // TECLADOS E RATOS (IDs 193-200)
  // =============================================
  {
    "id": 193,
    "name": "Wooting 80HE",
    "category": "Teclados e Ratos",
    "price": "199,00 €",
    "oldPrice": "219,00 €",
    "rating": 4.9,
    "img": "https://c1.neweggimages.com/ProductImageOriginal/AZB2S2507310G9Q4VFD.jpg",
    "gallery": ["https://c1.neweggimages.com/ProductImageOriginal/AZB2S2507310G9Q4VFD.jpg"],
    "description": "Teclado Hall Effect com Rapid Trigger e ponto de actuação ajustável de 0.1mm a 4.0mm. O standard de ouro para gaming competitivo.",
    "badge": "Esports Pro",
    "features": [
      { "name": "Switches", "value": "Hall Effect analógicos" },
      { "name": "Rapid Trigger", "value": "0.1mm - 4.0mm" },
      { "name": "Layout", "value": "TKL (80%)" },
      { "name": "Conexão", "value": "USB-C / Wireless" }
    ],
    "supplier_url": "https://wooting.io/wooting-80he",
    "brand": "Wooting",
    "inStock": true,
    "stockCount": 42
  },
  {
    "id": 196,
    "name": "Keychron Q1 HE",
    "category": "Teclados e Ratos",
    "price": "179,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/ProductImageCompressAll60/23-937-168-01.jpg",
    "gallery": ["https://c1.neweggimages.com/ProductImageCompressAll60/23-937-168-01.jpg"],
    "description": "Teclado mecânico Hall Effect com chassis de alumínio CNC. Rapid Trigger, gasket mount e compatível com QMK/VIA para personalização total.",
    "features": [
      { "name": "Switches", "value": "Hall Effect Gateron" },
      { "name": "Chassis", "value": "Alumínio CNC 6063" },
      { "name": "Layout", "value": "75%" },
      { "name": "Firmware", "value": "QMK / VIA" }
    ],
    "supplier_url": "https://www.keychron.com/products/keychron-q1-he",
    "brand": "Keychron",
    "inStock": true,
    "stockCount": 56
  },
  {
    "id": 197,
    "name": "Pulsar X2V2 Mini Wireless",
    "category": "Teclados e Ratos",
    "price": "99,00 €",
    "oldPrice": "119,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/BTD4D24050514RTS408.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/BTD4D24050514RTS408.jpg"],
    "description": "Rato simétrico ultra-leve de 52g para mãos pequenas a médias. Sensor PAW3395 e switches ópticos Kailh para zero double-click.",
    "badge": "Ultra Light",
    "features": [
      { "name": "Sensor", "value": "PAW3395 (26K DPI)" },
      { "name": "Peso", "value": "52 g" },
      { "name": "Switches", "value": "Kailh ópticos" },
      { "name": "Bateria", "value": "120 horas" }
    ],
    "supplier_url": "https://www.pulsar.gg/x2v2-mini-wireless",
    "brand": "Pulsar",
    "inStock": true,
    "stockCount": 15
  },
  {
    "id": 198,
    "name": "SteelSeries Apex Pro TKL 2024",
    "category": "Teclados e Ratos",
    "price": "189,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/23-239-062-04.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/23-239-062-04.jpg"],
    "description": "Teclado com switches OmniPoint 3.0 magnéticos e Rapid Trigger ajustável. Ecrã OLED integrado e chassis de alumínio premium.",
    "features": [
      { "name": "Switches", "value": "OmniPoint 3.0 magnéticos" },
      { "name": "Rapid Trigger", "value": "0.1mm - 4.0mm" },
      { "name": "Display", "value": "OLED integrado" },
      { "name": "Layout", "value": "TKL" }
    ],
    "supplier_url": "https://steelseries.com/gaming-keyboards/apex-pro-tkl-2024",
    "brand": "SteelSeries",
    "inStock": true,
    "stockCount": 64
  },
  {
    "id": 199,
    "name": "Endgame Gear OP1we",
    "category": "Teclados e Ratos",
    "price": "79,00 €",
    "oldPrice": "89,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/ProductImage/BT8WS24030506GDP869.jpg",
    "gallery": ["https://c1.neweggimages.com/ProductImage/BT8WS24030506GDP869.jpg"],
    "description": "Rato ergonómico wireless de 59g com sensor PixArt PAW3395 e switches Kailh GM 8.0. Shape inspirado no lendário Intellimouse.",
    "features": [
      { "name": "Sensor", "value": "PAW3395 (26K DPI)" },
      { "name": "Peso", "value": "59 g" },
      { "name": "Switches", "value": "Kailh GM 8.0" },
      { "name": "Conexão", "value": "2.4GHz + Bluetooth" }
    ],
    "supplier_url": "https://www.endgamegear.com/op1we",
    "brand": "Endgame Gear",
    "inStock": true,
    "stockCount": 9
  },
  {
    "id": 200,
    "name": "Corsair K70 MAX",
    "category": "Teclados e Ratos",
    "price": "229,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/23-816-165-05.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/23-816-165-05.png"],
    "description": "Teclado full-size com switches magnéticos MGX e Rapid Trigger. Chassis de alumínio escovado, apoio de pulso em couro e iCUE RGB.",
    "features": [
      { "name": "Switches", "value": "Corsair MGX magnéticos" },
      { "name": "Rapid Trigger", "value": "Ajustável" },
      { "name": "Layout", "value": "Full-size" },
      { "name": "Extra", "value": "Apoio pulso em couro" }
    ],
    "supplier_url": "https://www.corsair.com/us/en/p/keyboards/k70-max",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 53
  },
  // =============================================
  // HEADSETS E ÁUDIO (IDs 201-208)
  // =============================================
  {
    "id": 202,
    "name": "Audeze Maxwell Wireless",
    "category": "Headsets e Áudio",
    "price": "299,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb640/A17PD2404010V788PC0.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/A17PD2404010V788PC0.jpg"],
    "description": "Headset com drivers planares magnéticos de 90mm para fidelidade audiófila. DSP Waves NX para espacialização 3D e 80 horas de bateria.",
    "features": [
      { "name": "Drivers", "value": "Planares magnéticos 90mm" },
      { "name": "DSP", "value": "Waves NX 3D" },
      { "name": "Bateria", "value": "80 horas" },
      { "name": "Conexão", "value": "2.4GHz + Bluetooth 5.3" }
    ],
    "supplier_url": "https://www.audeze.com/products/maxwell-wireless",
    "brand": "Audeze",
    "inStock": true,
    "stockCount": 25
  },
  {
    "id": 204,
    "name": "Razer BlackShark V2 Pro 2024",
    "category": "Headsets e Áudio",
    "price": "179,00 €",
    "rating": 4.6,
    "img": "https://c1.neweggimages.com/productimage/nb640/A17PD2404010V71LCEF.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/A17PD2404010V71LCEF.jpg"],
    "description": "Headset esports com drivers TriForce Titanium de 50mm e HyperSpeed wireless. Microfone removível com isolamento de câmara e THX Spatial Audio.",
    "features": [
      { "name": "Drivers", "value": "TriForce Titanium 50mm" },
      { "name": "Wireless", "value": "HyperSpeed 2.4GHz" },
      { "name": "Audio", "value": "THX Spatial Audio" },
      { "name": "Bateria", "value": "70 horas" }
    ],
    "supplier_url": "https://www.razer.com/gaming-headsets/razer-blackshark-v2-pro-2024",
    "brand": "Razer",
    "inStock": true,
    "stockCount": 11
  },
  {
    "id": 205,
    "name": "Beyerdynamic DT 900 PRO X",
    "category": "Headsets e Áudio",
    "price": "249,00 €",
    "oldPrice": "279,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb640/26-380-048-V05.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/26-380-048-V05.jpg"],
    "description": "Auscultadores abertos de estúdio com driver STELLAR.45 para monitoring e gaming imersivo. Impedância de 48 Ohm — funciona sem amp dedicado.",
    "badge": "Studio Grade",
    "features": [
      { "name": "Drivers", "value": "STELLAR.45 (45mm)" },
      { "name": "Impedância", "value": "48 Ohm" },
      { "name": "Design", "value": "Open-back circum-aural" },
      { "name": "Cabo", "value": "Mini-XLR destacável" }
    ],
    "supplier_url": "https://www.beyerdynamic.com/dt-900-pro-x.html",
    "brand": "Beyerdynamic",
    "inStock": true,
    "stockCount": 20
  },
  {
    "id": 206,
    "name": "Corsair Virtuoso Pro",
    "category": "Headsets e Áudio",
    "price": "219,00 €",
    "rating": 4.5,
    "img": "https://c1.neweggimages.com/productimage/nb640/26-816-215-08.png",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/26-816-215-08.png"],
    "description": "Headset open-back para streaming e gaming com drivers de grafeno e microfone broadcast destacável. Qualidade de áudio comparável a headphones de estúdio.",
    "features": [
      { "name": "Drivers", "value": "Grafeno 50mm" },
      { "name": "Design", "value": "Open-back circum-aural" },
      { "name": "Microfone", "value": "Broadcast omnidirecional" },
      { "name": "Conexão", "value": "USB-C / 3.5mm" }
    ],
    "supplier_url": "https://www.corsair.com/us/en/p/gaming-headsets/virtuoso-pro",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 17
  },
  // =============================================
  // CADEIRAS GAMING (IDs 209-216)
  // =============================================
  {
    "id": 209,
    "name": "Secretlab Titan Evo 2024",
    "category": "Cadeiras Gaming",
    "price": "519,00 €",
    "oldPrice": "569,00 €",
    "rating": 4.8,
    "img": "https://secretlab.co/cdn/shop/products/SL_TitanEvoR_PU_Stealth0001_S_grande.jpg?v=1626023686",
    "gallery": ["https://secretlab.co/cdn/shop/products/SL_TitanEvoR_PU_Stealth0001_S_grande.jpg?v=1626023686"],
    "description": "A cadeira gaming mais vendida do mundo, versão 2024. Suporte lombar L-ADAPT com 4 vias, espuma de frio e acabamento SoftWeave Plus.",
    "badge": "Best Seller Mundial",
    "features": [
      { "name": "Material", "value": "SoftWeave Plus" },
      { "name": "Lombar", "value": "L-ADAPT 4 vias integrado" },
      { "name": "Reclinação", "value": "85° - 165°" },
      { "name": "Carga Máx.", "value": "130 kg" }
    ],
    "supplier_url": "https://secretlab.co/collections/titan-evo",
    "brand": "Secretlab",
    "inStock": true,
    "stockCount": 44
  },
  {
    "id": 213,
    "name": "Corsair TC200 Fabric",
    "category": "Cadeiras Gaming",
    "price": "349,00 €",
    "oldPrice": "399,00 €",
    "rating": 4.4,
    "img": "https://c1.neweggimages.com/productimage/nb640/A6ZPD2309280ZGX0D8A.jpg",
    "gallery": ["https://c1.neweggimages.com/productimage/nb640/A6ZPD2309280ZGX0D8A.jpg"],
    "description": "Cadeira gaming com tecido respirável Soft Fabric e almofada lombar em espuma viscoelástica. Design compacto ideal para secretárias standard.",
    "features": [
      { "name": "Material", "value": "Soft Fabric respirável" },
      { "name": "Almofada", "value": "Lombar viscoelástica" },
      { "name": "Reclinação", "value": "90° - 160°" },
      { "name": "Carga Máx.", "value": "120 kg" }
    ],
    "supplier_url": "https://www.corsair.com/us/en/p/gaming-chairs/tc200-fabric",
    "brand": "Corsair",
    "inStock": true,
    "stockCount": 65
  },
  {
    "id": 214,
    "name": "Steelcase Karman",
    "category": "Cadeiras Gaming",
    "price": "1.199,00 €",
    "rating": 4.7,
    "img": "https://images.steelcase.com/image/upload/v1690833473/21-0163191-4-scaled.jpg",
    "gallery": ["https://images.steelcase.com/image/upload/v1690833473/21-0163191-4-scaled.jpg"],
    "description": "Cadeira ergonómica ultra-leve com apenas 10 kg. Encosto em InterWoven Suspension para suporte e ventilação natural sem espuma tradicional.",
    "badge": "Ergonomia Next-Gen",
    "features": [
      { "name": "Material", "value": "InterWoven Suspension" },
      { "name": "Peso Cadeira", "value": "Apenas 10 kg" },
      { "name": "Ajustes", "value": "FlexFrame adaptativo" },
      { "name": "Garantia", "value": "12 anos" }
    ],
    "supplier_url": "https://www.steelcase.com/products/office-chairs/steelcase-karman/",
    "brand": "Steelcase",
    "inStock": true,
    "stockCount": 29
  },
  {
    "id": 215,
    "name": "IKEA MATCHSPEL",
    "category": "Cadeiras Gaming",
    "price": "199,00 €",
    "rating": 4.1,
    "img": "https://www.ikea.com/us/en/images/products/matchspel-gaming-chair-bomstad-black__0985645_pe816716_s5.jpg",
    "gallery": ["https://www.ikea.com/us/en/images/products/matchspel-gaming-chair-bomstad-black__0985645_pe816716_s5.jpg"],
    "description": "Cadeira gaming budget da IKEA com encosto em rede respirável e apoio lombar ajustável. Mecanismo de báscula e altura ajustável a gás.",
    "features": [
      { "name": "Material", "value": "Rede respirável Vissle" },
      { "name": "Lombar", "value": "Ajustável em altura" },
      { "name": "Báscula", "value": "Mecanismo integrado" },
      { "name": "Carga Máx.", "value": "110 kg" }
    ],
    "supplier_url": "https://www.ikea.com/us/en/p/matchspel-gaming-chair/",
    "brand": "IKEA",
    "inStock": true,
    "stockCount": 13
  },
  {
    "id": 216,
    "name": "AndaSeat Kaiser 4",
    "category": "Cadeiras Gaming",
    "price": "549,00 €",
    "oldPrice": "599,00 €",
    "rating": 4.6,
    "img": "https://www.andaseat.com/cdn/shop/files/AndaSeat-new-kaiser-4-series-gaming-chair-elegant-black-45.webp?v=1764403213",
    "gallery": ["https://www.andaseat.com/cdn/shop/files/AndaSeat-new-kaiser-4-series-gaming-chair-elegant-black-45.webp?v=1764403213"],
    "description": "Cadeira gaming XL com MagClap magnetic lumbar para ajuste instantâneo. Espuma moldada a frio de alta resiliência e braços 4D magnéticos.",
    "badge": "XL MagClap",
    "features": [
      { "name": "Lombar", "value": "MagClap magnético" },
      { "name": "Espuma", "value": "Moldada a frio HR" },
      { "name": "Braços", "value": "4D magnéticos" },
      { "name": "Carga Máx.", "value": "180 kg" }
    ],
    "supplier_url": "https://www.andaseat.com/products/kaiser-4",
    "brand": "AndaSeat",
    "inStock": true,
    "stockCount": 79
  }

];
