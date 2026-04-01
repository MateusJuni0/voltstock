"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  createSpring,
  stepSpring,
  isAtRest,
  snapToRest,
  registerRender,
  kickScheduler,
  type Spring,
  type SpringPresetName,
} from "./useSpring";

// ── Magnetic Cursor Effect ───────────────────────────────────────
// Elements "pull" toward cursor when mouse is nearby
// GPU-only: uses transform translate3d

interface MagneticOptions {
  /** How strongly the element follows the cursor (lower = stronger). Default 6 */
  strength?: number;
  /** Activation radius in px. Default 120 */
  radius?: number;
  /** Spring preset for return. Default "snappy" */
  preset?: SpringPresetName;
  /** Scale when hovering. Default 1.05 */
  hoverScale?: number;
}

export function useMagnetic(options: MagneticOptions = {}) {
  const {
    strength = 6,
    radius = 120,
    preset = "snappy",
    hoverScale = 1.05,
  } = options;

  const elRef = useRef<HTMLElement | null>(null);
  const springX = useRef<Spring>(createSpring(0, preset));
  const springY = useRef<Spring>(createSpring(0, preset));
  const springScale = useRef<Spring>(createSpring(1, preset));
  const isHovered = useRef(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = elRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        springX.current.dest = dx / strength;
        springY.current.dest = dy / strength;
        springScale.current.dest = hoverScale;
        if (!isHovered.current) {
          isHovered.current = true;
        }
      } else {
        springX.current.dest = 0;
        springY.current.dest = 0;
        springScale.current.dest = 1;
        isHovered.current = false;
      }
      kickScheduler();
    },
    [strength, radius, hoverScale]
  );

  const handleMouseLeave = useCallback(() => {
    springX.current.dest = 0;
    springY.current.dest = 0;
    springScale.current.dest = 1;
    isHovered.current = false;
    kickScheduler();
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const el = elRef.current;
    if (el) {
      el.addEventListener("mouseleave", handleMouseLeave);
    }

    const unregister = registerRender(() => {
      const sx = springX.current;
      const sy = springY.current;
      const ss = springScale.current;

      for (let i = 0; i < 4; i++) {
        stepSpring(sx, 0.004);
        stepSpring(sy, 0.004);
        stepSpring(ss, 0.004);
      }

      if (elRef.current) {
        elRef.current.style.transform = `translate3d(${sx.pos}px, ${sy.pos}px, 0) scale(${ss.pos})`;
      }

      const allRest = isAtRest(sx) && isAtRest(sy) && isAtRest(ss);
      if (allRest) {
        snapToRest(sx);
        snapToRest(sy);
        snapToRest(ss);
        return false;
      }
      return true;
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (el) {
        el.removeEventListener("mouseleave", handleMouseLeave);
      }
      unregister();
    };
  }, [handleMouseMove, handleMouseLeave]);

  return elRef;
}
