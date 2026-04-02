"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/data/products";
import { Star, ChevronLeft, ShoppingCart, Heart, Shield, Truck, Package, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/useCart";

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.img);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const images = [product.img, ...(product.gallery || [])];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-[1280px] mx-auto">
        <Link href="/produtos">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-orange-400/60 hover:text-orange-400 transition-colors mb-10 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar ao Catálogo
          </motion.button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16">
          {/* Left: Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[2rem] bg-accent/[0.03] border border-accent/10 overflow-hidden shadow-2xl"
            >
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
              {product.badge && (
                <span className="absolute top-6 left-6 px-4 py-2 rounded-full bg-accent text-[#0A0E1A] font-bold text-sm shadow-xl z-10">
                  {product.badge}
                </span>
              )}
            </motion.div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
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
                  <img src={img} alt="" className="w-full h-full object-contain" />
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
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-orange-400 mb-6 leading-tight"
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
                <span className="text-sm text-orange-400/40">128 avaliações</span>
              </div>

              <div className="flex items-end gap-4 mb-10">
                <span className="text-4xl font-black text-orange-400">{product.price}</span>
                {product.oldPrice && (
                  <span className="text-xl text-orange-400/30 line-through mb-1">{product.oldPrice}</span>
                )}
              </div>

              <p className="text-lg text-orange-400/70 leading-relaxed mb-10 whitespace-pre-line">
                {product.description}
              </p>

              {product.features && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-10">
                  {product.features.map((f, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-accent/[0.03] border border-accent/5 flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-orange-400/40 font-bold">{f.name}</span>
                      <span className="text-sm font-bold text-orange-400">{f.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
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
                <button className="w-16 h-16 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center text-orange-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all shadow-lg">
                  <Heart size={24} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
