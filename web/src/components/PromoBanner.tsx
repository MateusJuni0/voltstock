"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[1100] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white text-center py-1 px-4">
      <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-3 text-[11px] sm:text-xs font-semibold">
        <span>
          <span className="font-black">ENVIO GRATIS</span> acima de 50EUR
          <span className="hidden sm:inline"> &bull; Pagamento seguro via MBWay e Stripe</span>
        </span>
        <Link
          href="/produtos"
          className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] transition-colors"
        >
          Ver Catalogo
        </Link>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-white/20 transition-colors"
          aria-label="Fechar banner"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
