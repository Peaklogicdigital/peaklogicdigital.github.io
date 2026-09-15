"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SECTIONS = [
  {
    id: "web-design-building",
    number: "01",
    heading: "Web Design and Building",
    body: "We design and build the site itself, custom, mobile-first, and live on your own domain. Everything else on this list exists to support what gets built here first.",
  },
  {
    id: "lead-automation",
    number: "02",
    heading: "Follow Up and Lead Response",
    body: "A missed call is a missed customer. We set up automatic replies so every call, message, or form submission gets a response within minutes, even outside business hours.",
  },
  {
    id: "digital-presence",
    number: "03",
    heading: "Digital Presence and Reputation",
    body: "We set up and manage the Google Business Profile so the business shows up correctly in local search and maps. After each visit, a short automatic message asks the customer for a review. The owner never has to remember to ask.",
  },
  {
    id: "booking-systems",
    number: "04",
    heading: "Booking and Reservations",
    body: "We connect whichever booking method actually fits the business, a simple WhatsApp line, a dedicated platform, or something in between, so appointments and tables land in one place instead of three different apps.",
  },
  {
    id: "brand-print",
    number: "05",
    heading: "Brand and Print",
    body: "For businesses that want a complete look, we design the menu, the signage, and the printed materials alongside the site, so everything a customer sees matches.",
  },
];

function ServiceRow({
  id,
  number,
  heading,
  body,
}: {
  id: string;
  number: string;
  heading: string;
  body: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, rowRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id={id}
      ref={rowRef}
      className="group border-t border-white/10 py-10 md:py-14 first:border-t-0"
    >
      <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-10">
        <span className="font-mono text-sm text-cyan-400/70 md:w-16 shrink-0">
          {number}
        </span>
        <div className="flex-1">
          <h3 className="font-display font-bold text-2xl md:text-4xl text-white mb-3 transition-colors duration-300 group-hover:text-cyan-300">
            {heading}
          </h3>
          <p className="font-body text-white/60 text-base md:text-lg leading-relaxed max-w-3xl">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <div className="py-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        {SECTIONS.map((section) => (
          <ServiceRow key={section.id} {...section} />
        ))}
      </div>
    </div>
  );
}
