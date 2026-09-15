import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type HeadingRevealOptions = {
  /** ScrollTrigger start position. Ignored when scrollTriggered is false. */
  start?: string;
  /** Stagger (seconds) between each masked word/char. */
  stagger?: number;
  /** Duration (seconds) of each word/char's slide + tilt. */
  duration?: number;
  /** Delay (seconds) before the timeline begins. */
  delay?: number;
  /** When false, the timeline plays immediately instead of on scroll. */
  scrollTriggered?: boolean;
};

/**
 * Builds the "Monolithic Masked Reveal": each `.reveal-inner` span slides up
 * from below its overflow-hidden mask with a slight 3D tilt, then the
 * `.reveal-sweep` overlay (a gradient-clipped duplicate of the heading)
 * sweeps a cyan highlight across the now-settled text. No opacity, blur, or
 * scale is used anywhere in the sequence, so the type stays sharp throughout.
 */
export function createHeadingReveal(
  root: HTMLElement,
  {
    start = "top 78%",
    stagger = 0.06,
    duration = 1.1,
    delay = 0,
    scrollTriggered = true,
  }: HeadingRevealOptions = {}
) {
  const lines = root.querySelectorAll<HTMLElement>(".reveal-inner");
  if (lines.length === 0) return null;

  const sweep = root.querySelector<HTMLElement>(".reveal-sweep");

  const tl = gsap.timeline({
    delay,
    scrollTrigger: scrollTriggered
      ? {
          trigger: root,
          start,
          toggleActions: "play none none none",
        }
      : undefined,
  });

  tl.fromTo(
    lines,
    { yPercent: 100, rotateX: 15 },
    {
      yPercent: 0,
      rotateX: 0,
      duration,
      ease: "power4.out",
      stagger,
      transformOrigin: "50% 100%",
      transformPerspective: 700,
    }
  );

  if (sweep) {
    tl.fromTo(
      sweep,
      { backgroundPosition: "160% 0" },
      {
        backgroundPosition: "-60% 0",
        duration: 0.85,
        ease: "power2.inOut",
      },
      `-=${Math.min(duration * 0.35, 0.45)}`
    );
  }

  return tl;
}
