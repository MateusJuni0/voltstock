"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { products as localProducts } from "@/data/products";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  BarChart3,
  AlertTriangle,
  Wallet,
  PieChart,
} from "lucide-react";
import { motion } from "framer-motion";

// ---------- Types ----------

interface ProductProfit {
  id: number;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  marginPercentage: number;
  adSpend: number;
  apiOverhead: number;
  realProfit: number;
}

interface KpiData {
  receitaTotal: number;
  custoTotal: number;
  lucroLiquido: number;
  margemMedia: number;
  encomendasTotal: number;
  aov: number;
}

// ---------- Helpers ----------

function parseEuroPrice(priceStr: string): number {
  // "2.199,00 €" -> 2199.00 / "338,45 €" -> 338.45
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

function buildFallbackProducts(): ProductProfit[] {
  return localProducts.map((p) => {
    const sellingPrice = parseEuroPrice(p.price);
    const costPrice = sellingPrice / 2; // 100% markup assumption
    const adSpend = 0;
    const apiOverhead = 0;
    const realProfit = sellingPrice - costPrice - adSpend - apiOverhead;
    const marginPercentage =
      sellingPrice > 0
        ? ((sellingPrice - costPrice) / sellingPrice) * 100
        : 0;

    return {
      id: p.id,
      name: p.name,
      category: p.category,
      costPrice,
      sellingPrice,
      marginPercentage,
      adSpend,
      apiOverhead,
      realProfit,
    };
  });
}

function getMarginColor(margin: number): string {
  if (margin >= 30) return "text-emerald-400";
  if (margin >= 15) return "text-yellow-400";
  return "text-red-400";
}

function getMarginRowBg(margin: number): string {
  if (margin >= 30) return "hover:bg-emerald-500/5";
  if (margin >= 15) return "hover:bg-yellow-500/5";
  return "hover:bg-red-500/5 bg-red-500/[0.02]";
}

// ---------- KPI Card Component ----------

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  accent?: boolean;
  delay?: number;
}

