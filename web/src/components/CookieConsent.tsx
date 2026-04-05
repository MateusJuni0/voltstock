"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const COOKIE_KEY = "voltstock_cookie_consent";

type ConsentChoice = "accepted" | "essential" | null;

function getStoredConsent(): ConsentChoice {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(COOKIE_KEY);
  if (stored === "accepted" || stored === "essential") return stored;
  return null;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = getStoredConsent();
    if (!consent) {
      // Delay showing to avoid layout shift on first load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAcceptAll() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  function handleEssentialOnly() {
    localStorage.setItem(COOKIE_KEY, "essential");
    setVisible(false);
  }

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-[440px] z-[100] rounded-2xl border border-orange-500/15 bg-[#0A0E1A]/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-5"
        >
          {/* Close button */}
          <button
            onClick={handleEssentialOnly}
            className="absolute top-3 right-3 text-orange-400/30 hover:text-orange-400/60 transition-colors"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Cookie size={16} className="text-orange-400" />
            </div>
            <h3
              className="text-sm font-bold text-orange-400"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Cookies e Privacidade
            </h3>
          </div>

          {/* Message */}
          <p className="text-xs text-orange-400/50 leading-relaxed mb-4">
            Utilizamos cookies essenciais para o funcionamento do site e cookies
            opcionais para melhorar a sua experiencia. Pode aceitar todos ou
            apenas os essenciais. Consulte a nossa{" "}
            <Link
              href="/privacidade"
              className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
            >
              Politica de Privacidade
            </Link>
            .
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold hover:from-orange-400 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-orange-500/20"
            >
              Aceitar Todos
            </button>
            <button
              onClick={handleEssentialOnly}
              className="flex-1 px-4 py-2.5 rounded-xl border border-orange-500/20 text-orange-400/70 text-xs font-semibold hover:border-orange-500/40 hover:text-orange-400 hover:bg-orange-500/5 transition-all duration-300"
            >
              Apenas Essenciais
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
