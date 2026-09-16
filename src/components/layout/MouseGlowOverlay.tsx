"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useActiveSection } from "@/lib/useActiveSection";

const DESKTOP_RADIUS = 380;
const MOBILE_RADIUS = 350;
const DESKTOP_ALPHA = 0.35;
const MOBILE_ALPHA = 0.28;
const COLOR_LERP_EASE = 0.08;

const SECTION_COLORS: Record<string, { r: number; g: number; b: number }> = {
  hero: { r: 0, g: 240, b: 255 }, // Cyber Cyan
  "core-services": { r: 99, g: 102, b: 241 }, // Deep Obsidian Violet/Indigo
  "selected-work": { r: 20, g: 184, b: 166 }, // Electric Cyan-Teal
  contact: { r: 16, g: 185, b: 129 }, // Emerald Green
};
const DEFAULT_COLOR = SECTION_COLORS.hero;

export default function MouseGlowOverlay() {
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const positionFrameId = useRef<number | null>(null);

  const currentColor = useRef({ ...DEFAULT_COLOR });
  const targetColor = useRef({ ...DEFAULT_COLOR });
  const colorFrameId = useRef<number | null>(null);

  const activeSection = useActiveSection(Object.keys(SECTION_COLORS));

  function applyBackgrounds() {
    const { r, g, b } = currentColor.current;
    const rr = Math.round(r);
    const gg = Math.round(g);
    const bb = Math.round(b);

    const mobile = mobileRef.current;
    if (mobile) {
      mobile.style.background = `radial-gradient(${MOBILE_RADIUS}px circle at 50% 0%, rgba(${rr}, ${gg}, ${bb}, ${MOBILE_ALPHA}), transparent 75%)`;
    }
    const desktop = desktopRef.current;
    if (desktop) {
      desktop.style.background = `radial-gradient(${DESKTOP_RADIUS}px circle at var(--glow-x) var(--glow-y), rgba(${rr}, ${gg}, ${bb}, ${DESKTOP_ALPHA}), transparent 75%)`;
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
      applyBackgrounds();

      const dist = Math.abs(tgt.r - cur.r) + Math.abs(tgt.g - cur.g) + Math.abs(tgt.b - cur.b);
      if (dist > 0.5) {
        colorFrameId.current = requestAnimationFrame(lerp);
      } else {
        currentColor.current = { ...tgt };
        applyBackgrounds();
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

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isNarrowViewport = window.matchMedia("(max-width: 767px)").matches;
    // Touch devices (or narrow viewports) get the static top-anchored glow
    // below instead - no cursor to track, and skipping the listener avoids
    // any chance of tracking overhead during touch scrolling.
    if (isTouchDevice || isNarrowViewport) return;

    position.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    function applyPosition() {
      const glow = desktopRef.current;
      if (glow) {
        glow.style.setProperty("--glow-x", `${position.current.x}px`);
        glow.style.setProperty("--glow-y", `${position.current.y}px`);
      }
      positionFrameId.current = null;
    }

    function handleMouseMove(event: MouseEvent) {
      position.current.x = event.clientX;
      position.current.y = event.clientY;
      if (positionFrameId.current === null) {
        positionFrameId.current = requestAnimationFrame(applyPosition);
      }
    }

    applyPosition();
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (positionFrameId.current !== null) cancelAnimationFrame(positionFrameId.current);
    };
  }, []);

  // No z-index: this relies on being an early child in layout.tsx's <body>
  // so real content (rendered after it) naturally paints on top. z-index:-1
  // is deliberately avoided - it's unreliable in some rendering contexts.
  //
  // Two layers, switched purely by the md: CSS breakpoint rather than JS,
  // so there's no hydration flash: below 768px, a fixed ambient glow
  // anchored top-center; at 768px and up, the cursor-tracking glow (whose
  // effect above no-ops on touch/narrow viewports, so on a wide touch
  // device - e.g. a tablet - it simply stays centered instead of tracking).
  // Both layers' color is driven by the same lerp loop above.
  return (
    <>
      <div
        ref={mobileRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none md:hidden"
        style={{
          background: `radial-gradient(${MOBILE_RADIUS}px circle at 50% 0%, rgba(0, 240, 255, ${MOBILE_ALPHA}), transparent 75%)`,
        }}
      />
      <div
        ref={desktopRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none hidden md:block"
        style={
          {
            // Explicit 50%/50% seed so the glow is visible centered on first
            // paint, before any client JS has run - not just a var() fallback.
            "--glow-x": "50%",
            "--glow-y": "50%",
            background: `radial-gradient(${DESKTOP_RADIUS}px circle at var(--glow-x) var(--glow-y), rgba(0, 240, 255, ${DESKTOP_ALPHA}), transparent 75%)`,
          } as CSSProperties
        }
      />
    </>
  );
}
