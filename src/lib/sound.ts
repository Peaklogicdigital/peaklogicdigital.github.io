let audioContext: AudioContext | null = null;
let enabled = true;
let bootstrapped = false;

export function isSoundEnabled() {
  return enabled;
}

function ensureContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

/** User-gesture-gated: only actually construct/resume the AudioContext once
 *  the toggle is switched on, respecting browser autoplay policy. */
export function setSoundEnabled(value: boolean) {
  enabled = value;
  if (!enabled) return;
  ensureContext();
}

/**
 * Sound defaults to on, but the AudioContext still can't be created until a
 * genuine user gesture without violating autoplay policy - and creating it
 * eagerly at mount would add avoidable work during cold load. This wires a
 * one-time listener for the first real interaction (click/key/touch) so the
 * context is primed silently as soon as the user starts using the page,
 * with zero cost before that point. Safe to call multiple times.
 */
export function bootstrapAudioOnFirstInteraction() {
  if (bootstrapped || typeof window === "undefined") return;
  bootstrapped = true;

  function onFirstInteraction() {
    if (enabled) ensureContext();
    window.removeEventListener("pointerdown", onFirstInteraction);
    window.removeEventListener("keydown", onFirstInteraction);
    window.removeEventListener("touchstart", onFirstInteraction);
  }

  window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
  window.addEventListener("keydown", onFirstInteraction, { once: true });
  window.addEventListener("touchstart", onFirstInteraction, { once: true, passive: true });
}

/**
 * Ultra-clean ~15ms high-frequency click/pop, synthesized entirely via the
 * Web Audio API - zero audio file downloads. No-ops silently when sound is
 * off or the context hasn't been created yet (no user gesture seen), so
 * callers never need to check isSoundEnabled() themselves before calling
 * this.
 */
export function playTone(frequency = 1100) {
  if (!enabled || !audioContext) return;

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.02);
}
