import type Lenis from "@studio-freight/lenis";

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const target = document.querySelector(id);
  if (!target) return;

  if (window.lenis) {
    window.lenis.scrollTo(target as HTMLElement, { offset: 0 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
