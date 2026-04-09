import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, ChevronRight } from "lucide-react";
import { guides } from "@/data/guides";
import { products } from "@/data/products";
import { JsonLd } from "@/components/JsonLd";
import { GuiasPageClient } from "./GuiasPageClient";

export const metadata: Metadata = {
  title: "Guias de Compra",
  description:
    "Guias de compra completos para hardware e perifericos. Processadores, placas graficas, monitores, teclados e muito mais. Conselhos de especialistas para comprar em Portugal.",
  openGraph: {
    title: "Guias de Compra | VoltStock",
    description:
      "Guias de compra completos para hardware e perifericos. Conselhos de especialistas para ajudar a escolher o melhor para o seu setup.",
    url: "https://voltstock.pt/guias",
    type: "website",
  },
  alternates: {
    canonical: "https://voltstock.pt/guias",
  },
};

function getProductCount(categoryName: string): number {
  return products.filter((p) => p.category === categoryName).length;
}

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Guias de Compra | VoltStock",
  description:
    "Guias de compra completos para hardware e perifericos em Portugal.",
  url: "https://voltstock.pt/guias",
  publisher: {
    "@type": "Organization",
    name: "VoltStock",
    url: "https://voltstock.pt",
  },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: guides.length,
    itemListElement: guides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: `https://voltstock.pt/guias/${guide.slug}`,
    })),
  },
};

export default function GuiasPage() {
  const guidesWithCounts = guides.map((guide) => ({
    slug: guide.slug,
    title: guide.title,
    metaDescription: guide.metaDescription,
    categoryName: guide.categoryName,
    criteriaCount: guide.buyingCriteria.length,
    productCount: getProductCount(guide.categoryName),
  }));

  return (
    <>
      <JsonLd data={collectionPageJsonLd} />
      <GuiasPageClient guides={guidesWithCounts} />
    </>
  );
}
