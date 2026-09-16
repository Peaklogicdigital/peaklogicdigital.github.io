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

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

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
        {Array.from({ length: TIER_COUNT }, (_, index) => (
          <div key={index} className="pricing-card h-full">
            <Magnetic className="block h-full" radius={40} strength={10}>
            <GlassTiltCard className="h-full p-8 flex flex-col">
              <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
                {t(`pricing.tiers.${index}.name`)}
              </span>
              <h3 className="font-display font-bold text-2xl text-white mt-2 mb-6">
                {t(`pricing.tiers.${index}.tagline`)}
              </h3>

              <div className="mb-6">
                <p className="font-display font-black text-3xl text-white">
                  {t(`pricing.tiers.${index}.launchPrice`)}
                </p>
                <p className="font-body text-white/50 text-sm">
                  {t("pricing.toLaunch", {
                    price: t(`pricing.tiers.${index}.monthlyPrice`),
                  })}
                </p>
              </div>

              <div className="flex-1">
                <p className="font-body text-white/70 text-sm leading-relaxed mb-4">
                  {t(`pricing.tiers.${index}.whatYouGet`)}
                </p>
                <p className="font-body text-white/50 text-sm leading-relaxed">
                  {t(`pricing.tiers.${index}.howItWorks`)}
                </p>
              </div>

              <p className="font-body text-white/35 text-xs leading-relaxed mt-6 pt-6 border-t border-white/10">
                {t(`pricing.tiers.${index}.context`)}
              </p>
            </GlassTiltCard>
            </Magnetic>
          </div>
        ))}
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
