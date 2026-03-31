"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Heart, Star, Check, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { products, Product } from "@/data/products";
import { useCart } from "@/store/useCart";
import { ProductModal } from "./ProductModal";

export function FeaturedProducts() {
  const featured = products.slice(0, 8);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const maxIndex = Math.max(0, featured.length - itemsPerView);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const cardWidth = containerWidth > 0 ? containerWidth / itemsPerView : 0;
  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <>
      <section className="py-32 px-6 bg-transparent relative">
        <div className="max-w-[1280px] mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
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
                  className="px-8 py-4 rounded-2xl bg-orange-500 text-white font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 cursor-pointer shadow-[0_0_40px_rgba(249,115,22,0.15)]"
                >
                  Ver Catálogo →
                </motion.div>
              </a>
            </motion.div>
          </div>

          {/* Carousel */}
          <div className="overflow-hidden" ref={containerRef}>
            {containerWidth > 0 && (
              <motion.div
                className="flex"
                animate={{ x: -currentIndex * cardWidth }}
                transition={{ type: "spring", stiffness: 280, damping: 32, mass: 0.9 }}
              >
                {featured.map((product, idx) => (
                  <div
                    key={product.id}
                    style={{ width: cardWidth, flexShrink: 0, paddingLeft: 12, paddingRight: 12 }}
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
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={cn(
                    "h-2 rounded-full transition-colors duration-300",
                    i === currentIndex ? "bg-accent" : "bg-accent/20 hover:bg-accent/40"
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.48), ease: "easeOut" }}
      whileHover={{ y: -10 }}
      onClick={onOpen}
      className="group relative flex flex-col rounded-[3rem] bg-accent/[0.03] border border-accent/5 overflow-hidden hover:border-accent/20 hover:shadow-accent/5 transition-all duration-500 shadow-2xl h-full cursor-pointer"
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-8 left-8 z-20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-2xl">
          {product.badge}
        </span>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden p-10 flex items-center justify-center">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(249,115,22,0.1)] group-hover:scale-[1.08] transition-all duration-700 ease-out z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-8 right-8 p-3.5 rounded-2xl bg-black/40 backdrop-blur-xl text-orange-400/50 hover:text-rose-400 hover:bg-black/60 transition-all z-20 opacity-0 group-hover:opacity-100 shadow-xl"
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Info */}
      <div className="px-10 pb-10 flex-1 flex flex-col">
        <div className="mb-8">
          <p className="text-[10px] font-black tracking-[0.3em] text-orange-400/30 uppercase mb-4">
            {product.category}
          </p>
          <h3
            className="text-[17px] font-bold text-orange-400 mb-4 leading-tight group-hover:text-white transition-colors duration-300 line-clamp-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                size={13}
                className={
                  j < Math.floor(Number(product.rating))
                    ? "text-amber-400 fill-amber-400"
                    : "text-orange-400/10"
                }
              />
            ))}
            <span className="text-xs font-black text-orange-400/20 ml-1.5">{product.rating}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-orange-400/25 line-through mb-1">{product.oldPrice}</span>
            )}
            <span className="text-2xl font-black text-orange-400">{product.price}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={cn(
              "relative flex items-center justify-center h-14 rounded-2xl transition-all duration-500 shadow-lg font-black",
              isAdded
                ? "w-full bg-emerald-500 text-white"
                : "w-14 bg-orange-500/5 border border-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white hover:w-full"
            )}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest"
                >
                  <Check size={18} />
                  <span>No Carrinho</span>
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
                >
                  <ShoppingCart size={20} className="shrink-0" />
                  <span className="max-w-0 overflow-hidden group-hover:max-w-[80px] transition-all duration-500 text-xs uppercase tracking-widest whitespace-nowrap">
                    Adicionar
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
