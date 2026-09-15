"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export default function MouseGlowOverlay() {
  const glowRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const frameId = useRef<number | null>(null);

  useEffect(() => {
    position.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    function applyPosition() {
      const glow = glowRef.current;
      if (glow) {
        glow.style.setProperty("--glow-x", `${position.current.x}px`);
        glow.style.setProperty("--glow-y", `${position.current.y}px`);
      }
      frameId.current = null;
    }

    function handleMouseMove(event: MouseEvent) {
      position.current.x = event.clientX;
      position.current.y = event.clientY;
      if (frameId.current === null) {
        frameId.current = requestAnimationFrame(applyPosition);
      }
    }

    applyPosition();
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameId.current !== null) cancelAnimationFrame(frameId.current);
    };
  }, []);

  // No z-index: this relies on being an early child in layout.tsx's <body>
  // so real content (rendered after it) naturally paints on top. z-index:-1
  // is deliberately avoided - it's unreliable in some rendering contexts.
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
          background:
            "radial-gradient(900px circle at var(--glow-x) var(--glow-y), rgba(34, 211, 238, 0.28), transparent 75%)",
        } as CSSProperties
      }
    />
  );
}
