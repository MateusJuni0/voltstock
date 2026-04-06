"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  User,
  RotateCcw,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Painel", href: "/conta", icon: LayoutDashboard },
  { label: "Encomendas", href: "/conta/encomendas", icon: Package },
  { label: "Devolucoes", href: "/conta/devolucoes", icon: RotateCcw },
  { label: "Moradas", href: "/conta/moradas", icon: MapPin },
  { label: "Lista de Desejos", href: "/conta/wishlist", icon: Heart },
  { label: "Perfil", href: "/conta/perfil", icon: User },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/conta") return pathname === "/conta";
  return pathname.startsWith(href);
}

export default function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/?auth=login&redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[120px] pb-20 px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">
        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden flex items-center gap-2 text-accent/70 hover:text-accent transition-colors mb-2 self-start"
          aria-label="Menu da conta"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="text-sm font-medium">Menu da Conta</span>
        </button>

        {/* Sidebar — desktop always visible, mobile collapsible */}
        <AnimatePresence>
          {(mobileOpen || typeof window === "undefined") && (
            <motion.aside
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:!hidden overflow-hidden"
            >
              <SidebarContent
                pathname={pathname}
                onSignOut={signOut}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-[120px]">
            <SidebarContent pathname={pathname} onSignOut={signOut} />
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  pathname: string;
  onSignOut: () => void;
  onNavigate?: () => void;
}

function SidebarContent({ pathname, onSignOut, onNavigate }: SidebarContentProps) {
  return (
    <nav className="glass-sidebar rounded-2xl p-5 flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              active
                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-sm shadow-orange-500/10"
                : "text-accent/60 hover:text-accent hover:bg-white/5 border border-transparent"
            )}
          >
            <Icon size={18} className={active ? "text-orange-400" : "text-accent/40"} />
            {item.label}
          </Link>
        );
      })}

      {/* Divider */}
      <div className="my-2 border-t border-white/10" />

      <button
        onClick={() => {
          onNavigate?.();
          onSignOut();
        }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all duration-200"
      >
        <LogOut size={18} />
        Sair
      </button>
    </nav>
  );
}
