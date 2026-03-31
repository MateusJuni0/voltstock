"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Quais são os métodos de pagamento aceites?",
    answer: "Aceitamos MBWay, Multibanco (referência bancária), cartões Visa e Mastercard, e transferência bancária. Todos os pagamentos são processados com encriptação SSL e conformidade PCI-DSS. A fatura com NIF é emitida automaticamente após a compra.",
  },
  {
    question: "Quanto tempo demora a entrega?",
    answer: "Para Portugal Continental, as entregas são feitas em 1-3 dias úteis via CTT Expresso. Encomendas efetuadas até às 14h são processadas no mesmo dia. Para os Açores e Madeira, o prazo é de 3-7 dias úteis. Envio grátis em encomendas acima de 50€.",
  },
  {
    question: "Qual é a política de devoluções?",
    answer: "Tem direito a devolver qualquer produto no prazo de 14 dias após a receção, sem necessidade de justificação, conforme o Decreto-Lei 24/2014. Basta contactar o nosso suporte para iniciar o processo. Os custos de devolução são por nossa conta.",
  },
  {
    question: "Os produtos têm garantia?",
    answer: "Sim, todos os produtos têm garantia europeia mínima de 2 anos, conforme a legislação da UE. Para produtos adquiridos após 1 de janeiro de 2022, a garantia legal é de 3 anos (Lei 3/2021). Tratamos de todo o processo de garantia em português.",
  },
  {
    question: "Posso pedir fatura com NIF?",
    answer: "Sim, todas as faturas são emitidas automaticamente com o NIF que indicar no momento da compra. Pode também solicitar fatura de empresa com dados fiscais completos. As faturas são enviadas por e-mail e ficam disponíveis na sua área de cliente.",
  },
  {
    question: "Fazem montagem personalizada de PCs?",
    answer: "Sim! Somos especialistas em montagem de estações de trabalho e setups gaming de alta performance. Contacte o nosso suporte técnico para um orçamento personalizado e aconselhamento gratuito.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 px-6 bg-transparent relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Dúvidas Comuns</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-orange-400 mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Perguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/30">Frequentes</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-orange-400/60 text-lg md:text-xl font-medium"
          >
            Tudo o que precisa de saber para comprar com total confiança na VoltStock.
          </motion.p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "rounded-[2.5rem] border border-accent/5 overflow-hidden transition-all duration-500",
                openIndex === i ? "bg-accent/[0.04] border-accent/20 shadow-2xl" : "bg-accent/[0.02] hover:bg-accent/[0.04] hover:border-accent/10"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 md:px-12 py-8 flex items-center justify-between text-left group"
              >
                <span className={cn(
                  "text-xl md:text-2xl font-black transition-colors duration-500 tracking-tight",
                  openIndex === i ? "text-orange-400" : "text-orange-400/60 group-hover:text-orange-400"
                )} style={{ fontFamily: 'var(--font-outfit)' }}>
                  {faq.question}
                </span>
                <div className={cn(
                  "flex-shrink-0 ml-6 p-4 rounded-2xl transition-all duration-500 shadow-xl",
                  openIndex === i ? "bg-orange-500 text-white rotate-0" : "bg-accent/10 text-orange-400 rotate-180"
                )}>
                  {openIndex === i ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-8 md:px-12 pb-10 text-lg text-orange-400/50 leading-relaxed font-medium max-w-2xl">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/[0.03] rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
