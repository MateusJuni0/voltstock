import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { FlashSaleBanner } from "@/components/FlashSaleBanner";
import { BrandsStrip } from "@/components/BrandsStrip";
import { Categories } from "@/components/Categories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { BestSellers } from "@/components/BestSellers";
import { NewArrivals } from "@/components/NewArrivals";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { CTABanner } from "@/components/CTABanner";
import { Newsletter } from "@/components/Newsletter";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Loja de Hardware e Componentes Gaming | VoltStock Portugal",
  description:
    "Compre hardware premium, placas gráficas, processadores, monitores gaming e periféricos ao melhor preço em Portugal. Envio rápido, MBWay, Multibanco. Garantia incluída.",
  alternates: { canonical: "https://voltstock.pt" },
  openGraph: {
    title: "VoltStock — Hardware Premium & Gaming Portugal",
    description:
      "A loja portuguesa de hardware e gaming. Componentes PC, setups completos, preços competitivos. Pagamento MBWay e cartão.",
    url: "https://voltstock.pt",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen text-orange-300 relative z-10">
      <Hero />
      <FlashSaleBanner />
      <BrandsStrip />
      <Categories />
      <FeaturedProducts />
      <BestSellers />
      <NewArrivals />
      <Features />
      <Stats />
      <Testimonials />
      <CTABanner />
      <Newsletter />
      <FAQ />
    </main>
  );
}
