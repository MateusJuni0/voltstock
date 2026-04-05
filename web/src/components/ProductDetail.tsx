"use client";

import { useState, useRef, useEffect, useCallback, MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/data/products";
import {
  Star, ChevronLeft, ShoppingCart, Heart, Shield, Truck, Package, Check, X,
  AlertTriangle, RotateCcw, Clock, Lock, MessageCircle, ChevronDown, Flame, Eye,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import { Breadcrumbs } from "./Breadcrumbs";
import { RelatedProducts } from "./RelatedProducts";
import { toast } from "sonner";

// --- Helpers ---

/** Parse Portuguese price string like "2.199,00 €" into a number */
function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^\d,]/g, "").replace(",", "."));
}

/** Format number to Portuguese price string */
function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",") + " \u20AC";
}

/** Deterministic pseudo-random number from product ID (range min..max) */
function pseudoRandom(id: number, min: number, max: number): number {
  const hash = ((id * 2654435761) >>> 0) % (max - min + 1);
  return min + hash;
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.img);
  const [isAdded, setIsAdded] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [magnifier, setMagnifier] = useState({ active: false, x: 0, y: 0 });
  const addItem = useCart((state) => state.addItem);
  const { toggleItem, hasItem } = useWishlist();
  const isInWishlist = hasItem(product.id);
  const addToCartRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    toast.success(`${product.name} adicionado ao carrinho`, {
      description: "Continuar a comprar ou finalizar compra",
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleItem(product.id);
    toast.success(
      isInWishlist ? "Removido da lista de desejos" : "Adicionado à lista de desejos"
    );
  };

  // Sticky bar: show when original add-to-cart scrolls out of view
  useEffect(() => {
    const el = addToCartRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Image magnifier handlers
  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMagnifier({ active: true, x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMagnifier({ active: false, x: 0, y: 0 });
  }, []);

  // Computed values
  const priceNum = parsePrice(product.price);
  const oldPriceNum = product.oldPrice ? parsePrice(product.oldPrice) : null;
  const savings = oldPriceNum ? oldPriceNum - priceNum : 0;
  const savingsPercent = oldPriceNum ? Math.round((savings / oldPriceNum) * 100) : 0;
  const socialProofCount = pseudoRandom(product.id, 15, 89);
  const freeShipping = priceNum >= 50;

  const images = [product.img, ...(product.gallery || [])];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-[1280px] mx-auto">
        <Breadcrumbs
          items={[
            { label: "Produtos", href: "/produtos" },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-square rounded-[2rem] bg-accent/[0.03] border border-accent/10 overflow-hidden shadow-2xl cursor-crosshair"
            >
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8"
                style={magnifier.active ? {
                  transform: "scale(2)",
                  transformOrigin: `${magnifier.x}% ${magnifier.y}%`,
                  transition: "transform 0.1s ease-out",
                } : {
                  transform: "scale(1)",
                  transformOrigin: "center center",
                  transition: "transform 0.3s ease-out",
                }}
              />
              {product.badge && (
                <span className="absolute top-6 left-6 px-4 py-2 rounded-full bg-accent text-[#0A0E1A] font-bold text-sm shadow-xl z-10">
                  {product.badge}
                </span>
              )}
              {magnifier.active && (
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 text-orange-400/70 text-xs font-medium backdrop-blur-sm z-10">
                  <Eye size={12} className="inline mr-1.5 -mt-0.5" />
                  Zoom ativo
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "aspect-square rounded-2xl bg-accent/[0.03] border overflow-hidden transition-all duration-300 p-2",
                    selectedImage === img ? "border-accent ring-2 ring-accent/20" : "border-accent/10 opacity-60 hover:opacity-100"
                  )}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`${product.name} - imagem ${idx + 1}`}
                      fill
                        sizes="(max-width: 768px) 25vw, 120px"
                      className="object-contain"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm font-semibold tracking-[0.2em] text-orange-400/50 uppercase mb-4">
                {product.category}
              </p>
              <h1
                className="text-4xl md:text-5xl font-extrabold text-orange-400 mb-6 leading-tight"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(Number(product.rating))
                          ? "text-amber-400 fill-amber-400"
                          : "text-orange-400/15"
                      }
                    />
                  ))}
                  <span className="text-sm font-bold text-orange-400 ml-2">{product.rating}</span>
                </div>
                <div className="w-px h-4 bg-accent/20" />
                <span className="text-sm text-orange-400/40">{((product.id * 7 + 13) % 180) + 20} avaliações</span>
              </div>

              <div className="flex items-end gap-4 mb-2">
                <span className="text-4xl font-black text-orange-400">{product.price}</span>
                {product.oldPrice && (
                  <span className="text-xl text-orange-400/30 line-through mb-1">{product.oldPrice}</span>
                )}
              </div>

              {/* Savings Badge */}
              {product.oldPrice && savings > 0 && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
                    Poupa {formatPrice(savings)} (-{savingsPercent}%)
                  </span>
                </div>
              )}

              {/* Shipping & Guarantee Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-white/[0.02] border border-accent/5">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-orange-400/60 shrink-0" />
                  <span className="text-xs text-orange-400/60 leading-tight">
                    {freeShipping ? "Envio Grátis" : "Envio: 4,99\u20AC"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={16} className="text-orange-400/60 shrink-0" />
                  <span className="text-xs text-orange-400/60 leading-tight">14 dias devoluções</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-orange-400/60 shrink-0" />
                  <span className="text-xs text-orange-400/60 leading-tight">Garantia 2 anos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-orange-400/60 shrink-0" />
                  <span className="text-xs text-orange-400/60 leading-tight">Entrega 24-48h</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3 mb-4">
                {product.inStock !== false ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                      <Check size={14} className="shrink-0" />
                      Em Stock
                    </span>
                    {product.stockCount != null && product.stockCount <= 5 && product.stockCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold">
                        <AlertTriangle size={14} className="shrink-0" />
                        Só restam {product.stockCount} em stock!
                      </span>
                    )}
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
                    <X size={14} className="shrink-0" />
                    Esgotado
                  </span>
                )}
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-2 mb-10 px-3 py-2 rounded-xl bg-orange-500/5 border border-orange-500/10 w-fit">
                <Flame size={14} className="text-orange-400 shrink-0" />
                <span className="text-sm text-orange-400/70 font-medium">
                  {socialProofCount} pessoas viram este produto nas últimas 24h
                </span>
              </div>

              <p className="text-lg text-orange-400/70 leading-relaxed mb-8 whitespace-pre-line">
                {product.description}
              </p>

              {/* Trust Section — Porquê VoltStock? */}
              <div className="mb-10 p-5 rounded-2xl bg-white/[0.02] border border-accent/5">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-400/40 font-bold mb-4">Porquê VoltStock?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-400/5 border border-orange-400/10 flex items-center justify-center">
                      <Lock size={18} className="text-orange-400/70" />
                    </div>
                    <span className="text-xs text-orange-400/60 font-medium leading-tight">Pagamento Seguro</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-400/5 border border-orange-400/10 flex items-center justify-center">
                      <Truck size={18} className="text-orange-400/70" />
                    </div>
                    <span className="text-xs text-orange-400/60 font-medium leading-tight">Envio 24-48h</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-400/5 border border-orange-400/10 flex items-center justify-center">
                      <MessageCircle size={18} className="text-orange-400/70" />
                    </div>
                    <span className="text-xs text-orange-400/60 font-medium leading-tight">Suporte WhatsApp</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-400/5 border border-orange-400/10 flex items-center justify-center">
                      <RotateCcw size={18} className="text-orange-400/70" />
                    </div>
                    <span className="text-xs text-orange-400/60 font-medium leading-tight">14 dias devolução</span>
                  </div>
                </div>
              </div>

              {product.features && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {product.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-accent/[0.03] border border-accent/5 flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-orange-400/40 font-bold">{f.name}</span>
                      <span className="text-sm font-bold text-orange-400">{f.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Collapsible Specs Table */}
              {product.features && product.features.length > 0 && (
                <div className="mb-10">
                  <button
                    onClick={() => setSpecsOpen((prev) => !prev)}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl bg-white/[0.02] border border-accent/5 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-sm font-bold text-orange-400">Especificações Técnicas</span>
                    <motion.div
                      animate={{ rotate: specsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-auto"
                    >
                      <ChevronDown size={16} className="text-orange-400/50" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {specsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 rounded-xl border border-accent/5 overflow-hidden">
                          {product.features.map((f, i) => (
                            <div
                              key={i}
                              className={cn(
                                "flex items-center justify-between px-4 py-3 text-sm",
                                i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                              )}
                            >
                              <span className="text-orange-400/50 font-medium">{f.name}</span>
                              <span className="text-orange-400 font-bold text-right">{f.value}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="flex gap-4" ref={addToCartRef}>
                {product.inStock === false ? (
                  <button
                    disabled
                    className="flex-1 h-16 rounded-2xl font-bold text-lg bg-white/5 border border-white/10 text-white/30 cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <X size={22} />
                    Esgotado
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className={cn(
                      "flex-1 h-16 rounded-2xl font-bold text-lg transition-all duration-500 relative overflow-hidden flex items-center justify-center gap-3",
                      isAdded ? "bg-emerald-500 text-white" : "bg-accent text-[#0A0E1A] hover:bg-accent/90 shadow-lg shadow-accent/10"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isAdded ? (
                        <motion.div
                          key="check"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          <Check size={22} />
                          No Carrinho!
                        </motion.div>
                      ) : (
                        <motion.div
                          key="cart"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-3"
                        >
                          <ShoppingCart size={22} />
                          Adicionar ao Carrinho
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                )}
                <button
                  onClick={handleToggleWishlist}
                  className={cn(
                    "w-16 h-16 rounded-2xl border flex items-center justify-center transition-all shadow-lg",
                    isInWishlist
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      : "bg-accent/5 border-accent/10 text-orange-400/60 hover:text-rose-400 hover:bg-rose-500/10"
                  )}
                >
                  <Heart size={24} className={isInWishlist ? "fill-rose-400" : ""} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts currentProduct={product} />
      </div>

      {/* Sticky Add-to-Cart Bar */}
      <AnimatePresence>
        {showStickyBar && product.inStock !== false && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-accent/10 bg-[#0A0E1A]/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 px-6 py-3">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-sm font-bold text-orange-400 truncate max-w-[200px] sm:max-w-[300px]">
                  {product.name}
                </span>
                <span className="text-lg font-black text-orange-400 shrink-0">{product.price}</span>
              </div>
              <button
                onClick={handleAddToCart}
                className={cn(
                  "h-11 px-6 rounded-xl font-bold text-sm transition-all duration-500 flex items-center gap-2 shrink-0",
                  isAdded ? "bg-emerald-500 text-white" : "bg-accent text-[#0A0E1A] hover:bg-accent/90 shadow-lg shadow-accent/10"
                )}
              >
                {isAdded ? (
                  <>
                    <Check size={16} />
                    <span className="hidden sm:inline">No Carrinho!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    <span className="hidden sm:inline">Adicionar ao Carrinho</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
