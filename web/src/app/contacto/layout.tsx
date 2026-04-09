import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Entre em contacto com a equipa VoltStock. Suporte tecnico, informacoes sobre encomendas, devolucoes e parcerias. Resposta em ate 24 horas uteis.",
  openGraph: {
    title: "Contacto | VoltStock",
    description:
      "Entre em contacto com a equipa VoltStock. Suporte tecnico, informacoes sobre encomendas e parcerias.",
    url: "https://voltstock.pt/contacto",
    type: "website",
    locale: "pt_PT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoltStock - Contacto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto | VoltStock",
    description:
      "Entre em contacto com a equipa VoltStock. Suporte tecnico e informacoes sobre encomendas.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://voltstock.pt/contacto",
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
