"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total: number;
  items_count: number;
  items?: OrderItem[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  paid: { label: "Pago", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  processing: { label: "Em processamento", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  shipped: { label: "Enviado", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  delivered: { label: "Entregue", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  cancelled: { label: "Cancelado", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-accent/10 text-accent/60 border-accent/20",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
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
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
          // Table may not exist yet
          if (dbError.code === "42P01" || dbError.message?.includes("does not exist")) {
            setOrders([]);
          } else {
            setError("Nao foi possivel carregar as encomendas.");
          }
          return;
        }

        setOrders(data ?? []);
      } catch {
        setError("Erro de ligacao. Tente novamente mais tarde.");
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
          <p className="text-sm text-accent/50 mt-1">
            Acompanhe o estado das suas compras
          </p>
        </div>
      </div>

      {error && (
        <div className="glass-sidebar rounded-2xl p-6 mb-6 border-red-500/20">
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
          className="space-y-4"
        >
          {orders.map((order) => (
            <motion.div key={order.id} variants={itemVariants}>
              <Link href={`/conta/encomendas/${order.id}`} className="block group">
                <div className="glass-sidebar rounded-2xl p-5 md:p-6 transition-all duration-200 hover:border-orange-500/20 hover:shadow-orange-500/5 hover:shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                        <Package size={20} className="text-accent/40" />
                      </div>
                      <div>
                        <p className="font-semibold text-accent text-sm">
                          Encomenda #{order.order_number}
                        </p>
                        <p className="text-xs text-accent/40 mt-0.5">
                          {formatDate(order.created_at)} &middot; {order.items_count}{" "}
                          {order.items_count === 1 ? "artigo" : "artigos"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <StatusBadge status={order.status} />
                      <span className="text-sm font-bold text-accent">
                        {formatCurrency(order.total)}
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-accent/20 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-200"
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
    <div className="glass-sidebar rounded-2xl p-12 text-center">
      <Package size={48} className="mx-auto text-accent/15 mb-5" />
      <h3 className="text-lg font-semibold text-accent/70 mb-2">
        Ainda nao tem encomendas
      </h3>
      <p className="text-sm text-accent/40 mb-6 max-w-md mx-auto">
        Quando fizer a sua primeira compra, ela aparecera aqui.
      </p>
      <Link
        href="/produtos"
        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/80 hover:bg-orange-500 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-orange-500/20"
      >
        <ShoppingBag size={16} />
        Explorar Loja
      </Link>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-56 bg-accent/10 rounded-lg mb-2" />
        <div className="h-4 w-72 bg-accent/5 rounded-lg" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-sidebar rounded-2xl p-6 h-20" />
        ))}
      </div>
    </div>
  );
}
