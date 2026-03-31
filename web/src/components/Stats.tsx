"use client";

import { useEffect, useRef } from "react";
import { Users, Truck, ShieldCheck, Clock } from "lucide-react";
import GlassSurface from "@/components/reactbits/GlassSurface";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StatConfig {
  icon: React.ElementType;
  label: string;
  value: string;
  numericTarget: number | null;
  suffix: string;
  color: string;
}

const stats: StatConfig[] = [
  {
    icon: Users,
    label: "Clientes Satisfeitos",
    value: "15K+",
    numericTarget: 15,
    suffix: "K+",
    color: "text-orange-400",
  },
  {
    icon: Truck,
    label: "Entregas em 24h",
    value: "98%",
    numericTarget: 98,
    suffix: "%",
    color: "text-orange-400",
  },
  {
    icon: ShieldCheck,
    label: "Anos de Garantia",
    value: "2-3",
    numericTarget: null,
    suffix: "",
    color: "text-orange-400",
  },
  {
    icon: Clock,
    label: "Suporte Especializado",
    value: "24/7",
    numericTarget: null,
    suffix: "",
    color: "text-orange-400",
  },
];

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const valueRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Stagger card entrance ────────────────────────────────────
      gsap.from(cardRefs.current.filter(Boolean), {
        opacity: 0,
        y: 40,
        scale: 0.96,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // ── Numeric counter per stat ─────────────────────────────────
      stats.forEach((stat, i) => {
        if (stat.numericTarget === null) return;
        const el = valueRefs.current[i];
        if (!el) return;

        const obj = { val: 0 };

        gsap.to(obj, {
          val: stat.numericTarget,
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          onUpdate() {
            el.textContent = Math.round(obj.val) + stat.suffix;
          },
          onComplete() {
            // Ensure final value is exact
            el.textContent = stat.value;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="group relative"
            >
              <div className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 text-center border border-white/5 bg-white/[0.02] group-hover:bg-white/[0.05] transition-all duration-500 h-full">
                <div className="absolute inset-0 z-0">
                  <GlassSurface
                    borderRadius={32}
                    borderWidth={0}
                    blur={30}
                    opacity={0.05}
                    className="w-full h-full"
                  />
                </div>

                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} mx-auto mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <stat.icon size={28} />
                  </div>
                  <h3
                    ref={(el) => { valueRefs.current[i] = el; }}
                    className="text-3xl md:text-5xl font-extrabold text-orange-400 mb-3 tracking-tight tabular-nums"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {stat.value}
                  </h3>
                  <p className="text-sm font-semibold text-orange-400/30 uppercase tracking-[0.1em]">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
