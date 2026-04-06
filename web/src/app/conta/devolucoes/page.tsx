"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Package, X, ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────

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

// ── Status config ──────────────────────────────────────────────────────────

const returnStatusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pendente",
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  approved: {
    label: "Aprovada",
    className: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  rejected: {
    label: "Rejeitada",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  completed: {
    label: "Concluida",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config = returnStatusConfig[status] ?? {
    label: status,
    className: "bg-accent/10 text-accent/60 border-accent/20",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
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

// ── Animation variants ─────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

// ── Main component ─────────────────────────────────────────────────────────

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
        setError(json.error ?? "Erro ao carregar pedidos de devolucao.");
        return;
      }

      setReturns(json.data ?? []);
    } catch {
      setError("Erro de ligacao. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    fetchReturns();
  }, [user, authLoading, fetchReturns]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/login?redirect=/conta/devolucoes";
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
    return <ReturnsSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-accent"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Devolucoes
          </h1>
          <p className="text-sm text-accent/50 mt-1">
            Gerencie os seus pedidos de devolucao
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500/80 hover:bg-orange-500 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-orange-500/20"
        >
          <RotateCcw size={16} />
          Pedir Devolucao
        </button>
      </div>

      {error && (
        <div className="glass-sidebar rounded-2xl p-6 mb-6 border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {returns.length === 0 && !error ? (
        <EmptyReturns />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {returns.map((r) => (
            <motion.div key={r.id} variants={itemVariants}>
              <div className="glass-sidebar rounded-2xl p-5 md:p-6 transition-all duration-200 hover:border-orange-500/20 hover:shadow-orange-500/5 hover:shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <RotateCcw size={20} className="text-accent/40" />
                    </div>
                    <div>
                      <p className="font-semibold text-accent text-sm">
                        Encomenda #{r.order_number ?? "—"}
                      </p>
                      <p className="text-xs text-accent/40 mt-0.5">
                        Pedido em {formatDate(r.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusBadge status={r.status} />
                  </div>
                </div>

                {/* Reason */}
                <div className="mt-4 pl-14">
                  <p className="text-xs text-accent/30 mb-1">Motivo</p>
                  <p className="text-sm text-accent/60 leading-relaxed">{r.reason}</p>
                </div>

                {/* Admin notes */}
                {r.admin_notes && (
                  <div className="mt-3 pl-14">
                    <p className="text-xs text-accent/30 mb-1">Nota da equipa</p>
                    <p className="text-sm text-accent/60 leading-relaxed italic">
                      {r.admin_notes}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
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

// ── Return Modal ───────────────────────────────────────────────────────────

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
      setFormError("Erro de ligacao. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-lg glass-sidebar rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-bold text-accent"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Pedir Devolucao
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent/40 hover:text-accent hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Order select */}
            <div>
              <label className="block text-sm font-medium text-accent/70 mb-2">
                Encomenda
              </label>
              {loadingOrders ? (
                <div className="flex items-center gap-2 text-accent/40 text-sm py-3">
                  <Loader2 size={16} className="animate-spin" />
                  A carregar encomendas...
                </div>
              ) : orders.length === 0 ? (
                <p className="text-sm text-accent/40 py-3">
                  Nao tem encomendas elegiveis para devolucao (ultimos 14 dias).
                </p>
              ) : (
                <div className="relative">
                  <select
                    value={selectedOrder}
                    onChange={(e) => setSelectedOrder(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-accent focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#0A0E1A]">
                      Selecione uma encomenda...
                    </option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id} className="bg-[#0A0E1A]">
                        #{o.order_number} — {formatDate(o.created_at)} —{" "}
                        {formatCurrency(o.total)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-accent/30 pointer-events-none"
                  />
                </div>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-accent/70 mb-2">
                Motivo da devolucao
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Descreva o motivo da devolucao..."
                rows={4}
                maxLength={1000}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-accent placeholder:text-accent/25 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all resize-none"
              />
              <p className="text-xs text-accent/30 mt-1 text-right">
                {reason.length}/1000
              </p>
            </div>

            {/* Error */}
            {formError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                <p className="text-red-400 text-sm">{formError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || orders.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500/80 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-orange-500/20"
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

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyReturns() {
  return (
    <div className="glass-sidebar rounded-2xl p-12 text-center">
      <RotateCcw size={48} className="mx-auto text-accent/15 mb-5" />
      <h3 className="text-lg font-semibold text-accent/70 mb-2">
        Ainda nao tens pedidos de devolucao
      </h3>
      <p className="text-sm text-accent/40 mb-2 max-w-md mx-auto">
        Se precisar devolver algum artigo, pode iniciar o processo aqui.
      </p>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function ReturnsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-48 bg-accent/10 rounded-lg mb-2" />
        <div className="h-4 w-72 bg-accent/5 rounded-lg" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-sidebar rounded-2xl p-6 h-24" />
        ))}
      </div>
    </div>
  );
}
