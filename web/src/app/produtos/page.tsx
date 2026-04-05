import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsPage } from "@/components/ProductsPage";

export const metadata: Metadata = {
  title: "Catalogo de Produtos",
  description:
    "Navegue pelo nosso catalogo completo de hardware e perifericos premium. Placas graficas, processadores, monitores, perifericos gaming e mais. Envio gratuito acima de 50 EUR.",
  openGraph: {
    title: "Catalogo de Produtos | VoltStock",
    description:
      "Navegue pelo nosso catalogo completo de hardware e perifericos premium. Placas graficas, processadores, monitores e mais.",
    url: "https://voltstock.pt/produtos",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoltStock - Catalogo de Hardware Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalogo de Produtos | VoltStock",
    description:
      "Navegue pelo nosso catalogo completo de hardware e perifericos premium.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://voltstock.pt/produtos",
  },
};

export default function Page() {
  return (
    <Suspense>
      <ProductsPage />
    </Suspense>
  );
}
