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

// ── Types ───────────────────────────────────────────────────────────────────

type Category =
  | "Todas"
  | "Encomendas"
  | "Envios"
  | "Pagamentos"
  | "Devoluções"
  | "Conta"
  | "Geral";

interface FaqItem {
  question: string;
  answer: string;
  category: Exclude<Category, "Todas">;
}

// ── FAQ Data ────────────────────────────────────────────────────────────────

const faqItems: readonly FaqItem[] = [
  // Encomendas
  {
    category: "Encomendas",
    question: "Como posso acompanhar a minha encomenda?",
    answer:
      "Após o envio, receberá um e-mail com o número de tracking e um link direto para acompanhar a encomenda em tempo real. Pode também consultar o estado na sua área de cliente, na secção 'As Minhas Encomendas'.",
  },
  {
    category: "Encomendas",
    question: "Posso alterar ou cancelar uma encomenda já efetuada?",
    answer:
      "Sim, desde que a encomenda ainda não tenha sido expedida. Contacte o nosso suporte o mais rapidamente possível via e-mail ou telefone. Se já estiver em trânsito, poderá recusar a entrega ou solicitar a devolução após receção.",
  },
  {
    category: "Encomendas",
    question: "Qual é o valor mínimo de encomenda?",
    answer:
      "Não existe valor mínimo de encomenda na VoltStock. Pode comprar qualquer produto independentemente do valor. Porém, encomendas acima de 50\u20AC beneficiam de envio gratuito para Portugal Continental.",
  },
  {
    category: "Encomendas",
    question: "Um produto está esgotado. Quando volta a estar disponível?",
    answer:
      "Na página do produto esgotado, pode ativar o alerta de reposição de stock. Assim que o artigo estiver novamente disponível, receberá uma notificação por e-mail. Também pode contactar o suporte para saber a previsão de reposição.",
  },

  // Envios
  {
    category: "Envios",
    question: "Quanto tempo demora a entrega?",
    answer:
      "Para Portugal Continental, as entregas são feitas em 1-3 dias úteis via CTT Expresso. Encomendas efetuadas até às 14h são processadas no mesmo dia. Para os Açores e Madeira, o prazo é de 3-7 dias úteis.",
  },
  {
    category: "Envios",
    question: "Qual é o custo de envio?",
    answer:
      "O envio para Portugal Continental custa 3,99\u20AC e é gratuito em encomendas acima de 50\u20AC. Para os Açores e Madeira, o custo é de 6,99\u20AC (gratuito acima de 80\u20AC). Entregas internacionais para a UE estão disponíveis com custos calculados no checkout.",
  },
  {
    category: "Envios",
    question: "Fazem entregas internacionais?",
    answer:
      "Sim, enviamos para todos os países da União Europeia. Os custos e prazos variam consoante o destino e são calculados automaticamente no checkout. Para envios fora da UE, contacte o nosso suporte para um orçamento personalizado.",
  },
  {
    category: "Envios",
    question: "Posso escolher a data e hora de entrega?",
    answer:
      "Atualmente, a seleção de data e hora específica não está disponível. Contudo, ao efetuar a encomenda pode adicionar instruções de entrega (ex: deixar na portaria, entregar ao vizinho) no campo de observações do checkout.",
  },

  // Pagamentos
  {
    category: "Pagamentos",
    question: "Quais são os métodos de pagamento aceites?",
    answer:
      "Aceitamos MBWay, Multibanco (referência bancária), cartões Visa e Mastercard, e transferência bancária. Todos os pagamentos são processados com encriptação SSL e conformidade PCI-DSS.",
  },
  {
    category: "Pagamentos",
    question: "Os pagamentos são seguros?",
    answer:
      "Absolutamente. Utilizamos encriptação SSL de 256 bits e os dados do seu cartão nunca são armazenados nos nossos servidores. Todos os pagamentos por cartão são processados via Stripe, que cumpre os mais elevados padrões de segurança PCI-DSS Level 1.",
  },
  {
    category: "Pagamentos",
    question: "Posso pedir fatura com NIF?",
    answer:
      "Sim, todas as faturas são emitidas automaticamente com o NIF que indicar no momento da compra. Pode também solicitar fatura de empresa com dados fiscais completos. As faturas são enviadas por e-mail e ficam disponíveis na sua área de cliente.",
  },
  {
    category: "Pagamentos",
    question: "Quando é cobrado o pagamento por Multibanco?",
    answer:
      "Ao escolher pagamento por Multibanco, recebe uma referência válida por 72 horas. O pagamento só é cobrado quando efetuar o pagamento num terminal ATM ou homebanking. A encomenda é processada automaticamente após confirmação do pagamento.",
  },

  // Devoluções
  {
    category: "Devoluções",
    question: "Qual é a política de devoluções?",
    answer:
      "Tem direito a devolver qualquer produto no prazo de 14 dias após a receção, sem necessidade de justificação, conforme o Decreto-Lei 24/2014 (Lei Europeia do Consumidor). Os custos de devolução são por nossa conta.",
  },
  {
    category: "Devoluções",
    question: "Como solicito uma devolução?",
    answer:
      "Aceda à sua área de cliente, selecione a encomenda e clique em 'Solicitar Devolução'. Em alternativa, envie um e-mail para suporte@voltstock.pt com o número da encomenda. Receberá uma etiqueta de devolução pré-paga no prazo de 24 horas.",
  },
  {
    category: "Devoluções",
    question: "Quando recebo o reembolso?",
    answer:
      "O reembolso é processado no prazo de 5 a 10 dias úteis após recebermos e inspecionarmos o produto devolvido. O valor é creditado no mesmo método de pagamento utilizado na compra original.",
  },
  {
    category: "Devoluções",
    question: "Posso trocar um produto em vez de devolver?",
    answer:
      "Sim, oferecemos troca direta para produtos em stock. Basta indicar o artigo pretendido ao solicitar a devolução. Se houver diferença de preço, será ajustada automaticamente. A troca é enviada assim que recebermos o produto original.",
  },

  // Conta
  {
    category: "Conta",
    question: "Como crio uma conta na VoltStock?",
    answer:
      "Clique em 'Criar Conta' no canto superior direito do site. Pode registar-se com e-mail e password ou utilizar o login social com Google. A criação de conta é gratuita e permite acompanhar encomendas, guardar favoritos e aceder a ofertas exclusivas.",
  },
  {
    category: "Conta",
    question: "Esqueci-me da password. Como a recupero?",
    answer:
      "Na página de login, clique em 'Esqueci-me da Password'. Insira o e-mail associado à sua conta e receberá um link de recuperação válido por 24 horas. Se não receber o e-mail, verifique a pasta de spam ou contacte o suporte.",
  },
  {
    category: "Conta",
    question: "Como são protegidos os meus dados pessoais?",
    answer:
      "Cumprimos integralmente o RGPD (Regulamento Geral de Proteção de Dados). Os seus dados são encriptados e nunca partilhados com terceiros para fins de marketing. Pode consultar, alterar ou eliminar os seus dados a qualquer momento na área de cliente.",
  },

  // Geral
  {
    category: "Geral",
    question: "Os produtos têm garantia?",
    answer:
      "Sim, todos os produtos têm garantia europeia mínima de 2 anos, conforme a legislação da UE. Para produtos adquiridos após 1 de janeiro de 2022, a garantia legal é de 3 anos (Lei 3/2021). Tratamos de todo o processo de garantia.",
  },
  {
    category: "Geral",
    question: "Fazem montagem personalizada de PCs?",
    answer:
      "Sim! Somos especialistas em montagem de estações de trabalho e setups gaming de alta performance. Contacte o nosso suporte técnico para um orçamento personalizado e aconselhamento gratuito.",
  },
  {
    category: "Geral",
    question: "Têm loja física?",
    answer:
      "Atualmente operamos exclusivamente online, o que nos permite oferecer preços mais competitivos. Toda a operação é gerida a partir de Portugal, com armazém próprio e suporte técnico nacional em português.",
  },
  {
    category: "Geral",
    question: "Como posso contactar o suporte?",
    answer:
      "Pode contactar-nos via e-mail (suporte@voltstock.pt), telefone ou pelo formulário de contacto no site. O nosso horário de atendimento é de segunda a sexta, das 9h às 18h. Respondemos a todos os pedidos no prazo máximo de 24 horas.",
  },
] as const;

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
