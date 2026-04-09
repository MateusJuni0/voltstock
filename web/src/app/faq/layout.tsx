import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/structured-data";
import { faqItems } from "@/data/faq-items";

export const metadata: Metadata = {
  title: "Perguntas Frequentes (FAQ)",
  description:
    "Encontre respostas para as duvidas mais comuns sobre compras, envios, pagamentos, devolucoes e muito mais na VoltStock. Centro de ajuda completo.",
  openGraph: {
    title: "Perguntas Frequentes | VoltStock",
    description:
      "Encontre respostas para as duvidas mais comuns sobre compras, envios, pagamentos e devolucoes na VoltStock.",
    url: "https://voltstock.pt/faq",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoltStock - Perguntas Frequentes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perguntas Frequentes | VoltStock",
    description:
      "Encontre respostas para as duvidas mais comuns sobre compras, envios, pagamentos e devolucoes na VoltStock.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://voltstock.pt/faq",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <JsonLd data={faqSchema(faqItems)} />
    </>
  );
}
