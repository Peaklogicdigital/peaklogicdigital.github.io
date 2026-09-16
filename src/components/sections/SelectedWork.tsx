"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { deferToNextFrame } from "@/lib/deferredEffect";
import Magnetic from "@/components/ui/Magnetic";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Same reasoning as CoreServices.tsx: statically importing this would pull
// the entire three.js/@react-three dependency graph into the initial
// bundle, since this section renders unconditionally on first paint.
function PanelSkeleton() {
  return <div className="w-full h-full bg-white/5 animate-pulse" />;
}

const MinimalGlassPanel = dynamic(() => import("@/components/three/MinimalGlassPanel"), {
  ssr: false,
  loading: PanelSkeleton,
});

export default function SelectedWork() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  // Same viewport-gating as CoreServices.tsx: code-splitting the Three.js
  // chunk isn't enough on its own, since this section still renders (and
  // thus mounts/shader-compiles) unconditionally on first paint. Only start
  // loading the WebGL panels once this section is about to scroll into view.
  const [shouldLoadVisuals, setShouldLoadVisuals] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoadVisuals(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const cancel = deferToNextFrame(() => {
      ctx = gsap.context(() => {
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
      id="selected-work"
      ref={sectionRef}
      className="flex flex-col items-center justify-center px-4 py-16 md:px-16 md:py-24"
    >
      <div className="max-w-2xl text-center mb-16">
        <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
          {t("selectedWork.eyebrow")}
        </span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-4">
          {t("selectedWork.heading")}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <div className="work-panel">
          <Magnetic className="block" radius={40} strength={10}>
            <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/10 overflow-hidden">
              {shouldLoadVisuals ? <MinimalGlassPanel /> : <PanelSkeleton />}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-display font-bold tracking-[0.3em] text-white/50 text-sm md:text-base">
                  {t("selectedWork.comingSoon")}
                </span>
              </div>
            </div>
          </Magnetic>
        </div>
        <div className="work-panel">
          <Magnetic className="block" radius={40} strength={10}>
            <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/10 overflow-hidden">
              {shouldLoadVisuals ? <MinimalGlassPanel /> : <PanelSkeleton />}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-display font-bold tracking-[0.3em] text-white/50 text-sm md:text-base">
                  {t("selectedWork.comingSoon")}
                </span>
              </div>
            </div>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
