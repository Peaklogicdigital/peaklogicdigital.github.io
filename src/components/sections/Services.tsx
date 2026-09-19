"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { deferToNextFrame } from "@/lib/deferredEffect";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const SECTIONS = [
  { id: "digital-storefronts", number: "01", key: "digitalStorefronts" },
  { id: "automated-booking", number: "02", key: "automatedBooking" },
  { id: "global-expansion", number: "03", key: "globalExpansion" },
];

function ServiceRow({
  id,
  number,
  translationKey,
}: {
  id: string;
  number: string;
  translationKey: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const cancel = deferToNextFrame(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          rowRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rowRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }, rowRef);
    });

    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <div
      id={id}
      ref={rowRef}
      className="group border-t border-white/10 py-10 md:py-14 first:border-t-0"
    >
      <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-10">
        <span className="font-mono text-sm text-cyan-400/70 md:w-16 shrink-0">
          {number}
        </span>
        <div className="flex-1">
          <h3 className="font-display font-bold text-2xl md:text-4xl text-white mb-3 transition-colors duration-300 group-hover:text-cyan-300">
            {t(`servicesIndex.${translationKey}.heading`)}
          </h3>
          <p className="font-body text-white/60 text-base md:text-lg leading-relaxed max-w-3xl">
            {t(`servicesIndex.${translationKey}.body`)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <div className="py-16 px-4 md:py-24 md:px-16">
      <div className="max-w-4xl mx-auto">
        {SECTIONS.map((section) => (
          <ServiceRow
            key={section.id}
            id={section.id}
            number={section.number}
            translationKey={section.key}
          />
        ))}
      </div>
    </div>
  );
}
