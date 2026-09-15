"use client";

import { useRef } from "react";
import { scrollToSection } from "@/lib/lenis";
import Magnetic from "@/components/ui/Magnetic";
import SplitHeading from "@/components/ui/SplitHeading";

const HEADLINE = "PEAKLOGIC";

const INDEX_CHIPS = [
  { label: "Digital Presence", href: "#digital-presence" },
  { label: "Booking Systems", href: "#booking-systems" },
  { label: "Brand & Print", href: "#brand-print" },
  { label: "Lead Automation", href: "#lead-automation" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center pointer-events-none"
    >
      <SplitHeading
        text={HEADLINE}
        as="h1"
        splitBy="chars"
        playOnMount
        delay={0.2}
        className="font-display font-black text-white text-7xl md:text-[10vw] leading-none tracking-tight text-center"
      />
      <p className="font-body text-white/70 text-lg md:text-2xl mt-6 text-center max-w-2xl px-6">
        High-End Web Design &amp; Development. Built fast, built to convert,
        backed by the systems that keep it running.
      </p>
      <div className="pointer-events-auto flex flex-wrap justify-center gap-3 mt-10 px-6">
        {INDEX_CHIPS.map((chip) => (
          <Magnetic key={chip.href} className="block" radius={30} strength={8}>
            <a
              href={chip.href}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(chip.href);
              }}
              className="font-body text-sm text-white/80 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2 transition-colors hover:bg-white/10 hover:border-white/25 hover:text-white"
            >
              {chip.label}
            </a>
          </Magnetic>
        ))}
      </div>
    </div>
  );
}
