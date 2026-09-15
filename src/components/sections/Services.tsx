"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SECTIONS = [
  {
    id: "digital-presence",
    number: "01",
    heading: "Digital Presence and Reputation",
    body: "We set up and manage the Google Business Profile so the business shows up correctly in local search and maps. After each visit, a short automatic message asks the customer for a review. The owner never has to remember to ask.",
  },
  {
    id: "booking-systems",
    number: "02",
    heading: "Booking and Reservations",
    body: "We connect whichever booking method actually fits the business, a simple WhatsApp line, a dedicated platform, or something in between, so appointments and tables land in one place instead of three different apps.",
  },
  {
    id: "brand-print",
    number: "03",
    heading: "Brand and Print",
    body: "For businesses that want a complete look, we design the menu, the signage, and the printed materials alongside the site, so everything a customer sees matches.",
  },
  {
    id: "lead-automation",
    number: "04",
    heading: "Follow Up and Lead Response",
    body: "A missed call is a missed customer. We set up automatic replies so every call, message, or form submission gets a response within minutes, even outside business hours.",
  },
];

function TiltPanel({ number }: { number: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const quickToX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickToY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  function ensureQuickTo() {
    if (!panelRef.current) return;
    if (!quickToX.current) {
      quickToX.current = gsap.quickTo(panelRef.current, "rotationX", {
        duration: 0.5,
        ease: "power3",
      });
    }
    if (!quickToY.current) {
      quickToY.current = gsap.quickTo(panelRef.current, "rotationY", {
        duration: 0.5,
        ease: "power3",
      });
    }
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const panel = panelRef.current;
    if (!panel) return;
    ensureQuickTo();

    const rect = panel.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;

    const maxRotation = 12;
    quickToY.current?.(relX * maxRotation * 2);
    quickToX.current?.(relY * -maxRotation * 2);
  }

  function handleMouseLeave() {
    ensureQuickTo();
    quickToX.current?.(0);
    quickToY.current?.(0);
  }

  return (
    <div className="w-full flex justify-center [perspective:1000px]">
      <div
        ref={panelRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-md aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] flex items-center justify-between p-8"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]" />
        <span className="font-mono text-xs text-white/40 tracking-widest">
          {number}
        </span>
      </div>
    </div>
  );
}

function ServiceSection({
  id,
  number,
  heading,
  body,
  reverse,
}: {
  id: string;
  number: string;
  heading: string;
  body: string;
  reverse: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const panelWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        panelWrapperRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
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
    <div
      id={id}
      ref={sectionRef}
      className={`min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 px-6 md:px-16 py-24 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div ref={textRef} className="w-full md:w-1/2 max-w-lg">
        <span className="font-mono text-xs text-cyan-400/80 tracking-widest">
          {number}
        </span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-4 mb-6 leading-tight">
          {heading}
        </h2>
        <p className="font-body text-white/60 text-base md:text-lg leading-relaxed">
          {body}
        </p>
      </div>
      <div ref={panelWrapperRef} className="w-full md:w-1/2 flex justify-center">
        <TiltPanel number={number} />
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <div>
      {SECTIONS.map((section, index) => (
        <ServiceSection key={section.id} {...section} reverse={index % 2 === 1} />
      ))}
    </div>
  );
}
