"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useActiveSection } from "@/lib/useActiveSection";

const RADIUS = 260;
const ALPHA = 0.15;
const COLOR_LERP_EASE = 0.08;
const POSITION_LERP_EASE = 0.15;

const SECTION_COLORS: Record<string, { r: number; g: number; b: number }> = {
  hero: { r: 0, g: 240, b: 255 }, // Cyber Cyan
  "core-services": { r: 99, g: 102, b: 241 }, // Deep Obsidian Violet/Indigo
  "selected-work": { r: 20, g: 184, b: 166 }, // Electric Cyan-Teal
  contact: { r: 16, g: 185, b: 129 }, // Emerald Green
};
const DEFAULT_COLOR = SECTION_COLORS.hero;

export default function MouseGlowOverlay() {
  const glowRef = useRef<HTMLDivElement>(null);

  const currentPosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const positionFrameId = useRef<number | null>(null);

  const currentColor = useRef({ ...DEFAULT_COLOR });
  const targetColor = useRef({ ...DEFAULT_COLOR });
  const colorFrameId = useRef<number | null>(null);

  const activeSection = useActiveSection(Object.keys(SECTION_COLORS));

  function applyBackground() {
    const { r, g, b } = currentColor.current;
    const rr = Math.round(r);
    const gg = Math.round(g);
    const bb = Math.round(b);

    const glow = glowRef.current;
    if (glow) {
      glow.style.background = `radial-gradient(${RADIUS}px circle at var(--glow-x) var(--glow-y), rgba(${rr}, ${gg}, ${bb}, ${ALPHA}), transparent 75%)`;
    }
  }

  // Section-aware color: lerp toward the active section's color each frame
  // instead of a CSS transition, since gradients with shifting color stops
  // aren't reliably animatable via plain `transition` across browsers.
  useEffect(() => {
    if (!activeSection) return;
    const next = SECTION_COLORS[activeSection];
    if (!next) return;
    targetColor.current = next;

    if (colorFrameId.current !== null) return;

    function lerp() {
      const cur = currentColor.current;
      const tgt = targetColor.current;
      cur.r += (tgt.r - cur.r) * COLOR_LERP_EASE;
      cur.g += (tgt.g - cur.g) * COLOR_LERP_EASE;
      cur.b += (tgt.b - cur.b) * COLOR_LERP_EASE;
      applyBackground();

      const dist = Math.abs(tgt.r - cur.r) + Math.abs(tgt.g - cur.g) + Math.abs(tgt.b - cur.b);
      if (dist > 0.5) {
        colorFrameId.current = requestAnimationFrame(lerp);
      } else {
        currentColor.current = { ...tgt };
        applyBackground();
        colorFrameId.current = null;
      }
    }

    colorFrameId.current = requestAnimationFrame(lerp);
  }, [activeSection]);

  useEffect(() => {
    return () => {
      if (colorFrameId.current !== null) cancelAnimationFrame(colorFrameId.current);
    };
  }, []);

  // Single tactile position tracker for mouse AND touch: the glow eases
  // toward wherever the pointer/finger last was, via the same rAF-driven
  // lerp pattern as the color transition above, rather than snapping
  // instantly - so fast swipes produce a smooth trailing glow instead of
  // jitter. touchstart/touchmove are bound passive so this never competes
  // with the browser's native scroll thread.
  useEffect(() => {
    function applyPosition() {
      const glow = glowRef.current;
      if (glow) {
        glow.style.setProperty("--glow-x", `${currentPosition.current.x}px`);
        glow.style.setProperty("--glow-y", `${currentPosition.current.y}px`);
      }
    }

    function schedulePositionLerp() {
      if (positionFrameId.current !== null) return;

      function step() {
        const cur = currentPosition.current;
        const tgt = targetPosition.current;
        cur.x += (tgt.x - cur.x) * POSITION_LERP_EASE;
        cur.y += (tgt.y - cur.y) * POSITION_LERP_EASE;
        applyPosition();

        const dist = Math.abs(tgt.x - cur.x) + Math.abs(tgt.y - cur.y);
        if (dist > 0.5) {
          positionFrameId.current = requestAnimationFrame(step);
        } else {
          currentPosition.current = { ...tgt };
          applyPosition();
          positionFrameId.current = null;
        }
      }

      positionFrameId.current = requestAnimationFrame(step);
    }

    function updateTarget(x: number, y: number) {
      targetPosition.current = { x, y };
      schedulePositionLerp();
    }

    function handleMouseMove(event: MouseEvent) {
      updateTarget(event.clientX, event.clientY);
    }

    function handleTouchStart(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      updateTarget(touch.clientX, touch.clientY);
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      updateTarget(touch.clientX, touch.clientY);
    }

    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    currentPosition.current = center;
    targetPosition.current = center;
    applyPosition();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      if (positionFrameId.current !== null) cancelAnimationFrame(positionFrameId.current);
    };
  }, []);

  // No z-index: this relies on being an early child in layout.tsx's <body>
  // so real content (rendered after it) naturally paints on top. z-index:-1
  // is deliberately avoided - it's unreliable in some rendering contexts.
  //
  // One node for every device (no more CSS-breakpoint split between a
  // static mobile glow and a tracking desktop one) - pointer-events-none
  // so it can never intercept a tap or click meant for real content.
  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={
        {
          // Explicit 50%/50% seed so the glow is visible centered on first
          // paint, before any client JS has run - not just a var() fallback.
          "--glow-x": "50%",
          "--glow-y": "50%",
          background: `radial-gradient(${RADIUS}px circle at var(--glow-x) var(--glow-y), rgba(0, 240, 255, ${ALPHA}), transparent 75%)`,
        } as CSSProperties
      }
    />
  );
}
