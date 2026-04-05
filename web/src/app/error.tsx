"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      // Future: send to Sentry, LogRocket, etc.
    }
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-lg">
        {/* Animated icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.1,
          }}
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center"
        >
          <AlertTriangle size={36} className="text-red-400" />
        </motion.div>

        {/* Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-orange-400 mb-4"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Algo correu mal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-orange-400/50 text-base mb-10 leading-relaxed"
        >
          Ocorreu um erro inesperado. A nossa equipa foi notificada. Tente
          recarregar a pagina ou volte ao inicio.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm hover:from-orange-400 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-orange-500/20"
          >
            <RefreshCw size={16} />
            Tentar Novamente
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-orange-500/20 text-orange-400 font-semibold text-sm hover:border-orange-500/40 hover:bg-orange-500/10 transition-all duration-300"
          >
            <Home size={16} />
            Voltar ao Inicio
          </Link>
        </motion.div>

        {/* Error digest for support */}
        {error.digest && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-[10px] text-orange-400/20 font-mono"
          >
            Ref: {error.digest}
          </motion.p>
        )}
      </div>
    </main>
  );
}
