"use client";

import { motion } from "framer-motion";

const brands = [
  "NVIDIA", "Intel", "AMD", "ASUS ROG", "MSI", "Corsair", "Logitech G", "Razer", "Samsung", "LG", "Alienware", "SteelSeries"
];

export function BrandsStrip() {
  return (
    <section className="py-12 bg-transparent border-y border-white/5 overflow-hidden">
      <div className="relative flex items-center">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-16 whitespace-nowrap px-8"
        >
          {/* Double the brands for seamless loop */}
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={i}
              className="text-xl md:text-3xl font-extrabold tracking-tighter text-orange-400/20 hover:text-orange-400 transition-all duration-500 cursor-default select-none uppercase italic"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {brand}
            </span>
          ))}
        </motion.div>
        
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0E1A] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0E1A] to-transparent z-10" />
      </div>
    </section>
  );
}