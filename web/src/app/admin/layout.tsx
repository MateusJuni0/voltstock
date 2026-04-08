"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ShieldAlert,
  Loader2,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/encomendas",
    label: "Encomendas",
    icon: ShoppingBag,
    exact: false,
  },
  {
    href: "/admin/produtos",
    label: "Produtos",
    icon: Package,
    exact: false,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdminRole() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setIsAdmin(profile?.role === "admin");
      } catch {
        // Supabase offline or profiles table missing — deny access in production
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminRole();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-[#A5D6E1]/60 text-sm">
            A verificar permissoes...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-sidebar rounded-2xl p-12 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white mb-3">
            Acesso Negado
          </h1>
          <p className="text-[#A5D6E1]/60 mb-8">
            Nao tens permissoes de administrador para aceder a esta area.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Voltar a Loja
          </Link>
        </motion.div>
      </div>
    );
  }

  function isActive(href: string, exact: boolean): boolean {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex">
      {/* Sidebar */}
      <aside className="w-64 glass-sidebar border-r border-white/5 flex flex-col min-h-screen sticky top-0">
        {/* Logo area */}
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-white text-lg leading-tight">
                VoltStock
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-orange-400 font-semibold">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                    : "text-[#A5D6E1]/60 hover:text-[#A5D6E1] hover:bg-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-orange-400" : ""}`} />
                {item.label}
                {active && (
                  <motion.div
                    layoutId="admin-nav-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#A5D6E1]/40 hover:text-[#A5D6E1]/70 hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Voltar a Loja
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
