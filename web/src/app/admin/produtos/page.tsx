"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { products as localProducts, type Product } from "@/data/products";
import {
  Pencil,
  Check,
  X,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Types ----------

interface AdminProduct {
  id: number;
  name: string;
  category: string;
  img: string;
  costPrice: number;
  sellingPrice: number;
  marginPercentage: number;
  adSpend: number;
  apiOverhead: number;
  inStock: boolean;
}

interface EditFormData {
  costPrice: string;
  sellingPrice: string;
  adSpend: string;
  apiOverhead: string;
}

// ---------- Helpers ----------

function parseEuroPrice(priceStr: string): number {
  const cleaned = priceStr
    .replace(/\s*€\s*/, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

function formatEuro(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function getMarginColor(margin: number): string {
  if (margin >= 30) return "text-emerald-400";
  if (margin >= 15) return "text-yellow-400";
  return "text-red-400";
}

function buildFromLocal(products: Product[]): AdminProduct[] {
  return products.map((p) => {
    const sellingPrice = parseEuroPrice(p.price);
    const costPrice = sellingPrice / 2;
    const marginPercentage =
      sellingPrice > 0
        ? ((sellingPrice - costPrice) / sellingPrice) * 100
        : 0;

    return {
      id: p.id,
      name: p.name,
      category: p.category,
      img: p.img,
      costPrice,
      sellingPrice,
      marginPercentage,
      adSpend: 0,
      apiOverhead: 0,
      inStock: true,
    };
  });
}

// ---------- Main Page ----------

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditFormData>({
    costPrice: "",
    sellingPrice: "",
    adSpend: "",
    apiOverhead: "",
  });
  const [dataSource, setDataSource] = useState<"supabase" | "local">("local");

  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select(
            "id, name, category, image_url, cost_price, selling_price, margin_percentage, ad_spend, api_overhead, in_stock"
          );

        if (error || !data || data.length === 0) {
          throw new Error("No data");
        }

        const mapped: AdminProduct[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          img: p.image_url ?? "",
          costPrice: p.cost_price ?? 0,
          sellingPrice: p.selling_price ?? 0,
          marginPercentage: p.margin_percentage ?? 0,
          adSpend: p.ad_spend ?? 0,
          apiOverhead: p.api_overhead ?? 0,
          inStock: p.in_stock ?? true,
        }));

        setProducts(mapped);
        setDataSource("supabase");
      } catch {
        setProducts(buildFromLocal(localProducts));
        setDataSource("local");
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const startEditing = useCallback((product: AdminProduct) => {
    setEditingId(product.id);
    setEditForm({
      costPrice: product.costPrice.toFixed(2),
      sellingPrice: product.sellingPrice.toFixed(2),
      adSpend: product.adSpend.toFixed(2),
      apiOverhead: product.apiOverhead.toFixed(2),
    });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
  }, []);

  const saveEditing = useCallback(
    (productId: number) => {
      const cost = parseFloat(editForm.costPrice) || 0;
      const selling = parseFloat(editForm.sellingPrice) || 0;
      const ad = parseFloat(editForm.adSpend) || 0;
      const overhead = parseFloat(editForm.apiOverhead) || 0;
      const margin =
        selling > 0 ? ((selling - cost) / selling) * 100 : 0;

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                costPrice: cost,
                sellingPrice: selling,
                adSpend: ad,
                apiOverhead: overhead,
                marginPercentage: margin,
              }
            : p
        )
      );
      setEditingId(null);
    },
    [editForm]
  );

  const toggleStock = useCallback((productId: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, inStock: !p.inStock } : p
      )
    );
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">
            Gestao de Produtos
          </h1>
          <p className="text-[#A5D6E1]/50 text-sm mt-1">
            {products.length} produtos no catalogo
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
            dataSource === "supabase"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              dataSource === "supabase" ? "bg-emerald-400" : "bg-yellow-400"
            }`}
          />
          {dataSource === "supabase"
            ? "Supabase Online"
            : "Dados Locais (Fallback)"}
        </span>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-sidebar rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Produto
                </th>
                <th className="text-left px-4 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Categoria
                </th>
                <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Custo
                </th>
                <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Preco Venda
                </th>
                <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Margem
                </th>
                <th className="text-center px-4 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Stock
                </th>
                <th className="text-center px-6 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Acoes
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {products.map((product, index) => {
                  const isEditing = editingId === product.id;
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Product info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                            {product.img ? (
                              <img
                                src={product.img}
                                alt={product.name}
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-[#A5D6E1]/30" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white truncate max-w-[220px]">
                              {product.name}
                            </p>
                            {product.marginPercentage < 20 && (
                              <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] text-red-400">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Margem Critica
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-[#A5D6E1]/60 border border-white/5">
                          {product.category}
                        </span>
                      </td>

                      {/* Cost */}
                      <td className="text-right px-4 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.costPrice}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                costPrice: e.target.value,
                              }))
                            }
                            className="w-24 bg-white/5 border border-orange-500/30 rounded-lg px-2 py-1 text-sm text-white text-right font-mono focus:outline-none focus:border-orange-500"
                          />
                        ) : (
                          <span className="text-sm text-[#A5D6E1]/70 font-mono">
                            {formatEuro(product.costPrice)}
                          </span>
                        )}
                      </td>

                      {/* Selling Price */}
                      <td className="text-right px-4 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.sellingPrice}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                sellingPrice: e.target.value,
                              }))
                            }
                            className="w-24 bg-white/5 border border-orange-500/30 rounded-lg px-2 py-1 text-sm text-white text-right font-mono focus:outline-none focus:border-orange-500"
                          />
                        ) : (
                          <span className="text-sm text-white font-mono font-medium">
                            {formatEuro(product.sellingPrice)}
                          </span>
                        )}
                      </td>

                      {/* Margin */}
                      <td className="text-right px-4 py-4">
                        <span
                          className={`text-sm font-mono font-semibold ${getMarginColor(
                            product.marginPercentage
                          )}`}
                        >
                          {formatPercent(product.marginPercentage)}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="text-center px-4 py-4">
                        <button
                          onClick={() => toggleStock(product.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            product.inStock
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                          }`}
                        >
                          {product.inStock ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Em Stock
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              Esgotado
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="text-center px-6 py-4">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => saveEditing(product.id)}
                              className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(product)}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#A5D6E1]/50 hover:text-orange-400 hover:border-orange-500/20 hover:bg-orange-500/5 transition-all mx-auto"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>

                      {/* Inline edit row for ad_spend and api_overhead */}
                      {isEditing && (
                        <td colSpan={7} className="px-6 py-0">
                          {/* Rendered as a nested visual element */}
                        </td>
                      )}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Expanded edit panel - shown below table when editing */}
        <AnimatePresence>
          {editingId !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-orange-500/20 bg-orange-500/[0.03]"
            >
              <div className="p-6">
                <p className="text-xs uppercase tracking-wider text-orange-400/70 font-semibold mb-4">
                  Custos adicionais -{" "}
                  {products.find((p) => p.id === editingId)?.name}
                </p>
                <div className="flex items-center gap-6">
                  <div>
                    <label className="text-xs text-[#A5D6E1]/40 block mb-1">
                      Ad Spend
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.adSpend}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          adSpend: e.target.value,
                        }))
                      }
                      className="w-32 bg-white/5 border border-orange-500/30 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#A5D6E1]/40 block mb-1">
                      API Overhead
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.apiOverhead}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          apiOverhead: e.target.value,
                        }))
                      }
                      className="w-32 bg-white/5 border border-orange-500/30 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <button
                      onClick={() => saveEditing(editingId)}
                      className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
                    >
                      Guardar Alteracoes
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A5D6E1]/60 text-sm transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
