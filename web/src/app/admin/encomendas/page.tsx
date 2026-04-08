"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Search,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { products as catalogProducts } from "@/data/products";

// ── Types ────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: number;
  status: string;
  total: number;
  shipping_cost: number;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  shipping_district: string | null;
  shipping_phone: string | null;
  shipping_nif: string | null;
  tracking_code: string | null;
  tracking_url: string | null;
  notes: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  created_at: string;
  items: OrderItem[];
  email?: string;
}

// ── Status Config ────────────────────────────────────────────────────────

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
    label: "Em Preparação",
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

const STATUS_FLOW = ["paid", "processing", "shipped", "delivered"];

// ── Helpers ──────────────────────────────────────────────────────────────

function formatEuro(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function findSupplierUrl(productName: string): string | undefined {
  const product = catalogProducts.find((p) => p.name === productName);
  return product?.supplier_url;
}

// ── Order Row Component ──────────────────────────────────────────────────

function OrderRow({
  order,
  onStatusChange,
  onTrackingUpdate,
}: {
  order: Order;
  onStatusChange: (orderId: string, status: string) => Promise<void>;
  onTrackingUpdate: (
    orderId: string,
    trackingCode: string,
    trackingUrl: string,
  ) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [trackingCode, setTrackingCode] = useState(order.tracking_code ?? "");
  const [trackingUrl, setTrackingUrl] = useState(order.tracking_url ?? "");
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const statusConfig = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];

  async function handleStatusChange(newStatus: string) {
    setUpdating(true);
    await onStatusChange(order.id, newStatus);
    setUpdating(false);
  }

  async function handleTrackingSave() {
    setUpdating(true);
    await onTrackingUpdate(order.id, trackingCode, trackingUrl);
    setUpdating(false);
  }

  function copyOrderId() {
    navigator.clipboard.writeText(order.id.slice(0, 8).toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <motion.div
      layout
      className="glass-sidebar rounded-xl overflow-hidden border border-white/5"
    >
      {/* Order Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${statusConfig.bg}`}
          >
            <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-mono">
                #{order.order_number ?? order.id.slice(0, 8).toUpperCase()}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${statusConfig.bg} ${statusConfig.color}`}
              >
                {statusConfig.label}
              </span>
            </div>
            <p className="text-xs text-[#A5D6E1]/40 mt-0.5 truncate">
              {order.shipping_name ?? "Sem nome"} —{" "}
              {formatDate(order.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-lg font-bold text-orange-400 font-mono">
              {formatEuro(order.total)}
            </p>
            <p className="text-[10px] text-[#A5D6E1]/30">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </p>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-[#A5D6E1]/30" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#A5D6E1]/30" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4 border-t border-white/5 pt-4">
              {/* Order ID + Stripe */}
              <div className="flex items-center gap-2 text-xs text-[#A5D6E1]/40">
                <span>ID: {order.id.slice(0, 8).toUpperCase()}</span>
                <button onClick={copyOrderId} className="hover:text-white transition-colors">
                  <Copy className="w-3 h-3" />
                </button>
                {copied && <span className="text-emerald-400">Copiado!</span>}
                {order.stripe_payment_intent && (
                  <>
                    <span className="mx-1">|</span>
                    <span>Stripe: {order.stripe_payment_intent.slice(0, 16)}...</span>
                  </>
                )}
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.02] rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">
                    Morada de Envio
                  </h4>
                  <p className="text-sm text-[#A5D6E1]/80 leading-relaxed">
                    <strong className="text-white">
                      {order.shipping_name}
                    </strong>
                    <br />
                    {order.shipping_address}
                    <br />
                    {order.shipping_postal_code} {order.shipping_city}
                    <br />
                    {order.shipping_district}
                    {order.shipping_phone && (
                      <>
                        <br />
                        Tel: {order.shipping_phone}
                      </>
                    )}
                    {order.shipping_nif && (
                      <>
                        <br />
                        NIF: {order.shipping_nif}
                      </>
                    )}
                  </p>
                </div>

                {/* Tracking */}
                <div className="bg-white/[0.02] rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">
                    Tracking & Envio
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      placeholder="Código de rastreio (CTT, DPD...)"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-[#A5D6E1]/30 focus:border-orange-500/50 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                      placeholder="URL de tracking (opcional)"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-[#A5D6E1]/30 focus:border-orange-500/50 focus:outline-none"
                    />
                    <button
                      onClick={handleTrackingSave}
                      disabled={updating}
                      className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-[#A5D6E1]/70 hover:text-white transition-all disabled:opacity-50"
                    >
                      {updating ? "A guardar..." : "Guardar Tracking"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Products (with supplier links) */}
              <div className="bg-white/[0.02] rounded-lg overflow-hidden">
                <div className="px-4 py-2 border-b border-white/5">
                  <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                    Produtos — Clica para encomendar no AliExpress
                  </h4>
                </div>
                {order.items.map((item) => {
                  const supplierUrl = findSupplierUrl(item.product_name);
                  return (
                    <div
                      key={item.id}
                      className="px-4 py-3 flex items-center justify-between border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-sm text-white truncate">
                          {item.product_name}
                        </span>
                        <span className="text-xs text-[#A5D6E1]/30">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-[#A5D6E1]/70">
                          {formatEuro(item.total_price)}
                        </span>
                        {supplierUrl && (
                          <a
                            href={supplierUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs hover:bg-orange-500/20 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            AliExpress
                          </a>
                        )}
                        {!supplierUrl && (
                          <span className="flex items-center gap-1 text-[10px] text-red-400/60">
                            <AlertTriangle className="w-3 h-3" />
                            Sem fornecedor
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="flex items-center justify-between text-sm px-1">
                <div className="text-[#A5D6E1]/40">
                  Subtotal: {formatEuro(order.total - order.shipping_cost)} |
                  Envio:{" "}
                  {order.shipping_cost === 0
                    ? "Grátis"
                    : formatEuro(order.shipping_cost)}
                </div>
                <div className="text-lg font-bold text-orange-400 font-mono">
                  Total: {formatEuro(order.total)}
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {nextStatus && (
                  <button
                    onClick={() => handleStatusChange(nextStatus)}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Avançar para:{" "}
                    {STATUS_CONFIG[nextStatus]?.label ?? nextStatus}
                  </button>
                )}
                {order.status !== "cancelled" &&
                  order.status !== "delivered" && (
                    <button
                      onClick={() => handleStatusChange("cancelled")}
                      disabled={updating}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium border border-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancelar
                    </button>
                  )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const res = await fetch(
        `/api/admin/orders?status=${statusFilter}&page=1`,
        {
          headers: { "x-user-id": user?.id ?? "" },
        },
      );
      const data = await res.json();
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function handleStatusChange(
    orderId: string,
    status: string,
  ) {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      await fetchOrders();
    }
  }

  async function handleTrackingUpdate(
    orderId: string,
    trackingCode: string,
    trackingUrl: string,
  ) {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, trackingCode, trackingUrl }),
    });
    if (res.ok) {
      await fetchOrders();
    }
  }

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.shipping_name?.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      String(o.order_number).includes(q)
    );
  });

  const statusCounts: Record<string, number> = {};
  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">
            Encomendas
          </h1>
          <p className="text-[#A5D6E1]/50 text-sm mt-1">
            {total} encomenda{total !== 1 ? "s" : ""} no total
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A5D6E1]/60 hover:text-white text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5D6E1]/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome, nº encomenda..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#A5D6E1]/30 focus:border-orange-500/50 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Todas" },
            { key: "paid", label: "Pagas" },
            { key: "processing", label: "Preparação" },
            { key: "shipped", label: "Enviadas" },
            { key: "delivered", label: "Entregues" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                statusFilter === filter.key
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                  : "bg-white/5 text-[#A5D6E1]/50 hover:text-white border border-white/5"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-sidebar rounded-2xl p-16 text-center"
        >
          <Package className="w-16 h-16 text-[#A5D6E1]/20 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-white mb-2">
            Nenhuma encomenda
          </h2>
          <p className="text-[#A5D6E1]/40 text-sm">
            {statusFilter !== "all"
              ? `Sem encomendas com status "${STATUS_CONFIG[statusFilter]?.label ?? statusFilter}".`
              : "Quando um cliente fizer uma compra, as encomendas aparecem aqui automaticamente."}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <OrderRow
                order={order}
                onStatusChange={handleStatusChange}
                onTrackingUpdate={handleTrackingUpdate}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
