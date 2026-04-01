"use client";

import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const FREE_SHIPPING_THRESHOLD = 50;

export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, total } = useCart();
  const router = useRouter();

  const subtotal = items.reduce((acc, item) => {
    const p = parseFloat(item.price.replace(/[^\d,]/g, '').replace(',', '.'));
    return acc + p * item.quantity;
  }, 0);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const shippingProgress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]"
          />

          {/* Sidebar — spring wobbly entrance */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.8 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0A0E1A]/80 backdrop-blur-2xl border-l border-accent/10 z-[2001] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-accent/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-orange-400">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-bold text-orange-400" style={{ fontFamily: "var(--font-outfit)" }}>
                  O Seu Carrinho
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-accent/10 text-orange-400/60 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-orange-400/40 text-center px-10">
                  <ShoppingBag size={48} className="mb-4 opacity-10" />
                  <p className="text-lg font-medium">O seu carrinho está vazio.</p>
                  <p className="text-sm mt-2">Adicione hardware de elite para começar a montar o seu setup.</p>
                  <button
                    onClick={() => { onClose(); router.push("/produtos"); }}
                    className="mt-8 px-6 py-3 rounded-full bg-accent/5 border border-accent/10 text-orange-400 font-bold hover:bg-accent hover:text-[#0A0E1A] transition-all"
                  >
                    Explorar Catálogo
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 rounded-2xl bg-accent/[0.03] border border-accent/5 group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <h3 className="text-sm font-bold text-orange-400 line-clamp-2 leading-tight">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-orange-400/20 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-accent/5 rounded-lg border border-accent/10 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded hover:bg-accent/10 text-orange-400/60"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-orange-400">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded hover:bg-accent/10 text-orange-400/60"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-black text-orange-400">{item.price}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-accent/10 bg-accent/[0.02] space-y-4">
                {/* Free Shipping Progress */}
                <div className="space-y-2">
                  {remaining > 0 ? (
                    <>
                      <div className="flex items-center gap-2 text-xs">
                        <Truck size={14} className="text-orange-400" />
                        <span className="text-orange-400/50">
                          Faltam{" "}
                          <span className="text-orange-400 font-bold">
                            {remaining.toLocaleString("pt-PT", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </span>{" "}
                          para envio grátis!
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-accent/10 overflow-hidden">
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
                        Envio grátis!
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-orange-400/60 font-medium">Subtotal</span>
                  <span className="text-2xl font-black text-orange-400">
                    {subtotal.toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    router.push("/checkout");
                  }}
                  className="w-full h-16 rounded-2xl bg-orange-500 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-orange-600 shadow-xl shadow-orange-500/20 group transition-colors cursor-pointer"
                >
                  Finalizar Compra
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
