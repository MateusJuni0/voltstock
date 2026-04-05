"use client";

import {
  Shield,
  Lock,
  Truck,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface TrustBadgesProps {
  className?: string;
}

// ── Badge data ───────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  {
    icon: CreditCard,
    label: "Visa, Mastercard, MBWay, Multibanco, Apple Pay",
    category: "payment" as const,
  },
  {
    icon: Lock,
    label: "Pagamento Seguro SSL",
    category: "security" as const,
  },
  {
    icon: Shield,
    label: "Dados Protegidos RGPD",
    category: "security" as const,
  },
  {
    icon: Truck,
    label: "Envio 24-48h",
    category: "shipping" as const,
  },
  {
    icon: RotateCcw,
    label: "Devoluções 14 Dias",
    category: "shipping" as const,
  },
] as const;

// ── Component ────────────────────────────────────────────────────────────────

export function TrustBadges({ className }: TrustBadgesProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-6 gap-y-3",
        "px-5 py-4 rounded-xl",
        "bg-white/[0.02] backdrop-blur-sm border border-accent/5",
        className
      )}
    >
      {TRUST_ITEMS.map((item) => (
        <div
          key={item.label}
          className="inline-flex items-center gap-2 text-gray-400 select-none"
        >
          <item.icon size={14} className="shrink-0 text-gray-500" />
          <span className="text-[11px] font-medium whitespace-nowrap">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
