"use client";

import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface PaymentLogosProps {
  size?: "sm" | "md";
  className?: string;
}

// ── Payment method badge data ────────────────────────────────────────────────

const PAYMENT_METHODS = [
  {
    name: "VISA",
    bg: "bg-[#1A1F71]/20 border-[#1A1F71]/30",
    text: "text-[#4D6FD0]",
    font: "font-black italic",
  },
  {
    name: "Mastercard",
    bg: "bg-[#EB001B]/10 border-[#EB001B]/20",
    text: "text-[#F79E1B]",
    font: "font-bold",
  },
  {
    name: "MB WAY",
    bg: "bg-[#D4213D]/10 border-[#D4213D]/20",
    text: "text-[#D4213D]",
    font: "font-black",
  },
  {
    name: "Multibanco",
    bg: "bg-[#00447C]/15 border-[#00447C]/25",
    text: "text-[#5B9BD5]",
    font: "font-bold",
  },
  {
    name: "Apple Pay",
    bg: "bg-white/5 border-white/10",
    text: "text-white/70",
    font: "font-semibold",
  },
] as const;

// ── Component ────────────────────────────────────────────────────────────────

export function PaymentLogos({ size = "md", className }: PaymentLogosProps) {
  const isSmall = size === "sm";

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {PAYMENT_METHODS.map((method) => (
        <span
          key={method.name}
          className={cn(
            "inline-flex items-center justify-center rounded-md border select-none",
            method.bg,
            method.text,
            method.font,
            isSmall
              ? "px-2 py-0.5 text-[9px] tracking-wide"
              : "px-3 py-1 text-[10px] tracking-wide"
          )}
        >
          {method.name}
        </span>
      ))}
    </div>
  );
}
