"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { deferToNextFrame } from "@/lib/deferredEffect";
import Magnetic from "@/components/ui/Magnetic";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const FLOW_STEP_COUNT = 5;

export default function OperationalFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const cancel = deferToNextFrame(() => {
      ctx = gsap.context(() => {
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
    });

    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <div
      id="operational-flow"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 md:px-16 md:py-24"
    >
      <div className="max-w-2xl text-center mb-16">
        <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
          {t("operationalFlow.eyebrow")}
        </span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-4">
          {t("operationalFlow.heading")}
        </h2>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full">
          {Array.from({ length: FLOW_STEP_COUNT }, (_, index) => {
            const isActive = index === activeIndex;
            return (
              <Magnetic key={index} className="block w-full" radius={30} strength={8}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full text-center rounded-xl border px-3 py-4 transition-colors ${
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
                    {t(`operationalFlow.steps.${index}.label`)}
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
            {t(`operationalFlow.steps.${activeIndex}.detail`)}
          </p>
        </div>
      </div>
    </div>
  );
}
