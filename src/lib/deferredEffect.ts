/**
 * Defers `callback` by two animation frames so the browser gets a chance to
 * finish initial layout and paint before any GSAP timeline/ScrollTrigger
 * setup runs on the main thread. Returns a cancel function for cleanup.
 */
export function deferToNextFrame(callback: () => void): () => void {
  let outerFrame = 0;
  let innerFrame = 0;

  outerFrame = requestAnimationFrame(() => {
    innerFrame = requestAnimationFrame(callback);
  });

  return () => {
    cancelAnimationFrame(outerFrame);
    cancelAnimationFrame(innerFrame);
  };
}
