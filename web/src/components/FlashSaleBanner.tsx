"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Zap, Clock, ArrowRight, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(endTime: Date): TimeLeft {
  const now = new Date().getTime();
  const diff = endTime.getTime() - now;

  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function CountdownDigit({ value, label }: { value: number; label: string }) {
  const prevValue = useRef(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      setFlipping(true);
      const timer = setTimeout(() => setFlipping(false), 500);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-black/40 border border-orange-500/30 flex items-center justify-center backdrop-blur-md shadow-lg shadow-orange-500/10 overflow-hidden"
        style={{ perspective: "200px" }}
      >
        <span
          className={cn(
            "text-2xl sm:text-3xl font-black text-white tabular-nums",
            flipping && "digit-flip-enter"
          )}
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {String(value).padStart(2, "0")}
        </span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-orange-500/10" />
        {/* Shimmer on flip */}
        {flipping && (
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent animate-pulse pointer-events-none" />
        )}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-orange-300/60 mt-1.5">
        {label}
      </span>
    </div>
  );
}

export function FlashSaleBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Flash sale ends at midnight tonight
  const [endTime] = useState(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end;
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(endTime));

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  const isExpired = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <section ref={sectionRef} className="py-8 px-6 bg-transparent relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto relative z-10">
        <div
          ref={contentRef}
          className="relative rounded-2xl overflow-hidden border border-orange-500/30 bg-gradient-to-r from-orange-950/40 via-red-950/30 to-orange-950/40 backdrop-blur-xl"
        >
          {/* Animated fire particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 left-1/4 w-32 h-32 bg-orange-500/20 rounded-full blur-[60px] animate-pulse" />
            <div className="absolute -top-10 right-1/3 w-24 h-24 bg-red-500/15 rounded-full blur-[50px] animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute -bottom-10 left-1/2 w-40 h-20 bg-amber-500/10 rounded-full blur-[40px] animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
            {/* Left: Label + Title */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="hidden sm:flex w-14 h-14 rounded-xl bg-orange-500 items-center justify-center text-white shadow-lg shadow-orange-500/40 shrink-0"
              >
                <Flame size={28} />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={14} className="text-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                    Flash Sale
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                  {isExpired ? "A próxima sale está a chegar!" : "Até 40% de desconto"}
                </h3>
                <p className="text-xs text-orange-300/60 mt-1 font-medium">
                  Em componentes selecionados. Stock limitado.
                </p>
              </div>
            </div>

            {/* Center: Countdown */}
            {!isExpired && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock size={16} className="text-orange-400/60 hidden sm:block" />
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CountdownDigit value={timeLeft.hours} label="Horas" />
                  <span className="text-xl font-bold text-orange-500/40 mt-[-12px]">:</span>
                  <CountdownDigit value={timeLeft.minutes} label="Min" />
                  <span className="text-xl font-bold text-orange-500/40 mt-[-12px]">:</span>
                  <CountdownDigit value={timeLeft.seconds} label="Seg" />
                </div>
              </div>
            )}

            {/* Right: CTA */}
            <Link href="/produtos" className="shrink-0">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(249,115,22,0.5)" }}
                whileTap={{ scale: 0.95 }}
                data-magnetic
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/30 relative"
              >
                Ver Ofertas
                <ArrowRight size={16} />
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
