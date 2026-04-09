"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Star,
  X,
  Search,
  ArrowRight,
  GitCompareArrows,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Product } from "@/data/products";

interface ComparePageClientProps {
  products: Product[];
}

const MAX_COMPARE = 4;

function ProductSelector({
  products,
  selectedIds,
  onSelect,
  placeholder,
}: {
  products: Product[];
  selectedIds: number[];
  onSelect: (product: Product) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return products.slice(0, 20);
    const lower = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          (p.brand?.toLowerCase().includes(lower) ?? false) ||
          p.category.toLowerCase().includes(lower)
      )
      .slice(0, 20);
  }, [products, query]);

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] cursor-pointer hover:border-orange-500/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Search size={14} className="text-white/30 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        />
        <ChevronDown
          size={14}
          className={`text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0E1225]/95 backdrop-blur-md z-50"
          >
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-white/30 text-center">
                Nenhum produto encontrado
              </p>
            ) : (
              filtered.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    disabled={isSelected}
                    onClick={() => {
                      onSelect(product);
                      setQuery("");
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors ${
                      isSelected ? "opacity-30 cursor-not-allowed" : ""
                    }`}
                  >
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-10 h-10 object-contain shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-white/30">
                        {product.category}
                        {product.brand ? ` / ${product.brand}` : ""}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-orange-400 shrink-0">
                      {product.price}
                    </span>
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompareCard({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
    >
      {/* Image + remove */}
      <div className="relative aspect-square bg-gradient-to-b from-white/[0.04] to-transparent p-4 flex items-center justify-center">
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          aria-label="Remover da comparacao"
        >
          <X size={14} />
        </button>
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg">
            {product.badge}
          </span>
        )}
        <img
          src={product.img}
          alt={product.name}
          className="max-h-32 w-auto object-contain"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <Link href={`/produtos/${product.id}`}>
          <h3
            className="text-sm font-bold text-white hover:text-orange-400 transition-colors line-clamp-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {product.name}
          </h3>
        </Link>

        {product.brand && (
          <p className="text-[11px] text-white/30">{product.brand}</p>
        )}

        <div className="flex items-center gap-1">
          <Star size={12} className="text-orange-400 fill-orange-400" />
          <span className="text-xs text-white/40">{product.rating}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-orange-400">
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-white/25 line-through">
              {product.oldPrice}
            </span>
          )}
        </div>

        <p className="text-[11px] text-white/30">{product.category}</p>
      </div>

      {/* Specs */}
      {product.features && product.features.length > 0 && (
        <div className="border-t border-white/[0.06] p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/25 mb-3">
            Especificacoes
          </p>
          <div className="space-y-2">
            {product.features.map((feat) => (
              <div key={feat.name} className="flex justify-between gap-2">
                <span className="text-xs text-white/40 truncate">
                  {feat.name}
                </span>
                <span className="text-xs font-semibold text-white/70 text-right">
                  {feat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function ComparePageClient({ products }: ComparePageClientProps) {
  const [selected, setSelected] = useState<Product[]>([]);

  const handleSelect = (product: Product) => {
    if (selected.length >= MAX_COMPARE) return;
    if (selected.some((p) => p.id === product.id)) return;
    setSelected([...selected, product]);
  };

  const handleRemove = (productId: number) => {
    setSelected(selected.filter((p) => p.id !== productId));
  };

  const selectedIds = selected.map((p) => p.id);

  return (
    <main className="min-h-screen bg-[#0A0E1A] pt-32 pb-24">
      {/* Decorative background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-0 translate-x-1/2 w-[600px] h-[600px] bg-orange-500/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Comparar Produtos" }]} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <GitCompareArrows size={14} className="text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
              Comparador
            </span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Comparar{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Hardware
            </span>
          </h1>

          <p className="text-white/50 text-lg font-medium max-w-2xl">
            Selecione ate {MAX_COMPARE} produtos para comparar especificacoes
            lado a lado. Encontre o componente perfeito para o seu setup.
          </p>
        </motion.div>

        {/* Product Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10"
        >
          <ProductSelector
            products={products}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            placeholder={
              selected.length >= MAX_COMPARE
                ? "Maximo de produtos atingido"
                : "Pesquisar produto para comparar..."
            }
          />
          <p className="mt-2 text-xs text-white/25">
            {selected.length}/{MAX_COMPARE} produtos selecionados
          </p>
        </motion.div>

        {/* Comparison Grid */}
        {selected.length > 0 ? (
          <div
            className={`grid gap-4 mb-16 ${
              selected.length === 1
                ? "grid-cols-1 max-w-sm"
                : selected.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : selected.length === 3
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {selected.map((product) => (
                <CompareCard
                  key={product.id}
                  product={product}
                  onRemove={() => handleRemove(product.id)}
                />
              ))}
            </AnimatePresence>

            {/* Add more placeholder */}
            {selected.length < MAX_COMPARE && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] flex items-center justify-center min-h-[300px]"
              >
                <div className="text-center">
                  <Plus size={24} className="text-white/15 mx-auto mb-2" />
                  <p className="text-sm text-white/20">
                    Adicionar produto
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-16 text-center mb-16"
          >
            <GitCompareArrows
              size={48}
              className="text-white/10 mx-auto mb-4"
            />
            <h3
              className="text-lg font-bold text-white/40 mb-2"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Nenhum produto selecionado
            </h3>
            <p className="text-sm text-white/25 max-w-md mx-auto">
              Use a barra de pesquisa acima para adicionar produtos e comparar
              especificacoes, precos e caracteristicas lado a lado.
            </p>
          </motion.div>
        )}

        {/* SEO Internal Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
        >
          <h2
            className="text-lg font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Categorias Populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Processadores", href: "/categoria/processadores" },
              { label: "Placas Graficas", href: "/categoria/placas-graficas" },
              { label: "Monitores", href: "/categoria/monitores" },
              { label: "Memoria RAM", href: "/categoria/memoria-ram" },
              { label: "Armazenamento", href: "/categoria/armazenamento" },
              { label: "Teclados e Ratos", href: "/categoria/teclados-ratos" },
              { label: "Guias de Compra", href: "/guias" },
              { label: "Todos os Produtos", href: "/produtos" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-orange-400 transition-colors duration-200"
              >
                <ArrowRight size={12} />
                {link.label}
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
