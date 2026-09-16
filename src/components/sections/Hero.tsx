"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "@/lib/lenis";
import { deferToNextFrame } from "@/lib/deferredEffect";
import { playTone } from "@/lib/sound";
import Magnetic from "@/components/ui/Magnetic";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const HEADLINE = "PEAKLOGIC";
const TYPE_SPEED_MS = 45;
const CURSOR_FADE_DELAY_S = 0.4;
const CURSOR_FADE_DURATION_S = 0.6;

const INDEX_CHIPS = [
  { key: "digitalPresence", href: "#digital-presence" },
  { key: "bookingSystems", href: "#booking-systems" },
  { key: "brandPrint", href: "#brand-print" },
  { key: "leadAutomation", href: "#lead-automation" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [typedCount, setTypedCount] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const { t } = useLanguage();

  // Character-by-character typing reveal, deferred so it doesn't compete
  // with first paint.
  useEffect(() => {
    let charIndex = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const cancelDefer = deferToNextFrame(() => {
      intervalId = setInterval(() => {
        charIndex += 1;
        setTypedCount(charIndex);
        if (charIndex >= HEADLINE.length) {
          clearInterval(intervalId);
          setIsTypingDone(true);
        }
      }, TYPE_SPEED_MS);
    });

    return () => {
      cancelDefer();
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Once typing finishes, hand the cursor off from its CSS blink to a
  // smooth GSAP fade-out.
  useEffect(() => {
    if (!isTypingDone) return;

    const ctx = gsap.context(() => {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: CURSOR_FADE_DURATION_S,
        delay: CURSOR_FADE_DELAY_S,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, [isTypingDone]);

  // Scroll-scrubbed grow/fade exit, unchanged.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const cancel = deferToNextFrame(() => {
      ctx = gsap.context(() => {
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
          ease: "none",
        });
      }, sectionRef);
    });

    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <div
      id="hero"
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center pointer-events-none"
    >
      <h1
        ref={headlineRef}
        className="font-display font-black text-white text-4xl sm:text-5xl md:text-[10vw] leading-none tracking-tight"
      >
        <span aria-hidden="true">
          {HEADLINE.slice(0, typedCount)}
          <span
            ref={cursorRef}
            className={`text-cyan-400 ${isTypingDone ? "" : "cursor-blink"}`}
          >
            |
          </span>
        </span>
        <span className="sr-only">{HEADLINE}</span>
      </h1>
      <p className="font-body text-white/70 text-lg md:text-2xl mt-6 text-center max-w-2xl px-4 md:px-6">
        {t("hero.subtitle")}
      </p>
      <div className="pointer-events-auto flex flex-wrap justify-center gap-3 mt-10 px-4 md:px-6">
        {INDEX_CHIPS.map((chip) => (
          <Magnetic key={chip.href} className="block" radius={30} strength={8}>
            <a
              href={chip.href}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(chip.href);
              }}
              onMouseEnter={() => playTone(1100)}
              className="font-body text-sm text-white/80 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2 transition-colors hover:bg-white/10 hover:border-white/25 hover:text-white"
            >
              {t(`hero.chips.${chip.key}`)}
            </a>
          </Magnetic>
        ))}
      </div>
      <div className="pointer-events-auto mt-4">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
