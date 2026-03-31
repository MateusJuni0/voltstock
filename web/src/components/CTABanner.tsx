"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import GlassSurface from "@/components/reactbits/GlassSurface";
import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-24 px-6 bg-transparent overflow-hidden">
      <div className="max-w-[1280px] mx-auto relative group">
        {/* Animated Glow effect behind */}
        <div className="absolute -inset-10 bg-accent/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative rounded-[3rem] overflow-hidden p-12 md:p-24 border border-accent/20 bg-accent/[0.03] group-hover:bg-accent/[0.05] transition-colors duration-500">
          {/* Glass background */}
          <div className="absolute inset-0 z-0">
            <GlassSurface 
              borderRadius={48} 
              borderWidth={0} 
              blur={50} 
              opacity={0.08} 
              className="w-full h-full"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-2xl bg-orange-500/15 flex items-center justify-center text-orange-400 mb-10 border border-orange-500/20"
            >
              <Sparkles size={28} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-extrabold text-orange-300 mb-8 leading-[0.95] tracking-tight"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Construa o seu
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">
                Setup de Sonho.
              </span>
            </motion.h2>
            
            <p className="text-orange-300/50 mb-12 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Descubra a nossa gama exclusiva de hardware premium e leve a sua estação de trabalho para o próximo nível com a VoltStock.
            </p>

            <Link href="/produtos">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-10 py-5 bg-orange-500 text-white font-extrabold rounded-full hover:bg-orange-600 transition-all duration-300 shadow-xl shadow-orange-500/20 cursor-pointer"
              >
                <ShoppingBag size={20} />
                Explorar Catálogo
                <ArrowRight size={20} />
              </motion.div>
            </Link>
            
            <p className="mt-8 text-xs text-orange-400/40 font-semibold tracking-widest uppercase">
              Montagem profissional incluída em todos os Setups.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}