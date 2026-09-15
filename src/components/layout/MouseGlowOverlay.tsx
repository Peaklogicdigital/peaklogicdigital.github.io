"use client";

import { useEffect, useRef } from "react";

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

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{
        background:
          "radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(34, 211, 238, 0.13), transparent 70%)",
      }}
    />
  );
}
