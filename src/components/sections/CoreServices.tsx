"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassTiltCard from "@/components/ui/GlassTiltCard";
import Magnetic from "@/components/ui/Magnetic";
import SplitHeading from "@/components/ui/SplitHeading";
import ServicePrism from "@/components/three/ServicePrism";
import DataCore from "@/components/three/DataCore";
import Lattice from "@/components/three/Lattice";
import type { ComponentType } from "react";

const CORE_SERVICES: {
  number: string;
  title: string;
  description: string;
  Visual: ComponentType;
}[] = [
  {
    number: "01",
    title: "Web Design & Build",
    description:
      "Custom, high-end websites designed and built in-house, mobile-first from the first pixel. Fast to launch, built to last, and yours to own outright, not a rented template with your logo on it.",
    Visual: ServicePrism,
  },
  {
    number: "02",
    title: "Enquiry & Lead Handling Systems",
    description:
      "Once the site is live, every inbound enquiry, call, form, message, or walk-in, gets logged, tagged, and routed to the right person automatically. Nothing sits in an inbox waiting to be noticed.",
    Visual: DataCore,
  },
  {
    number: "03",
    title: "Workflow & Tool Integration",
    description:
      "We connect the calendars, POS systems, and messaging platforms already in use, and layer in automation and AI only where it removes real manual work, not where it looks impressive.",
    Visual: Lattice,
  },
];

export default function CoreServices() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
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
      id="core-services"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 md:px-16 py-24"
    >
      <div className="max-w-2xl text-center mb-16">
        <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
          WHAT WE DO
        </span>
        <div className="mt-4">
          <SplitHeading
            text="Websites First. Systems That Keep Them Working."
            as="h2"
            start="top 75%"
            className="font-display font-bold text-3xl md:text-5xl text-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl items-stretch">
        {CORE_SERVICES.map((service) => (
          <div key={service.number} className="core-service-card h-full">
            <Magnetic className="block h-full" radius={40} strength={10}>
              <GlassTiltCard className="h-full p-8 flex flex-col">
                <div className="w-full aspect-video rounded-xl border border-white/10 overflow-hidden mb-6">
                  <service.Visual />
                </div>
                <span className="font-mono text-xs text-white/40 tracking-widest">
                  {service.number}
                </span>
                <h3 className="font-display font-bold text-xl text-white mt-4 mb-3">
                  {service.title}
                </h3>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  {service.description}
                </p>
              </GlassTiltCard>
            </Magnetic>
          </div>
        ))}
      </div>
    </div>
  );
}
