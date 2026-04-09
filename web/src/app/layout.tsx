import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Waves from "@/components/reactbits/Waves";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { PromoBanner } from "@/components/PromoBanner";
import { CartFlightProvider } from "@/components/CartFlight";
import { JsonLd } from "@/components/JsonLd";
import {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
} from "@/lib/structured-data";
import { Toaster } from "sonner";
import { CookieConsent } from "@/components/CookieConsent";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { MetaPixel } from "@/components/MetaPixel";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://voltstock.pt"),
  title: {
    default: "VoltStock | Hardware Premium Portugal",
    template: "%s | VoltStock",
  },
  description:
    "A referência em hardware premium e eletrónica profissional em Portugal. Componentes, periféricos e setups de elite. Pagamentos via MBWay e Stripe.",
  keywords: [
    "hardware",
    "gaming",
    "portugal",
    "premium",
    "componentes",
    "periféricos",
    "voltstock",
    "pc gaming",
    "hardware portugal",
    "loja hardware",
  ],
  authors: [{ name: "VoltStock" }],
  creator: "VoltStock",
  publisher: "CM Tecnologia",
  other: {
    "geo.region": "PT",
    "geo.placename": "Portugal",
    "geo.position": "38.7223;-9.1393",
    ICBM: "38.7223, -9.1393",
    "content-language": "pt-PT",
  },
  alternates: {
    canonical: "https://voltstock.pt",
    languages: {
      "pt-PT": "https://voltstock.pt",
    },
  },
  openGraph: {
    title: "VoltStock | Hardware Premium Portugal",
    description:
      "A referência em hardware premium e eletrónica profissional em Portugal. Componentes, periféricos e setups de elite.",
    url: "https://voltstock.pt",
    siteName: "VoltStock",
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoltStock | Hardware Premium Portugal",
    description:
      "A referência em hardware premium e eletrónica profissional em Portugal. Componentes, periféricos e setups de elite.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googlecf57564f968c0e71",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-PT"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0E1A] text-[#FED7AA] font-sans overflow-x-hidden relative selection:bg-orange-500/30">
        <Waves
          lineColor="rgba(134, 184, 190, 0.45)"
          backgroundColor="transparent"
          waveSpeedX={0.0125}
          waveSpeedY={0.015}
          waveAmpX={50}
          waveAmpY={25}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={10}
          yGap={24}
          className="fixed inset-0 z-[1] opacity-60 pointer-events-none mix-blend-screen"
        />
        <CartFlightProvider>
          <div className="relative z-[2] flex flex-col flex-1">
            <PromoBanner />
            <Navbar />
            {children}
            <Footer />
            <FloatingButtons />
          </div>
        </CartFlightProvider>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={localBusinessSchema()} />
        <GoogleAnalytics />
        <MetaPixel />
        <CookieConsent />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(20, 16, 12, 0.95)",
              border: "1px solid rgba(251, 146, 60, 0.2)",
              color: "#fb923c",
              backdropFilter: "blur(12px)",
            },
          }}
          theme="dark"
        />
      </body>
    </html>
  );
}
