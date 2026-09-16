"use client";

import { useEffect, useState } from "react";
import { setSoundEnabled, playTone, bootstrapAudioOnFirstInteraction } from "@/lib/sound";
import { useActiveSection } from "@/lib/useActiveSection";
import { FOCUS_RING } from "@/lib/focusRing";

const SECTION_IDS = ["hero", "core-services", "selected-work", "contact"];

export default function SoundToggle() {
  // Sound defaults to on; the AudioContext itself is still only created on
  // the user's first real interaction (see bootstrapAudioOnFirstInteraction),
  // so this doesn't cost anything during cold load.
  const [enabled, setEnabled] = useState(true);
  const activeSection = useActiveSection(SECTION_IDS);

  useEffect(() => {
    bootstrapAudioOnFirstInteraction();
  }, []);

  // A quiet pop on every section change - only ever audible once sound is
  // on, since playTone() itself no-ops while disabled.
  useEffect(() => {
    if (activeSection) playTone(900);
  }, [activeSection]);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    if (next) playTone(1400);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={`Sound ${enabled ? "on" : "off"}`}
      className={`fixed top-6 right-6 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/60 backdrop-blur-md px-4 py-2 font-mono text-[11px] tracking-widest text-white/50 hover:text-white hover:border-white/25 transition-colors ${FOCUS_RING}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full transition-colors ${
          enabled ? "bg-cyan-400" : "bg-white/20"
        }`}
      />
      SOUND: {enabled ? "ON" : "OFF"}
    </button>
  );
}
