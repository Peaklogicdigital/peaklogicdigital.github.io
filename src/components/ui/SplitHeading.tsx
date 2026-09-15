"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { createHeadingReveal } from "@/lib/textReveal";

type SplitBy = "words" | "chars";
type HeadingTag = "h1" | "h2" | "h3";

type SplitHeadingProps = {
  text: string;
  as?: HeadingTag;
  className?: string;
  splitBy?: SplitBy;
  start?: string;
  playOnMount?: boolean;
  delay?: number;
  stagger?: number;
};

const SWEEP_GRADIENT =
  "linear-gradient(100deg, transparent 35%, rgba(103,232,249,0.95) 48%, rgba(255,255,255,0.95) 52%, rgba(34,211,238,0.95) 56%, transparent 72%)";

export default function SplitHeading({
  text,
  as = "h2",
  className = "",
  splitBy = "words",
  start = "top 78%",
  playOnMount = false,
  delay = 0,
  stagger,
}: SplitHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const Tag = as;
  const tokens = splitBy === "chars" ? text.split("") : text.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!rootRef.current) return;
      createHeadingReveal(rootRef.current, {
        start,
        scrollTriggered: !playOnMount,
        delay,
        stagger: stagger ?? (splitBy === "chars" ? 0.03 : 0.08),
      });
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <Tag className={className}>
        {tokens.map((token, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.15em] -mb-[0.15em] align-top">
              <span className="reveal-inner inline-block will-change-transform">
                {token === "" ? " " : token}
              </span>
            </span>
            {splitBy === "words" && i < tokens.length - 1 ? " " : null}
          </span>
        ))}
      </Tag>
      <Tag
        aria-hidden="true"
        className={`${className} reveal-sweep absolute inset-0 pointer-events-none select-none bg-clip-text text-transparent`}
        style={{
          backgroundImage: SWEEP_GRADIENT,
          backgroundSize: "250% 100%",
          backgroundPosition: "160% 0",
          WebkitBackgroundClip: "text",
        }}
      >
        {text}
      </Tag>
    </div>
  );
}
