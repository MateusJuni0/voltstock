import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Waves from "@/components/reactbits/Waves";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { PromoBanner } from "@/components/PromoBanner";
import { CustomCursor } from "@/components/CustomCursor";
import { CartFlightProvider } from "@/components/CartFlight";

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
  title: "VoltStock | Hardware Premium Portugal",
  description:
    "A referência em hardware premium e eletrónica profissional em Portugal. Componentes, periféricos e setups de elite. Pagamentos via MBWay e Stripe.",
  keywords: ["hardware", "gaming", "portugal", "premium", "componentes", "periféricos", "voltstock"],
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
        <CustomCursor />
        <CartFlightProvider>
          <div className="relative z-[2] flex flex-col flex-1">
            <PromoBanner />
            <Navbar />
            <main className="pt-[96px] md:pt-[88px]">
              {children}
            </main>
            <Footer />
            <FloatingButtons />
          </div>
        </CartFlightProvider>
      </body>
    </html>
  );
}
