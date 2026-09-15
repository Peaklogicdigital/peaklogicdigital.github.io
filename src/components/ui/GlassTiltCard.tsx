"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";

export default function GlassTiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const quickToX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickToY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  function ensureQuickTo() {
    if (!cardRef.current) return;
    if (!quickToX.current) {
      quickToX.current = gsap.quickTo(cardRef.current, "rotationX", {
        duration: 0.5,
        ease: "power3",
      });
    }
    if (!quickToY.current) {
      quickToY.current = gsap.quickTo(cardRef.current, "rotationY", {
        duration: 0.5,
        ease: "power3",
      });
    }
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    ensureQuickTo();

    const rect = card.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;

    const maxRotation = 10;
    quickToY.current?.(relX * maxRotation * 2);
    quickToX.current?.(relY * -maxRotation * 2);
  }

  function handleMouseLeave() {
    ensureQuickTo();
    quickToX.current?.(0);
    quickToY.current?.(0);
  }

  return (
    <div className="h-full [perspective:1000px]">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] ${className ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}
