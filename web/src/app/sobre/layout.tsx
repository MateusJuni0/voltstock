import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre a VoltStock | Hardware Premium Portugal",
  description:
    "Conheca a VoltStock — a referencia em hardware premium em Portugal. A nossa missao e democratizar o acesso a componentes de topo com precos justos e envio rapido.",
  openGraph: {
    title: "Sobre a VoltStock | Hardware Premium Portugal",
    description:
      "Conheca a VoltStock — a referencia em hardware premium em Portugal. A nossa missao e democratizar o acesso a componentes de topo.",
    url: "https://voltstock.pt/sobre",
    type: "website",
    locale: "pt_PT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoltStock - Sobre Nos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre a VoltStock | Hardware Premium Portugal",
    description:
      "Conheca a VoltStock — a referencia em hardware premium em Portugal.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://voltstock.pt/sobre",
  },
};

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
