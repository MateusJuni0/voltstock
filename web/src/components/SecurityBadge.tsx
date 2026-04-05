"use client";

import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface SecurityBadgeProps {
  className?: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export function SecurityBadge({ className }: SecurityBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 px-4 py-3 rounded-xl",
        "bg-white/[0.03] backdrop-blur-md border border-accent/10",
        className
      )}
    >
      <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
        <Shield size={18} className="text-green-400" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-accent/80">
          Compra Segura
        </span>
        <span className="text-[11px] text-accent/40">
          SSL Encriptado &middot; RGPD Compliant
        </span>
      </div>
    </div>
  );
}
