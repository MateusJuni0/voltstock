"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star,
  ArrowRight,
  Award,
  ShoppingCart,
  Layers,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { SeoBrand } from "@/data/seo-brands";
import type { Product } from "@/data/products";

interface BrandPageClientProps {
  brand: SeoBrand;
  products: Product[];
  groupedCategories: {
    categoryName: string;
    products: Product[];
  }[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" as const },
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
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-orange-400/50 mb-1">
            {product.category}
          </p>
          <h3
            className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors duration-300 mb-1.5 line-clamp-2 leading-snug"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="text-orange-400 fill-orange-400" />
            <span className="text-xs text-white/40">{product.rating}</span>
          </div>
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

export function BrandPageClient({
  brand,
  products,
  groupedCategories,
}: BrandPageClientProps) {
  return (
    <main className="min-h-screen bg-[#0A0E1A] pt-32 pb-24">
      {/* Decorative background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-0 translate-x-1/2 w-[600px] h-[600px] bg-orange-500/[0.02] rounded-full blur-[150px]" />
        <div className="absolute top-2/3 left-1/3 w-[400px] h-[400px] bg-orange-500/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Marcas", href: "/produtos" },
            { label: brand.name },
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
            <Award size={14} className="text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
              Marca
            </span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Produtos{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              {brand.name}
            </span>{" "}
            em Portugal
          </h1>

          <p className="text-white/50 text-lg font-medium max-w-3xl mb-4">
            Encontre todos os produtos {brand.name} disponiveis na VoltStock.
            Entrega rapida em Portugal continental e ilhas, com pagamento via
            MBWay, cartao de credito ou transferencia bancaria.
          </p>

          <div className="flex items-center gap-2 text-sm text-white/30">
            <span className="font-semibold text-orange-400">
              {products.length}
            </span>{" "}
            produtos {brand.name}
            {" "}&middot;{" "}
            <span className="font-semibold text-orange-400">
              {groupedCategories.length}
            </span>{" "}
            {groupedCategories.length === 1 ? "categoria" : "categorias"}
          </div>
        </motion.div>

        {/* Products by Category */}
        {groupedCategories.map((group) => (
          <section key={group.categoryName} className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Layers size={16} className="text-orange-400" />
              </div>
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {brand.name} — {group.categoryName}
              </h2>
              <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-1 rounded-lg">
                {group.products.length}
              </span>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </section>
        ))}

        {/* SEO Internal Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
        >
          <h2
            className="text-lg font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Mais na VoltStock
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/comparar"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-orange-400 transition-colors duration-200"
            >
              <ArrowRight size={12} />
              Comparar Produtos
            </Link>
            <Link
              href="/produtos"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-orange-400 transition-colors duration-200"
            >
              <ArrowRight size={12} />
              Todos os Produtos
            </Link>
            <Link
              href="/guias"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-orange-400 transition-colors duration-200"
            >
              <ArrowRight size={12} />
              Guias de Compra
            </Link>
            <Link
              href="/categoria/processadores"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-orange-400 transition-colors duration-200"
            >
              <ArrowRight size={12} />
              Processadores
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
