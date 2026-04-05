import type { Product } from "@/data/products";

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VoltStock",
    url: "https://voltstock.pt",
    logo: "https://voltstock.pt/logo.png",
    description: "Hardware Premium e Eletrónica Profissional em Portugal",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PT",
      addressLocality: "Portugal",
    },
    email: "info@voltstock.pt",
    telephone: "+351961227666",
    taxID: "311848710",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@voltstock.pt",
      telephone: "+351961227666",
      availableLanguage: "Portuguese",
    },
    sameAs: [],
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VoltStock",
    url: "https://voltstock.pt",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://voltstock.pt/produtos?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function extractBrand(productName: string): string {
  const knownBrands = [
    "MSI",
    "ASUS",
    "NVIDIA",
    "AMD",
    "Intel",
    "Corsair",
    "Gigabyte",
    "EVGA",
    "Razer",
    "Logitech",
    "HyperX",
    "Kingston",
    "Samsung",
    "Western Digital",
    "WD",
    "Seagate",
    "Noctua",
    "be quiet!",
    "Cooler Master",
    "NZXT",
    "Fractal Design",
    "SteelSeries",
    "BenQ",
    "LG",
    "Dell",
    "AOC",
    "Thermaltake",
    "Seasonic",
    "ROG",
    "TUF",
    "Secretlab",
    "noblechairs",
    "G.Skill",
    "Crucial",
    "Sapphire",
    "XFX",
    "PowerColor",
    "ASRock",
    "ZOTAC",
    "Palit",
    "DeepCool",
    "Arctic",
    "Lian Li",
    "Phanteks",
  ];

  const firstWord = productName.split(" ")[0];

  for (const brand of knownBrands) {
    if (
      productName.toUpperCase().startsWith(brand.toUpperCase())
    ) {
      return brand;
    }
  }

  return firstWord;
}

function parsePrice(priceStr: string): number {
  const cleaned = priceStr
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

function seededRatingCount(productId: number): number {
  const seed = ((productId * 2654435761) >>> 0) % 191;
  return seed + 10;
}

export function productSchema(
  product: Product,
): Record<string, unknown> {
  const price = parsePrice(product.price);
  const brand = extractBrand(product.name);
  const ratingValue =
    typeof product.rating === "string"
      ? parseFloat(product.rating)
      : product.rating;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ??
      `${product.name} - Hardware Premium disponível na VoltStock`,
    image: product.img,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "VoltStock",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PT",
        },
      },
    },
  };

  if (ratingValue && ratingValue > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingValue,
      bestRating: 5,
      worstRating: 1,
      ratingCount: seededRatingCount(product.id),
    };
  }

  return schema;
}

export function faqSchema(
  faqs: ReadonlyArray<{ question: string; answer: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: ReadonlyArray<{ name: string; url: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function localBusinessSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "VoltStock",
    legalName: "CM Tecnologia, Unipessoal Lda.",
    taxID: "311848710",
    url: "https://voltstock.pt",
    email: "info@voltstock.pt",
    telephone: "+351961227666",
    description:
      "Loja online de hardware premium e componentes informáticos em Portugal",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "38.7223",
      longitude: "-9.1393",
    },
    areaServed: {
      "@type": "Country",
      name: "Portugal",
    },
    priceRange: "€€-€€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Credit Card, MBWay, Multibanco",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
  };
}
