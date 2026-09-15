"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassTiltCard from "@/components/ui/GlassTiltCard";
import Magnetic from "@/components/ui/Magnetic";
import SplitHeading from "@/components/ui/SplitHeading";
import { scrollToSection } from "@/lib/lenis";

const TIERS = [
  {
    name: "STANDARD",
    tagline: "Website",
    whatYouGet:
      "A custom-built site, live on your own domain, mobile-first from the first pixel. Hosting, SSL, and the legal pages you're required to have, all included, all handled.",
    howItWorks:
      "We build it, you approve it, it goes live within days. After that, monthly upkeep keeps it fast, secure, and current, so it never quietly goes stale the way most small business sites do.",
    launchPrice: "€249",
    monthlyPrice: "€35/month",
    context:
      "A standalone build like this typically runs €399 to €999 before you've even added ongoing maintenance, which usually adds another €30 to €150 a month on its own.",
  },
  {
    name: "PLUS",
    tagline: "Website + Presence",
    whatYouGet:
      "Everything in Standard, plus a properly optimized Google Business Profile and an automatic system that asks every customer for a review right after their visit, so your rating climbs without you lifting a finger.",
    howItWorks:
      "We set up your booking method of choice, whether that's a WhatsApp line or a dedicated platform, connect your Google presence, and manage both every month alongside the site itself.",
    launchPrice: "€329",
    monthlyPrice: "€59/month",
    context:
      "Buying a website maintenance plan and a Google Business management service separately typically costs €60 to over €130 a month combined. Here it's one plan, one price, one person to call.",
  },
  {
    name: "PREMIUM",
    tagline: "Full Identity",
    whatYouGet:
      "Everything in Plus, plus a complete visual identity, your menu, your signage, your printed materials, all designed to match the site and each other, with priority turnaround on every update after launch.",
    howItWorks:
      "Your design work runs in parallel with the build, so the whole identity launches together instead of arriving in pieces over separate invoices.",
    launchPrice: "€449",
    monthlyPrice: "€79/month",
    context:
      "Commissioned separately, a professional menu design alone typically runs €80 to €250, on top of the website and its maintenance. Bundled here, it's part of one launch, at a price below what the pieces would cost apart.",
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".pricing-card");
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
      id="pricing"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 md:px-16 py-24"
    >
      <div className="max-w-2xl text-center mb-16">
        <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
          PRICING
        </span>
        <div className="mt-4">
          <SplitHeading
            text="Three Ways In"
            as="h2"
            start="top 75%"
            className="font-display font-bold text-3xl md:text-5xl text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl items-stretch">
        {TIERS.map((tier) => (
          <div key={tier.name} className="pricing-card h-full">
            <Magnetic className="block h-full" radius={40} strength={10}>
            <GlassTiltCard className="h-full p-8 flex flex-col">
              <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
                {tier.name}
              </span>
              <h3 className="font-display font-bold text-2xl text-white mt-2 mb-6">
                {tier.tagline}
              </h3>

              <div className="mb-6">
                <p className="font-display font-black text-3xl text-white">
                  {tier.launchPrice}
                </p>
                <p className="font-body text-white/50 text-sm">
                  to launch, then {tier.monthlyPrice}
                </p>
              </div>

              <div className="flex-1">
                <p className="font-body text-white/70 text-sm leading-relaxed mb-4">
                  {tier.whatYouGet}
                </p>
                <p className="font-body text-white/50 text-sm leading-relaxed">
                  {tier.howItWorks}
                </p>
              </div>

              <p className="font-body text-white/35 text-xs leading-relaxed mt-6 pt-6 border-t border-white/10">
                {tier.context}
              </p>
            </GlassTiltCard>
            </Magnetic>
          </div>
        ))}
      </div>

      <Magnetic className="block mt-16" radius={50} strength={10}>
        <button
          type="button"
          onClick={() => scrollToSection("#contact")}
          className="font-display font-bold text-white bg-cyan-400/10 border border-cyan-400/50 rounded-full px-10 py-4 text-lg transition-colors hover:bg-cyan-400/20 hover:border-cyan-400"
        >
          Interested?
        </button>
      </Magnetic>
    </div>
  );
}
