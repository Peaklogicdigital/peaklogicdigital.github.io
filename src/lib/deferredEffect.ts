const requestIdle: (callback: IdleRequestCallback) => number =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? window.requestIdleCallback.bind(window)
    : (callback) =>
        window.setTimeout(
          () => callback({ didTimeout: true, timeRemaining: () => 0 }),
          1
        ) as unknown as number;

const cancelIdle: (handle: number) => void =
  typeof window !== "undefined" && "cancelIdleCallback" in window
    ? window.cancelIdleCallback.bind(window)
    : (handle) => window.clearTimeout(handle);

/**
 * Defers `callback` by two animation frames, then to the next idle period,
 * so the browser finishes initial layout and paint - and any higher-priority
 * work queued right after it - before GSAP timeline/ScrollTrigger setup runs
 * on the main thread. Falls back to a 1ms timeout where requestIdleCallback
 * isn't available (Safari). Returns a cancel function for cleanup.
 */
export function deferToNextFrame(callback: () => void): () => void {
  let outerFrame = 0;
  let innerFrame = 0;
  let idleHandle = 0;

  outerFrame = requestAnimationFrame(() => {
    innerFrame = requestAnimationFrame(() => {
      idleHandle = requestIdle(() => callback());
    });
  });

  return () => {
    cancelAnimationFrame(outerFrame);
    cancelAnimationFrame(innerFrame);
    cancelIdle(idleHandle);
  };
}
