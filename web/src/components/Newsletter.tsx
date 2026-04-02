"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bell } from "lucide-react";
import GlassSurface from "@/components/reactbits/GlassSurface";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-transparent">
      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="relative rounded-[3rem] overflow-hidden p-8 md:p-16 text-center border border-white/5">
          {/* Glass background inside the box */}
          <div className="absolute inset-0 z-0">
            <GlassSurface 
              borderRadius={48} 
              borderWidth={0} 
              blur={40} 
              opacity={0.1} 
              className="w-full h-full"
            />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 mx-auto mb-8"
            >
              <Bell size={28} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold text-orange-300 mb-6"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Receba as novidades.
            </motion.h2>
            <p className="text-orange-300/50 mb-10 text-lg">
              Ofertas exclusivas e lançamentos em primeira mão. Seja o primeiro a saber quando chegam as novidades à VoltStock.
            </p>

            <form onSubmit={handleSubmit} className="relative group max-w-md mx-auto">
              <input
                type="email"
                placeholder="O seu melhor e-mail..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-orange-200 placeholder:text-orange-400/30 focus:outline-none focus:border-orange-500/40 focus:bg-white/[0.08] transition-all"
              />
              <button
                type="submit"
                className="absolute top-2 right-2 bottom-2 px-6 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center"
              >
                {subscribed ? "Subscrito!" : <Send size={20} />}
              </button>
            </form>
            
            <p className="mt-6 text-[11px] text-orange-400/30 uppercase tracking-widest font-bold">
              Sem spam. Apenas hardware de elite diretamente no seu e-mail.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}