"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Heart,
  MapPin,
  RotateCcw,
  ArrowRight,
  ShoppingBag,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  gradient: string;
  delay?: number;
}

function StatCard({ label, value, icon: Icon, href, gradient, delay = 0 }: StatCardProps) {
  return (
    <Link href={href} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] as const }}
        className="relative glass-card-immersive rounded-2xl p-5 overflow-hidden pulse-glow-hover"
      >
        {/* Animated floating halo */}
        <div className="stat-halo top-2 right-2" style={{ animationDelay: `${delay * 2}s` }} />

        {/* Gradient accent line at top */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${gradient} opacity-60`} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl ${gradient} p-[1px]`}>
              <div className="w-full h-full rounded-[11px] bg-background/80 flex items-center justify-center">
                <Icon size={18} className="text-orange-400" />
              </div>
            </div>
            <ArrowRight
              size={14}
              className="text-accent/15 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300 mt-1"
            />
          </div>
          <p className="text-3xl font-bold text-accent mb-1 tabular-nums">{value}</p>
          <p className="text-xs text-accent/40 font-medium">{label}</p>
        </div>
      </motion.div>
    </Link>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function ContaDashboardPage() {
  const { user, profile, loading } = useAuth();
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, addresses: 0, returns: 0 });

  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      const supabase = createClient();
      const userId = user!.id;

      const [ordersRes, wishlistRes, addressesRes, returnsRes] = await Promise.allSettled([
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("wishlists").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("addresses").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("return_requests").select("id", { count: "exact", head: true }).eq("user_id", userId),
      ]);

      setStats({
        orders: ordersRes.status === "fulfilled" ? (ordersRes.value.count ?? 0) : 0,
        wishlist: wishlistRes.status === "fulfilled" ? (wishlistRes.value.count ?? 0) : 0,
        addresses: addressesRes.status === "fulfilled" ? (addressesRes.value.count ?? 0) : 0,
        returns: returnsRes.status === "fulfilled" ? (returnsRes.value.count ?? 0) : 0,
      });
    }

    fetchStats();
  }, [user]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Utilizador";

  const greeting = getGreeting();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={14} className="text-accent/30" />
          <span className="text-xs text-accent/30 font-medium uppercase tracking-wider">{greeting}</span>
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          <span className="text-accent">Olá, </span>
          <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
            {displayName}
          </span>
        </h1>
        <p className="text-sm text-accent/40 max-w-lg">
          Gerencie as suas encomendas, moradas e preferências a partir do seu painel pessoal.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
        <StatCard
          label="Total de encomendas"
          value={stats.orders}
          icon={Package}
          href="/conta/encomendas"
          gradient="bg-gradient-to-r from-orange-500 to-amber-500"
          delay={0.1}
        />
        <StatCard
          label="Devoluções"
          value={stats.returns}
          icon={RotateCcw}
          href="/conta/devolucoes"
          gradient="bg-gradient-to-r from-purple-500 to-pink-500"
          delay={0.15}
        />
        <StatCard
          label="Na wishlist"
          value={stats.wishlist}
          icon={Heart}
          href="/conta/wishlist"
          gradient="bg-gradient-to-r from-rose-500 to-orange-500"
          delay={0.2}
        />
        <StatCard
          label="Moradas guardadas"
          value={stats.addresses}
          icon={MapPin}
          href="/conta/moradas"
          gradient="bg-gradient-to-r from-cyan-500 to-blue-500"
          delay={0.25}
        />
      </div>

      {/* Quick Access */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} className="text-accent/30" />
          <h2 className="text-sm font-semibold text-accent/50 uppercase tracking-wider">Acesso rápido</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          {[
            { label: "Encomendas", href: "/conta/encomendas", icon: Package },
            { label: "Devoluções", href: "/conta/devolucoes", icon: RotateCcw },
            { label: "Wishlist", href: "/conta/wishlist", icon: Heart },
            { label: "Moradas", href: "/conta/moradas", icon: MapPin },
            { label: "Explorar Loja", href: "/produtos", icon: ShoppingBag },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl glass-card-immersive text-sm text-accent/55 hover:text-orange-400 transition-all duration-300 group"
            >
              <link.icon size={15} className="text-accent/30 group-hover:text-orange-400 transition-colors" />
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Orders — empty state */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <Package size={14} className="text-accent/30" />
          <h2 className="text-sm font-semibold text-accent/50 uppercase tracking-wider">Encomendas recentes</h2>
        </div>
        <div className="glass-card-immersive rounded-2xl p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 blur-[80px]" />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/15 to-amber-500/5 border border-orange-500/10 flex items-center justify-center mx-auto mb-5">
              <Package size={28} className="text-orange-400/40" />
            </div>
            <h3 className="text-lg font-semibold text-accent/60 mb-2">Ainda não fez nenhuma encomenda</h3>
            <p className="text-sm text-accent/30 mb-6 max-w-sm mx-auto">
              Explore a nossa loja e descubra produtos incríveis.
            </p>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02]"
            >
              <ShoppingBag size={16} />
              Explorar Produtos
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      <div>
        <div className="h-4 w-20 skeleton-shimmer rounded mb-3" />
        <div className="h-10 w-72 skeleton-shimmer rounded-lg mb-2" />
        <div className="h-5 w-96 skeleton-shimmer rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card-immersive rounded-2xl p-5 h-[130px] skeleton-shimmer" />
        ))}
      </div>
      <div className="glass-card-immersive rounded-2xl p-12 h-52 skeleton-shimmer" />
    </div>
  );
}
