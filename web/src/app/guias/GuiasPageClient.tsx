"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ArrowRight, ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface GuideCardData {
  slug: string;
  title: string;
  metaDescription: string;
  categoryName: string;
  criteriaCount: number;
  productCount: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

const categoryIcons: Record<string, string> = {
  Processadores: "🔧",
  "Placas Gráficas": "🎮",
  Motherboards: "🔌",
  "Memória RAM": "💾",
  Armazenamento: "💿",
  "Fontes de Alimentação": "⚡",
  Caixas: "📦",
  "Refrigeração": "❄️",
  Monitores: "🖥️",
  "Teclados e Ratos": "⌨️",
  "Headsets e Áudio": "🎧",
  "Cadeiras Gaming": "🪑",
};

export function GuiasPageClient({ guides }: { guides: GuideCardData[] }) {
  return (
    <main className="min-h-screen bg-[#0A0E1A] pt-32 pb-24">
      {/* Decorative background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-0 translate-x-1/2 w-[600px] h-[600px] bg-orange-500/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Guias de Compra" }]} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-8 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <BookOpen size={14} className="text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
              Guias de Compra
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Escolha com{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Confianca
            </span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Guias detalhados escritos por especialistas para ajudar a encontrar o
            hardware perfeito para o seu setup. Comparacoes, precos e
            recomendacoes para Portugal.
          </p>
        </motion.div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.slug}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              variants={fadeUp}
            >
              <Link
                href={`/guias/${guide.slug}`}
                className="group block h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-orange-500/20 transition-all duration-300 p-6 relative overflow-hidden"
              >
                {/* Glass highlight on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  {/* Category icon + badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">
                      {categoryIcons[guide.categoryName] ?? "📖"}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 bg-white/[0.04] px-2.5 py-1 rounded-lg">
                      {guide.productCount} produtos
                    </span>
                  </div>

                  {/* Category Name */}
                  <h2
                    className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-300 mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {guide.categoryName}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-white/40 leading-relaxed mb-4 line-clamp-2">
                    {guide.metaDescription}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/25">
                      {guide.criteriaCount} criterios analisados
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-400/70 group-hover:text-orange-400 transition-colors duration-300">
                      Ler guia
                      <ArrowRight
                        size={12}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-10 md:p-14 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.04] via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
              <h2
                className="text-2xl md:text-3xl font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Pronto para montar o seu setup?
              </h2>

              <p className="text-white/40 text-base md:text-lg mb-8 max-w-md mx-auto">
                Explore o nosso catalogo completo com mais de 200 produtos
                premium e envio rapido para todo Portugal.
              </p>

              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Ver Produtos
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
