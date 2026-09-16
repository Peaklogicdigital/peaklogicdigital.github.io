"use client";

import { useEffect, useRef, type ReactNode } from "react";

const MAX_SKEW_DEG = 2.5;
const VELOCITY_TO_SKEW = 0.05;
const SPRING_EASE = 0.12;

/**
 * Wraps the page's main content and applies a subtle skewY based on scroll
 * velocity, springing back to 0deg as scrolling settles. Disabled entirely
 * on touch devices per spec - there's no meaningful "velocity" gesture to
 * key off during a touch-driven scroll the same way, and it's not worth the
 * risk of an artifact on those viewports.
 */
export default function ScrollSkewWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const currentSkew = useRef(0);
  const lastScrollY = useRef(0);
  const frameId = useRef<number | null>(null);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    lastScrollY.current = window.scrollY;

    function tick() {
      const scrollY = window.scrollY;
      const velocity = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;

      const targetSkew = Math.max(
        -MAX_SKEW_DEG,
        Math.min(MAX_SKEW_DEG, velocity * VELOCITY_TO_SKEW)
      );
      currentSkew.current += (targetSkew - currentSkew.current) * SPRING_EASE;
      if (Math.abs(currentSkew.current) < 0.01) currentSkew.current = 0;

      const el = ref.current;
      if (el) {
        el.style.transform = `skewY(${currentSkew.current.toFixed(3)}deg)`;
      }

      frameId.current = requestAnimationFrame(tick);
    }

    frameId.current = requestAnimationFrame(tick);
    return () => {
      if (frameId.current !== null) cancelAnimationFrame(frameId.current);
    };
  }, []);

  return (
    <div ref={ref} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
