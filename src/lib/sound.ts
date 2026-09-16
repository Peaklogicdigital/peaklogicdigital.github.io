let audioContext: AudioContext | null = null;
let enabled = false;

export function isSoundEnabled() {
  return enabled;
}

/** User-gesture-gated: only actually construct/resume the AudioContext once
 *  the toggle is switched on, respecting browser autoplay policy. */
export function setSoundEnabled(value: boolean) {
  enabled = value;
  if (!enabled) return;

  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

/**
 * Ultra-clean ~15ms high-frequency click/pop, synthesized entirely via the
 * Web Audio API - zero audio file downloads. No-ops silently when sound is
 * off or the context hasn't been created yet, so callers never need to
 * check isSoundEnabled() themselves before calling this.
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
