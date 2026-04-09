import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { seoCategories, getCategoryBySlug } from "@/data/seo-categories";
import { JsonLd } from "@/components/JsonLd";
import { CategoryPageClient } from "./CategoryPageClient";

export async function generateStaticParams() {
  return seoCategories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoria nao encontrada",
      description: "A categoria que procura nao foi encontrada na VoltStock.",
    };
  }

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    openGraph: {
      title: `${category.metaTitle} | VoltStock`,
      description: category.metaDescription,
      url: `https://voltstock.pt/categoria/${category.slug}`,
      type: "article",
    },
    alternates: {
      canonical: `https://voltstock.pt/categoria/${category.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (p) => p.category === category.name
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: category.metaTitle,
    description: category.metaDescription,
    url: `https://voltstock.pt/categoria/${category.slug}`,
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
      "@id": `https://voltstock.pt/categoria/${category.slug}`,
    },
    about: {
      "@type": "Thing",
      name: category.displayName,
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
        name: "Categorias",
        item: "https://voltstock.pt/produtos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.displayName,
        item: `https://voltstock.pt/categoria/${category.slug}`,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.displayName,
    description: category.metaDescription,
    url: `https://voltstock.pt/categoria/${category.slug}`,
    numberOfItems: categoryProducts.length,
    provider: {
      "@type": "Organization",
      name: "VoltStock",
      url: "https://voltstock.pt",
    },
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <CategoryPageClient
        category={category}
        products={categoryProducts}
      />
    </>
  );
}
