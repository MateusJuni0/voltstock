"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User as UserIcon,
  Package,
  Heart,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import PillNav from "@/components/reactbits/PillNav";
import GlassSurface from "@/components/reactbits/GlassSurface";
import { CartSidebar } from "@/components/CartSidebar";
import { AuthModal } from "@/components/AuthModal";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Componentes", href: "/produtos?categoria=Componentes" },
  { label: "Periféricos", href: "/produtos?categoria=Periféricos" },
  { label: "Monitores", href: "/produtos?categoria=Monitores" },
  { label: "Setups", href: "/produtos?categoria=Setups" },
];

function getUserInitials(
  name: string | null | undefined,
  email: string | null | undefined
): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U";
}

interface UserDropdownProps {
  initials: string;
  onSignOut: () => void;
  onClose: () => void;
}

function UserDropdown({ initials, onSignOut, onClose }: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 group"
        aria-label="Menu do utilizador"
      >
        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold tracking-tight shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
          {initials}
        </div>
        <ChevronDown
          size={14}
          className={cn(
            "text-white/50 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden border border-white/[0.1] bg-[#0f1320]/90 backdrop-blur-2xl shadow-2xl shadow-black/50"
          >
            <div className="py-1.5">
              <Link
                href="/conta"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <UserIcon size={16} className="text-orange-400" />
                A Minha Conta
              </Link>
              <Link
                href="/conta/encomendas"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <Package size={16} className="text-orange-400" />
                Encomendas
              </Link>
              <Link
                href="/conta/wishlist"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <Heart size={16} className="text-orange-400" />
                Lista de Desejos
              </Link>

              <div className="my-1.5 mx-3 h-px bg-white/[0.08]" />

              <button
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-white/[0.06] transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const items = useCart((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-open auth modal when ?login=true is in the URL (set by middleware redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "true") {
      setIsAuthOpen(true);
      // Clean up the URL param without a page reload
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, []);

  const initials = getUserInitials(
    profile?.full_name ?? user?.user_metadata?.full_name,
    user?.email
  );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 md:top-4 left-0 right-0 z-[1001] transition-all duration-500 max-w-[1280px] mx-auto px-0 md:px-6 h-[64px] md:h-[72px] bg-[#0A0E1A] md:bg-transparent"
        )}
      >
        {/* Mobile: solid opaque background — no glass effect */}
        <div className="absolute inset-0 bg-[#0A0E1A] md:hidden z-0" />
        {/* Desktop: glass effect */}
        <div className="absolute inset-0 px-4 md:px-6 z-0 hidden md:block">
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={scrolled ? 999 : 24}
            borderWidth={1}
            opacity={1}
            backgroundOpacity={scrolled ? 0.15 : 0.05}
            blur={30}
            brightness={scrolled ? 1.4 : 1.2}
            className="transition-all duration-500 border border-orange-500/10 shadow-lg shadow-black/20"
          />
        </div>
        <div className="relative z-10 w-full h-full flex items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center mix-blend-screen overflow-hidden">
              <video
                src="/logo/voltstock.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-[120%] h-[120%] object-contain"
              />
            </div>
            <span
              className="text-xl font-bold tracking-tight hidden lg:block text-orange-400"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              VoltStock
            </span>
          </Link>

          {/* Desktop Nav via PillNav */}
          <div className="hidden md:flex flex-1 justify-center max-w-lg mx-auto">
            <div className="translate-y-[8px]">
              <PillNav
                items={navLinks}
                baseColor="rgba(249, 115, 22, 0.05)"
                pillColor="rgba(249, 115, 22, 0.15)"
                hoveredPillTextColor="#FB923C"
                pillTextColor="rgba(251, 146, 60, 0.6)"
                className="justify-center mx-auto"
                logo=""
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Pesquisar"
              data-magnetic
              onClick={() => {
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="p-2.5 rounded-xl hover:bg-orange-500/10 transition-colors text-orange-400/80 hover:text-orange-400 relative"
            >
              <Search size={18} />
            </button>
            <button
              aria-label="Carrinho"
              data-magnetic
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-xl hover:bg-orange-500/10 transition-colors text-orange-400/80 hover:text-orange-400"
            >
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Auth: Login button or User dropdown (desktop) */}
            {!loading && (
              <div className="hidden md:flex items-center">
                {user ? (
                  <UserDropdown
                    initials={initials}
                    onSignOut={signOut}
                    onClose={() => {}}
                  />
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAuthOpen(true)}
                    data-magnetic
                    className="ml-1 px-4 py-2 rounded-xl text-sm font-medium border border-orange-500/50 text-orange-300 hover:bg-orange-500 hover:text-white transition-all duration-200 relative"
                  >
                    Entrar
                  </motion.button>
                )}
              </div>
            )}

            <button
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-orange-500/10 transition-colors text-orange-400/80 hover:text-orange-400"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[1000] bg-[#0A0E1A]/92 backdrop-blur-2xl pt-28 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-semibold text-orange-400/80 hover:text-orange-400 transition-colors"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile auth section */}
              {!loading && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.08 }}
                  className="pt-4 border-t border-white/[0.08]"
                >
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/20">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {profile?.full_name ??
                              user.user_metadata?.full_name ??
                              "Utilizador"}
                          </p>
                          <p className="text-xs text-white/40">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/conta"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 text-lg text-white/70 hover:text-white transition-colors"
                      >
                        <UserIcon size={18} className="text-orange-400" />
                        A Minha Conta
                      </Link>
                      <Link
                        href="/conta/encomendas"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 text-lg text-white/70 hover:text-white transition-colors"
                      >
                        <Package size={18} className="text-orange-400" />
                        Encomendas
                      </Link>
                      <Link
                        href="/conta/wishlist"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 text-lg text-white/70 hover:text-white transition-colors"
                      >
                        <Heart size={18} className="text-orange-400" />
                        Lista de Desejos
                      </Link>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-3 text-lg text-red-400/80 hover:text-red-400 transition-colors mt-2"
                      >
                        <LogOut size={18} />
                        Sair
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="w-full py-3 rounded-xl text-base font-medium border border-orange-500/50 text-orange-300 hover:bg-orange-500 hover:text-white transition-all duration-200"
                    >
                      Entrar
                    </button>
                  )}
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-0 left-0 right-0 z-[1101] p-4 pt-6"
            >
              <div className="max-w-xl mx-auto">
                <div className="flex items-center gap-3 bg-[#0D1221] border border-orange-500/20 rounded-2xl px-5 py-3 shadow-2xl shadow-black/50">
                  <Search size={20} className="text-orange-400/60 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Pesquisar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        setIsSearchOpen(false);
                        router.push(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchQuery("");
                      }
                      if (e.key === "Escape") {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }
                    }}
                    className="flex-1 bg-transparent text-white placeholder-orange-400/30 text-base outline-none"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="p-1.5 rounded-lg hover:bg-orange-500/10 text-orange-400/50 hover:text-orange-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}
