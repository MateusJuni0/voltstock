import type { Metadata } from "next";
import { products } from "@/data/products";
import { JsonLd } from "@/components/JsonLd";
import { ComparePageClient } from "./ComparePageClient";

export const metadata: Metadata = {
  title: "Comparar Hardware Portugal | Processadores, GPUs, RAM, SSDs",
  description:
    "Compare especificacoes de hardware lado a lado. Processadores, placas graficas, memoria RAM, SSDs e mais. Encontre o melhor componente para o seu PC em Portugal.",
  openGraph: {
    title: "Comparar Hardware Portugal | VoltStock",
    description:
      "Compare especificacoes de hardware lado a lado. Encontre o melhor componente para o seu PC em Portugal.",
    url: "https://voltstock.pt/comparar",
    type: "website",
  },
  alternates: {
    canonical: "https://voltstock.pt/comparar",
  },
};

export default function ComparePage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://voltstock.pt",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Comparar Produtos",
        item: "https://voltstock.pt/comparar",
      },
    ],
  };

  const webpageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Comparar Hardware Portugal",
    description:
      "Compare especificacoes de hardware lado a lado na VoltStock Portugal.",
    url: "https://voltstock.pt/comparar",
    provider: {
      "@type": "Organization",
      name: "VoltStock",
      url: "https://voltstock.pt",
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={webpageJsonLd} />
      <ComparePageClient products={products} />
    </>
  );
}
