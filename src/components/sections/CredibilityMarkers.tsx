"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MARKERS = [
  {
    stat: "< 5 min",
    label: "Typical first response once automation is live",
  },
  {
    stat: "1 system",
    label: "Every enquiry channel unified into one place",
  },
  {
    stat: "24/7",
    label: "Coverage outside business hours via automated replies",
  },
  {
    stat: "0",
    label: "Missed follow-ups once a workflow is deployed",
  },
];

export default function CredibilityMarkers() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll(".credibility-item");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
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
      ref={sectionRef}
      className="py-24 px-6 md:px-16 border-y border-white/10"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {MARKERS.map((marker) => (
          <div
            key={marker.label}
            className="credibility-item text-center md:text-left"
          >
            <p className="font-display font-black text-3xl md:text-4xl text-cyan-400">
              {marker.stat}
            </p>
            <p className="font-body text-white/50 text-sm mt-2 leading-relaxed">
              {marker.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
