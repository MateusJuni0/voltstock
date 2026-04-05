"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/data/products";
import { Star, X, ShoppingCart, Heart, Shield, Truck, Package, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import { TRUST } from "@/lib/trust-constants";
import { toast } from "sonner";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [selectedImage, setSelectedImage] = useState(product.img);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const { toggleItem, hasItem } = useWishlist();
  const isInWishlist = hasItem(product.id);
  const router = useRouter();

  // Deterministic pseudo-random review count from product ID (3-182 range)
  const reviewCount = ((product.id * 7 + 13) % 180) + 3;
  const images = [product.img, ...(product.gallery || [])].filter(
    (img, idx, arr) => arr.indexOf(img) === idx
  );

  useEffect(() => {
    setSelectedImage(product.img);
    setIsAdded(false);
  }, [product.img]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    toast.success(`${product.name} adicionado ao carrinho`, {
      description: "Continuar a comprar ou finalizar compra",
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product);
    onClose();
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    toggleItem(product.id);
    toast.success(
      isInWishlist ? "Removido da lista de desejos" : "Adicionado à lista de desejos"
    );
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[1100] bg-black/75 backdrop-blur-md"
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 24 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[2.5rem] bg-[#0D1221] border border-accent/10 shadow-2xl shadow-black/60 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="sticky top-3 md:top-4 float-right mr-4 md:mr-6 mt-3 md:mt-4 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-[#0A0E1A] border border-orange-400/30 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition-all duration-200 shadow-lg shadow-black/40"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* ── Left: Images ── */}
            <div className="p-8 lg:p-10 space-y-4">
              <div className="relative aspect-square rounded-[2rem] bg-accent/[0.03] border border-accent/[0.08] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                  />
                </AnimatePresence>
                {product.badge && (
                  <span className="absolute top-5 left-5 px-4 py-2 rounded-full bg-accent text-[#0A0E1A] font-bold text-sm shadow-xl z-10">
                    {product.badge}
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={cn(
                        "flex-1 aspect-square rounded-2xl bg-accent/[0.03] border overflow-hidden transition-all duration-300 p-2",
                        selectedImage === img
                          ? "border-accent ring-2 ring-accent/20"
                          : "border-accent/10 opacity-50 hover:opacity-90"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Info ── */}
            <div className="p-8 lg:p-10 flex flex-col lg:border-l lg:border-accent/5">
              <p className="text-[10px] font-black tracking-[0.2em] text-orange-400/40 uppercase mb-3">
                {product.category}
              </p>
              <h2
                className="text-2xl lg:text-3xl font-extrabold text-orange-400 mb-4 leading-tight"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
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
                <span className="text-sm text-orange-400/40">{reviewCount} avaliações</span>
              </div>

              {/* Pricing */}
              <div className="flex items-end gap-4 mb-6">
                <span className="text-3xl font-black text-orange-400">{product.price}</span>
                {product.oldPrice && (
                  <span className="text-lg text-orange-400/30 line-through mb-1">{product.oldPrice}</span>
                )}
              </div>

              {product.description && (
                <p className="text-sm text-orange-400/60 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Features grid */}
              {product.features && product.features.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {product.features.map((f, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-accent/[0.04] border border-accent/8 flex flex-col gap-1"
                    >
                      <span className="text-[10px] uppercase tracking-wider text-orange-400/40 font-bold">
                        {f.name}
                      </span>
                      <span className="text-sm font-bold text-orange-400">{f.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Trust badges */}
              <div className="flex flex-wrap gap-5 mb-6">
                {[
                  { Icon: Shield, label: TRUST.warranty },
                  { Icon: Truck, label: TRUST.shippingFree },
                  { Icon: Package, label: TRUST.returns },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-orange-400/40">
                    <Icon size={15} />
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    className={cn(
                      "flex-1 h-14 rounded-2xl font-bold text-base transition-all duration-400 flex items-center justify-center gap-3",
                      isAdded
                        ? "bg-emerald-500 text-white"
                        : "bg-accent text-[#0A0E1A] hover:brightness-110 shadow-lg shadow-accent/15"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isAdded ? (
                        <motion.span
                          key="ok"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Check size={20} />
                          No Carrinho!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <ShoppingCart size={20} />
                          Adicionar ao Carrinho
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  <button
                    onClick={handleToggleWishlist}
                    className={cn(
                      "w-14 h-14 rounded-2xl border flex items-center justify-center transition-all",
                      isInWishlist
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        : "bg-accent/5 border-accent/10 text-orange-400/50 hover:text-rose-400 hover:bg-rose-500/10"
                    )}
                  >
                    <Heart size={22} className={isInWishlist ? "fill-rose-400" : ""} />
                  </button>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBuyNow}
                  className="w-full h-12 rounded-2xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Zap size={18} />
                  Comprar Agora
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
