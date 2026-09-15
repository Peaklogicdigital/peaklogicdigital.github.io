"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "@/components/ui/Magnetic";
import ShowcaseGrid from "@/components/three/ShowcaseGrid";
import ShowcaseParallax from "@/components/three/ShowcaseParallax";

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
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-4">
          Recent Builds
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <div className="work-panel">
          <Magnetic className="block" radius={40} strength={10}>
            <div className="w-full aspect-[4/3] rounded-2xl border border-white/10 overflow-hidden">
              <ShowcaseGrid />
            </div>
          </Magnetic>
        </div>
        <div className="work-panel">
          <Magnetic className="block" radius={40} strength={10}>
            <div className="w-full aspect-[4/3] rounded-2xl border border-white/10 overflow-hidden">
              <ShowcaseParallax />
            </div>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
