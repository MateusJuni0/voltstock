"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Check,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { products, type Product } from "@/data/products";
import { useCart } from "@/store/useCart";
import { ProductModal } from "./ProductModal";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const bestSellerIds = [23, 29, 150, 153, 71, 88, 11, 200];

export function BestSellers() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const bestSellers = bestSellerIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  // GSAP staggered entrance
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".bestsellers-header", {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".bestseller-card", {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".bestseller-grid",
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={sectionRef} className="py-28 px-6 bg-transparent relative">
        <div className="max-w-[1280px] mx-auto relative z-10">
          {/* Header */}
          <div className="bestsellers-header flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <TrendingUp size={12} className="text-orange-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                  Mais Vendidos
                </span>
              </div>
              <h2
                className="font-black tracking-tight text-orange-400 leading-none"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                }}
              >
                O que Portugal{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/30">
                  Compra
                </span>
                .
              </h2>
              <p className="mt-4 text-orange-400/40 text-sm max-w-md">
                Os produtos mais escolhidos pela comunidade portuguesa de hardware e gaming.
              </p>
            </div>

            <Link href="/produtos">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500/8 border border-orange-500/15 text-orange-400 font-black text-sm uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer"
              >
                Ver Todos
                <ArrowRight size={16} />
              </motion.div>
            </Link>
          </div>

          {/* Product Grid */}
          <div className="bestseller-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product, idx) => (
              <BestSellerCard
                key={product.id}
                product={product}
                rank={idx + 1}
                onOpen={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </div>

        {/* Background orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-[500px] bg-accent/[0.015] rounded-full blur-[120px] pointer-events-none" />
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Best Seller Card ──────────────────────────────────────────────

function BestSellerCard({
  product,
  rank,
  onOpen,
}: {
  product: Product;
  rank: number;
  onOpen: () => void;
}) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    toast.success(`${product.name} adicionado ao carrinho`, {
      description: "Continuar a comprar ou finalizar compra",
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      className="bestseller-card group relative flex flex-col rounded-3xl border border-orange-500/8 bg-gradient-to-b from-white/[0.04] to-white/[0.01] cursor-pointer overflow-hidden"
      style={{
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.03) inset",
      }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      onClick={onOpen}
    >
      {/* Rank badge */}
      <div className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
        <span className="text-xs font-black text-orange-400">#{rank}</span>
      </div>

      {/* Product badge */}
      {product.badge && (
        <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-lg shadow-orange-500/30">
          {product.badge}
        </span>
      )}

      {/* Image */}
      <div className="relative flex items-center justify-center pt-14 pb-6 px-8">
        <div className="relative w-full max-w-[160px] h-[140px]">
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="160px"
            className="object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Info */}
      <div className="px-6 pb-6 flex-1 flex flex-col border-t border-white/[0.05] pt-5">
        <p className="text-[9px] font-black tracking-[0.3em] text-orange-400/30 uppercase mb-2">
          {product.category}
        </p>
        <h3
          className="text-sm font-bold text-orange-400 mb-2 leading-tight group-hover:text-white transition-colors duration-300 line-clamp-2"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star
              key={j}
              size={10}
              className={
                j < Math.floor(Number(product.rating))
                  ? "text-amber-400 fill-amber-400"
                  : "text-orange-400/10"
              }
            />
          ))}
          <span className="text-[10px] text-orange-400/20 ml-1">
            {product.rating}
          </span>
        </div>

        {/* Price + Cart */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-[10px] text-orange-400/25 line-through">
                {product.oldPrice}
              </span>
            )}
            <span
              className="text-xl font-black text-orange-400"
              style={{ textShadow: "0 0 16px rgba(249,115,22,0.2)" }}
            >
              {product.price}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={cn(
              "flex items-center justify-center h-10 rounded-xl transition-all duration-400 font-black text-xs",
              isAdded
                ? "w-10 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : "w-10 bg-orange-500/8 border border-orange-500/15 text-orange-400 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-500/30"
            )}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="ok"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check size={14} />
                </motion.div>
              ) : (
                <motion.div key="cart">
                  <ShoppingCart size={14} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-t from-orange-500/[0.03] to-transparent" />
    </motion.div>
  );
}
