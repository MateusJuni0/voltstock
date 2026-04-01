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

// ── 3D Card Tilt + Image Z-Lift with Spring Physics ──────────────
// Key technique: card tilts + inner image physically floats ABOVE card
// IMPORTANT: card must NOT have overflow:hidden for image to escape bounds

interface TiltOptions {
  /** Max rotation in degrees. Default 15 */
  maxTilt?: number;
  /** Spring preset. Default "snappy" */
  preset?: SpringPresetName;
  /** Perspective distance in px (lower = more dramatic). Default 500 */
  perspective?: number;
  /** Scale on hover. Default 1.04 */
  hoverScale?: number;
  /** Enable glow following cursor. Default true */
  glowFollow?: boolean;
  /** How much the image floats above card in px. Default 70 */
  imageZ?: number;
}

export function use3DTilt(options: TiltOptions = {}) {
  const {
    maxTilt = 15,
    preset = "snappy",
    perspective = 500,
    hoverScale = 1.04,
    glowFollow = true,
    imageZ = 70,
  } = options;

  const elRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLElement | null>(null);
  const shadowRef = useRef<HTMLElement | null>(null);

  const rotX = useRef<Spring>(createSpring(0, preset));
  const rotY = useRef<Spring>(createSpring(0, preset));
  const scale = useRef<Spring>(createSpring(1, preset));
  const imgZ = useRef<Spring>(createSpring(0, preset));

  const glowX = useRef(50);
  const glowY = useRef(50);
  const isActive = useRef(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = elRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      rotX.current.dest = -ny * maxTilt;
      rotY.current.dest = nx * maxTilt;
      scale.current.dest = hoverScale;
      imgZ.current.dest = imageZ;

      glowX.current = ((e.clientX - rect.left) / rect.width) * 100;
      glowY.current = ((e.clientY - rect.top) / rect.height) * 100;

      isActive.current = true;
      kickScheduler();
    },
    [maxTilt, hoverScale, imageZ]
  );

  const handleMouseLeave = useCallback(() => {
    rotX.current.dest = 0;
    rotY.current.dest = 0;
    scale.current.dest = 1;
    imgZ.current.dest = 0;
    isActive.current = false;
    kickScheduler();
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // CRITICAL: preserve-3d so children can have their own Z layers
    el.style.transformStyle = "preserve-3d";
    el.style.willChange = "transform";

    // Set perspective on parent wrapper
    const parent = el.parentElement as HTMLElement | null;
    if (parent) {
      parent.style.perspective = `${perspective}px`;
      parent.style.perspectiveOrigin = "center center";
    }

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    const unregister = registerRender(() => {
      const rx = rotX.current;
      const ry = rotY.current;
      const s = scale.current;
      const iz = imgZ.current;

      for (let i = 0; i < 4; i++) {
        stepSpring(rx, 0.004);
        stepSpring(ry, 0.004);
        stepSpring(s, 0.004);
        stepSpring(iz, 0.004);
      }

      // Apply card tilt
      if (elRef.current) {
        elRef.current.style.transform = `rotateX(${rx.pos}deg) rotateY(${ry.pos}deg) scale3d(${s.pos}, ${s.pos}, ${s.pos})`;
      }

      // Apply image Z-lift — image floats ABOVE the card
      if (imgRef.current) {
        imgRef.current.style.transform = `translateZ(${iz.pos}px)`;
        // Enhance drop shadow as image lifts
        const shadowBlur = 20 + iz.pos * 0.8;
        const shadowOpacity = 0.15 + iz.pos * 0.006;
        imgRef.current.style.filter = `drop-shadow(0 ${Math.round(iz.pos * 0.6)}px ${Math.round(shadowBlur)}px rgba(0,0,0,${shadowOpacity.toFixed(2)})) drop-shadow(0 0 ${Math.round(iz.pos * 0.3)}px rgba(249,115,22,${(iz.pos * 0.003).toFixed(3)}))`;
      }

      // Shadow disc beneath floating image
      if (shadowRef.current) {
        const spread = 60 + iz.pos * 0.5;
        const opacity = 0.15 + iz.pos * 0.004;
        shadowRef.current.style.filter = `blur(${spread}px)`;
        shadowRef.current.style.opacity = `${opacity}`;
        shadowRef.current.style.transform = `translateZ(-10px) translateX(${ry.pos * 1.5}px) translateY(${-rx.pos * 1.5}px)`;
      }

      // Cursor-tracking glow overlay
      if (glowFollow && glowRef.current) {
        if (isActive.current) {
          glowRef.current.style.background = `radial-gradient(circle at ${glowX.current}% ${glowY.current}%, rgba(249,115,22,0.18) 0%, transparent 65%)`;
          glowRef.current.style.opacity = "1";
        } else {
          glowRef.current.style.opacity = "0";
        }
      }

      const allRest =
        isAtRest(rx) && isAtRest(ry) && isAtRest(s) && isAtRest(iz);
      if (allRest && !isActive.current) {
        snapToRest(rx);
        snapToRest(ry);
        snapToRest(s);
        snapToRest(iz);
        return false;
      }
      return true;
    });

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      unregister();
    };
  }, [handleMouseMove, handleMouseLeave, perspective, glowFollow]);

  return { tiltRef: elRef, glowRef, imgRef, shadowRef };
}
