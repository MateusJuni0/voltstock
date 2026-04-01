"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  CreditCard,
  Headphones,
  Zap,
  Star,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "@/hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

const trustItems = [
  { icon: Truck, label: "Envio 24h" },
  { icon: ShieldCheck, label: "Garantia 2-3 Anos" },
  { icon: CreditCard, label: "MBWay & Stripe" },
  { icon: Headphones, label: "Suporte PT" },
];

// ── Magnetic CTA Wrapper ─────────────────────────────────────────
function MagneticButton({
  children,
  className,
  href,
  strength = 5,
  radius = 150,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
  strength?: number;
  radius?: number;
}) {
  const magnetRef = useMagnetic({ strength, radius, hoverScale: 1.06, preset: "snappy" });

  return (
    <Link href={href}>
      <div
        ref={magnetRef as React.RefObject<HTMLDivElement>}
        data-magnetic
        className={className}
        style={{ willChange: "transform" }}
      >
        {children}
      </div>
    </Link>
  );
}

// ── Spring Trust Badge ───────────────────────────────────────────
function TrustBadge({
  icon: Icon,
  label,
  index,
}: {
  icon: typeof Truck;
  label: string;
  index: number;
}) {
  const magnetRef = useMagnetic({
    strength: 10,
    radius: 80,
    hoverScale: 1.08,
    preset: "stiff",
  });

  return (
    <div
      ref={magnetRef as React.RefObject<HTMLDivElement>}
      data-magnetic
      className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:border-orange-500/20 hover:bg-orange-500/[0.05] transition-colors duration-300"
      style={{ willChange: "transform" }}
    >
      <Icon size={16} className="text-orange-400/70" />
      <span className="text-xs font-bold text-orange-400/50 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Entrance timeline
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(headingRef.current, {
        opacity: 0,
        y: 80,
        scale: 0.95,
        duration: 1.2,
        ease: "power4.out",
      })
        .from(
          subtitleRef.current,
          { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" },
          "-=0.7"
        )
        .from(
          ctasRef.current ? Array.from(ctasRef.current.children) : [],
          {
            opacity: 0,
            y: 30,
            stagger: 0.12,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          trustRef.current ? Array.from(trustRef.current.children) : [],
          {
            opacity: 0,
            y: 20,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3"
        );

      // ── Floating orbs slow animation
      if (orbsRef.current) {
        const orbs = orbsRef.current.querySelectorAll(".hero-orb");
        orbs.forEach((orb, i) => {
          gsap.to(orb, {
            y: `random(-30, 30)`,
            x: `random(-20, 20)`,
            duration: `random(3, 5)`,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.3,
          });
        });
      }

      // ── Parallax on scroll
      gsap.to(contentRef.current, {
        yPercent: -8,
        opacity: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "80% top",
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Animated background orbs ── */}
      <div
        ref={orbsRef}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div className="hero-orb absolute top-[15%] left-[10%] w-[400px] h-[400px] rounded-full bg-orange-500/[0.04] blur-[100px]" />
        <div className="hero-orb absolute top-[60%] right-[5%] w-[350px] h-[350px] rounded-full bg-blue-500/[0.03] blur-[120px]" />
        <div className="hero-orb absolute bottom-[10%] left-[30%] w-[300px] h-[300px] rounded-full bg-orange-600/[0.03] blur-[80px]" />
        <div className="hero-orb absolute top-[30%] right-[25%] w-[200px] h-[200px] rounded-full bg-amber-500/[0.04] blur-[90px]" />
      </div>

      {/* ── Grid pattern overlay ── */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A]/40 via-transparent to-[#0A0E1A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(249,115,22,0.06)_0%,transparent_70%)]" />
      </div>

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-orange-400/30"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-[1280px] mx-auto px-6 w-full pt-28 pb-16"
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-md">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Zap size={14} className="text-orange-400" />
              </motion.div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-orange-400">
                Envio gratis acima de 50EUR
              </span>
              <div className="w-px h-3 bg-orange-500/30" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-orange-400/60">
                MBWay aceite
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="mb-8"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <span className="block text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.95] font-black tracking-tight text-orange-400 drop-shadow-[0_0_40px_rgba(249,115,22,0.15)]">
              O Hardware Que
            </span>
            <span className="block text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.95] font-black tracking-tight mt-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-orange-400 to-red-500 drop-shadow-[0_0_60px_rgba(249,115,22,0.3)]">
                Define Campeoes.
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-orange-200/60 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Tecnologia premium com entrega em 24-48h para todo o continente.
            Pagamento seguro via MBWay, Multibanco e cartao. Fatura com NIF
            emitida automaticamente.
          </p>

          {/* Magnetic CTAs */}
          <div
            ref={ctasRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <MagneticButton
              href="/produtos"
              strength={4}
              radius={180}
              className="group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-full overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.35)] cursor-pointer"
            >
              <span className="relative z-10">Explorar Catalogo</span>
              <ArrowRight
                size={20}
                className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </MagneticButton>

            <MagneticButton
              href="/produtos"
              strength={5}
              radius={140}
              className="flex items-center gap-2 px-8 py-5 rounded-full border border-orange-500/20 text-orange-400 font-semibold hover:bg-orange-500/10 hover:border-orange-500/40 transition-all duration-300 cursor-pointer backdrop-blur-md"
            >
              <Star size={16} className="text-amber-400" />
              Ver Promocoes
            </MagneticButton>
          </div>

          {/* Magnetic Trust badges */}
          <div
            ref={trustRef}
            className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
          >
            {trustItems.map((item, i) => (
              <TrustBadge
                key={item.label}
                icon={item.icon}
                label={item.label}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-6 h-10 rounded-full border-2 border-orange-400/20 flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], y: [0, 6, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1 h-2 rounded-full bg-orange-400/60"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
