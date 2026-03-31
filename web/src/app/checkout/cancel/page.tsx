"use client";

import { motion } from "framer-motion";
import { XCircle, RotateCcw, Store } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="mx-auto w-24 h-24 rounded-full bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            <XCircle size={48} className="text-orange-400" />
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
            Pagamento Cancelado
          </h1>
          <p className="text-accent/50 text-sm leading-relaxed">
            O seu carrinho ainda está guardado. Pode tentar novamente quando
            quiser — os seus artigos não serão perdidos.
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
            href="/checkout"
            className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-colors"
          >
            <RotateCcw size={18} />
            Tentar Novamente
          </Link>

          <Link
            href="/produtos"
            className="w-full h-12 rounded-2xl bg-accent/5 border border-accent/10 text-accent/60 font-medium text-sm flex items-center justify-center gap-2 hover:bg-accent/10 transition-colors"
          >
            <Store size={16} />
            Voltar à Loja
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
