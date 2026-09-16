"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which of the given section element IDs is currently closest to the
 * vertical center of the viewport, via IntersectionObserver rather than a
 * scroll listener. Returns null until the first section becomes active.
 */
export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const key = sectionIds.join(",");

  useEffect(() => {
    const ids = key.split(",").filter(Boolean);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const best = visible.reduce((a, b) =>
          Math.abs(a.boundingClientRect.top) < Math.abs(b.boundingClientRect.top) ? a : b
        );
        setActiveId(best.target.id);
      },
      // Fires when a section's box crosses the middle band of the viewport,
      // rather than as soon as any sliver of it enters at the edges.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return activeId;
}
