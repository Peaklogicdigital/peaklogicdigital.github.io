"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassTiltCard from "@/components/ui/GlassTiltCard";

const CORE_SERVICES = [
  {
    number: "01",
    title: "Enquiry & Lead Handling Systems",
    description:
      "Every inbound enquiry, call, form, message, or walk-in, gets logged, tagged, and routed to the right person automatically. Nothing sits in an inbox waiting to be noticed.",
  },
  {
    number: "02",
    title: "Workflow Design",
    description:
      "We map how work actually moves through the business, then build the automations and checklists that keep it moving the same way every time, regardless of who's on shift.",
  },
  {
    number: "03",
    title: "Tool & AI Integration",
    description:
      "Existing tools stay. We connect calendars, POS systems, and messaging platforms, and layer in AI where it removes real manual work, not where it looks impressive.",
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
          THE OPERATIONAL LAYER
        </span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-4">
          What Actually Keeps It Running
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {CORE_SERVICES.map((service) => (
          <div key={service.number} className="core-service-card">
            <GlassTiltCard className="h-full p-8 flex flex-col">
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
          </div>
        ))}
      </div>
    </div>
  );
}
