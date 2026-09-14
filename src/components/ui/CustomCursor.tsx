"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const quickToX = gsap.quickTo(cursor, "x", {
      duration: 0.5,
      ease: "power3",
    });
    const quickToY = gsap.quickTo(cursor, "y", {
      duration: 0.5,
      ease: "power3",
    });

    function handleMouseMove(event: MouseEvent) {
      quickToX(event.clientX);
      quickToY(event.clientY);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white pointer-events-none z-[9999]"
      style={{ mixBlendMode: "difference" }}
    />
  );
}
