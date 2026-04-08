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
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Painel", href: "/conta", icon: LayoutDashboard },
  { label: "Encomendas", href: "/conta/encomendas", icon: Package },
  { label: "Devoluções", href: "/conta/devolucoes", icon: RotateCcw },
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
  const { signOut, user, profile, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/?auth=login&redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-orange-400/10 border-b-orange-400/40 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        </div>
      </div>
    );
  }

  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Utilizador";
  const email = user?.email ?? "";
  const initials = getInitials(displayName, email);

  return (
    <div className="min-h-screen pt-[120px] pb-20 px-4 md:px-6">
      <div className="max-w-[1320px] mx-auto flex flex-col lg:flex-row gap-8">
        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden flex items-center gap-3 glass-card-immersive rounded-xl px-4 py-3 self-start"
          aria-label="Menu da conta"
        >
          {mobileOpen ? <X size={18} className="text-orange-400" /> : <Menu size={18} className="text-accent/60" />}
          <span className="text-sm font-medium text-accent/80">Menu da Conta</span>
        </button>

        {/* Sidebar — mobile collapsible */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.aside
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
              className="lg:!hidden overflow-hidden"
            >
              <SidebarContent
                pathname={pathname}
                onSignOut={signOut}
                onNavigate={() => setMobileOpen(false)}
                displayName={displayName}
                email={email}
                initials={initials}
                avatarUrl={profile?.avatar_url}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sidebar — desktop sticky */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="sticky top-[120px]">
            <SidebarContent
              pathname={pathname}
              onSignOut={signOut}
              displayName={displayName}
              email={email}
              initials={initials}
              avatarUrl={profile?.avatar_url}
            />
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
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
  displayName: string;
  email: string;
  initials: string;
  avatarUrl?: string | null;
}

function SidebarContent({ pathname, onSignOut, onNavigate, displayName, email, initials, avatarUrl }: SidebarContentProps) {
  return (
    <nav className="glass-card-immersive rounded-2xl overflow-hidden">
      {/* User Profile Section */}
      <div className="p-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3.5">
          {/* Avatar with animated ring */}
          <div className="relative">
            <div className="absolute -inset-[2px] rounded-full avatar-ring opacity-60" />
            <div className="relative w-11 h-11 rounded-full overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-500/30 to-amber-600/15 flex items-center justify-center text-sm font-bold text-orange-400">
                  {initials}
                </div>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-accent truncate">{displayName}</p>
            <p className="text-[11px] text-accent/35 truncate">{email}</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
            <Sparkles size={10} className="text-orange-400" />
            <span className="text-[10px] font-semibold text-orange-400/80">PRO</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group",
                active
                  ? "bg-orange-500/[0.12] text-orange-400"
                  : "text-accent/55 hover:text-accent/90 hover:bg-white/[0.04]"
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="nav-active-indicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0",
                active
                  ? "bg-orange-500/20 shadow-sm shadow-orange-500/10"
                  : "bg-white/[0.04] group-hover:bg-white/[0.07]"
              )}>
                <Icon size={16} className={active ? "text-orange-400" : "text-accent/40 group-hover:text-accent/60"} />
              </div>
              <span className="flex-1">{item.label}</span>
              {active && (
                <ChevronRight size={14} className="text-orange-400/50" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Sign out */}
      <div className="p-3 pt-0">
        <div className="border-t border-white/[0.06] pt-3">
          <button
            onClick={() => {
              onNavigate?.();
              onSignOut();
            }}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-300 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-red-500/10 flex items-center justify-center transition-all duration-300">
              <LogOut size={16} className="text-red-400/40 group-hover:text-red-400" />
            </div>
            Terminar Sessão
          </button>
        </div>
      </div>
    </nav>
  );
}

function getInitials(name: string, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return email ? email.slice(0, 2).toUpperCase() : "U";
}
