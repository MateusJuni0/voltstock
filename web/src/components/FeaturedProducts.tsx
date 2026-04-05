"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Check,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { products, type Product } from "@/data/products";
import { useCart } from "@/store/useCart";
import { ProductModal } from "./ProductModal";
import { use3DTilt } from "@/hooks/use3DTilt";
import { useCartFlight } from "./CartFlight";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedProducts() {
  const featured = products.slice(0, 8);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const W = containerRef.current.offsetWidth;
      setContainerWidth(W);
      setItemsPerView(W < 640 ? 1 : W < 1024 ? 2 : 4);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Staggered scroll reveal with GSAP + spring ──
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from(".featured-header", {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // Product card parallax: content moves slower than scroll
      if (cardsContainerRef.current) {
        gsap.to(cardsContainerRef.current, {
          yPercent: -3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const maxIndex = Math.max(0, featured.length - itemsPerView);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const cardWidth = containerWidth > 0 ? containerWidth / itemsPerView : 0;
  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <>
      <section ref={sectionRef} className="py-32 px-6 bg-transparent relative">
        <div className="max-w-[1280px] mx-auto relative z-10">
          {/* Header */}
          <div className="featured-header flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                  Drops de Elite
                </span>
              </div>
              <h2
                className="font-black tracking-tight text-orange-400 leading-none"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                }}
              >
                Hardware{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/30">
                  de Elite
                </span>
                .
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Navigation arrows */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prev}
                  disabled={currentIndex === 0}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-accent/5 border border-accent/15 text-orange-400 hover:bg-orange-500 hover:text-white hover:border-orange-500/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={next}
                  disabled={currentIndex >= maxIndex}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-accent/5 border border-accent/15 text-orange-400 hover:bg-orange-500 hover:text-white hover:border-orange-500/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>

              <a href="/produtos">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-magnetic
                  className="px-8 py-4 rounded-2xl bg-orange-500 text-white font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 cursor-pointer shadow-[0_0_40px_rgba(249,115,22,0.15)] relative"
                >
                  Ver Catálogo →
                </motion.div>
              </a>
            </div>
          </div>

          {/* Carousel with parallax container */}
          <div className="overflow-hidden" ref={containerRef}>
            {containerWidth > 0 && (
              <motion.div
                ref={cardsContainerRef}
                className="flex"
                animate={{ x: -currentIndex * cardWidth }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 32,
                  mass: 0.9,
                }}
              >
                {featured.map((product, idx) => (
                  <div
                    key={product.id}
                    style={{
                      width: cardWidth,
                      flexShrink: 0,
                      paddingLeft: 12,
                      paddingRight: 12,
                      perspective: "800px",
                    }}
                  >
                    <FeaturedProductCard
                      product={product}
                      index={idx}
                      onOpen={() => setSelectedProduct(product)}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Dot indicators */}
          {maxIndex > 0 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  animate={{ width: i === currentIndex ? 28 : 8 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className={cn(
                    "h-2 rounded-full transition-colors duration-300",
                    i === currentIndex
                      ? "bg-accent"
                      : "bg-accent/20 hover:bg-accent/40"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Background orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[600px] bg-accent/[0.02] rounded-full blur-[150px] pointer-events-none" />
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

// ── Product Card: True 3D Pop-Out Effect ─────────────────────────
// Image physically floats ABOVE the card using translateZ spring
// NO overflow:hidden on card → image escapes card boundaries
// Volumetric shadow beneath floating product

function FeaturedProductCard({
  product,
  index,
  onOpen,
}: {
  product: Product;
  index: number;
  onOpen: () => void;
}) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const { fireCartFlight } = useCartFlight();

  // 3D tilt with image Z-lift: image flies out 70px above card
  const { tiltRef, glowRef, imgRef, shadowRef } = use3DTilt({
    maxTilt: 16,
    preset: "snappy",
    perspective: 480,
    hoverScale: 1.04,
    glowFollow: true,
    imageZ: 75,
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const imgElRef = useRef<HTMLImageElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  // Merge tiltRef with cardRef
  const setCardRef = useCallback(
    (el: HTMLDivElement | null) => {
      cardRef.current = el;
      (tiltRef as React.MutableRefObject<HTMLElement | null>).current = el;
    },
    [tiltRef]
  );

  // Assign the image container to the tilt imgRef for GSAP translateZ transforms
  const setImgContainerRef = useCallback(
    (el: HTMLDivElement | null) => {
      imgContainerRef.current = el;
      (imgRef as React.MutableRefObject<HTMLElement | null>).current = el;
    },
    [imgRef]
  );

  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      imgElRef.current = e.currentTarget;
    },
    []
  );

  // ── Scroll stagger entrance ──
  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 0.9,
        delay: Math.min(index * 0.1, 0.4),
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 92%",
          once: true,
        },
      });
    });
    return () => ctx.revert();
  }, [index]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);

    const el = imgElRef.current ?? imgContainerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      fireCartFlight({
        imgSrc: product.img,
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
      });
    }

    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    // Outer wrapper: sets perspective context
    <div className="relative h-full" style={{ perspective: "480px" }}>
      {/* ── Card: NO overflow:hidden so image escapes upward ── */}
      <div
        ref={setCardRef}
        onClick={onOpen}
        className="group relative flex flex-col rounded-[2.5rem] border border-orange-500/8 bg-gradient-to-b from-white/[0.04] to-white/[0.01] h-full cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          // Box shadow for base card depth
          boxShadow: "0 8px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Cursor-tracking glow */}
        <div
          ref={glowRef as React.RefObject<HTMLDivElement>}
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: 0 }}
        />

        {/* Holographic shimmer overlay */}
        <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(249,115,22,0.06) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite",
            }}
          />
        </div>

        {/* Badge — floats at Z+30 */}
        {product.badge && (
          <span
            className="absolute top-8 left-8 z-20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-xl shadow-orange-500/40"
            style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
          >
            {product.badge}
          </span>
        )}

        {/* Image section — tall area, NO overflow:hidden */}
        <div
          className="relative flex items-center justify-center pt-12 pb-4 px-8"
          style={{ minHeight: "260px" }}
        >
          {/* Shadow disc beneath floating product */}
          <div
            ref={shadowRef as React.RefObject<HTMLDivElement>}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-10 bg-black rounded-full pointer-events-none"
            style={{ transform: "translateZ(-10px)" }}
          />

          {/* The product image — springs to translateZ(75px) on hover */}
          <div
            ref={setImgContainerRef}
            className="relative w-full max-w-[200px] h-[180px] z-20 pointer-events-none"
            style={{
              transform: "translateZ(0px)",
              willChange: "transform",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
            }}
          >
            <Image
              src={product.img}
              alt={product.name}
              fill
              sizes="200px"
              className="object-contain"
              onLoad={handleImageLoad}
            />
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute top-6 right-6 p-3 rounded-2xl bg-black/40 backdrop-blur-xl text-orange-400/40 hover:text-rose-400 hover:bg-black/60 transition-all z-30 opacity-0 group-hover:opacity-100"
            style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
          >
            <Heart size={16} />
          </button>
        </div>

        {/* Info section — Z+10 slight lift */}
        <div
          className="px-8 pb-8 flex-1 flex flex-col border-t border-white/[0.05] mt-2 pt-6"
          style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
        >
          <p className="text-[10px] font-black tracking-[0.3em] text-orange-400/30 uppercase mb-3">
            {product.category}
          </p>
          <h3
            className="text-base font-bold text-orange-400 mb-3 leading-tight group-hover:text-white transition-colors duration-300 line-clamp-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                size={12}
                className={
                  j < Math.floor(Number(product.rating))
                    ? "text-amber-400 fill-amber-400"
                    : "text-orange-400/10"
                }
              />
            ))}
            <span className="text-xs text-orange-400/20 ml-1">{product.rating}</span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3">
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-xs text-orange-400/25 line-through mb-0.5">
                  {product.oldPrice}
                </span>
              )}
              <span
                className="text-2xl font-black text-orange-400"
                style={{ textShadow: "0 0 20px rgba(249,115,22,0.3)" }}
              >
                {product.price}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={cn(
                "relative flex items-center justify-center h-12 rounded-2xl transition-all duration-500 font-black text-sm",
                isAdded
                  ? "w-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : "w-12 bg-orange-500/8 border border-orange-500/15 text-orange-400 hover:bg-orange-500 hover:text-white hover:w-full hover:shadow-lg hover:shadow-orange-500/30"
              )}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest whitespace-nowrap"
                  >
                    <Check size={16} />
                    <span>No Carrinho</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
                  >
                    <ShoppingCart size={18} className="shrink-0" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-[80px] transition-all duration-500 text-xs uppercase tracking-widest">
                      Adicionar
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
