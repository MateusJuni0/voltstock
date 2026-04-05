"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Clock,
  MapPin,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// ── Schema ───────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório (min. 2 caracteres)"),
  email: z.string().email("Email inválido"),
  assunto: z.string().min(1, "Selecione um assunto"),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ── Data ─────────────────────────────────────────────────────────────────────

const assuntoOptions = [
  { value: "", label: "Selecione um assunto" },
  { value: "suporte", label: "Suporte Técnico" },
  { value: "encomendas", label: "Encomendas" },
  { value: "devolucoes", label: "Devoluções" },
  { value: "parcerias", label: "Parcerias" },
  { value: "outro", label: "Outro" },
];

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "info@voltstock.pt",
    href: "mailto:info@voltstock.pt",
  },
  {
    icon: Clock,
    title: "Horário",
    value: "Segunda a Sexta, 9h–18h",
    href: null,
  },
  {
    icon: MapPin,
    title: "Localização",
    value: "Portugal",
    href: null,
  },
];

// ── Shared input styles ──────────────────────────────────────────────────────

const inputBase =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-orange-400/90 placeholder:text-orange-400/30 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-colors duration-200";

const labelBase = "block text-sm font-medium text-orange-400/70 mb-2";

const errorBase = "text-xs text-red-400 mt-1.5";

// ── Component ────────────────────────────────────────────────────────────────

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nome: "",
      email: "",
      assunto: "",
      mensagem: "",
    },
  });

  async function onSubmit(_data: ContactFormData) {
    // Simulate API delay — visual only, no real backend
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitted(true);
    reset();
  }

  return (
    <>
      <head>
        <title>Contacto | VoltStock</title>
        <meta
          name="description"
          content="Entre em contacto com a equipa VoltStock. Suporte técnico, informações sobre encomendas, devoluções e parcerias. Resposta em até 24 horas úteis."
        />
        <meta property="og:title" content="Contacto | VoltStock" />
        <meta
          property="og:description"
          content="Entre em contacto com a equipa VoltStock. Suporte técnico, informações sobre encomendas e parcerias."
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_PT" />
      </head>

      <main className="min-h-screen pt-[120px] pb-20 px-4">
        <div className="max-w-[1100px] mx-auto">
          <Breadcrumbs items={[{ label: "Contacto" }]} />

          {/* ── Hero ── */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h1
              variants={fadeUp}
              custom={0}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Fale{" "}
              <span className="text-gradient">Connosco</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-lg text-orange-400/60 max-w-xl mx-auto"
            >
              Tem alguma questão? A nossa equipa está pronta para ajudar.
            </motion.p>
          </motion.section>

          {/* ── Contact Info Cards ── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {contactInfo.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={idx}
                  className="glass-sidebar rounded-2xl p-6 text-center group hover:border-orange-500/20 transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3
                    className="text-sm font-semibold text-orange-400 mb-2"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {item.title}
                  </h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-orange-400/60 hover:text-orange-400 transition-colors duration-200"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-orange-400/60">{item.value}</p>
                  )}
                </motion.div>
              );
            })}
          </motion.section>

          {/* ── Form Section ── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mb-16"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="glass-sidebar rounded-2xl p-8 md:p-12 max-w-[700px] mx-auto"
            >
              <h2
                className="text-2xl font-bold text-orange-400 mb-8"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Envie-nos uma Mensagem
              </h2>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3
                      className="text-xl font-semibold text-orange-400 mb-3"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      Mensagem enviada com sucesso!
                    </h3>
                    <p className="text-orange-400/50 mb-8">
                      A nossa equipa irá responder dentro de 24 horas úteis.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-orange-400/70 hover:text-orange-400 hover:border-orange-500/30 transition-colors duration-200"
                    >
                      Enviar outra mensagem
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Nome */}
                    <div>
                      <label htmlFor="nome" className={labelBase}>
                        Nome
                      </label>
                      <input
                        id="nome"
                        type="text"
                        placeholder="O seu nome"
                        className={inputBase}
                        {...register("nome")}
                      />
                      {errors.nome && (
                        <p className={errorBase}>{errors.nome.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className={labelBase}>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="email@exemplo.pt"
                        className={inputBase}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className={errorBase}>{errors.email.message}</p>
                      )}
                    </div>

                    {/* Assunto */}
                    <div>
                      <label htmlFor="assunto" className={labelBase}>
                        Assunto
                      </label>
                      <select
                        id="assunto"
                        className={`${inputBase} appearance-none cursor-pointer`}
                        {...register("assunto")}
                      >
                        {assuntoOptions.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            className="bg-[#0A0E1A] text-orange-400"
                          >
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.assunto && (
                        <p className={errorBase}>{errors.assunto.message}</p>
                      )}
                    </div>

                    {/* Mensagem */}
                    <div>
                      <label htmlFor="mensagem" className={labelBase}>
                        Mensagem
                      </label>
                      <textarea
                        id="mensagem"
                        rows={5}
                        placeholder="Descreva a sua questão..."
                        className={`${inputBase} resize-none`}
                        {...register("mensagem")}
                      />
                      {errors.mensagem && (
                        <p className={errorBase}>{errors.mensagem.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors duration-300"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          A enviar...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Enviar Mensagem
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.section>

          {/* ── FAQ mini ── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="glass-sidebar rounded-2xl p-8 max-w-[700px] mx-auto"
            >
              <h3
                className="text-lg font-semibold text-orange-400 mb-3"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Perguntas Frequentes
              </h3>
              <p className="text-sm text-orange-400/50 leading-relaxed">
                <strong className="text-orange-400/70">Tempo de resposta habitual:</strong>{" "}
                até 24 horas úteis. Para questões urgentes sobre encomendas em trânsito,
                contacte-nos via{" "}
                <a
                  href="https://wa.me/351961227666"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200"
                >
                  WhatsApp
                </a>{" "}
                para uma resposta mais rápida.
              </p>
            </motion.div>
          </motion.section>
        </div>
      </main>
    </>
  );
}
