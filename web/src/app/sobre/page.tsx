"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, BadgeEuro, Truck, Headset, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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

const values = [
  {
    icon: Award,
    title: "Qualidade Premium",
    description:
      "Trabalhamos exclusivamente com marcas de topo. Cada produto é selecionado e testado para garantir a melhor experiência.",
  },
  {
    icon: BadgeEuro,
    title: "Preços Justos",
    description:
      "Preços competitivos com política de price matching. Se encontrar mais barato, igualamos o valor.",
  },
  {
    icon: Truck,
    title: "Envio Rápido",
    description:
      "Entrega em 24 a 48 horas em todo o território português. Envio gratuito acima de 50€.",
  },
  {
    icon: Headset,
    title: "Suporte Dedicado",
    description:
      "Equipa de especialistas portugueses prontos para ajudar. Suporte técnico real, não bots.",
  },
];

const stats = [
  { value: "200+", label: "Produtos" },
  { value: "100%", label: "Garantia" },
  { value: "IVA", label: "Incluído" },
  { value: "24-48h", label: "Entrega" },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function SobrePage() {
  return (
      <main className="min-h-screen pt-[120px] pb-20 px-4">
        <div className="max-w-[1100px] mx-auto">
          <Breadcrumbs items={[{ label: "Sobre Nos" }]} />

          {/* ── Hero ── */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.h1
              variants={fadeUp}
              custom={0}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Sobre a{" "}
              <span className="text-gradient">VoltStock</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-lg md:text-xl text-orange-400/60 max-w-2xl mx-auto leading-relaxed"
            >
              A referência em hardware premium e eletrónica profissional em Portugal.
              Construída por entusiastas, para entusiastas.
            </motion.p>
          </motion.section>

          {/* ── Mission ── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mb-20"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="glass-sidebar rounded-2xl p-8 md:p-12"
            >
              <h2
                className="text-2xl md:text-3xl font-bold text-orange-400 mb-6"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                A Nossa Missão
              </h2>
              <p className="text-lg md:text-xl text-orange-400/70 leading-relaxed mb-6">
                A nossa missão é{" "}
                <span className="text-orange-400 font-semibold">
                  democratizar o acesso a hardware premium em Portugal
                </span>
                . Acreditamos que cada utilizador merece componentes de topo, a preços
                justos, com uma experiência de compra moderna e sem complicações.
              </p>
              <p className="text-orange-400/50 leading-relaxed">
                Num mercado onde as opções nacionais eram limitadas, caras ou com
                experiências de compra ultrapassadas, a VoltStock nasceu para mudar o
                paradigma — oferecendo curadoria de marcas premium, envios rápidos em
                todo o país e suporte técnico real em português.
              </p>
            </motion.div>
          </motion.section>

          {/* ── Story ── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mb-20"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="glass-sidebar rounded-2xl p-8 md:p-12"
            >
              <h2
                className="text-2xl md:text-3xl font-bold text-orange-400 mb-6"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                A Nossa História
              </h2>
              <div className="space-y-4 text-orange-400/60 leading-relaxed">
                <p>
                  A VoltStock foi fundada por um grupo de entusiastas de tecnologia que
                  partilhavam a mesma frustração: Portugal carecia de uma loja de hardware
                  premium, de confiança, com uma experiência de utilizador moderna.
                </p>
                <p>
                  Cansados de encomendar peças de sites estrangeiros com envios demorados,
                  devoluções complicadas e suporte inexistente em português, decidimos criar
                  a solução que sempre quisemos ter — uma loja que combina a curadoria
                  rigorosa de produtos com a rapidez de entrega e o atendimento que os
                  entusiastas portugueses merecem.
                </p>
                <p>
                  Hoje, a VoltStock é a escolha de milhares de gamers, criadores de conteúdo
                  e profissionais em todo o país que exigem o melhor do hardware, sem
                  compromissos.
                </p>
              </div>
            </motion.div>
          </motion.section>

          {/* ── Values Grid ── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mb-20"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-2xl md:text-3xl font-bold text-orange-400 text-center mb-10"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Os Nossos Valores
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    custom={idx + 1}
                    className="glass-sidebar rounded-2xl p-8 group hover:border-orange-500/20 transition-colors duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-5 group-hover:bg-orange-500/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <h3
                      className="text-lg font-semibold text-orange-400 mb-3"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-orange-400/50 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* ── Stats ── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mb-20"
          >
            <div className="glass-sidebar rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    variants={fadeUp}
                    custom={idx}
                    className="text-center"
                  >
                    <div
                      className="text-3xl md:text-4xl font-bold text-gradient mb-2"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-orange-400/50">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── CTA ── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-2xl md:text-3xl font-bold text-orange-400 mb-4"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Pronto para Explorar?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-orange-400/50 mb-8 max-w-lg mx-auto"
            >
              Descubra a nossa seleção de hardware premium e encontre o componente
              perfeito para o seu setup.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors duration-300"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Explorar Catálogo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.section>
        </div>
      </main>
  );
}
