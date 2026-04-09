export interface SeoCategory {
  slug: string;
  name: string;
  displayName: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  guideSlug: string;
}

export const seoCategories: SeoCategory[] = [
  {
    slug: "processadores",
    name: "Processadores",
    displayName: "Processadores",
    metaTitle: "Comprar Processadores em Portugal | AMD Ryzen & Intel Core",
    metaDescription:
      "Os melhores processadores AMD Ryzen e Intel Core disponiveis em Portugal. CPUs para gaming, edicao de video e workstations profissionais. Entrega rapida e pagamento MBWay.",
    intro:
      "Encontre o processador ideal para o seu PC na VoltStock. Temos os modelos mais recentes da AMD e Intel, desde os Ryzen 7 para gaming ate aos Threadripper para workstations profissionais. Todos os nossos CPUs vem com garantia e entrega rapida em Portugal.",
    guideSlug: "processadores",
  },
  {
    slug: "placas-graficas",
    name: "Placas Graficas",
    displayName: "Placas Graficas",
    metaTitle: "Comprar Placas Graficas Portugal | RTX 5090, RX 9070",
    metaDescription:
      "Placas graficas NVIDIA GeForce RTX e AMD Radeon RX em stock. RTX 5090, RTX 4090, RX 9070 XT e mais. Melhores precos em Portugal com entrega rapida.",
    intro:
      "Descubra a nossa selecao de placas graficas de topo. Desde as poderosas NVIDIA RTX 5090 para 4K/8K ate as AMD Radeon RX para excelente relacao qualidade-preco. GPUs para gaming, criacao de conteudo e inteligencia artificial, com entrega em todo o Portugal.",
    guideSlug: "placas-graficas",
  },
  {
    slug: "motherboards",
    name: "Motherboards",
    displayName: "Motherboards",
    metaTitle: "Comprar Motherboards Portugal | AM5, LGA 1851, DDR5",
    metaDescription:
      "Motherboards ASUS, MSI, Gigabyte e ASRock para AMD AM5 e Intel LGA 1851. Suporte DDR5 e PCIe 5.0. As melhores placas-mae em Portugal com garantia.",
    intro:
      "A motherboard e a espinha dorsal do seu PC. Na VoltStock, oferecemos as melhores placas-mae para AMD e Intel, com suporte para DDR5, PCIe 5.0 e Wi-Fi 7. Marcas de confianca como ASUS ROG, MSI MAG, Gigabyte AORUS e ASRock, todas com garantia em Portugal.",
    guideSlug: "motherboards",
  },
  {
    slug: "memoria-ram",
    name: "Memoria RAM",
    displayName: "Memoria RAM",
    metaTitle: "Comprar Memoria RAM DDR5 Portugal | Corsair, G.Skill, Kingston",
    metaDescription:
      "Memoria RAM DDR5 de alta performance para gaming e producao. Corsair Dominator, G.Skill Trident Z5, Kingston Fury. Melhores precos em Portugal.",
    intro:
      "Maximize o desempenho do seu sistema com memoria RAM DDR5 de alta velocidade. Temos kits de 16GB, 32GB e 64GB das melhores marcas: Corsair, G.Skill, Kingston e Crucial. RAM com perfis XMP/EXPO para overclock facil, entrega rapida em Portugal.",
    guideSlug: "memoria-ram",
  },
  {
    slug: "armazenamento",
    name: "Armazenamento",
    displayName: "Armazenamento",
    metaTitle: "Comprar SSD NVMe e HDD Portugal | Samsung, WD, Crucial",
    metaDescription:
      "SSDs NVMe Gen 5 e Gen 4, SSDs SATA e HDDs de alta capacidade. Samsung 990 Pro, WD Black SN850X, Crucial T700. Armazenamento rapido em Portugal.",
    intro:
      "Acelere o seu PC com SSDs NVMe de ultima geracao ou expanda a capacidade com HDDs de alto volume. Temos os SSDs mais rapidos do mercado, incluindo modelos PCIe Gen 5 com velocidades superiores a 12 GB/s, alem de opcoes economicas para armazenamento secundario.",
    guideSlug: "armazenamento",
  },
  {
    slug: "fontes-alimentacao",
    name: "Fontes de Alimentacao",
    displayName: "Fontes de Alimentacao",
    metaTitle: "Comprar Fontes de Alimentacao Portugal | 80+ Gold, Platinum",
    metaDescription:
      "Fontes de alimentacao ATX 3.0 certificadas 80+ Gold e Platinum. Corsair, Seasonic, be quiet! De 650W a 1600W. Envio para todo o Portugal.",
    intro:
      "Uma fonte de alimentacao de qualidade e essencial para proteger os seus componentes. Oferecemos PSUs modulares e semi-modulares das marcas mais fiaveis: Corsair, Seasonic e be quiet!, com certificacao 80+ Gold, Platinum e Titanium. Compatibilidade ATX 3.0 com conector 12VHPWR.",
    guideSlug: "fontes-alimentacao",
  },
  {
    slug: "caixas",
    name: "Caixas",
    displayName: "Caixas PC",
    metaTitle: "Comprar Caixas PC Portugal | Mid-Tower, Full-Tower, Mini-ITX",
    metaDescription:
      "Caixas para PC gaming e workstation. Lian Li, NZXT, Fractal Design, Phanteks. Mid-tower, full-tower e mini-ITX. Melhores precos em Portugal.",
    intro:
      "Encontre a caixa perfeita para o seu build. Desde caixas compactas mini-ITX para builds elegantes ate torres full-tower com espaco para refrigeracao liquida personalizada. Marcas premium como Lian Li, NZXT, Fractal Design e Phanteks, todas disponiveis em Portugal.",
    guideSlug: "caixas-pc",
  },
  {
    slug: "refrigeracao",
    name: "Refrigeracao",
    displayName: "Refrigeracao",
    metaTitle: "Comprar Refrigeracao PC Portugal | AIO, Air Cooler, Ventoinhas",
    metaDescription:
      "Coolers de CPU, AIOs de 240mm a 420mm e ventoinhas de alta performance. Noctua, Arctic, Corsair, be quiet!. Refrigeracao silenciosa em Portugal.",
    intro:
      "Mantenha o seu sistema fresco e silencioso com as nossas solucoes de refrigeracao. Desde air coolers Noctua e be quiet! ate AIOs Corsair e Arctic com ecranes LCD. Ventoinhas de alto fluxo de ar e pressao estatica para a melhor circulacao de ar no seu PC.",
    guideSlug: "refrigeracao",
  },
  {
    slug: "monitores",
    name: "Monitores",
    displayName: "Monitores",
    metaTitle: "Comprar Monitores Gaming Portugal | 4K, 240Hz, OLED",
    metaDescription:
      "Monitores gaming 4K, 1440p e 1080p de 240Hz a 360Hz. ASUS ROG, LG, Samsung, BenQ. Paineis OLED e IPS. Os melhores monitores em Portugal.",
    intro:
      "Descubra a nossa gama de monitores para gaming e produtividade. Desde paineis OLED 4K para cores perfeitas ate monitores 360Hz para esports competitivo. Marcas de referencia como ASUS ROG, LG UltraGear, Samsung Odyssey e BenQ, com entrega em Portugal.",
    guideSlug: "monitores",
  },
  {
    slug: "teclados-ratos",
    name: "Teclados e Ratos",
    displayName: "Teclados e Ratos",
    metaTitle: "Comprar Teclados e Ratos Gaming Portugal | Mecanicos, Wireless",
    metaDescription:
      "Teclados mecanicos e ratos gaming de alta precisao. Razer, Logitech, SteelSeries, Corsair. Switches Cherry MX, sensores 30K DPI. Portugal.",
    intro:
      "Eleve a sua experiencia de gaming e produtividade com teclados mecanicos premium e ratos de alta precisao. Switches personalizaveis, sensores opticos de 30.000 DPI, conectividade wireless com latencia minima. As melhores marcas de perifericos, disponiveis em Portugal.",
    guideSlug: "teclados-ratos",
  },
  {
    slug: "headsets-audio",
    name: "Headsets e Audio",
    displayName: "Headsets e Audio",
    metaTitle: "Comprar Headsets Gaming Portugal | Wireless, 7.1 Surround",
    metaDescription:
      "Headsets gaming wireless e com fio. Audio espacial 7.1, microfone com cancelamento de ruido. Razer, SteelSeries, HyperX, Corsair em Portugal.",
    intro:
      "Audio de qualidade e essencial para imersao total em jogos e comunicacao clara em reunioes. Os nossos headsets oferecem som surround 7.1, microfones com cancelamento de ruido ativo e conforto para sessoes longas. Opcoes wireless e com fio das melhores marcas.",
    guideSlug: "headsets-audio",
  },
  {
    slug: "cadeiras-gaming",
    name: "Cadeiras Gaming",
    displayName: "Cadeiras Gaming",
    metaTitle: "Comprar Cadeiras Gaming Portugal | Ergonomicas, Secretlab",
    metaDescription:
      "Cadeiras gaming ergonomicas para longas sessoes. Secretlab Titan, Herman Miller, DXRacer, AKRacing. Suporte lombar ajustavel. Entrega em Portugal.",
    intro:
      "Invista no seu conforto com uma cadeira gaming ergonomica de qualidade. Suporte lombar ajustavel, apoio de bracos 4D, materiais premium que duram anos. Desde opcoes acessiveis ate cadeiras de escritorio premium como a Secretlab Titan e Herman Miller.",
    guideSlug: "cadeiras-gaming",
  },
];

/** Map category display name to slug */
export function getCategorySlug(categoryName: string): string {
  const found = seoCategories.find((c) => c.name === categoryName);
  return found?.slug ?? categoryName.toLowerCase().replace(/\s+/g, "-");
}

/** Map slug to category display name */
export function getCategoryBySlug(slug: string): SeoCategory | undefined {
  return seoCategories.find((c) => c.slug === slug);
}
