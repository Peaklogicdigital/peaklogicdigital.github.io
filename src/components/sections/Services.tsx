"use client";

import { useRef } from "react";
import gsap from "gsap";

const SERVICES = [
  {
    number: "01",
    title: "Engineering",
    description: "Resilient systems built on precision code and rigorous testing.",
  },
  {
    number: "02",
    title: "Architecture",
    description: "Scalable structures designed for velocity and long-term clarity.",
  },
  {
    number: "03",
    title: "Deployment",
    description: "Zero-friction pipelines that ship with confidence, every time.",
  },
];

function ServiceCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
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

    const maxRotation = 12;
    quickToY.current?.(relX * maxRotation * 2);
    quickToX.current?.(relY * -maxRotation * 2);
  }

  function handleMouseLeave() {
    ensureQuickTo();
    quickToX.current?.(0);
    quickToY.current?.(0);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
    >
      <div className="flex items-center gap-3 mb-8">
        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]" />
        <span className="font-mono text-xs text-white/50 tracking-widest">
          {number}
        </span>
      </div>
      <h3 className="font-display font-bold text-2xl text-white mb-3">
        {title}
      </h3>
      <p className="font-body text-white/60 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Services() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 py-24 md:flex-row md:gap-6"
      style={{ perspective: 1000 }}
    >
      {SERVICES.map((service) => (
        <ServiceCard key={service.number} {...service} />
      ))}
    </div>
  );
}
