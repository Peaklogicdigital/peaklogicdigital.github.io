"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassTiltCard from "@/components/ui/GlassTiltCard";
import Magnetic from "@/components/ui/Magnetic";
import { scrollToSection } from "@/lib/lenis";
import { deferToNextFrame } from "@/lib/deferredEffect";
import { playTone } from "@/lib/sound";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const TIER_COUNT = 3;
const HIGHLIGHTED_TIER_INDEX = 1;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400"
      aria-hidden="true"
    >
      <path
        d="M4 10.5L8 14.5L16 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t, dict } = useLanguage();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const cancel = deferToNextFrame(() => {
      ctx = gsap.context(() => {
        const cards = sectionRef.current?.querySelectorAll(".pricing-card");
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              stagger: 0.15,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 55%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }, sectionRef);
    });

    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <div
      id="pricing"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 md:px-16 md:py-24"
    >
      <div className="max-w-2xl text-center mb-16">
        <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
          {t("pricing.eyebrow")}
        </span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-4">
          {t("pricing.heading")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl items-stretch">
        {Array.from({ length: TIER_COUNT }, (_, index) => {
          const isHighlighted = index === HIGHLIGHTED_TIER_INDEX;
          const features = dict.pricing.tiers[index].features;

          return (
            <div key={index} className="pricing-card h-full">
              <Magnetic className="block h-full" radius={40} strength={10}>
                <GlassTiltCard
                  className={`h-full p-8 flex flex-col relative ${
                    isHighlighted
                      ? "border-cyan-400/60 shadow-[0_0_50px_-12px_rgba(34,211,238,0.35)]"
                      : ""
                  }`}
                >
                  {isHighlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold tracking-widest text-zinc-950 bg-cyan-400 rounded-full px-3 py-1 whitespace-nowrap">
                      {t("pricing.mostPopular")}
                    </span>
                  )}

                  <h3 className="font-display font-bold text-xl text-white mb-6">
                    {t(`pricing.tiers.${index}.name`)}
                  </h3>

                  <div className="mb-6">
                    <p className="font-display font-black text-3xl md:text-4xl text-white leading-none">
                      {t(`pricing.tiers.${index}.buildPrice`)}
                      <span className="font-body font-normal text-sm text-white/50 ml-1.5">
                        {t("pricing.buildLabel")}
                      </span>
                    </p>
                    <p className="font-body font-medium text-white/60 text-base mt-2">
                      + {t(`pricing.tiers.${index}.monthlyPrice`)}
                    </p>
                    <p className="font-body text-white/40 text-xs mt-1">
                      {t("pricing.yearlyNote", {
                        price: t(`pricing.tiers.${index}.yearlyPrice`),
                      })}
                    </p>
                  </div>

                  <p className="font-body text-white/70 text-sm leading-relaxed mb-6">
                    {t(`pricing.tiers.${index}.description`)}
                  </p>

                  <ul className="flex-1 space-y-3">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 font-body text-white/60 text-sm leading-snug"
                      >
                        <CheckIcon />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </GlassTiltCard>
              </Magnetic>
            </div>
          );
        })}
      </div>

      <Magnetic className="block mt-16" radius={50} strength={10}>
        <button
          type="button"
          onClick={() => scrollToSection("#contact")}
          onMouseEnter={() => playTone(1100)}
          className="font-display font-bold text-white bg-cyan-400/10 border border-cyan-400/50 rounded-full px-10 py-4 text-lg transition-colors hover:bg-cyan-400/20 hover:border-cyan-400"
        >
          {t("pricing.cta")}
        </button>
      </Magnetic>
    </div>
  );
}
