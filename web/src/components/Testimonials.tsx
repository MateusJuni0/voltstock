"use client";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Ricardo Silva",
    role: "Profissional de Design",
    content: "O serviço da VoltStock é excepcional. O PC que montaram para o meu estúdio é uma máquina incrível. A atenção aos detalhes e o suporte em português fazem toda a diferença.",
    avatar: "RS",
    rating: 5,
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    name: "Sofia Martins",
    role: "Entusiasta de Gaming",
    content: "Comprei a minha RTX 5090 aqui e chegou no dia seguinte! O empacotamento era perfeito e o suporte respondeu a todas as minhas dúvidas sobre a montagem.",
    avatar: "SM",
    rating: 5,
    color: "bg-accent/10 text-orange-400",
  },
  {
    name: "João Pereira",
    role: "Desenvolvedor",
    content: "A VoltStock é a minha loja de referência para hardware premium em Portugal. A qualidade das estações de trabalho que oferecem é inigualável no mercado nacional.",
    avatar: "JP",
    rating: 5,
    color: "bg-emerald-500/10 text-emerald-400",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 px-6 bg-transparent relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Testemunhos Reais</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-orange-400 mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            O que dizem os <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/30">nossos clientes.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-orange-400/60 text-lg md:text-xl font-medium"
          >
            Experiências reais de quem escolheu a excelência da VoltStock.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -10 }}
              className="group relative h-full"
            >
              <div className="relative rounded-[3rem] overflow-hidden p-10 md:p-12 border border-accent/5 bg-accent/[0.03] hover:bg-accent/[0.06] hover:border-accent/20 transition-all duration-500 flex flex-col justify-between h-full shadow-2xl">
                
                {/* Decorative Quote Icon in background */}
                <Quote size={80} className="absolute -top-4 -right-4 text-orange-400/[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-10">
                    {Array.from({ length: test.rating }).map((_, j) => (
                      <Star key={j} size={16} className="fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  
                  <p className="text-xl md:text-2xl text-orange-400 font-medium mb-12 leading-relaxed italic" style={{ fontFamily: 'var(--font-outfit)' }}>
                    &quot;{test.content}&quot;
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-5 pt-10 border-t border-accent/10">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border border-accent/10 shadow-lg",
                    test.color
                  )}>
                    {test.avatar}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-lg font-black text-orange-400 flex items-center gap-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {test.name} <CheckCircle2 size={16} className="text-orange-400" />
                    </h4>
                    <p className="text-[10px] text-orange-400/40 font-black uppercase tracking-[0.2em]">{test.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
