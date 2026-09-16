"use client";

import { useEffect, useState, type RefObject } from "react";

const requestIdle: (callback: IdleRequestCallback) => number =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? window.requestIdleCallback.bind(window)
    : (callback) =>
        window.setTimeout(
          () => callback({ didTimeout: true, timeRemaining: () => 0 }),
          1500
        ) as unknown as number;

const cancelIdle: (handle: number) => void =
  typeof window !== "undefined" && "cancelIdleCallback" in window
    ? window.cancelIdleCallback.bind(window)
    : (handle) => window.clearTimeout(handle);

const HARD_TIMEOUT_MS = 800;

/**
 * Signals mount-readiness on whichever comes first: the target element
 * coming within `rootMargin` of the viewport, the browser going idle after
 * load, or a hard 800ms timeout. The idle trigger is what normally starts
 * the mount (and its shader compile) in the background well before the user
 * could scroll there - but requestIdleCallback can be starved indefinitely
 * if the main thread stays busy (e.g. a user who starts scrolling within
 * milliseconds of load keeps it continuously occupied with scroll/paint
 * work), which would otherwise push the same compile cost into the middle
 * of that scroll - exactly the freeze this is meant to prevent. The hard
 * timeout guarantees mounting starts promptly regardless.
 */
export function useEarlyMount(ref: RefObject<HTMLElement | null>, rootMargin: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setReady(true);
      },
      { rootMargin }
    );
    observer.observe(el);

    const idleHandle = requestIdle(() => setReady(true));
    const hardTimeout = window.setTimeout(() => setReady(true), HARD_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      cancelIdle(idleHandle);
      window.clearTimeout(hardTimeout);
    };
  }, [ref, rootMargin]);

  return ready;
}
