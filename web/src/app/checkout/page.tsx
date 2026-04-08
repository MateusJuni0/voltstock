"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/store/useCart";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Truck,
  ShieldCheck,
  Loader2,
  Lock,
} from "lucide-react";
import Image from "next/image";
import { PaymentLogos } from "@/components/PaymentLogos";
import { SecurityBadge } from "@/components/SecurityBadge";
import { getDeliveryEstimate } from "@/lib/delivery";
import { trackBeginCheckout, fbTrackInitiateCheckout } from "@/lib/analytics";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const shippingSchema = z.object({
  fullName: z.string().min(3, "Nome completo obrigatório (min. 3 caracteres)"),
  line1: z.string().min(3, "Morada obrigatória"),
  line2: z.string().optional(),
  city: z.string().min(2, "Cidade obrigatória"),
  postalCode: z
    .string()
    .regex(/^\d{4}-?\d{3}$/, "Formato: XXXX-XXX ou XXXXXXX"),
  district: z.string().min(2, "Distrito obrigatório"),
  phone: z
    .string()
    .regex(/^(\+351)?\s?\d{9}$/, "Número de telefone inválido"),
  nif: z
    .string()
    .regex(/^\d{9}$/, "NIF deve ter 9 dígitos")
    .optional()
    .or(z.literal("")),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^\d,]/g, "").replace(",", "."));
}

function calculateShipping(subtotal: number, postalCode: string): number {
  const isIslands = postalCode.startsWith("9");

  if (isIslands) {
    return subtotal >= 100 ? 0 : 9.99;
  }

  return subtotal >= 50 ? 0 : 4.99;
}

