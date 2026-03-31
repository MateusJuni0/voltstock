"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
}

interface ShippingAddress {
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  postal_code: string;
  district: string;
}

interface OrderDetail {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  tracking_code: string | null;
  tracking_url: string | null;
  shipping_address: ShippingAddress | null;
  items: OrderItem[];
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
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${config.className}`}>
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchOrder() {
      try {
        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from("orders")
          .select(
            "id, order_number, created_at, status, subtotal, shipping_cost, total, tracking_code, tracking_url, shipping_address"
          )
          .eq("id", id)
          .eq("user_id", user!.id)
          .single();

        if (dbError) {
          setError("Encomenda nao encontrada.");
          setLoading(false);
          return;
        }

        // Fetch order items
        const { data: items } = await supabase
          .from("order_items")
          .select("id, product_name, product_image, quantity, unit_price")
          .eq("order_id", id);

        setOrder({
          ...data,
          shipping_address:
            typeof data.shipping_address === "string"
              ? JSON.parse(data.shipping_address)
              : data.shipping_address,
          items: items ?? [],
        });
      } catch {
        setError("Erro ao carregar detalhes da encomenda.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id, user, authLoading]);

  if (authLoading || loading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <div>
        <BackLink />
        <div className="glass-sidebar rounded-2xl p-12 text-center">
          <Package size={48} className="mx-auto text-accent/15 mb-4" />
          <p className="text-accent/50">{error ?? "Encomenda nao encontrada."}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <BackLink />

      {/* Header */}
      <div className="glass-sidebar rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-xl md:text-2xl font-bold text-accent"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Encomenda #{order.order_number}
            </h1>
            <p className="text-sm text-accent/40 mt-1">{formatDate(order.created_at)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-accent/60 uppercase tracking-wider mb-3">
            Artigos
          </h2>
          {order.items.length === 0 ? (
            <div className="glass-sidebar rounded-2xl p-6 text-center text-accent/40 text-sm">
              Sem detalhes de artigos disponiveis.
            </div>
          ) : (
            order.items.map((item) => (
              <div
                key={item.id}
                className="glass-sidebar rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl bg-accent/5 flex items-center justify-center overflow-hidden shrink-0">
                  {item.product_image ? (
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  ) : (
                    <Package size={24} className="text-accent/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-accent truncate">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-accent/40 mt-0.5">
                    Qtd: {item.quantity} &times; {formatCurrency(item.unit_price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-accent shrink-0">
                  {formatCurrency(item.quantity * item.unit_price)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Totals */}
          <div className="glass-sidebar rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-accent/60 mb-4">
              <CreditCard size={16} /> Resumo
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-accent/60">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-accent/60">
                <span>Envio</span>
                <span>
                  {order.shipping_cost === 0
                    ? "Gratis"
                    : formatCurrency(order.shipping_cost)}
                </span>
              </div>
              <div className="border-t border-white/10 my-2" />
              <div className="flex justify-between font-bold text-accent">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shipping_address && (
            <div className="glass-sidebar rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-accent/60 mb-3">
                <MapPin size={16} /> Morada de envio
              </h3>
              <div className="text-sm text-accent/70 space-y-0.5">
                <p className="font-medium text-accent">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.line1}</p>
                {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                <p>
                  {order.shipping_address.postal_code} {order.shipping_address.city}
                </p>
                <p>{order.shipping_address.district}</p>
              </div>
            </div>
          )}

          {/* Tracking */}
          {order.tracking_code && (
            <div className="glass-sidebar rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-accent/60 mb-3">
                <Truck size={16} /> Rastreamento
              </h3>
              <p className="text-sm font-mono text-accent/80 bg-accent/5 px-3 py-2 rounded-lg">
                {order.tracking_code}
              </p>
              {order.tracking_url && (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Seguir encomenda &rarr;
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function BackLink() {
  return (
    <Link
      href="/conta/encomendas"
      className="inline-flex items-center gap-2 text-sm text-accent/50 hover:text-orange-400 transition-colors mb-6"
    >
      <ArrowLeft size={16} />
      Voltar as encomendas
    </Link>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-5 w-40 bg-accent/10 rounded" />
      <div className="glass-sidebar rounded-2xl p-6 h-24" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="glass-sidebar rounded-2xl p-4 h-20" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="glass-sidebar rounded-2xl p-5 h-40" />
          <div className="glass-sidebar rounded-2xl p-5 h-32" />
        </div>
      </div>
    </div>
  );
}
