import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { seoBrands, getBrandBySlug } from "@/data/seo-brands";
import { JsonLd } from "@/components/JsonLd";
import { BrandPageClient } from "./BrandPageClient";

export async function generateStaticParams() {
  return seoBrands.map((brand) => ({
    slug: brand.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return {
      title: "Marca nao encontrada",
      description: "A marca que procura nao foi encontrada na VoltStock.",
    };
  }

  const title = `Comprar ${brand.name} Portugal | Produtos ${brand.name} na VoltStock`;
  const description = `Descubra todos os produtos ${brand.name} disponiveis na VoltStock. ${brand.productCount} produtos em stock com entrega rapida em Portugal. Precos competitivos e pagamento MBWay.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | VoltStock`,
      description,
      url: `https://voltstock.pt/marca/${brand.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://voltstock.pt/marca/${brand.slug}`,
    },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const brandProducts = products.filter((p) => p.brand === brand.name);

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
        name: "Marcas",
        item: "https://voltstock.pt/produtos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brand.name,
        item: `https://voltstock.pt/marca/${brand.slug}`,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Produtos ${brand.name}`,
    description: `Todos os produtos ${brand.name} disponiveis na VoltStock Portugal.`,
    url: `https://voltstock.pt/marca/${brand.slug}`,
    numberOfItems: brandProducts.length,
    provider: {
      "@type": "Organization",
      name: "VoltStock",
      url: "https://voltstock.pt",
    },
  };

  // Group by category for display
  const categoriesMap = new Map<string, typeof brandProducts>();
  for (const product of brandProducts) {
    const existing = categoriesMap.get(product.category) ?? [];
    categoriesMap.set(product.category, [...existing, product]);
  }
  const groupedCategories = Array.from(categoriesMap.entries()).map(
    ([categoryName, prods]) => ({ categoryName, products: prods })
  );

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <BrandPageClient
        brand={brand}
        products={brandProducts}
        groupedCategories={groupedCategories}
      />
    </>
  );
}
