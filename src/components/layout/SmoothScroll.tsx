"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Mobile/touch must get plain native touch-scrolling - Lenis's wheel/
    // touch hijacking is a desktop-only enhancement here. Skipping
    // construction entirely (rather than just disabling smoothWheel) means
    // window.lenis stays undefined, so scrollToSection() in lib/lenis.ts
    // falls back to native scrollIntoView automatically.
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isNarrowViewport = window.matchMedia("(max-width: 767px)").matches;
    if (isTouchDevice || isNarrowViewport) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
