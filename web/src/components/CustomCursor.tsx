"use client";

import { useEffect, useRef } from "react";
import {
  createSpring,
  stepSpring,
  isAtRest,
  snapToRest,
  registerRender,
  kickScheduler,
  type Spring,
} from "@/hooks/useSpring";

// ── Premium Custom Cursor ────────────────────────────────────────
// Orange glow circle that follows mouse with spring physics
// Expands on interactive elements (links, buttons)
// GPU compositor only: translate3d + scale

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const isPointer = useRef(false);
  const isVisible = useRef(false);

  useEffect(() => {
    // Skip on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    const dotSpringX = createSpring(0, "stiff");
    const dotSpringY = createSpring(0, "stiff");
    const ringSpringX = createSpring(0, "gentle");
    const ringSpringY = createSpring(0, "gentle");
    const ringScale = createSpring(1, "snappy");

    const onMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      dotSpringX.dest = e.clientX;
      dotSpringY.dest = e.clientY;
      ringSpringX.dest = e.clientX;
      ringSpringY.dest = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        // Snap to position immediately on first move
        dotSpringX.pos = e.clientX;
        dotSpringY.pos = e.clientY;
        ringSpringX.pos = e.clientX;
        ringSpringY.pos = e.clientY;
      }

      // Check if hovering interactive element
      const target = e.target as HTMLElement;
      const interactive =
        target.closest("a, button, [role='button'], input, select, textarea, [data-magnetic]");
      const newIsPointer = interactive !== null;
      if (newIsPointer !== isPointer.current) {
        isPointer.current = newIsPointer;
        ringScale.dest = newIsPointer ? 1.8 : 1;
      }

      kickScheduler();
    };

    const onMouseLeave = () => {
      isVisible.current = false;
    };

    const onMouseEnter = () => {
      isVisible.current = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const unregister = registerRender(() => {
      for (let i = 0; i < 4; i++) {
        stepSpring(dotSpringX, 0.004);
        stepSpring(dotSpringY, 0.004);
        stepSpring(ringSpringX, 0.004);
        stepSpring(ringSpringY, 0.004);
        stepSpring(ringScale, 0.004);
      }

      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot) {
        dot.style.transform = `translate3d(${dotSpringX.pos - 4}px, ${dotSpringY.pos - 4}px, 0)`;
        dot.style.opacity = isVisible.current ? "1" : "0";
      }

      if (ring) {
        ring.style.transform = `translate3d(${ringSpringX.pos - 20}px, ${ringSpringY.pos - 20}px, 0) scale(${ringScale.pos})`;
        ring.style.opacity = isVisible.current ? "1" : "0";
      }

      const allRest =
        isAtRest(dotSpringX) &&
        isAtRest(dotSpringY) &&
        isAtRest(ringSpringX) &&
        isAtRest(ringSpringY) &&
        isAtRest(ringScale);

      if (allRest) {
        snapToRest(dotSpringX);
        snapToRest(dotSpringY);
        snapToRest(ringSpringX);
        snapToRest(ringSpringY);
        snapToRest(ringScale);
        return false;
      }
      return true;
    });

    // Hide default cursor globally
    document.documentElement.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      unregister();
      document.documentElement.style.cursor = "";
      style.remove();
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 rounded-full bg-orange-400 mix-blend-screen"
        style={{ opacity: 0, willChange: "transform" }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none w-10 h-10 rounded-full border border-orange-400/40 mix-blend-screen transition-[border-color] duration-200"
        style={{ opacity: 0, willChange: "transform" }}
      />
    </>
  );
}
