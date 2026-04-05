"use client";

import { motion } from "framer-motion";
import { Plus, LayoutGrid, Cpu, Monitor, Keyboard, Gamepad2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { products } from "@/data/products";

// Category definitions — mapped to real product categories
const categoryDefs = [
  {
    name: "Placas Gráficas",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop",
    color: "from-blue-500/20 to-cyan-400/20",
    productCategories: ["Placas Gráficas"],
  },
  {
    name: "Processadores",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop",
    color: "from-purple-500/20 to-pink-400/20",
    productCategories: ["Processadores"],
  },
  {
    name: "Monitores",
    icon: Monitor,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    color: "from-orange-500/20 to-amber-400/20",
    productCategories: ["Monitores"],
  },
  {
    name: "Periféricos",
    icon: Keyboard,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
    color: "from-emerald-500/20 to-teal-400/20",
    productCategories: ["Teclados e Ratos", "Headsets e Áudio"],
  },
  {
    name: "Componentes",
    icon: LayoutGrid,
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop",
    color: "from-indigo-500/20 to-blue-400/20",
    productCategories: ["Motherboards", "Memória RAM", "Armazenamento", "Fontes de Alimentação"],
  },
  {
    name: "Gaming",
    icon: Gamepad2,
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=800&auto=format&fit=crop",
    color: "from-rose-500/20 to-orange-400/20",
    productCategories: ["Cadeiras Gaming", "Caixas", "Refrigeração"],
  },
];

// Real counts from product catalog
const categories = categoryDefs.map((cat) => {
  const count = products.filter((p) => cat.productCategories.includes(p.category)).length;
  return { ...cat, count: `${count} Produto${count !== 1 ? "s" : ""}` };
});

export function Categories() {
  return (
    <section className="py-32 px-6 bg-transparent relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Curadoria VoltStock</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-orange-400 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
              Hardware de <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/40">Elite</span>
            </h2>
            <p className="text-orange-400/60 max-w-lg text-lg">
              Explore a nossa seleção curada dos componentes mais potentes e esteticamente perfeitos do mercado.
            </p>
          </motion.div>
          <Link href="/produtos">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 text-orange-400 font-bold hover:bg-orange-500 hover:text-white transition-all duration-500 group cursor-pointer"
            >
              Ver Catálogo Completo
              <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {categories.map((cat, i) => (
            <Link key={cat.name} href={`/produtos?categoria=${encodeURIComponent(cat.name)}`}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -12 }}
              className="group cursor-pointer h-[320px] relative rounded-[2.5rem] overflow-hidden border border-accent/5 hover:border-orange-500/30 transition-all duration-500 shadow-2xl"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-125 transition-all duration-1000 ease-out opacity-30 group-hover:opacity-60" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                <div className="mb-6 p-4 w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 backdrop-blur-md flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500/50 transition-all duration-500 shadow-xl">
                  <cat.icon size={28} />
                </div>
                
                <h3 className="text-xl font-black text-orange-400 mb-2 group-hover:translate-x-1 transition-transform duration-500" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {cat.name}
                </h3>
                
                <div className="flex items-center justify-between overflow-hidden">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400/40 group-hover:text-orange-400 transition-colors">
                    {cat.count}
                  </p>
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="text-orange-400"
                  >
                    <Plus size={16} />
                  </motion.div>
                </div>
              </div>

              {/* Animated Border/Glow */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10 transition-all duration-500 pointer-events-none" />
              <div className="absolute -inset-[100%] group-hover:animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(249,115,22,0.1)_360deg)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </motion.div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
