"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "@/components/ui/Magnetic";
import SplitHeading from "@/components/ui/SplitHeading";
import MinimalGlassPanel from "@/components/three/MinimalGlassPanel";

export default function SelectedWork() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const panels = sectionRef.current?.querySelectorAll(".work-panel");
      if (panels && panels.length > 0) {
        gsap.fromTo(
          panels,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="selected-work"
      ref={sectionRef}
      className="flex flex-col items-center justify-center px-6 md:px-16 py-24"
    >
      <div className="max-w-2xl text-center mb-16">
        <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
          SELECTED WORK
        </span>
        <div className="mt-4">
          <SplitHeading
            text="Recent Builds"
            as="h2"
            start="top 75%"
            className="font-display font-bold text-3xl md:text-5xl text-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <div className="work-panel">
          <Magnetic className="block" radius={40} strength={10}>
            <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/10 overflow-hidden">
              <MinimalGlassPanel />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-display font-bold tracking-[0.3em] text-white/50 text-sm md:text-base">
                  COMING SOON
                </span>
              </div>
            </div>
          </Magnetic>
        </div>
        <div className="work-panel">
          <Magnetic className="block" radius={40} strength={10}>
            <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/10 overflow-hidden">
              <MinimalGlassPanel />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-display font-bold tracking-[0.3em] text-white/50 text-sm md:text-base">
                  COMING SOON
                </span>
              </div>
            </div>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
