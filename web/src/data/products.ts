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
    ]
  },
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
    ]
  },
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
    ]
  },
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
    ]
  },
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
    ]
  },
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
    ]
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
    ]
  },
  {
    "id": 8,
    "name": "Lian Li Lancool 216 RGB White",
    "category": "Caixas",
    "price": "95,00 €",
    "oldPrice": "115,00 €",
    "rating": 4.8,
    "img": "https://c1.neweggimages.com/productimage/nb1280/AFSTS2211290JUTT4B6.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb1280/AFSTS2211290JUTT4B6.jpg"
    ],
    "description": "Fluxo de ar superior com dois ventoinhas frontais de 160mm PWM incluídos e painel lateral em vidro temperado de 4mm. Design modular e estética clean.",
    "badge": "Airflow King",
    "features": [
      { "name": "Front Fans", "value": "2 × 160mm PWM" },
      { "name": "Suporte", "value": "E-ATX" },
      { "name": "Vidro", "value": "Temperado 4mm" },
      { "name": "Cor", "value": "Branco" }
    ]
  },
  {
    "id": 9,
    "name": "MSI MAG B650 Tomahawk WiFi",
    "category": "Motherboards",
    "price": "198,00 €",
    "oldPrice": "229,00 €",
    "rating": 4.7,
    "img": "https://c1.neweggimages.com/productimage/nb1280/13-144-557-01.jpg",
    "gallery": [
      "https://c1.neweggimages.com/productimage/nb1280/13-144-557-01.jpg"
    ],
    "description": "A base sólida para o teu setup AM5. VRM robusto de 14+2+1 fases, suporte DDR5 até 6400MHz e WiFi 6E integrado para conectividade sem fios de próxima geração.",
    "badge": "Base Sólida",
    "features": [
      { "name": "Socket", "value": "AM5 (Ryzen 7000)" },
      { "name": "Fases VRM", "value": "14+2+1" },
      { "name": "WiFi", "value": "6E (2.4GHz/5GHz/6GHz)" },
      { "name": "PCIe", "value": "5.0 x16" }
    ]
  },
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
    ]
  },
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
    ]
  },
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
    ]
  },
  {
    "id": 13,
    "name": "Intel Core i9-14900K",
    "category": "Processadores",
    "price": "549,00 €",
    "oldPrice": "629,00 €",
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
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
    ]
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
    ]
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
    ]
  }
];
