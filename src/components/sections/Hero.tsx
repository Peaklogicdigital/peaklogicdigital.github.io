"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const HEADLINE = "PEAKLOGIC";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const letters = containerRef.current?.querySelectorAll(".hero-letter");
    if (!letters || letters.length === 0) return;

    const tween = gsap.fromTo(
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

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen flex flex-col items-center justify-center pointer-events-none"
    >
      <h1 className="font-display font-black text-white text-7xl md:text-[10vw] leading-none tracking-tight overflow-hidden flex">
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
