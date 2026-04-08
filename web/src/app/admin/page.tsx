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
  CalendarDays,
  CalendarRange,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
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

interface OrderRow {
  id: string;
  total: number;
  shipping_cost: number;
  status: string;
  created_at: string;
}

interface OrderStatusCount {
  status: string;
  count: number;
}

interface KpiData {
  receitaTotal: number;
  receitaHoje: number;
  receitaMes: number;
  custoTotal: number;
  lucroLiquido: number;
  margemMedia: number;
  encomendasTotal: number;
  aov: number;
  ordersByStatus: OrderStatusCount[];
}

// ---------- Status Config (matches encomendas page) ----------

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pendente",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    icon: Clock,
  },
  paid: {
    label: "Pago",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: CreditCard,
  },
  processing: {
    label: "Em Preparacao",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    icon: Package,
  },
  shipped: {
    label: "Enviado",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    icon: Truck,
  },
  delivered: {
    label: "Entregue",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: XCircle,
  },
  refunded: {
    label: "Reembolsado",
    color: "text-gray-400",
    bg: "bg-gray-500/10 border-gray-500/20",
    icon: RefreshCw,
  },
};

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
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<"supabase" | "local">("local");

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();

        // Fetch real orders from Supabase
        const { data: ordersData } = await supabase
          .from("orders")
          .select("id, total, shipping_cost, status, created_at");

        if (ordersData && ordersData.length > 0) {
          setOrders(ordersData);
        }

        // Fetch product catalog for profitability table
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
        // Supabase offline — use fallback for products only
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
    // Filter out cancelled/refunded orders for revenue calculations
    const activeOrders = orders.filter(
      (o) => o.status !== "cancelled" && o.status !== "refunded"
    );

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const receitaTotal = activeOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);

    const receitaHoje = activeOrders
      .filter((o) => new Date(o.created_at) >= todayStart)
      .reduce((sum, o) => sum + (o.total ?? 0), 0);

    const receitaMes = activeOrders
      .filter((o) => new Date(o.created_at) >= monthStart)
      .reduce((sum, o) => sum + (o.total ?? 0), 0);

    const encomendasTotal = activeOrders.length;
    const aov = encomendasTotal > 0 ? receitaTotal / encomendasTotal : 0;

    // Product profitability metrics (from catalog)
    const custoTotal = productsProfitData.reduce(
      (sum, p) => sum + p.costPrice,
      0
    );
    const catalogReceita = productsProfitData.reduce(
      (sum, p) => sum + p.sellingPrice,
      0
    );
    const lucroLiquido = catalogReceita - custoTotal;
    const margemMedia =
      productsProfitData.length > 0
        ? productsProfitData.reduce((sum, p) => sum + p.marginPercentage, 0) /
          productsProfitData.length
        : 0;

    // Count orders by status (including cancelled/refunded)
    const statusMap = new Map<string, number>();
    for (const o of orders) {
      statusMap.set(o.status, (statusMap.get(o.status) ?? 0) + 1);
    }
    const ordersByStatus: OrderStatusCount[] = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    return {
      receitaTotal,
      receitaHoje,
      receitaMes,
      custoTotal,
      lucroLiquido,
      margemMedia,
      encomendasTotal,
      aov,
      ordersByStatus,
    };
  }, [orders, productsProfitData]);

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

      {/* KPI Cards — Real Order Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Receita Total"
          value={formatEuro(kpis.receitaTotal)}
          icon={<DollarSign className="w-5 h-5" />}
          trend={kpis.receitaTotal > 0 ? "up" : "neutral"}
          accent
          delay={0}
        />
        <KpiCard
          title="Hoje"
          value={formatEuro(kpis.receitaHoje)}
          icon={<CalendarDays className="w-5 h-5" />}
          trend={kpis.receitaHoje > 0 ? "up" : "neutral"}
          accent
          delay={0.05}
        />
        <KpiCard
          title="Este Mes"
          value={formatEuro(kpis.receitaMes)}
          icon={<CalendarRange className="w-5 h-5" />}
          trend={kpis.receitaMes > 0 ? "up" : "neutral"}
          delay={0.1}
        />
        <KpiCard
          title="Encomendas"
          value={String(kpis.encomendasTotal)}
          icon={<ShoppingCart className="w-5 h-5" />}
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="AOV (Ticket Medio)"
          value={formatEuro(kpis.aov)}
          icon={<BarChart3 className="w-5 h-5" />}
          delay={0.2}
        />
        <KpiCard
          title="Custo Catalogo"
          value={formatEuro(kpis.custoTotal)}
          icon={<Wallet className="w-5 h-5" />}
          delay={0.25}
        />
        <KpiCard
          title="Lucro Catalogo"
          value={formatEuro(kpis.lucroLiquido)}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={kpis.lucroLiquido > 0 ? "up" : "down"}
          delay={0.3}
        />
        <KpiCard
          title="Margem Media"
          value={formatPercent(kpis.margemMedia)}
          icon={<PieChart className="w-5 h-5" />}
          trend={kpis.margemMedia >= 30 ? "up" : "down"}
          delay={0.35}
        />
      </div>

      {/* Orders by Status Summary */}
      {kpis.ordersByStatus.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="glass-sidebar rounded-2xl p-6"
        >
          <h2 className="text-lg font-heading font-bold text-white mb-4">
            Resumo de Encomendas por Estado
          </h2>
          <div className="flex flex-wrap gap-3">
            {kpis.ordersByStatus.map(({ status, count }) => {
              const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
              const StatusIcon = config.icon;
              return (
                <div
                  key={status}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${config.bg} transition-colors`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}
                  >
                    <StatusIcon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className={`text-lg font-bold font-mono ${config.color}`}>
                      {count}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-[#A5D6E1]/40 font-semibold">
                      {config.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {orders.length === 0 && dataSource === "supabase" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="glass-sidebar rounded-2xl p-8 text-center"
        >
          <ShoppingCart className="w-12 h-12 text-[#A5D6E1]/20 mx-auto mb-3" />
          <p className="text-white font-heading font-bold text-lg mb-1">
            Sem encomendas ainda
          </p>
          <p className="text-[#A5D6E1]/40 text-sm">
            Quando um cliente fizer uma compra, os KPIs reais aparecem aqui automaticamente.
          </p>
        </motion.div>
      )}

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
