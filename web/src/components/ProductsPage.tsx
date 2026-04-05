"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { products, categories, Product } from "@/data/products";
import { Plus, Heart, Star, Search, SlidersHorizontal, Check, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import { toast } from "sonner";
import { ProductModal } from "./ProductModal";
import { use3DTilt } from "@/hooks/use3DTilt";
import { useCartFlight } from "./CartFlight";
import { Breadcrumbs } from "./Breadcrumbs";
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
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const qParam = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(qParam);
  const [sort, setSort] = useState<SortOption>("relevance");

  // Sync search query when URL param changes (e.g. from Navbar search)
  useEffect(() => {
    setSearchQuery(qParam);
  }, [qParam]);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "Todos" || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStock = !showInStockOnly || p.inStock !== false;
    return matchCat && matchSearch && matchStock;
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
        <Breadcrumbs items={[{ label: "Produtos" }]} />

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

              {/* Availability Filter */}
              <div className="mt-8 pt-8 border-t border-white/[0.06]">
                <h3 className="font-bold text-orange-400/80 mb-4 uppercase tracking-[0.2em] text-xs">
                  Disponibilidade
                </h3>
                <button
                  onClick={() => setShowInStockOnly((v) => !v)}
                  className={cn(
                    "w-full flex items-center justify-between px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border",
                    showInStockOnly
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "text-white/50 hover:text-white hover:bg-white/5 border-transparent"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      showInStockOnly ? "bg-emerald-400" : "bg-white/20"
                    )} />
                    Só em stock
                  </span>
                  <span className={cn(
                    "w-10 h-5 rounded-full relative transition-colors duration-300",
                    showInStockOnly ? "bg-emerald-500/40" : "bg-white/10"
                  )}>
                    <span className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300",
                      showInStockOnly ? "left-[22px] bg-emerald-400" : "left-0.5 bg-white/30"
                    )} />
                  </span>
                </button>
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

// ── ProductCard: True 3D Pop-Out ──────────────────────────────────
// Same dramatic 3D as FeaturedProducts — image escapes card bounds

function ProductCard({
  product,
  index,
  onOpen,
}: {
  product: Product;
  index: number;
  onOpen: () => void;
}) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const { toggleItem, hasItem } = useWishlist();
  const isInWishlist = hasItem(product.id);
  const { fireCartFlight } = useCartFlight();

  const { tiltRef, glowRef, imgRef, shadowRef } = use3DTilt({
    maxTilt: 14,
    preset: "snappy",
    perspective: 520,
    hoverScale: 1.03,
    glowFollow: true,
    imageZ: 65,
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const imgElRef = useRef<HTMLImageElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    toast.success(`${product.name} adicionado ao carrinho`, {
      description: "Continuar a comprar ou finalizar compra",
    });

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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    toast.success(
      isInWishlist ? "Removido da lista de desejos" : "Adicionado à lista de desejos"
    );
  };

  return (
    <div
      className="product-card relative h-full"
      style={{ perspective: "520px" }}
    >
      {/* Card: NO overflow:hidden so image pops out */}
      <div
        ref={setCardRef}
        onClick={onOpen}
        className={cn(
          "group relative flex flex-col rounded-[2rem] border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-white/[0.01] h-full cursor-pointer",
          product.inStock === false && "opacity-60"
        )}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Cursor glow */}
        <div
          ref={glowRef as React.RefObject<HTMLDivElement>}
          className="absolute inset-0 rounded-[2rem] pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: 0 }}
        />

        {/* Holographic shimmer */}
        <div className="absolute inset-0 rounded-[2rem] pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, transparent 40%, rgba(249,115,22,0.07) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2.5s infinite",
            }}
          />
        </div>

        {/* Badge at Z+30 */}
        {product.badge && (
          <span
            className="absolute top-5 left-5 z-20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-lg shadow-orange-500/40"
            style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
          >
            {product.badge}
          </span>
        )}

        {/* Image area — tall, no overflow:hidden */}
        <div
          className="relative flex items-center justify-center pt-10 pb-2 px-6"
          style={{ minHeight: "220px" }}
        >
          {/* Volumetric shadow disc */}
          <div
            ref={shadowRef as React.RefObject<HTMLDivElement>}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/60 rounded-full pointer-events-none"
            style={{ transform: "translateZ(-10px)" }}
          />

          {/* Product image — springs to Z+65 on hover */}
          <div
            ref={setImgContainerRef}
            className="relative w-full max-w-[180px] h-[160px] z-20 pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              transform: "translateZ(0px)",
              willChange: "transform",
              filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.35))",
            }}
          >
            <Image
              src={product.img}
              alt={product.name}
              fill
              sizes="180px"
              className="object-contain"
              onLoad={handleImageLoad}
            />
          </div>

          {/* Wishlist */}
          <button
            onClick={handleToggleWishlist}
            className={cn(
              "absolute top-5 right-5 p-2.5 rounded-xl backdrop-blur-md transition-all z-30 opacity-0 group-hover:opacity-100",
              isInWishlist
                ? "bg-rose-500/20 text-rose-400"
                : "bg-black/40 text-white/30 hover:text-rose-400 hover:bg-black/60"
            )}
            style={{ transform: "translateZ(35px)", transformStyle: "preserve-3d" }}
          >
            <Heart size={15} className={isInWishlist ? "fill-rose-400" : ""} />
          </button>
        </div>

        {/* Info section at Z+10 */}
        <div
          className="px-6 pb-6 pt-4 flex-1 flex flex-col border-t border-white/[0.05]"
          style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
        >
          <p className="text-[9px] font-black tracking-[0.25em] text-orange-400/50 uppercase mb-2">
            {product.category}
          </p>
          <h3
            className="text-[15px] font-bold text-white mb-3 leading-tight group-hover:text-orange-300 transition-colors duration-300 line-clamp-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-3">
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
            <span className="text-xs text-white/25 ml-1.5">{product.rating}</span>
          </div>

          {/* Stock badge */}
          <div className="mb-4">
            {product.inStock !== false ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  Em Stock
                </span>
                {product.stockCount != null && product.stockCount <= 5 && product.stockCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <AlertTriangle size={10} className="shrink-0" />
                    Só restam {product.stockCount}!
                  </span>
                )}
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                Esgotado
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3">
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-xs text-white/20 line-through mb-0.5">
                  {product.oldPrice}
                </span>
              )}
              <span
                className={cn(
                  "text-xl font-black",
                  product.inStock === false ? "text-white/20" : "text-orange-300"
                )}
                style={product.inStock !== false ? { textShadow: "0 0 16px rgba(251,146,60,0.25)" } : undefined}
              >
                {product.price}
              </span>
            </div>

            {product.inStock === false ? (
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/5 border border-white/10 text-white/20 cursor-not-allowed">
                <X size={18} />
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className={cn(
                  "relative flex items-center justify-center gap-2 h-12 rounded-xl transition-all duration-500 font-bold text-sm",
                  isAdded
                    ? "w-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "w-12 bg-orange-500/10 border border-orange-500/20 text-orange-300 hover:bg-orange-500 hover:text-white hover:w-full hover:shadow-lg hover:shadow-orange-500/30"
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
                      <Check size={16} className="shrink-0" />
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
                      <Plus size={18} className="shrink-0" />
                      <span className="max-w-0 overflow-hidden group-hover:max-w-[80px] transition-all duration-500">
                        Adicionar
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
