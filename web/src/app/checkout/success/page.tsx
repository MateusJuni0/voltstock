"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";
import { trackPurchase, fbTrackPurchase } from "@/lib/analytics";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ShoppingBag,
  ClipboardList,
  Loader2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface VerifyResult {
  valid: boolean;
  customer_email?: string | null;
  amount_total?: number | null;
  /** HMAC-signed token for invoice access (cyber-neo CRIT-3 follow-up). */
  invoice_token?: string | null;
  error?: string;
}

type PageState =
  | { status: "loading" }
  | {
      status: "success";
      email: string | null;
      amount: number | null;
      invoiceToken: string | null;
    }
  | { status: "error"; message: string };

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [state, setState] = useState<PageState>({ status: "loading" });

  const sessionId = searchParams.get("session_id");

  const verifySession = useCallback(async (id: string) => {
    try {
      const res = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: id }),
      });

      const data: VerifyResult = await res.json();

      if (!res.ok || !data.valid) {
        setState({
          status: "error",
          message:
            data.error ??
            "Sessão de pagamento não encontrada ou expirada.",
        });
        return;
      }

      // Fire purchase tracking events before clearing cart
      const amountEur = (data.amount_total ?? 0) / 100;
      trackPurchase(id, amountEur, []);
      fbTrackPurchase(amountEur, id);

      clearCart();
      setState({
        status: "success",
        email: data.customer_email ?? null,
        amount: data.amount_total ?? null,
        invoiceToken: data.invoice_token ?? null,
      });
    } catch {
      setState({
        status: "error",
        message: "Não foi possível verificar o pagamento. Tente novamente.",
      });
    }
  }, [clearCart]);

  useEffect(() => {
    if (!sessionId) {
      router.replace("/");
      return;
    }

    verifySession(sessionId);
  }, [sessionId, router, verifySession]);

  // ------ Loading ------
  if (state.status === "loading") {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[70vh] px-4">
        <div className="flex flex-col items-center gap-4 text-accent/40">
          <Loader2 size={36} className="animate-spin text-orange-400" />
          <p className="text-sm font-medium">A verificar o seu pagamento...</p>
        </div>
      </main>
    );
  }

  // ------ Error ------
  if (state.status === "error") {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[70vh] px-4">
        <div className="max-w-md w-full text-center space-y-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto w-24 h-24 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center"
          >
            <AlertTriangle size={48} className="text-rose-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h1
              className="text-2xl font-bold text-accent"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Erro no Pagamento
            </h1>
            <p className="text-accent/50 text-sm leading-relaxed">
              {state.message}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-3 pt-4"
          >
            <Link
              href="/produtos"
              className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-colors"
            >
              <ShoppingBag size={18} />
              Voltar à Loja
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  // ------ Success ------
  return (
    <main className="flex-1 flex items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="mx-auto w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            <CheckCircle size={48} className="text-green-400" />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h1
            className="text-3xl font-bold text-accent"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Encomenda Confirmada!
          </h1>
          <p className="text-accent/50 text-sm leading-relaxed">
            O seu pagamento foi processado com sucesso. Receberá um e-mail de
            confirmação com os detalhes da encomenda e informações de
            rastreamento.
          </p>
        </motion.div>

        {/* Order details */}
        {(state.email || state.amount !== null) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl bg-white/[0.03] border border-accent/5 p-4 space-y-2 text-sm"
          >
            {state.amount !== null && (
              <div className="flex justify-between">
                <span className="text-accent/50">Total pago</span>
                <span className="text-orange-400 font-bold">
                  {state.amount.toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
            )}
            {state.email && (
              <div className="flex justify-between">
                <span className="text-accent/50">Confirmação enviada para</span>
                <span className="text-accent font-medium">{state.email}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3 pt-4"
        >
          <Link
            href="/produtos"
            className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-colors"
          >
            <ShoppingBag size={18} />
            Continuar a Comprar
          </Link>

          <Link
            href="/conta/encomendas"
            className="w-full h-12 rounded-2xl bg-accent/5 border border-accent/10 text-accent/60 font-medium text-sm flex items-center justify-center gap-2 hover:bg-accent/10 transition-colors"
          >
            <ClipboardList size={16} />
            Ver Encomendas
          </Link>

          <Link
            href={
              state.invoiceToken
                ? `/api/invoice?session_id=${sessionId}&token=${state.invoiceToken}`
                : `/api/invoice?session_id=${sessionId}`
            }
            target="_blank"
            className="w-full h-12 rounded-2xl bg-accent/5 border border-accent/10 text-accent/60 font-medium text-sm flex items-center justify-center gap-2 hover:bg-accent/10 transition-colors"
          >
            <FileText size={16} />
            Descarregar Factura
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
