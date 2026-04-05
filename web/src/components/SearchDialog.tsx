"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { products, categories, type Product } from "@/data/products";
import { useDebounce } from "@/hooks/useDebounce";

// --- Fuzzy search helpers ---

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function fuzzyMatch(text: string, query: string): boolean {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);

  // Direct substring match
  if (normalizedText.includes(normalizedQuery)) {
    return true;
  }

  // Character-sequence fuzzy match
  let queryIdx = 0;
  for (let i = 0; i < normalizedText.length && queryIdx < normalizedQuery.length; i++) {
    if (normalizedText[i] === normalizedQuery[queryIdx]) {
      queryIdx++;
    }
  }

  return queryIdx === normalizedQuery.length;
}

function searchProducts(query: string): Product[] {
  if (query.length < 2) return [];

  const scored = products
    .map((product) => {
      const nameMatch = fuzzyMatch(product.name, query);
      const categoryMatch = fuzzyMatch(product.category, query);

      if (!nameMatch && !categoryMatch) return null;

      // Score: exact substring > fuzzy, name > category
      const normalizedName = normalizeText(product.name);
      const normalizedCategory = normalizeText(product.category);
      const normalizedQuery = normalizeText(query);

      let score = 0;
      if (normalizedName.includes(normalizedQuery)) score += 10;
      else if (nameMatch) score += 5;
      if (normalizedCategory.includes(normalizedQuery)) score += 4;
      else if (categoryMatch) score += 2;

      return { product, score };
    })
    .filter((entry): entry is { product: Product; score: number } => entry !== null);

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 8).map((entry) => entry.product);
}

// --- Popular categories for empty state ---

const POPULAR_CATEGORIES = categories.slice(0, 6);

// --- Component ---

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(
    () => searchProducts(debouncedQuery),
    [debouncedQuery]
  );

  // Auto-focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow animation to start
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
    // Reset query when closing
    setQuery("");
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const navigateTo = useCallback(
    (path: string) => {
      onClose();
      router.push(path);
    },
    [onClose, router]
  );

  const handleResultClick = useCallback(
    (productId: number) => {
      navigateTo(`/produtos/${productId}`);
    },
    [navigateTo]
  );

  const handleCategoryClick = useCallback(
    (category: string) => {
      navigateTo(`/produtos?categoria=${encodeURIComponent(category)}`);
    },
    [navigateTo]
  );

  const handleViewAll = useCallback(() => {
    navigateTo(`/produtos?q=${encodeURIComponent(query)}`);
  }, [navigateTo, query]);

  const hasQuery = debouncedQuery.length >= 2;
  const hasResults = results.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[2000] flex items-start justify-center pt-[10vh] px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#0A0E1A]/95 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <Search size={20} className="text-orange-400/60 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquise por nome ou categoria..."
                className="flex-1 bg-transparent text-white text-lg placeholder:text-white/30 outline-none caret-orange-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.length >= 2) {
                    handleViewAll();
                  }
                }}
              />
              {query.length > 0 && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-lg hover:bg-white/[0.06] transition-colors text-white/40 hover:text-white/70"
                  aria-label="Limpar pesquisa"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-xs text-white/30 border border-white/[0.1] rounded-md px-2 py-1 hover:bg-white/[0.06] transition-colors shrink-0"
              >
                ESC
              </button>
            </div>

            {/* Content area */}
            <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
              {/* Empty state: no query yet */}
              {!hasQuery && (
                <div className="px-5 py-6">
                  <p className="text-sm text-white/30 mb-4">Categorias populares</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className="px-3 py-1.5 rounded-lg text-sm text-orange-300/80 border border-orange-500/20 hover:bg-orange-500/10 hover:border-orange-500/30 hover:text-orange-300 transition-all duration-200"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {hasQuery && hasResults && (
                <div className="py-2">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.id)}
                      className="w-full flex items-center gap-4 px-5 py-3 hover:bg-white/[0.04] transition-colors text-left group"
                    >
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                        <Image
                          src={product.img}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-contain w-10 h-10"
                          loading="lazy"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/90 truncate group-hover:text-white transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">
                          {product.category}
                        </p>
                      </div>

                      {/* Price + Stock */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            product.inStock !== false ? "bg-emerald-400" : "bg-red-400"
                          }`}
                          title={product.inStock !== false ? "Em Stock" : "Esgotado"}
                        />
                        <span className={`text-sm font-semibold ${
                          product.inStock === false ? "text-white/30 line-through" : "text-orange-400"
                        }`}>
                          {product.price}
                        </span>
                      </div>
                    </button>
                  ))}

                  {/* View all link */}
                  <div className="px-5 py-3 border-t border-white/[0.06]">
                    <button
                      onClick={handleViewAll}
                      className="text-sm text-orange-400/80 hover:text-orange-400 transition-colors"
                    >
                      Ver todos os resultados para &lsquo;{debouncedQuery}&rsquo;
                    </button>
                  </div>
                </div>
              )}

              {/* No results */}
              {hasQuery && !hasResults && (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-white/50">
                    Nenhum resultado para &lsquo;{debouncedQuery}&rsquo;
                  </p>
                  <p className="text-xs text-white/25 mt-2">
                    Tente outro termo ou explore o nosso catálogo
                  </p>
                  <button
                    onClick={() => navigateTo("/produtos")}
                    className="mt-4 px-4 py-2 rounded-lg text-sm text-orange-300/80 border border-orange-500/20 hover:bg-orange-500/10 hover:text-orange-300 transition-all duration-200"
                  >
                    Ver todos os produtos
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
