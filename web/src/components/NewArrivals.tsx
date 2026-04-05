"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { products, type Product } from "@/data/products";
import { ProductModal } from "./ProductModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const newArrivalIds = [121, 129, 130, 136, 185, 186, 187, 142];

export function NewArrivals() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const arrivals = newArrivalIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  // GSAP entrance
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".newarrivals-header", {
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

      gsap.from(".newarrival-card", {
        opacity: 0,
        x: 60,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".newarrivals-scroll",
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
          <div className="newarrivals-header flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Sparkles size={12} className="text-orange-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                  Novo
                </span>
              </div>
              <h2
                className="font-black tracking-tight text-orange-400 leading-none"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                }}
              >
                Acabados de{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/30">
                  Chegar
                </span>
                .
              </h2>
              <p className="mt-4 text-orange-400/40 text-sm max-w-md">
                A geração mais recente de hardware, disponível agora.
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

          {/* Horizontal scroll */}
          <div
            ref={scrollRef}
            className="newarrivals-scroll flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {arrivals.map((product) => (
              <NewArrivalCard
                key={product.id}
                product={product}
                onOpen={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </div>

        {/* Background orb */}
        <div className="absolute top-1/2 right-0 w-[600px] h-[400px] bg-accent/[0.015] rounded-full blur-[120px] pointer-events-none" />
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

// ── New Arrival Card ──────────────────────────────────────────────

function NewArrivalCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: () => void;
}) {
  return (
    <motion.div
      className="newarrival-card group relative flex-shrink-0 w-[280px] snap-start rounded-3xl border border-orange-500/8 bg-gradient-to-b from-white/[0.04] to-white/[0.01] cursor-pointer overflow-hidden"
      style={{
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.03) inset",
      }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
      onClick={onOpen}
    >
      {/* NOVO badge */}
      <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30">
        Novo
      </span>

      {/* Image */}
      <div className="relative flex items-center justify-center pt-14 pb-6 px-6">
        <div className="relative w-full max-w-[180px] h-[150px]">
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="180px"
            className="object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-5 flex flex-col border-t border-white/[0.05] pt-4">
        <p className="text-[9px] font-black tracking-[0.3em] text-orange-400/30 uppercase mb-2">
          {product.category}
        </p>
        <h3
          className="text-sm font-bold text-orange-400 mb-3 leading-tight group-hover:text-white transition-colors duration-300 line-clamp-2"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-[10px] text-orange-400/25 line-through">
                {product.oldPrice}
              </span>
            )}
            <span
              className="text-lg font-black text-orange-400"
              style={{ textShadow: "0 0 16px rgba(249,115,22,0.2)" }}
            >
              {product.price}
            </span>
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-t from-orange-500/[0.03] to-transparent" />
    </motion.div>
  );
}
