"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: -100, y: -100 });
  const frameId = useRef<number | null>(null);

  useEffect(() => {
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

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white pointer-events-none z-[9999] will-change-transform"
      style={{ mixBlendMode: "difference" }}
    />
  );
}
