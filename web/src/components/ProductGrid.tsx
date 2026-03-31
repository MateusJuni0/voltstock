import { motion } from "framer-motion";
import { Plus, Heart } from "lucide-react";
import Image from "next/image";

const products = [
  { id: 1, name: "NVIDIA RTX 5090 Suprim X", category: "Gráficas", price: "2,199.00 '", img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Intel Core i9-14900K", category: "Processadores", price: "649.90 '", img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Monitor Alienware 34\" QD-OLED", category: "Monitores", price: "1,099.00 '", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Teclado Custom VoltStock Pro", category: "Periféricos", price: "189.90 '", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800" }
];

export default function ProductGrid() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-orange-300 mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>Novidades Premium</h2>
          <p className="text-orange-300/50">O hardware mais procurado do momento.</p>
        </div>
        <button className="text-sm font-semibold text-orange-400 hover:text-orange-400/80 transition-colors hidden md:block">
          Ver todos os produtos →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative flex flex-col rounded-2xl bg-transparent border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-transparent">
              <img
                src={product.img}
                alt={product.name}
                className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <button className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-gray-300 hover:text-red-500 hover:bg-black/60 transition-all z-10">
                <Heart size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 justify-between bg-white/[0.02]">
              <div>
                <p className="text-xs font-semibold text-orange-400 mb-1">{product.category}</p>
                <h3 className="text-sm font-medium text-orange-300 mb-4 line-clamp-2 leading-snug" style={{ fontFamily: 'var(--font-outfit)' }}>{product.name}</h3>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-lg font-bold text-orange-300">{product.price}</span>
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-orange-400/50 hover:bg-accent hover:text-black transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}