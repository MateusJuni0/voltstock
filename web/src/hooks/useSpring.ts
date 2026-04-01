"use client";

import { useRef, useCallback, useEffect } from "react";

// ── Spring Physics Core (Cheng Lou approach) ──────────────────────
// Zero dependencies, interruptible, physics-based animation

export interface Spring {
  pos: number;
  dest: number;
  v: number;
  k: number;
  b: number;
}

export interface SpringPreset {
  k: number;
  b: number;
}

export const SPRING_PRESETS = {
  snappy: { k: 290, b: 30 },
  noWobble: { k: 170, b: 26 },
  gentle: { k: 120, b: 14 },
  wobbly: { k: 180, b: 12 },
  stiff: { k: 210, b: 20 },
  magnetic: { k: 400, b: 40 },
} as const;

export type SpringPresetName = keyof typeof SPRING_PRESETS;

export function createSpring(
  pos: number,
  preset: SpringPresetName = "snappy"
): Spring {
  const { k, b } = SPRING_PRESETS[preset];
  return { pos, dest: pos, v: 0, k, b };
}

export function stepSpring(s: Spring, dt = 0.004): void {
  const Fspring = -s.k * (s.pos - s.dest);
  const Fdamper = -s.b * s.v;
  const a = Fspring + Fdamper;
  s.v += a * dt;
  s.pos += s.v * dt;
}

export function isAtRest(s: Spring, threshold = 0.01): boolean {
  return Math.abs(s.v) < threshold && Math.abs(s.dest - s.pos) < threshold;
}

export function snapToRest(s: Spring): void {
  s.pos = s.dest;
  s.v = 0;
}

// ── Game Loop Scheduler ──────────────────────────────────────────
// Self-stopping: zero CPU when all springs at rest

type RenderFn = (now: number) => boolean; // return true to continue

let scheduled = false;
const renderCallbacks = new Set<RenderFn>();

function scheduleLoop() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(function tick(now: number) {
    scheduled = false;
    let needsMore = false;
    for (const cb of renderCallbacks) {
      if (cb(now)) needsMore = true;
    }
    if (needsMore) scheduleLoop();
  });
}

export function registerRender(fn: RenderFn): () => void {
  renderCallbacks.add(fn);
  scheduleLoop();
  return () => {
    renderCallbacks.delete(fn);
  };
}

export function kickScheduler(): void {
  scheduleLoop();
}

// ── React Hook: useSpringValue ───────────────────────────────────
// Animates a single value with spring physics

export function useSpringValue(
  initial: number,
  preset: SpringPresetName = "snappy"
) {
  const springRef = useRef<Spring>(createSpring(initial, preset));
  const callbackRef = useRef<((pos: number) => void) | null>(null);

  const setDest = useCallback((dest: number) => {
    springRef.current.dest = dest;
    kickScheduler();
  }, []);

  const onUpdate = useCallback((cb: (pos: number) => void) => {
    callbackRef.current = cb;
  }, []);

  useEffect(() => {
    const unregister = registerRender(() => {
      const s = springRef.current;
      // Step spring multiple sub-steps for stability
      for (let i = 0; i < 4; i++) {
        stepSpring(s, 0.004);
      }
      if (callbackRef.current) {
        callbackRef.current(s.pos);
      }
      if (isAtRest(s)) {
        snapToRest(s);
        return false;
      }
      return true;
    });
    return unregister;
  }, []);

  return { springRef, setDest, onUpdate };
}