function formatEUR(value: number): string {
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

// ---------------------------------------------------------------------------
// Step Indicator
// ---------------------------------------------------------------------------

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: "Morada de Envio", icon: MapPin },
    { label: "Resumo & Pagamento", icon: CreditCard },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((step, idx) => {
        const StepIcon = step.icon;
        const isActive = idx + 1 === currentStep;
        const isDone = idx + 1 < currentStep;

        return (
          <div key={step.label} className="flex items-center gap-2">
            {idx > 0 && (
              <div
                className={`h-px w-10 sm:w-16 transition-colors ${
                  isDone ? "bg-orange-500" : "bg-accent/10"
                }`}
              />
            )}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                  : isDone
                    ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                    : "bg-accent/5 text-accent/30 border border-accent/10"
              }`}
            >
              <StepIcon size={16} />
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{idx + 1}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Shipping Form
// ---------------------------------------------------------------------------

interface Step1Props {
  form: ReturnType<typeof useForm<ShippingFormData>>;
  onNext: (data: ShippingFormData) => void;
}

function StepShipping({ form, onNext }: Step1Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const fieldClass =
    "w-full bg-white/[0.04] border border-accent/10 rounded-xl px-4 py-3 text-accent placeholder:text-accent/25 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-accent/50 mb-1.5";
  const errorClass = "text-rose-400 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      {/* Full Name */}
      <div>
        <label className={labelClass}>Nome Completo *</label>
        <input
          {...register("fullName")}
          placeholder="João Silva"
          className={fieldClass}
        />
        {errors.fullName && (
          <p className={errorClass}>{errors.fullName.message}</p>
        )}
      </div>

      {/* Address Line 1 */}
      <div>
        <label className={labelClass}>Morada *</label>
        <input
          {...register("line1")}
          placeholder="Rua das Flores, 123"
          className={fieldClass}
        />
        {errors.line1 && (
          <p className={errorClass}>{errors.line1.message}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className={labelClass}>Morada (linha 2)</label>
        <input
          {...register("line2")}
          placeholder="Apartamento, andar, etc."
          className={fieldClass}
        />
      </div>

      {/* City + Postal Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Cidade *</label>
          <input
            {...register("city")}
            placeholder="Lisboa"
            className={fieldClass}
          />
          {errors.city && (
            <p className={errorClass}>{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Código Postal *</label>
          <input
            {...register("postalCode")}
            placeholder="1000-001"
            className={fieldClass}
          />
          {errors.postalCode && (
            <p className={errorClass}>{errors.postalCode.message}</p>
          )}
        </div>
      </div>

      {/* District + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Distrito *</label>
          <input
            {...register("district")}
            placeholder="Lisboa"
            className={fieldClass}
          />
          {errors.district && (
            <p className={errorClass}>{errors.district.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Telefone *</label>
          <input
            {...register("phone")}
            placeholder="+351 912345678"
            className={fieldClass}
          />
          {errors.phone && (
            <p className={errorClass}>{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* NIF */}
      <div>
        <label className={labelClass}>
          NIF{" "}
          <span className="text-accent/30 font-normal">
            (opcional, para fatura)
          </span>
        </label>
        <input
          {...register("nif")}
          placeholder="123456789"
          className={fieldClass}
        />
        {errors.nif && <p className={errorClass}>{errors.nif.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-colors mt-6 cursor-pointer"
      >
        Continuar para Pagamento
        <ChevronRight size={18} />
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Summary & Payment
// ---------------------------------------------------------------------------

interface Step2Props {
  shippingData: ShippingFormData;
  onBack: () => void;
}

function StepPayment({ shippingData, onBack }: Step2Props) {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce(
    (acc, item) => acc + parsePrice(item.price) * item.quantity,
    0,
  );
  const shipping = calculateShipping(subtotal, shippingData.postalCode);
  const total = subtotal + shipping;
  const deliveryEstimate = getDeliveryEstimate(shippingData.postalCode);

  async function handlePayment() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: parsePrice(item.price),
            quantity: item.quantity,
            img: item.img,
          })),
          shippingAddress: shippingData,
          shippingCost: shipping,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao processar pagamento");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Erro inesperado";
      const message = raw.includes("API Key") || raw.includes("Stripe") || raw.includes("startsWith")
        ? "Pagamentos online temporariamente indisponíveis. Contacte-nos via WhatsApp para finalizar a sua encomenda."
        : raw;
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => {
          const unitPrice = parsePrice(item.price);
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-accent/5"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/40 shrink-0">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-accent truncate">
                  {item.name}
                </p>
                <p className="text-xs text-accent/40 mt-0.5">
                  Qtd: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-accent whitespace-nowrap">
                {formatEUR(unitPrice * item.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="space-y-3 pt-4 border-t border-accent/10">
        <div className="flex justify-between text-sm">
          <span className="text-accent/50">Subtotal</span>
          <span className="text-accent font-medium">{formatEUR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-accent/50 flex items-center gap-1.5">
            <Truck size={14} />
            Envio
          </span>
          <span className="text-accent font-medium">
            {shipping === 0 ? (
              <span className="text-green-400">Grátis</span>
            ) : (
              formatEUR(shipping)
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-accent/50 flex items-center gap-1.5">
            <Truck size={14} className="text-orange-400/60" />
            Entrega estimada
          </span>
          <span className="text-orange-400 font-medium">
            {deliveryEstimate.label}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-3 border-t border-accent/10">
          <span className="text-accent">Total</span>
          <span className="text-orange-400">{formatEUR(total)}</span>
        </div>
      </div>

      {/* Shipping Address Summary */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-accent/5 text-sm space-y-1">
        <p className="text-accent/40 text-xs font-semibold uppercase tracking-wider mb-2">
          Morada de Envio
        </p>
        <p className="text-accent font-medium">{shippingData.fullName}</p>
        <p className="text-accent/60">{shippingData.line1}</p>
        {shippingData.line2 && (
          <p className="text-accent/60">{shippingData.line2}</p>
        )}
        <p className="text-accent/60">
          {shippingData.postalCode} {shippingData.city}, {shippingData.district}
        </p>
        <p className="text-accent/60">{shippingData.phone}</p>
        {shippingData.nif && (
          <p className="text-accent/40 text-xs mt-1">NIF: {shippingData.nif}</p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-colors cursor-pointer"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <ShieldCheck size={18} />
          )}
          {loading ? "A processar..." : "Pagar com Stripe"}
        </button>

        {/* Trust strip below submit */}
        <div className="flex items-center justify-center gap-2 text-accent/30 text-xs py-2">
          <Lock size={12} className="text-green-400/60" />
          <span>
            Pagamento 100% Seguro | SSL Encriptado | Dados Protegidos
          </span>
        </div>

        <button
          onClick={onBack}
          disabled={loading}
          className="w-full h-12 rounded-2xl bg-accent/5 border border-accent/10 text-accent/60 font-medium text-sm flex items-center justify-center gap-2 hover:bg-accent/10 transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          Voltar
        </button>
      </div>

      {/* Payment logos + satisfaction guarantee */}
      <div className="pt-4 space-y-3">
        <PaymentLogos size="sm" className="justify-center" />
        <p className="text-center text-[11px] text-accent/25">
          Satisfação Garantida — 14 dias para devoluções sem perguntas
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Order Summary Sidebar (Desktop)
// ---------------------------------------------------------------------------

function OrderSidebar() {
  const { items } = useCart();

  const subtotal = items.reduce(
    (acc, item) => acc + parsePrice(item.price) * item.quantity,
    0,
  );

  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-accent/10 p-6 space-y-5 sticky top-28">
      <h3 className="text-lg font-bold text-accent flex items-center gap-2">
        <ShieldCheck size={18} className="text-orange-400" />
        Resumo da Encomenda
      </h3>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {items.map((item) => {
          const unitPrice = parsePrice(item.price);
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 shrink-0">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-accent truncate">
                  {item.name}
                </p>
                <p className="text-xs text-accent/30">x{item.quantity}</p>
              </div>
              <p className="text-xs font-bold text-accent">
                {formatEUR(unitPrice * item.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-accent/10 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-accent/50">Subtotal</span>
          <span className="text-accent font-semibold">
            {formatEUR(subtotal)}
          </span>
        </div>
      </div>

      <SecurityBadge className="w-full" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const [step, setStep] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(
    null,
  );

  useEffect(() => {
    // Manually trigger Zustand rehydration and mark as ready.
    useCart.persist.rehydrate();
    setHydrated(true);
  }, []);

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "",
      line1: "",
      line2: "",
      city: "",
      postalCode: "",
      district: "",
      phone: "",
      nif: "",
    },
  });

  if (!hydrated) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-accent/40">
          <Loader2 size={36} className="animate-spin text-orange-400" />
          <p className="text-sm font-medium">A carregar o seu carrinho…</p>
        </div>
      </main>
    );
  }

  // Only redirect once we know the cart is truly empty (after hydration).
  if (items.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center space-y-4">
          <p className="text-accent/50 text-lg">O seu carrinho está vazio.</p>
          <button
            onClick={() => router.push("/produtos")}
            className="px-6 py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors cursor-pointer"
          >
            Explorar Catálogo
          </button>
        </div>
      </main>
    );
  }

  function handleStepOneComplete(data: ShippingFormData) {
    setShippingData(data);
    setStep(2);

    const checkoutItems = items.map((item) => ({
      name: item.name,
      price: parsePrice(item.price),
      quantity: item.quantity,
    }));
    const total = checkoutItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    trackBeginCheckout(checkoutItems, total);
    fbTrackInitiateCheckout(total, items.length);
  }

  return (
    <main className="flex-1 pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress */}
        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Left — Form / Payment */}
          <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-accent/10 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2
                    className="text-xl font-bold text-accent mb-6 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    <MapPin size={20} className="text-orange-400" />
                    Morada de Envio
                  </h2>
                  <StepShipping
                    form={form}
                    onNext={handleStepOneComplete}
                  />
                </motion.div>
              )}

              {step === 2 && shippingData && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2
                    className="text-xl font-bold text-accent mb-6 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    <CreditCard size={20} className="text-orange-400" />
                    Resumo & Pagamento
                  </h2>
                  <StepPayment
                    shippingData={shippingData}
                    onBack={() => setStep(1)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — Order Sidebar (desktop) */}
          <div className="hidden lg:block">
            <OrderSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
