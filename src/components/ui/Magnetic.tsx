"use client";

import { useEffect, useRef, type ReactNode } from "react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Wraps children in a div that eases toward the cursor when it's nearby,
 * and back to center on leave. Writes its own `transform` every frame, so
 * never target this wrapper's own element with another transform-driven
 * animation (GSAP reveals etc.) - put marker classes on an outer element
 * instead and let Magnetic own an inner one.
 */
export default function Magnetic({
  children,
  className,
  strength = 12,
  radius = 60,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frameId = useRef<number | null>(null);

  useEffect(() => {
    function tick() {
      current.current.x = lerp(current.current.x, target.current.x, 0.15);
      current.current.y = lerp(current.current.y, target.current.y, 0.15);
      const el = ref.current;
      if (el) {
        el.style.transform = `translate3d(${current.current.x.toFixed(2)}px, ${current.current.y.toFixed(2)}px, 0)`;
      }
      frameId.current = requestAnimationFrame(tick);
    }

    function handlePointerMove(event: PointerEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const captureRadius = radius + Math.max(rect.width, rect.height) / 2;
      const dist = Math.hypot(dx, dy);

      if (dist < captureRadius && dist > 0) {
        const pull = 1 - dist / captureRadius;
        target.current.x = (dx / dist) * strength * pull;
        target.current.y = (dy / dist) * strength * pull;
      } else {
        target.current.x = 0;
        target.current.y = 0;
      }
    }

    frameId.current = requestAnimationFrame(tick);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameId.current !== null) cancelAnimationFrame(frameId.current);
    };
  }, [strength, radius]);

  return (
    <div ref={ref} className={`will-change-transform ${className ?? ""}`}>
      {children}
    </div>
  );
}
