"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HEADLINE = "PEAKLOGIC";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const letters = headlineRef.current?.querySelectorAll(".hero-letter");
      if (letters && letters.length > 0) {
        gsap.fromTo(
          letters,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.05,
            delay: 0.2,
          }
        );
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }).to(headlineRef.current, {
        scale: 4,
        opacity: 0,
        filter: "blur(10px)",
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center pointer-events-none"
    >
      <h1
        ref={headlineRef}
        className="font-display font-black text-white text-7xl md:text-[10vw] leading-none tracking-tight overflow-hidden flex"
      >
        {HEADLINE.split("").map((letter, index) => (
          <span key={index} className="hero-letter inline-block">
            {letter}
          </span>
        ))}
      </h1>
      <p className="font-body text-white/70 text-lg md:text-2xl mt-6 text-center">
        Digital Ascendance through Precision Code.
      </p>
    </div>
  );
}
