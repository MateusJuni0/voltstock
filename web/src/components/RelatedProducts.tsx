"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { products, type Product } from "@/data/products";

interface RelatedProductsProps {
  currentProduct: Product;
}

function getRelatedProducts(current: Product): Product[] {
  const sameCategory = products.filter(
    (p) => p.category === current.category && p.id !== current.id
  );

  if (sameCategory.length >= 4) {
    return sameCategory.slice(0, 4);
  }

  const otherProducts = products.filter(
    (p) => p.category !== current.category && p.id !== current.id
  );

  // Shuffle deterministically based on current product id
  const shuffled = [...otherProducts].sort(
    (a, b) => ((a.id * 7 + current.id) % 97) - ((b.id * 7 + current.id) % 97)
  );

  const remaining = 4 - sameCategory.length;
  return [...sameCategory, ...shuffled.slice(0, remaining)];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={`/produtos/${product.id}`} className="block group h-full">
        <div className="relative flex flex-col rounded-[2rem] border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-white/[0.01] h-full overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(249,115,22,0.12)]">
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-5 left-5 z-20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-lg shadow-orange-500/40">
              {product.badge}
            </span>
          )}

          {/* Image */}
          <div className="relative w-full aspect-square flex items-center justify-center p-6">
            <Image
              src={product.img}
              alt={product.name}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.3))" }}
            />
          </div>

          {/* Info */}
          <div className="px-6 pb-6 pt-3 flex-1 flex flex-col border-t border-white/[0.05]">
            <p className="text-[9px] font-black tracking-[0.25em] text-orange-400/50 uppercase mb-2">
              {product.category}
            </p>
            <h3
              className="text-sm font-bold text-white mb-3 leading-tight group-hover:text-orange-300 transition-colors duration-300 line-clamp-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  size={12}
                  className={
                    j < Math.floor(Number(product.rating))
                      ? "text-amber-400 fill-amber-400"
                      : "text-white/10"
                  }
                />
              ))}
              <span className="text-xs text-white/25 ml-1.5">
                {product.rating}
              </span>
            </div>

            {/* Price */}
            <div className="mt-auto flex flex-col">
              {product.oldPrice && (
                <span className="text-xs text-white/20 line-through mb-0.5">
                  {product.oldPrice}
                </span>
              )}
              <span
                className="text-xl font-black text-orange-300"
                style={{ textShadow: "0 0 16px rgba(251,146,60,0.25)" }}
              >
                {product.price}
              </span>
            </div>

            {/* CTA */}
            <div className="mt-4">
              <span className="inline-flex items-center justify-center w-full h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-bold group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-500">
                Ver Produto
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const related = useMemo(
    () => getRelatedProducts(currentProduct),
    [currentProduct]
  );

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-24 mb-12">
      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent mb-16" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400/40 block mb-3">
          Tambem vai gostar
        </span>
        <h2
          className="text-3xl md:text-4xl font-extrabold text-orange-400"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Produtos Relacionados
        </h2>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {related.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </section>
  );
}
