"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Check,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { PaymentLogos } from "@/components/PaymentLogos";

const FREE_SHIPPING_MAINLAND = 50;
const FREE_SHIPPING_ISLANDS = 100;

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^\d,]/g, "").replace(",", "."));
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  const subtotal = items.reduce((acc, item) => {
    return acc + parsePrice(item.price) * item.quantity;
  }, 0);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const isFreeShippingMainland = subtotal >= FREE_SHIPPING_MAINLAND;
  const isFreeShippingIslands = subtotal >= FREE_SHIPPING_ISLANDS;
  const shippingMainland = isFreeShippingMainland ? 0 : 4.99;
  const shippingIslands = isFreeShippingIslands ? 0 : 9.99;

  const remainingMainland = Math.max(FREE_SHIPPING_MAINLAND - subtotal, 0);
  const shippingProgress = Math.min(subtotal / FREE_SHIPPING_MAINLAND, 1);

  // Empty cart state
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#0A0E1A] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-8">
            <ShoppingBag size={40} className="text-orange-400/30" />
          </div>
          <h1
            className="text-3xl font-bold text-orange-400 mb-3"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            O seu carrinho esta vazio
          </h1>
          <p className="text-orange-400/40 mb-10 leading-relaxed">
            Ainda nao adicionou nenhum produto. Explore o nosso catalogo de
            hardware de elite e monte o setup perfeito.
          </p>
          <Link
            href="/produtos"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 shadow-xl shadow-orange-500/20 transition-all"
          >
            Explorar Catalogo
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0E1A] px-4 py-10 md:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold text-orange-400"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                O Seu Carrinho
              </h1>
              <p className="text-sm text-orange-400/40">
                {totalItems} {totalItems === 1 ? "produto" : "produtos"}
              </p>
            </div>
          </div>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-sm text-orange-400/50 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Continuar a Comprar
          </Link>
        </motion.div>

        {/* Main Layout: Cart Items + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Table Header — desktop only */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 text-xs font-semibold text-orange-400/30 uppercase tracking-wider">
              <span>Produto</span>
              <span className="text-center">Preco Unit.</span>
              <span className="text-center">Quantidade</span>
              <span className="text-right">Subtotal</span>
              <span className="w-10" />
            </div>

            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const unitPrice = parsePrice(item.price);
                const itemSubtotal = unitPrice * item.quantity;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-4 md:p-6"
                  >
                    {/* Mobile Layout */}
                    <div className="flex gap-4 md:hidden">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/40 shrink-0">
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <h3 className="text-sm font-bold text-orange-400 line-clamp-2 leading-tight">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-orange-400/20 hover:text-rose-500 transition-colors shrink-0"
                            aria-label="Remover produto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-orange-400/30 mt-1">
                          {item.category}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-white/10 p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1.5 rounded hover:bg-white/10 text-orange-400/60 transition-colors"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-orange-400">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1.5 rounded hover:bg-white/10 text-orange-400/60 transition-colors"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="text-base font-black text-orange-400">
                            {formatCurrency(itemSubtotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">
                      {/* Product */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/40 shrink-0">
                          <Image
                            src={item.img}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-orange-400 line-clamp-2 leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-xs text-orange-400/30 mt-0.5">
                            {item.category}
                          </p>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <span className="text-sm text-orange-400/60 text-center">
                        {formatCurrency(unitPrice)}
                      </span>

                      {/* Quantity */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-white/10 p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 rounded hover:bg-white/10 text-orange-400/60 transition-colors"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-orange-400">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 rounded hover:bg-white/10 text-orange-400/60 transition-colors"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <span className="text-base font-black text-orange-400 text-right">
                        {formatCurrency(itemSubtotal)}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-orange-400/20 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                        aria-label="Remover produto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Clear cart */}
            <div className="flex justify-end pt-2">
              <button
                onClick={clearCart}
                className="text-xs text-orange-400/30 hover:text-rose-400 transition-colors"
              >
                Limpar Carrinho
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-6 space-y-5 sticky top-24">
              <h2
                className="text-lg font-bold text-orange-400"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Resumo da Encomenda
              </h2>

              {/* Line items */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-orange-400/60">
                  <span>
                    Subtotal ({totalItems}{" "}
                    {totalItems === 1 ? "artigo" : "artigos"})
                  </span>
                  <span className="text-orange-400 font-semibold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-orange-400/60">
                  <span>Envio (Continental)</span>
                  <span
                    className={
                      isFreeShippingMainland
                        ? "text-green-400 font-semibold"
                        : "text-orange-400 font-semibold"
                    }
                  >
                    {isFreeShippingMainland
                      ? "Gratis"
                      : formatCurrency(shippingMainland)}
                  </span>
                </div>

                {!isFreeShippingIslands && (
                  <p className="text-[11px] text-orange-400/30">
                    Ilhas: {formatCurrency(shippingIslands)} (gratis a partir de{" "}
                    {formatCurrency(FREE_SHIPPING_ISLANDS)})
                  </p>
                )}
              </div>

              {/* Free shipping progress */}
              <div className="space-y-2">
                {remainingMainland > 0 ? (
                  <>
                    <div className="flex items-center gap-2 text-xs">
                      <Truck size={14} className="text-orange-400" />
                      <span className="text-orange-400/50">
                        Faltam{" "}
                        <span className="text-orange-400 font-bold">
                          {formatCurrency(remainingMainland)}
                        </span>{" "}
                        para envio gratis!
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${shippingProgress * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check size={12} className="text-green-400" />
                    </div>
                    <span className="text-green-400 font-semibold">
                      Envio gratis para Portugal Continental!
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.06]" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-orange-400/70 font-medium">Total</span>
                <span className="text-2xl font-black text-orange-400">
                  {formatCurrency(subtotal + shippingMainland)}
                </span>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                className="w-full h-14 rounded-2xl bg-orange-500 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-orange-600 shadow-xl shadow-orange-500/20 transition-all group"
              >
                Finalizar Compra
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              {/* Trust Signals */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-green-400/60">
                  <Lock size={11} />
                  <span>Checkout Seguro — SSL 256-bit</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-orange-400/30">
                  <ShieldCheck size={11} />
                  <span>Garantia de 2 anos em todos os produtos</span>
                </div>
                <PaymentLogos size="sm" className="justify-center" />
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
