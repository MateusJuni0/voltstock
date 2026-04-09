"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ShoppingBag } from "lucide-react";

export function NotFoundContent() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-lg"
      >
        {/* 404 Number */}
        <h1
          className="text-[8rem] md:text-[10rem] font-bold leading-none text-gradient mb-2"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          404
        </h1>

        {/* Subtitle */}
        <h2
          className="text-2xl md:text-3xl font-bold text-orange-400 mb-4"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Página Não Encontrada
        </h2>

        {/* Description */}
        <p className="text-orange-400/50 mb-10 leading-relaxed">
          A página que procura não existe ou foi movida.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors duration-300"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <Home className="w-5 h-5" />
            Voltar à Homepage
          </Link>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-orange-400/80 hover:text-orange-400 hover:border-orange-500/30 font-semibold transition-colors duration-300"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <ShoppingBag className="w-5 h-5" />
            Ver Produtos
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
