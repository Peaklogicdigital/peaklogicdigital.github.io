"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Bridge() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
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
      className="min-h-screen flex items-center justify-center px-4 md:px-6"
    >
      <div
        id="bridge-content"
        ref={contentRef}
        className="max-w-3xl text-center"
      >
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">
          A beautiful website that doesn&apos;t answer the phone is just
          digital art.
        </h2>
        <p className="font-body text-white/60 text-base md:text-xl mt-8 leading-relaxed">
          We build the art, but we engineer the infrastructure. Capture the
          lead, book the table, secure the review. Automatically.
        </p>
      </div>
    </div>
  );
}
