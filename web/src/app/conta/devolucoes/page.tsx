"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X, ChevronDown, Loader2, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

interface ReturnRequest {
  id: string;
  order_id: string;
  order_number: string | null;
  reason: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface EligibleOrder {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
}

const returnStatusConfig: Record<string, { label: string; className: string; dotColor: string }> = {
  pending: { label: "Pendente", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", dotColor: "bg-yellow-400" },
  approved: { label: "Aprovada", className: "bg-green-500/10 text-green-400 border-green-500/20", dotColor: "bg-green-400" },
  rejected: { label: "Rejeitada", className: "bg-red-500/10 text-red-400 border-red-500/20", dotColor: "bg-red-400" },
  completed: { label: "Concluída", className: "bg-blue-500/10 text-blue-400 border-blue-500/20", dotColor: "bg-blue-400" },
};

function StatusBadge({ status }: { status: string }) {
  const config = returnStatusConfig[status] ?? {
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
    return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value);
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function DevolucoesPage() {
  const { user, loading: authLoading } = useAuth();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchReturns = useCallback(async () => {
    try {
      const res = await fetch("/api/returns");
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? "Erro ao carregar pedidos de devolução.");
        return;
      }
      setReturns(json.data ?? []);
    } catch {
      setError("Erro de ligação. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    fetchReturns();
  }, [user, authLoading, fetchReturns]);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/login?redirect=/conta/devolucoes";
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
    return <ReturnsSkeleton />;
  }

  if (!user) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-accent" style={{ fontFamily: "var(--font-outfit)" }}>
            Devoluções
          </h1>
          <p className="text-sm text-accent/40 mt-1">Gerencie os seus pedidos de devolução</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 hover:scale-[1.02]"
        >
          <RotateCcw size={15} />
          Pedir Devolução
        </button>
      </div>

      {error && (
        <div className="glass-card-immersive rounded-2xl p-5 mb-5 border-red-500/15">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {returns.length === 0 && !error ? (
        <EmptyReturns />
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
          {returns.map((r) => (
            <motion.div key={r.id} variants={itemVariants}>
              <div className="glass-card-immersive rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/0 to-transparent" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/15 to-pink-500/5 border border-purple-500/10 flex items-center justify-center shrink-0">
                      <RotateCcw size={18} className="text-purple-400/60" />
                    </div>
                    <div>
                      <p className="font-semibold text-accent text-sm">
                        Encomenda #{r.order_number ?? "—"}
                      </p>
                      <p className="text-xs text-accent/30 mt-0.5 flex items-center gap-1.5">
                        <Clock size={11} />
                        Pedido em {formatDate(r.created_at)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                <div className="mt-4 pl-14">
                  <p className="text-[11px] text-accent/25 uppercase tracking-wider font-medium mb-1">Motivo</p>
                  <p className="text-sm text-accent/50 leading-relaxed">{r.reason}</p>
                </div>

                {r.admin_notes && (
                  <div className="mt-3 pl-14">
                    <p className="text-[11px] text-accent/25 uppercase tracking-wider font-medium mb-1">Nota da equipa</p>
                    <p className="text-sm text-accent/50 leading-relaxed italic">{r.admin_notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <ReturnModal
            userId={user.id}
            onClose={() => setModalOpen(false)}
            onSuccess={() => {
              setModalOpen(false);
              setLoading(true);
              fetchReturns();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface ReturnModalProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ReturnModal({ userId, onClose, onSuccess }: ReturnModalProps) {
  const [orders, setOrders] = useState<EligibleOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEligibleOrders() {
      try {
        const supabase = createClient();
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const { data, error } = await supabase
          .from("orders")
          .select("id, order_number, created_at, total")
          .eq("user_id", userId)
          .gte("created_at", fourteenDaysAgo.toISOString())
          .order("created_at", { ascending: false });

        if (error) {
          setOrders([]);
          return;
        }
        setOrders(data ?? []);
      } catch {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchEligibleOrders();
  }, [userId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!selectedOrder) {
      setFormError("Selecione uma encomenda.");
      return;
    }
    if (reason.trim().length < 10) {
      setFormError("O motivo deve ter pelo menos 10 caracteres.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: selectedOrder, reason: reason.trim() }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setFormError(json.error ?? "Erro ao submeter pedido.");
        return;
      }
      onSuccess();
    } catch {
      setFormError("Erro de ligação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-lg glass-card-immersive rounded-2xl p-6 md:p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-accent" style={{ fontFamily: "var(--font-outfit)" }}>
              Pedir Devolução
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent/40 hover:text-accent hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-medium text-accent/40 uppercase tracking-wider mb-2">
                Encomenda
              </label>
              {loadingOrders ? (
                <div className="flex items-center gap-2 text-accent/30 text-sm py-3">
                  <Loader2 size={16} className="animate-spin" />
                  A carregar encomendas...
                </div>
              ) : orders.length === 0 ? (
                <p className="text-sm text-accent/30 py-3">
                  Não tem encomendas elegíveis para devolução (últimos 14 dias).
                </p>
              ) : (
                <div className="relative">
                  <select
                    value={selectedOrder}
                    onChange={(e) => setSelectedOrder(e.target.value)}
                    className="w-full appearance-none bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-accent focus:outline-none focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/15 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#0A0E1A]">Selecione uma encomenda...</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id} className="bg-[#0A0E1A]">
                        #{o.order_number} — {formatDate(o.created_at)} — {formatCurrency(o.total)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent/25 pointer-events-none" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-accent/40 uppercase tracking-wider mb-2">
                Motivo da devolução
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Descreva o motivo da devolução..."
                rows={4}
                maxLength={1000}
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-accent placeholder:text-accent/20 focus:outline-none focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/15 transition-all resize-none"
              />
              <p className="text-[11px] text-accent/20 mt-1 text-right">{reason.length}/1000</p>
            </div>

            {formError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/15 px-4 py-3">
                <p className="text-red-400 text-sm">{formError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || orders.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-orange-500/20"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  A submeter...
                </>
              ) : (
                <>
                  <RotateCcw size={16} />
                  Submeter Pedido
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
}

function EmptyReturns() {
  return (
    <div className="glass-card-immersive rounded-2xl p-12 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-[60px]" />
      </div>
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/15 to-pink-500/5 border border-purple-500/10 flex items-center justify-center mx-auto mb-5">
          <RotateCcw size={28} className="text-purple-400/40" />
        </div>
        <h3 className="text-lg font-semibold text-accent/60 mb-2">
          Sem pedidos de devolução
        </h3>
        <p className="text-sm text-accent/30 max-w-md mx-auto">
          Se precisar devolver algum artigo, pode iniciar o processo aqui.
        </p>
      </div>
    </div>
  );
}

function ReturnsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <div className="h-8 w-48 skeleton-shimmer rounded-lg mb-2" />
          <div className="h-4 w-72 skeleton-shimmer rounded-lg" />
        </div>
        <div className="h-10 w-40 skeleton-shimmer rounded-full" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card-immersive rounded-2xl p-5 h-28 skeleton-shimmer" />
        ))}
      </div>
    </div>
  );
}
