import { products } from "@/data/products";
import { ProductDetail } from "@/components/ProductDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
  if (!product) return { title: "Produto não encontrado | VoltStock" };

  const desc = product.description
    ? product.description.slice(0, 155)
    : `Compre ${product.name} por ${product.price} na VoltStock.`;

  return {
    title: `${product.name} | VoltStock`,
    description: desc,
    openGraph: {
      title: `${product.name} | VoltStock`,
      description: desc,
      images: product.img ? [{ url: product.img }] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === parseInt(resolvedParams.id));

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
