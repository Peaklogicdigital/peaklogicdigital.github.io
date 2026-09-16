"use client";

import { useEffect } from "react";

const requestIdle: (callback: IdleRequestCallback) => number =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? window.requestIdleCallback.bind(window)
    : (callback) =>
        window.setTimeout(
          () => callback({ didTimeout: true, timeRemaining: () => 0 }),
          1500
        ) as unknown as number;

/**
 * Silently warms the Three.js/@react-three chunk cache while the user is
 * still looking at the hero, so the JS is already fetched and parsed by the
 * time the IntersectionObserver in CoreServices.tsx/SelectedWork.tsx gates
 * the actual mount. This only prefetches the module graph - it doesn't
 * render anything, so it can't itself cause a scroll hitch; the mount/
 * shader-compile cost is handled separately by mounting those components
 * well before they're visible (see the rootMargin on that observer).
 */
export default function ThreePreloader() {
  useEffect(() => {
    requestIdle(() => {
      import("@/components/three/ServicePrism");
      import("@/components/three/DataCore");
      import("@/components/three/Lattice");
      import("@/components/three/MinimalGlassPanel");
    });
  }, []);

  return null;
}
