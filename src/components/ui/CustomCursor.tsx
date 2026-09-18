"use client";

import { useEffect, useRef, useState } from "react";
import { deferToNextFrame } from "@/lib/deferredEffect";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: -100, y: -100 });
  const frameId = useRef<number | null>(null);
  // Starts false on both server and client so there's nothing for hydration
  // to mismatch on; the real touch-capability check only runs client-side,
  // inside the effect below.
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const touchCapable = navigator.maxTouchPoints > 0;

    if (coarsePointer || touchCapable) {
      // Touch device: never attach the tracking listener at all - just flip
      // the state that makes the component return null below.
      return deferToNextFrame(() => setIsTouchDevice(true));
    }

    function applyPosition() {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0) translate(-50%, -50%)`;
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

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameId.current !== null) cancelAnimationFrame(frameId.current);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      // hidden md:block is a CSS-layer fallback for narrow viewports - the
      // isTouchDevice check above (capability-based, not viewport-based) is
      // what actually keeps this off touch devices of any screen size.
      className="hidden md:block fixed top-0 left-0 w-4 h-4 rounded-full bg-white pointer-events-none z-[9999] will-change-transform"
      style={{ mixBlendMode: "difference" }}
    />
  );
}
