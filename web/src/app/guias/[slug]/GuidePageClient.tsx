"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Star,
  Tag,
  ShoppingCart,
  ChevronRight,
  Search,
  TrendingUp,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Guide } from "@/data/guides";
import type { Product } from "@/data/products";

interface GuidePageClientProps {
  guide: Guide;
  categoryProducts: Product[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={fadeUp}
    >
      <Link
        href={`/produtos/${product.id}`}
        className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-orange-500/20 transition-all duration-300 overflow-hidden"
      >
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-b from-white/[0.04] to-transparent p-4 flex items-center justify-center">
          {product.badge && (
            <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg z-10">
              {product.badge}
            </span>
          )}
          <img
            src={product.img}
            alt={product.name}
            className="max-h-36 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3
            className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors duration-300 mb-1.5 line-clamp-2 leading-snug"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="text-orange-400 fill-orange-400" />
            <span className="text-xs text-white/40">{product.rating}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-orange-400">
              {product.price}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-white/25 line-through">
                {product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function GuidePageClient({ guide, categoryProducts }: GuidePageClientProps) {
  return (
    <main className="min-h-screen bg-[#0A0E1A] pt-32 pb-24">
      {/* Decorative background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-0 translate-x-1/2 w-[600px] h-[600px] bg-orange-500/[0.02] rounded-full blur-[150px]" />
        <div className="absolute top-2/3 left-1/3 w-[400px] h-[400px] bg-orange-500/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Guias de Compra", href: "/guias" },
            { label: guide.categoryName },
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <BookOpen size={14} className="text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
              Guia de Compra
            </span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {guide.title.split("—")[0]}
            {guide.title.includes("—") && (
              <>
                {"— "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                  {guide.title.split("—")[1]?.trim()}
                </span>
              </>
            )}
          </h1>

          <p className="text-white/50 text-lg font-medium max-w-2xl">
            {guide.metaDescription}
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-14 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-white/30 mb-3">
            Neste guia
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Introducao", href: "#introducao" },
              { label: "O Que Procurar", href: "#criterios" },
              { label: "Gamas de Preco", href: "#precos" },
              ...(categoryProducts.length > 0
                ? [{ label: "Recomendacoes", href: "#recomendacoes" }]
                : []),
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white/50 bg-white/[0.04] border border-white/[0.06] hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/20 transition-all duration-300"
              >
                <ChevronRight size={10} />
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Introduction */}
        <section id="introducao" className="mb-16 scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <BookOpen size={18} className="text-orange-400" />
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Introducao
              </h2>
            </div>

            <div className="space-y-4">
              {guide.intro.map((paragraph, i) => (
                <motion.p
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="text-white/50 text-base md:text-lg leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Buying Criteria */}
        <section id="criterios" className="mb-16 scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Search size={18} className="text-orange-400" />
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                O Que Procurar ao Comprar
              </h2>
            </div>

            <div className="space-y-4">
              {guide.buyingCriteria.map((criterion, index) => (
                <motion.div
                  key={criterion.title}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-orange-400" />
                    </div>
                    <div>
                      <h3
                        className="text-base font-bold text-white mb-1.5"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {criterion.title}
                      </h3>
                      <p className="text-sm text-white/45 leading-relaxed">
                        {criterion.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Price Ranges */}
        <section id="precos" className="mb-16 scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Tag size={18} className="text-orange-400" />
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Gamas de Preco em Portugal
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.priceRanges.map((range, index) => (
                <motion.div
                  key={range.range}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                >
                  <span className="inline-block text-sm font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-lg mb-3">
                    {range.range}
                  </span>
                  <p className="text-sm text-white/45 leading-relaxed">
                    {range.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Product Recommendations */}
        {categoryProducts.length > 0 && (
          <section id="recomendacoes" className="mb-16 scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <TrendingUp size={18} className="text-orange-400" />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  As Nossas Recomendacoes
                </h2>
              </div>
              <p className="text-white/40 text-sm mb-8 ml-[3.25rem]">
                Produtos selecionados do nosso catalogo de{" "}
                <Link
                  href={`/produtos?categoria=${encodeURIComponent(guide.categoryName)}`}
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 decoration-orange-400/30 hover:decoration-orange-400 transition-colors"
                >
                  {guide.categoryName}
                </Link>
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categoryProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>

              {/* View all link */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-6 text-center"
              >
                <Link
                  href={`/produtos?categoria=${encodeURIComponent(guide.categoryName)}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Ver todos os produtos de {guide.categoryName}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </section>
        )}

        {/* Internal Links / Related */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.04] via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Encontrou o que procurava?
                </h2>
                <p className="text-white/40 text-sm md:text-base">
                  Explore os nossos{" "}
                  <Link
                    href="/guias"
                    className="text-orange-400 hover:text-orange-300 underline underline-offset-2 decoration-orange-400/30 hover:decoration-orange-400 transition-colors"
                  >
                    outros guias de compra
                  </Link>{" "}
                  ou veja o{" "}
                  <Link
                    href="/produtos"
                    className="text-orange-400 hover:text-orange-300 underline underline-offset-2 decoration-orange-400/30 hover:decoration-orange-400 transition-colors"
                  >
                    catalogo completo
                  </Link>
                  .
                </p>
              </div>

              <Link
                href={`/produtos?categoria=${encodeURIComponent(guide.categoryName)}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                <ShoppingCart size={16} />
                Ver {guide.categoryName}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