function KpiCard({
  title,
  value,
  icon,
  trend = "neutral",
  accent = false,
  delay = 0,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-sidebar rounded-2xl p-6 relative overflow-hidden group"
    >
      {/* Accent glow */}
      {accent && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/15 transition-colors" />
      )}

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold mb-2">
            {title}
          </p>
          <p
            className={`text-2xl font-heading font-bold ${
              accent ? "text-orange-400" : "text-white"
            }`}
          >
            {value}
          </p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            accent
              ? "bg-orange-500/15 text-orange-400"
              : "bg-white/5 text-[#86B8BE]"
          }`}
        >
          {icon}
        </div>
      </div>

      {trend !== "neutral" && (
        <div className="mt-3 flex items-center gap-1 relative z-10">
          {trend === "up" ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          )}
          <span
            className={`text-xs font-medium ${
              trend === "up" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {trend === "up" ? "Positivo" : "Atencao"}
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ---------- Main Page ----------

export default function AdminDashboardPage() {
  const [productsProfitData, setProductsProfitData] = useState<ProductProfit[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<"supabase" | "local">("local");

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select(
            "id, name, category, cost_price, selling_price, margin_percentage, ad_spend, api_overhead"
          );

        if (error || !data || data.length === 0) {
          throw new Error("No data from Supabase");
        }

        const mapped: ProductProfit[] = data.map((p) => {
          const realProfit =
            (p.selling_price ?? 0) -
            (p.cost_price ?? 0) -
            (p.ad_spend ?? 0) -
            (p.api_overhead ?? 0);
          return {
            id: p.id,
            name: p.name,
            category: p.category,
            costPrice: p.cost_price ?? 0,
            sellingPrice: p.selling_price ?? 0,
            marginPercentage: p.margin_percentage ?? 0,
            adSpend: p.ad_spend ?? 0,
            apiOverhead: p.api_overhead ?? 0,
            realProfit,
          };
        });

        setProductsProfitData(
          mapped.sort((a, b) => b.realProfit - a.realProfit)
        );
        setDataSource("supabase");
      } catch {
        // Supabase offline — use fallback
        const fallback = buildFallbackProducts().sort(
          (a, b) => b.realProfit - a.realProfit
        );
        setProductsProfitData(fallback);
        setDataSource("local");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const kpis: KpiData = useMemo(() => {
    if (productsProfitData.length === 0) {
      return {
        receitaTotal: 0,
        custoTotal: 0,
        lucroLiquido: 0,
        margemMedia: 0,
        encomendasTotal: 0,
        aov: 0,
      };
    }

    const receitaTotal = productsProfitData.reduce(
      (sum, p) => sum + p.sellingPrice,
      0
    );
    const custoTotal = productsProfitData.reduce(
      (sum, p) => sum + p.costPrice,
      0
    );
    const lucroLiquido = receitaTotal - custoTotal;
    const margemMedia =
      productsProfitData.reduce((sum, p) => sum + p.marginPercentage, 0) /
      productsProfitData.length;
    // Simulated order count based on product count
    const encomendasTotal = productsProfitData.length;
    const aov = encomendasTotal > 0 ? receitaTotal / encomendasTotal : 0;

    return {
      receitaTotal,
      custoTotal,
      lucroLiquido,
      margemMedia,
      encomendasTotal,
      aov,
    };
  }, [productsProfitData]);

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
            Profit Engine
          </h1>
          <p className="text-[#A5D6E1]/50 text-sm mt-1">
            Analise de rentabilidade em tempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
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
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Receita Total"
          value={formatEuro(kpis.receitaTotal)}
          icon={<DollarSign className="w-5 h-5" />}
          trend="up"
          accent
          delay={0}
        />
        <KpiCard
          title="Custo Total"
          value={formatEuro(kpis.custoTotal)}
          icon={<Wallet className="w-5 h-5" />}
          delay={0.05}
        />
        <KpiCard
          title="Lucro Liquido"
          value={formatEuro(kpis.lucroLiquido)}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={kpis.lucroLiquido > 0 ? "up" : "down"}
          accent
          delay={0.1}
        />
        <KpiCard
          title="Margem Media"
          value={formatPercent(kpis.margemMedia)}
          icon={<PieChart className="w-5 h-5" />}
          trend={kpis.margemMedia >= 30 ? "up" : "down"}
          delay={0.15}
        />
        <KpiCard
          title="Encomendas Total"
          value={String(kpis.encomendasTotal)}
          icon={<ShoppingCart className="w-5 h-5" />}
          delay={0.2}
        />
        <KpiCard
          title="AOV"
          value={formatEuro(kpis.aov)}
          icon={<BarChart3 className="w-5 h-5" />}
          delay={0.25}
        />
      </div>

      {/* Products Profitability Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-sidebar rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-heading font-bold text-white">
            Rentabilidade por Produto
          </h2>
          <p className="text-[#A5D6E1]/40 text-sm mt-1">
            Ordenado por lucro real (descendente)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Produto
                </th>
                <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Custo
                </th>
                <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Preco Venda
                </th>
                <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Margem %
                </th>
                <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Ad Spend
                </th>
                <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Overhead
                </th>
                <th className="text-right px-6 py-4 text-xs uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                  Lucro Real
                </th>
              </tr>
            </thead>
            <tbody>
              {productsProfitData.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.35 + index * 0.03 }}
                  className={`border-b border-white/[0.03] transition-colors ${getMarginRowBg(
                    product.marginPercentage
                  )}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-white truncate max-w-[280px]">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[#A5D6E1]/40">
                            {product.category}
                          </span>
                          {product.marginPercentage < 20 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Margem Critica
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right px-4 py-4 text-sm text-[#A5D6E1]/70 font-mono">
                    {formatEuro(product.costPrice)}
                  </td>
                  <td className="text-right px-4 py-4 text-sm text-white font-mono font-medium">
                    {formatEuro(product.sellingPrice)}
                  </td>
                  <td className="text-right px-4 py-4">
                    <span
                      className={`text-sm font-mono font-semibold ${getMarginColor(
                        product.marginPercentage
                      )}`}
                    >
                      {formatPercent(product.marginPercentage)}
                    </span>
                  </td>
                  <td className="text-right px-4 py-4 text-sm text-[#A5D6E1]/50 font-mono">
                    {formatEuro(product.adSpend)}
                  </td>
                  <td className="text-right px-4 py-4 text-sm text-[#A5D6E1]/50 font-mono">
                    {formatEuro(product.apiOverhead)}
                  </td>
                  <td className="text-right px-6 py-4">
                    <span
                      className={`text-sm font-mono font-bold ${
                        product.realProfit >= 0
                          ? "text-orange-400"
                          : "text-red-400"
                      }`}
                    >
                      {formatEuro(product.realProfit)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer summary */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-[#A5D6E1]/40">
            {productsProfitData.length} produtos no catalogo
          </span>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[#A5D6E1]/40">Saudavel (&gt;30%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-[#A5D6E1]/40">Moderada (15-30%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-[#A5D6E1]/40">Critica (&lt;15%)</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
