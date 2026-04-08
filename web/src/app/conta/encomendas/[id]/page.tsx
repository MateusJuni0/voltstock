"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Clock } from "lucide-react";
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
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
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
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value);
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
          setError("Encomenda não encontrada.");
          setLoading(false);
          return;
        }

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
        <div className="glass-card-immersive rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/5 border border-orange-500/10 flex items-center justify-center mx-auto mb-5">
            <Package size={28} className="text-orange-400/40" />
          </div>
          <p className="text-accent/40">{error ?? "Encomenda não encontrada."}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <BackLink />

      {/* Header */}
      <div className="glass-card-immersive rounded-2xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-amber-500 opacity-40" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-accent" style={{ fontFamily: "var(--font-outfit)" }}>
              Encomenda #{order.order_number}
            </h1>
            <p className="text-sm text-accent/30 mt-1 flex items-center gap-1.5">
              <Clock size={13} />
              {formatDate(order.created_at)}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Package size={14} className="text-accent/25" />
            <h2 className="text-[11px] font-semibold text-accent/35 uppercase tracking-widest">Artigos</h2>
          </div>
          {order.items.length === 0 ? (
            <div className="glass-card-immersive rounded-2xl p-6 text-center text-accent/30 text-sm">
              Sem detalhes de artigos disponíveis.
            </div>
          ) : (
            order.items.map((item) => (
              <div
                key={item.id}
                className="glass-card-immersive rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent flex items-center justify-center overflow-hidden shrink-0">
                  {item.product_image ? (
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  ) : (
                    <Package size={24} className="text-accent/15" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-accent truncate">{item.product_name}</p>
                  <p className="text-xs text-accent/30 mt-0.5">
                    Qtd: {item.quantity} &times; {formatCurrency(item.unit_price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-accent shrink-0 tabular-nums">
                  {formatCurrency(item.quantity * item.unit_price)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Totals */}
          <div className="glass-card-immersive rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-[11px] font-semibold text-accent/35 uppercase tracking-widest mb-4">
              <CreditCard size={14} /> Resumo
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-accent/45">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-accent/45">
                <span>Envio</span>
                <span className="tabular-nums">
                  {order.shipping_cost === 0 ? "Grátis" : formatCurrency(order.shipping_cost)}
                </span>
              </div>
              <div className="border-t border-white/[0.06] my-2" />
              <div className="flex justify-between font-bold text-accent">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shipping_address && (
            <div className="glass-card-immersive rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-[11px] font-semibold text-accent/35 uppercase tracking-widest mb-3">
                <MapPin size={14} /> Morada de envio
              </h3>
              <div className="text-sm text-accent/50 space-y-0.5">
                <p className="font-medium text-accent">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.line1}</p>
                {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                <p>{order.shipping_address.district}</p>
              </div>
            </div>
          )}

          {/* Tracking */}
          {order.tracking_code && (
            <div className="glass-card-immersive rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-[11px] font-semibold text-accent/35 uppercase tracking-widest mb-3">
                <Truck size={14} /> Rastreamento
              </h3>
              <p className="text-sm font-mono text-accent/60 bg-white/[0.03] px-3 py-2 rounded-lg border border-white/[0.06]">
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
      className="inline-flex items-center gap-2 text-sm text-accent/35 hover:text-orange-400 transition-colors mb-6 group"
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
      Voltar às encomendas
    </Link>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-5 w-40 skeleton-shimmer rounded" />
      <div className="glass-card-immersive rounded-2xl p-6 h-24 skeleton-shimmer" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card-immersive rounded-2xl p-4 h-20 skeleton-shimmer" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="glass-card-immersive rounded-2xl p-5 h-40 skeleton-shimmer" />
          <div className="glass-card-immersive rounded-2xl p-5 h-32 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
