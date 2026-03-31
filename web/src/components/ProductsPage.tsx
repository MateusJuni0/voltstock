"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products, categories, Product } from "@/data/products";
import { Plus, Heart, Star, Search, SlidersHorizontal, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/useCart";
import { ProductModal } from "./ProductModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating";

// ── helpers ────────────────────────────────────────────────────────────────

function parsePrice(raw: string): number {
  return parseFloat(raw.replace(/[^0-9,]/g, "").replace(",", ".")) || 0;
}

function sortProducts(list: Product[], sort: SortOption): Product[] {
  const copy = [...list];
  if (sort === "price-asc") return copy.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  if (sort === "price-desc") return copy.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  if (sort === "rating") return copy.sort((a, b) => Number(b.rating) - Number(a.rating));
  return copy; // relevance = original order
}

// ── component ──────────────────────────────────────────────────────────────

export function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "Todos" || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const sorted = sortProducts(filtered, sort);

  const countByCategory = (cat: string) =>
    products.filter((p) => p.category === cat).length;

  // ── GSAP stagger when list changes ──────────────────────────────────────
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".product-card");
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 32, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.055,
        duration: 0.5,
        ease: "power3.out",
        clearProps: "transform",
      }
    );
  }, [activeCategory, searchQuery, sort]);

  const sortLabels: Record<SortOption, string> = {
    relevance: "Relevância",
    "price-asc": "Preço ↑",
    "price-desc": "Preço ↓",
    rating: "Avaliação",
  };

  return (
    <div className="min-h-screen pt-[120px] pb-20 px-6">
      <div className="max-w-[1280px] mx-auto">
        {/* ── Header & Search ── */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="font-extrabold tracking-tight text-orange-400 mb-2"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
              }}
            >
              Hardware de Elite
            </h1>
            <p className="text-orange-400/60">
              A base do seu próximo setup lendário está aqui.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-auto flex items-center gap-3"
          >
            {/* Search */}
            <div className="relative w-full md:w-96 group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400/30 group-focus-within:text-orange-400 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Pesquisar componentes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-accent/5 border border-accent/10 rounded-full py-4 pl-14 pr-6 text-orange-400 placeholder:text-orange-400/30 focus:outline-none focus:border-accent/40 focus:bg-accent/10 transition-all shadow-xl"
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 h-14 rounded-full bg-accent/5 border border-accent/10 text-orange-400 hover:bg-accent/10 transition-all whitespace-nowrap text-sm font-semibold",
                  sortOpen && "bg-orange-500/10 border-orange-500/30 text-orange-300"
                )}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">{sortLabels[sort]}</span>
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-[#0f1320]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
                  >
                    {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSort(key); setSortOpen(false); }}
                        className={cn(
                          "w-full text-left px-4 py-3 text-sm font-semibold transition-colors",
                          sort === key
                            ? "text-orange-400 bg-orange-500/10"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {sortLabels[key]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto p-8 rounded-[2.5rem] glass-sidebar scrollbar-thin">
              <h3 className="font-bold text-orange-400/80 mb-8 uppercase tracking-[0.2em] text-xs">
                Categorias
              </h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setActiveCategory("Todos")}
                  className={cn(
                    "text-left px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-between",
                    activeCategory === "Todos"
                      ? "bg-orange-500/80 text-white shadow-lg shadow-orange-500/30 border border-orange-400/30"
                      : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <span>Ver Tudo</span>
                  <span className="text-[10px] font-black opacity-60">{products.length}</span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "text-left px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-between",
                      activeCategory === cat
                        ? "bg-orange-500/80 text-white shadow-lg shadow-orange-500/30 border border-orange-400/30"
                        : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] font-black opacity-60">{countByCategory(cat)}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Grid ── */}
          <main className="flex-1">
            {/* Results count */}
            <p className="text-xs text-orange-400/30 font-bold uppercase tracking-widest mb-6">
              {sorted.length} produto{sorted.length !== 1 ? "s" : ""}
              {activeCategory !== "Todos" && ` em ${activeCategory}`}
            </p>

            {sorted.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-orange-400/50"
              >
                <Search size={64} className="mb-6 opacity-10" />
                <p className="text-xl font-medium">Não encontramos o que procuras.</p>
                <button
                  onClick={() => { setActiveCategory("Todos"); setSearchQuery(""); }}
                  className="mt-4 text-orange-400 hover:underline"
                >
                  Limpar filtros
                </button>
              </motion.div>
            ) : (
              <div
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {sorted.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={idx}
                    onOpen={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── ProductCard ────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  index: number;
  onOpen: () => void;
}) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div
      className="product-card group relative flex flex-col rounded-[2.5rem] bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] overflow-hidden hover:border-orange-500/30 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_60px_rgba(249,115,22,0.08),0_0_0_1px_rgba(249,115,22,0.15)] hover:-translate-y-2 hover:scale-[1.01]"
    >
      <div onClick={onOpen} className="flex flex-col flex-1 cursor-pointer">
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-6 left-6 z-10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-xl shadow-orange-500/30">
            {product.badge}
          </span>
        )}

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-transparent p-6">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-contain opacity-85 group-hover:opacity-100 group-hover:scale-[1.08] transition-all duration-700 ease-out drop-shadow-[0_10px_30px_rgba(134,184,190,0.15)]"
          />
          <button
            onClick={(e) => e.stopPropagation()}
            className="absolute top-6 right-6 p-3 rounded-full bg-black/50 backdrop-blur-md text-white/40 hover:text-rose-400 hover:bg-black/70 transition-all z-10 opacity-0 group-hover:opacity-100"
          >
            <Heart size={18} />
          </button>
        </div>

        {/* Info */}
        <div className="px-8 pb-8 flex-1 flex flex-col">
          <div className="mb-6">
            <p className="text-[10px] font-black tracking-[0.2em] text-orange-400/70 uppercase mb-3">
              {product.category}
            </p>
            <h3
              className="text-stroke-orange text-lg font-bold text-white mb-4 leading-tight group-hover:[text-shadow:0_0_20px_rgba(251,146,60,0.3)] transition-all duration-300"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  size={14}
                  className={
                    j < Math.floor(Number(product.rating))
                      ? "text-amber-400 fill-amber-400"
                      : "text-white/15"
                  }
                />
              ))}
              <span className="text-xs font-bold text-white/30 ml-2">
                {product.rating}
              </span>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="mt-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-xs text-white/25 line-through mb-0.5">
                  {product.oldPrice}
                </span>
              )}
              <span className="text-xl font-black text-orange-300 group-hover:[text-shadow:0_0_16px_rgba(251,146,60,0.5)] transition-all duration-300">
                {product.price}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={cn(
                "relative flex items-center justify-center gap-2 h-14 px-5 rounded-2xl transition-all duration-500 font-bold text-sm overflow-hidden",
                isAdded
                  ? "w-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : "w-14 bg-orange-500/10 border border-orange-500/20 text-orange-300 hover:bg-orange-500 hover:text-white hover:w-full hover:shadow-lg hover:shadow-orange-500/30"
              )}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Check size={18} className="shrink-0" />
                    <span>No Carrinho</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus size={20} className="shrink-0" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-[80px] transition-all duration-500">
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
