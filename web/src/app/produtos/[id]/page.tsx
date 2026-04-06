import type { Metadata } from "next";
import { products } from "@/data/products";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductReviews } from "@/components/ProductReviews";
import { JsonLd } from "@/components/JsonLd";
import { productSchema } from "@/lib/structured-data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return {
      title: "Produto nao encontrado",
      description: "O produto que procura nao foi encontrado na VoltStock.",
    };
  }

  const title = product.name;
  const description = product.description
    ? product.description.slice(0, 160)
    : `Compre ${product.name} na VoltStock. Hardware premium com envio rapido para todo Portugal. ${product.price}.`;

  return {
    title,
    description,
    openGraph: {
      title: `${product.name} | VoltStock`,
      description,
      url: `https://voltstock.pt/produtos/${product.id}`,
      type: "website",
      images: [
        {
          url: product.img,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | VoltStock`,
      description,
      images: [product.img],
    },
    alternates: {
      canonical: `https://voltstock.pt/produtos/${product.id}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = products.find(
    (p) => p.id === parseInt(resolvedParams.id)
  );

  if (!product) {
    notFound();
  }

  return (
    <>
      <JsonLd data={productSchema(product)} />
      <ProductDetail product={product} />
      <div className="max-w-[1280px] mx-auto px-6 pb-20">
        <ProductReviews productId={product.id} />
      </div>
    </>
  );
}
