"use client";

import { motion } from "framer-motion";
import { Zap, Truck, ShieldCheck, Headphones, CreditCard, Banknote, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Truck,
    title: "Envio Grátis acima de 50€",
    desc: "Entregas via CTT Expresso em 24-48h para Portugal Continental. Açores e Madeira em 3-7 dias úteis com tracking incluído.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Garantia Europeia de 2 Anos",
    desc: "Todos os produtos com garantia mínima de 2 anos ao abrigo da legislação europeia. Processo de garantia simples e em português.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: CreditCard,
    title: "Pagamento Seguro com MBWay",
    desc: "Pague com MBWay, Multibanco, Visa, Mastercard ou referência bancária. Encriptação SSL e conformidade PCI-DSS.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Banknote,
    title: "Devolução em 14 Dias",
    desc: "Direito de devolução gratuita em 14 dias conforme o DL 24/2014. Sem perguntas, sem complicações.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Headphones,
    title: "Suporte Técnico Especializado",
    desc: "Equipa técnica em português disponível por chat, e-mail e telefone. Ajudamos na escolha e na montagem.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Zap,
    title: "Entrega em 24-48h",
    desc: "Encomendas processadas no próprio dia se efetuadas até às 14h. Entrega expresso em Portugal Continental.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

export function Features() {
  return (
    <section className="py-32 px-6 bg-transparent relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Padrão de Qualidade</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-orange-400 mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Porquê escolher a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/30">VoltStock?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-orange-400/60 text-lg md:text-xl font-medium"
          >
            Elevamos o padrão do hardware em Portugal. Descubra as vantagens de comprar na loja preferida dos entusiastas.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="group relative h-full"
            >
              <div className="relative h-full rounded-[3rem] overflow-hidden p-10 md:p-12 border border-accent/5 bg-accent/[0.02] hover:bg-accent/[0.05] hover:border-accent/20 transition-all duration-500 shadow-2xl">
                {/* Glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-xl",
                    feat.bg,
                    feat.color
                  )}>
                    <feat.icon size={32} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-orange-400 mb-6 group-hover:translate-x-1 transition-transform duration-500" style={{ fontFamily: 'var(--font-outfit)' }}>
                    {feat.title}
                  </h3>
                  
                  <p className="text-base text-orange-400/50 leading-relaxed font-medium mb-8">
                    {feat.desc}
                  </p>
                  
                  <div className="mt-auto pt-6 flex items-center gap-2 text-orange-400/20 group-hover:text-orange-400 transition-colors duration-500 font-bold text-xs uppercase tracking-widest">
                    <span>Saber mais</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[500px] bg-accent/[0.01] rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
