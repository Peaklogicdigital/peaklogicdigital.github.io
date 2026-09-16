"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "@/components/ui/Magnetic";

const FLOW_STEPS = [
  {
    label: "Design & Build",
    detail:
      "The website goes live first, designed and built end to end, before any of the automation gets layered on top of it.",
  },
  {
    label: "Signal",
    detail: "A call, message, booking request, or form submission comes in.",
  },
  {
    label: "Route",
    detail: "The system identifies the type and sends it to the right channel or person.",
  },
  {
    label: "Action",
    detail: "A reply goes out, a slot gets booked, or a task gets created, within minutes.",
  },
  {
    label: "Record",
    detail: "Every interaction is logged, so nothing depends on memory.",
  },
];

export default function OperationalFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="operational-flow"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 md:px-16 md:py-24"
    >
      <div className="max-w-2xl text-center mb-16">
        <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
          OPERATIONAL FLOW
        </span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-4">
          How a Signal Becomes a Booked Customer
        </h2>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row gap-3 md:gap-2">
          {FLOW_STEPS.map((step, index) => {
            const isActive = index === activeIndex;
            return (
              <Magnetic key={step.label} className="flex-1 block" radius={30} strength={8}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full text-left rounded-xl border px-5 py-4 transition-colors ${
                    isActive
                      ? "border-cyan-400/60 bg-cyan-400/10"
                      : "border-white/10 bg-white/5 hover:border-white/25"
                  }`}
                >
                  <span className="font-mono text-xs text-white/40">
                    0{index + 1}
                  </span>
                  <p
                    className={`font-display font-bold mt-1 transition-colors ${
                      isActive ? "text-cyan-400" : "text-white"
                    }`}
                  >
                    {step.label}
                  </p>
                </button>
              </Magnetic>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-8 py-10 min-h-[9rem] flex items-center">
          <p
            key={activeIndex}
            className="font-body text-white/70 text-lg md:text-xl leading-relaxed"
          >
            {FLOW_STEPS[activeIndex].detail}
          </p>
        </div>
      </div>
    </div>
  );
}
