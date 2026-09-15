"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitHeading from "@/components/ui/SplitHeading";

export default function Bridge() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 60 },
        {
          y: 0,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="bridge"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div
        id="bridge-content"
        ref={contentRef}
        className="max-w-3xl text-center"
      >
        <SplitHeading
          text="A beautiful website that doesn't answer the phone is just digital art."
          as="h2"
          start="top 75%"
          className="font-display font-bold text-3xl md:text-5xl text-white leading-tight"
        />
        <p className="font-body text-white/60 text-base md:text-xl mt-8 leading-relaxed">
          We build the art, but we engineer the infrastructure. Capture the
          lead, book the table, secure the review. Automatically.
        </p>
      </div>
    </div>
  );
}
