import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guides } from "@/data/guides";
import { products } from "@/data/products";
import { JsonLd } from "@/components/JsonLd";
import { GuidePageClient } from "./GuidePageClient";

export async function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    return {
      title: "Guia nao encontrado",
      description: "O guia de compra que procura nao foi encontrado na VoltStock.",
    };
  }

  return {
    title: guide.title,
    description: guide.metaDescription,
    openGraph: {
      title: `${guide.title} | VoltStock`,
      description: guide.metaDescription,
      url: `https://voltstock.pt/guias/${guide.slug}`,
      type: "article",
    },
    alternates: {
      canonical: `https://voltstock.pt/guias/${guide.slug}`,
    },
  };
}

export default async function GuideSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  const categoryProducts = products
    .filter((p) => p.category === guide.categoryName)
    .slice(0, 5);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    url: `https://voltstock.pt/guias/${guide.slug}`,
    datePublished: "2026-04-09",
    dateModified: "2026-04-09",
    author: {
      "@type": "Organization",
      name: "VoltStock",
      url: "https://voltstock.pt",
    },
    publisher: {
      "@type": "Organization",
      name: "VoltStock",
      url: "https://voltstock.pt",
      logo: {
        "@type": "ImageObject",
        url: "https://voltstock.pt/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://voltstock.pt/guias/${guide.slug}`,
    },
    about: {
      "@type": "Thing",
      name: guide.categoryName,
    },
  };

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
        name: "Guias de Compra",
        item: "https://voltstock.pt/guias",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.categoryName,
        item: `https://voltstock.pt/guias/${guide.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <GuidePageClient
        guide={guide}
        categoryProducts={categoryProducts}
      />
    </>
  );
}
