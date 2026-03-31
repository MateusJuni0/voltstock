"use client";

import { useEffect } from "react";
import { useCart } from "@/store/useCart";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, ClipboardList } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

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
        </motion.div>
      </div>
    </main>
  );
}
