"use client";

import { motion } from "framer-motion";
import { Package, Heart, MapPin, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
}

function StatCard({ label, value, icon: Icon, href }: StatCardProps) {
  return (
    <Link href={href} className="group">
      <div className="glass-sidebar rounded-2xl p-6 transition-all duration-300 hover:border-orange-500/30 hover:shadow-orange-500/5 hover:shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
            <Icon size={20} className="text-orange-400" />
          </div>
          <ArrowRight
            size={16}
            className="text-accent/20 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
        <p className="text-2xl font-bold text-accent mb-1">{value}</p>
        <p className="text-sm text-accent/50">{label}</p>
      </div>
    </Link>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ContaDashboardPage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <DashboardSkeleton />;
  }

  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Utilizador";

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      {/* Welcome */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold text-accent mb-2"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Ola, {displayName}!
        </h1>
        <p className="text-accent/50">
          Bem-vindo ao seu painel. Gerencie as suas encomendas, moradas e preferencias.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
      >
        <StatCard label="Total de encomendas" value={0} icon={Package} href="/conta/encomendas" />
        <StatCard label="Produtos na wishlist" value={0} icon={Heart} href="/conta/wishlist" />
        <StatCard label="Moradas guardadas" value={0} icon={MapPin} href="/conta/moradas" />
      </motion.div>

      {/* Quick links */}
      <motion.div variants={itemVariants} className="mb-10">
        <h2 className="text-lg font-semibold text-accent/80 mb-4">Acesso rapido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Ver Encomendas", href: "/conta/encomendas", icon: Package },
            { label: "Lista de Desejos", href: "/conta/wishlist", icon: Heart },
            { label: "As Minhas Moradas", href: "/conta/moradas", icon: MapPin },
            { label: "Explorar Loja", href: "/produtos", icon: ShoppingBag },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-4 py-3 rounded-xl glass text-sm text-accent/70 hover:text-orange-400 hover:border-orange-500/20 transition-all duration-200"
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent orders — empty state */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-accent/80 mb-4">Encomendas recentes</h2>
        <div className="glass-sidebar rounded-2xl p-10 text-center">
          <Package size={40} className="mx-auto text-accent/20 mb-4" />
          <p className="text-accent/50 mb-4">Ainda nao fez nenhuma encomenda</p>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/80 hover:bg-orange-500 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-orange-500/20"
          >
            <ShoppingBag size={16} />
            Explorar Produtos
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div>
        <div className="h-9 w-64 bg-accent/10 rounded-lg mb-2" />
        <div className="h-5 w-96 bg-accent/5 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-sidebar rounded-2xl p-6 h-32" />
        ))}
      </div>
      <div className="glass-sidebar rounded-2xl p-10 h-48" />
    </div>
  );
}
