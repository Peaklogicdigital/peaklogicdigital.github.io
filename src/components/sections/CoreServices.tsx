"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { deferToNextFrame } from "@/lib/deferredEffect";
import GlassTiltCard from "@/components/ui/GlassTiltCard";
import Magnetic from "@/components/ui/Magnetic";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useEarlyMount } from "@/lib/useEarlyMount";
import type { ComponentType } from "react";

// Three.js/@react-three are heavy to parse and compile; loading these client-
// only and off the initial bundle keeps first paint from waiting on them.
function CardSkeleton() {
  return <div className="w-full h-full bg-white/5 animate-pulse" />;
}

const ServicePrism = dynamic(() => import("@/components/three/ServicePrism"), {
  ssr: false,
  loading: CardSkeleton,
});
const DataCore = dynamic(() => import("@/components/three/DataCore"), {
  ssr: false,
  loading: CardSkeleton,
});
const Lattice = dynamic(() => import("@/components/three/Lattice"), {
  ssr: false,
  loading: CardSkeleton,
});

const CORE_SERVICES: {
  number: string;
  Visual: ComponentType;
}[] = [
  { number: "01", Visual: ServicePrism },
  { number: "02", Visual: DataCore },
  { number: "03", Visual: Lattice },
  // Reuses ServicePrism rather than introducing a fourth WebGL scene - the
  // 3D visuals in src/components/three/ are a fixed, protected set.
  { number: "04", Visual: ServicePrism },
];

export default function CoreServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  // The dynamic() calls above already code-split the Three.js bundles into
  // separate chunks (further warmed in the background by ThreePreloader),
  // but the mount itself - WebGL context creation and shader compilation -
  // is still real GPU/main-thread work that must happen sometime. Mounting
  // on idle, within 1000px of the viewport, or within 800ms regardless
  // (see useEarlyMount) gives that compile time to finish off-screen well
  // before the user scrolls here, so scrolling into view never has to pay
  // for it in the moment.
  const shouldLoadVisuals = useEarlyMount(sectionRef, "0px 0px 1000px 0px");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const cancel = deferToNextFrame(() => {
      ctx = gsap.context(() => {
        const cards = sectionRef.current?.querySelectorAll(".core-service-card");
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
      id="core-services"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 md:px-16 md:py-24"
    >
      <div className="max-w-2xl text-center mb-16">
        <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
          {t("coreServices.eyebrow")}
        </span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-4">
          {t("coreServices.heading")}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full max-w-7xl items-stretch">
        {CORE_SERVICES.map((service, index) => (
          <div key={service.number} className="core-service-card h-full">
            <Magnetic className="block h-full" radius={40} strength={10}>
              <GlassTiltCard className="h-full p-8 flex flex-col">
                <div className="w-full aspect-video rounded-xl border border-white/10 overflow-hidden mb-6">
                  {shouldLoadVisuals ? <service.Visual /> : <CardSkeleton />}
                </div>
                <span className="font-mono text-xs text-white/40 tracking-widest">
                  {service.number}
                </span>
                <h3 className="font-display font-bold text-xl text-white mt-4 mb-3">
                  {t(`coreServices.items.${index}.title`)}
                </h3>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  {t(`coreServices.items.${index}.description`)}
                </p>
              </GlassTiltCard>
            </Magnetic>
          </div>
        ))}
      </div>
    </div>
  );
}
