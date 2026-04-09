"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Package,
  Truck,
  CreditCard,
  RotateCcw,
  User,
  HelpCircle,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { faqItems } from "@/data/faq-items";
import type { FaqItem } from "@/data/faq-items";

// ── Types ───────────────────────────────────────────────────────────────────

type Category =
  | "Todas"
  | "Encomendas"
  | "Envios"
  | "Pagamentos"
  | "Devoluções"
  | "Conta"
  | "Geral";

const categories: readonly Category[] = [
  "Todas",
  "Encomendas",
  "Envios",
  "Pagamentos",
  "Devoluções",
  "Conta",
  "Geral",
];

const categoryIcons: Record<Exclude<Category, "Todas">, typeof Package> = {
  Encomendas: Package,
  Envios: Truck,
  Pagamentos: CreditCard,
  "Devoluções": RotateCcw,
  Conta: User,
  Geral: HelpCircle,
};

// ── Animation Variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

// ── Accordion Item ──────────────────────────────────────────────────────────

function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const Icon = categoryIcons[item.category];

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUp}
      className={`
        rounded-2xl border overflow-hidden transition-all duration-300
        ${
          isOpen
            ? "bg-orange-500/[0.06] border-orange-500/20 shadow-lg shadow-orange-500/5"
            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10"
        }
      `}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start gap-4 text-left group"
        aria-expanded={isOpen}
      >
        <div
          className={`
            mt-0.5 flex-shrink-0 p-2 rounded-xl transition-all duration-300
            ${isOpen ? "bg-orange-500/20 text-orange-400" : "bg-white/5 text-white/40 group-hover:text-white/60"}
          `}
        >
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <span
            className={`
              text-base md:text-lg font-semibold transition-colors duration-300 leading-snug
              ${isOpen ? "text-orange-400" : "text-white/80 group-hover:text-white"}
            `}
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {item.question}
          </span>
          {!isOpen && (
            <span className="block mt-1 text-xs text-white/30 font-medium uppercase tracking-wider">
              {item.category}
            </span>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`
            flex-shrink-0 mt-1 p-2 rounded-xl transition-colors duration-300
            ${isOpen ? "text-orange-400" : "text-white/30 group-hover:text-white/50"}
          `}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 md:px-8 pb-6 pl-[4.25rem] md:pl-[4.75rem]">
              <p className="text-sm md:text-base text-white/50 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page Component ──────────────────────────────────────────────────────────

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("Todas");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return faqItems.filter((item) => {
      const matchesCategory =
        activeCategory === "Todas" || item.category === activeCategory;

      const matchesSearch =
        query === "" ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setOpenIndex(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setOpenIndex(null);
  };

  return (
    <main className="min-h-screen bg-[#0A0E1A] pt-32 pb-24">
      {/* Decorative background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "FAQ" },
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-8 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
              Centro de Ajuda
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Perguntas{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Frequentes
            </span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Encontre respostas para as duvidas mais comuns sobre compras, envios,
            pagamentos e muito mais.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              size={20}
            />
            <input
              type="text"
              placeholder="Pesquisar perguntas..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/40 focus:bg-white/[0.06] transition-all duration-300 text-base"
              style={{ fontFamily: "var(--font-inter)" }}
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm"
              >
                Limpar
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-10 justify-center"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const count =
              category === "Todas"
                ? faqItems.length
                : faqItems.filter((f) => f.category === category).length;

            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                  ${
                    isActive
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10"
                      : "bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/70"
                  }
                `}
              >
                {category}
                <span
                  className={`ml-1.5 text-xs ${isActive ? "text-orange-400/60" : "text-white/30"}`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, index) => (
              <AccordionItem
                key={`${item.category}-${item.question}`}
                item={item}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-4">
                <Search className="text-white/20" size={28} />
              </div>
              <p className="text-white/40 text-lg font-medium mb-2">
                Nenhuma pergunta encontrada
              </p>
              <p className="text-white/25 text-sm">
                Tente pesquisar com outros termos ou selecione outra categoria.
              </p>
            </motion.div>
          )}
        </div>

        {/* Results count */}
        {searchQuery && filteredFaqs.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/25 text-sm mt-6"
          >
            {filteredFaqs.length}{" "}
            {filteredFaqs.length === 1
              ? "resultado encontrado"
              : "resultados encontrados"}
          </motion.p>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-10 md:p-14 overflow-hidden">
            {/* Glass highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.04] via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6">
                <MessageCircle className="text-orange-400" size={24} />
              </div>

              <h2
                className="text-2xl md:text-3xl font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Ainda tem duvidas?
              </h2>

              <p className="text-white/40 text-base md:text-lg mb-8 max-w-md mx-auto">
                A nossa equipa de suporte esta pronta para ajudar. Resposta
                garantida em menos de 24 horas.
              </p>

              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Contactar Suporte
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
