"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassTiltCard from "@/components/ui/GlassTiltCard";
import { scrollToSection } from "@/lib/lenis";

export default function OperationalAudit() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex items-center justify-center px-6 py-24">
      <div ref={sectionRef} className="w-full max-w-3xl">
        <GlassTiltCard className="p-10 md:p-16 text-center">
          <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
            OPERATIONAL AUDIT
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-4 mb-6">
            Not Sure Where the Gaps Are?
          </h2>
          <p className="font-body text-white/60 text-base md:text-lg leading-relaxed mb-10">
            An Operational Audit maps every enquiry channel, booking flow, and
            follow-up sequence the business currently runs, then flags
            exactly where leads are getting lost.
          </p>
          <button
            type="button"
            onClick={() => scrollToSection("#contact")}
            className="font-body text-white border border-cyan-400/50 rounded-full px-8 py-3 transition-colors hover:bg-cyan-400/10 hover:border-cyan-400"
          >
            Request an Operational Audit
          </button>
        </GlassTiltCard>
      </div>
    </div>
  );
}
