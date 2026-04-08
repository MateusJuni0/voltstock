"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total: number;
  items_count: number;
}

const statusConfig: Record<string, { label: string; className: string; dotColor: string }> = {
  pending: { label: "Pendente", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", dotColor: "bg-yellow-400" },
  paid: { label: "Pago", className: "bg-blue-500/10 text-blue-400 border-blue-500/20", dotColor: "bg-blue-400" },
  processing: { label: "Em processamento", className: "bg-orange-500/10 text-orange-400 border-orange-500/20", dotColor: "bg-orange-400" },
  shipped: { label: "Enviado", className: "bg-purple-500/10 text-purple-400 border-purple-500/20", dotColor: "bg-purple-400" },
  delivered: { label: "Entregue", className: "bg-green-500/10 text-green-400 border-green-500/20", dotColor: "bg-green-400" },
  cancelled: { label: "Cancelado", className: "bg-red-500/10 text-red-400 border-red-500/20", dotColor: "bg-red-400" },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-accent/10 text-accent/60 border-accent/20",
    dotColor: "bg-accent/40",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function EncomendasPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchOrders() {
      try {
        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from("orders")
          .select("id, order_number, created_at, status, total, items_count")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false });

        if (dbError) {
          if (dbError.code === "42P01" || dbError.message?.includes("does not exist")) {
            setOrders([]);
          } else {
            setError("Não foi possível carregar as encomendas.");
          }
          return;
        }

        setOrders(data ?? []);
      } catch {
        setError("Erro de ligação. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <OrdersSkeleton />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-accent"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            As Minhas Encomendas
          </h1>
          <p className="text-sm text-accent/40 mt-1">
            {orders.length > 0
              ? `${orders.length} ${orders.length === 1 ? "encomenda" : "encomendas"} encontradas`
              : "Acompanhe o estado das suas compras"}
          </p>
        </div>
      </div>

      {error && (
        <div className="glass-card-immersive rounded-2xl p-5 mb-5 border-red-500/15">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {orders.length === 0 && !error ? (
        <EmptyOrders />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {orders.map((order) => (
            <motion.div key={order.id} variants={itemVariants}>
              <Link href={`/conta/encomendas/${order.id}`} className="block group">
                <div className="glass-card-immersive rounded-2xl p-5 relative overflow-hidden">
                  {/* Subtle gradient accent on hover */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/30 transition-all duration-500" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/5 border border-orange-500/10 flex items-center justify-center shrink-0">
                        <Package size={18} className="text-orange-400/60" />
                      </div>
                      <div>
                        <p className="font-semibold text-accent text-sm group-hover:text-orange-400 transition-colors">
                          Encomenda #{order.order_number}
                        </p>
                        <p className="text-xs text-accent/30 mt-0.5 flex items-center gap-1.5">
                          <Clock size={11} />
                          {formatDate(order.created_at)} · {order.items_count}{" "}
                          {order.items_count === 1 ? "artigo" : "artigos"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <span className="text-sm font-bold text-accent tabular-nums">
                        {formatCurrency(order.total)}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-accent/15 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="glass-card-immersive rounded-2xl p-12 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 blur-[60px]" />
      </div>
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/5 border border-orange-500/10 flex items-center justify-center mx-auto mb-5">
          <Package size={28} className="text-orange-400/40" />
        </div>
        <h3 className="text-lg font-semibold text-accent/60 mb-2">
          Ainda não tem encomendas
        </h3>
        <p className="text-sm text-accent/30 mb-6 max-w-md mx-auto">
          Quando fizer a sua primeira compra, ela aparecerá aqui.
        </p>
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02]"
        >
          <ShoppingBag size={16} />
          Explorar Loja
        </Link>
      </div>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-56 skeleton-shimmer rounded-lg mb-2" />
        <div className="h-4 w-72 skeleton-shimmer rounded-lg" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card-immersive rounded-2xl p-5 h-[72px] skeleton-shimmer" />
        ))}
      </div>
    </div>
  );
}
