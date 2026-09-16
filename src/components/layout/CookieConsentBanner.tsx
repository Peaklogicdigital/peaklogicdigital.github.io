"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredConsent, storeConsent, type ConsentChoice } from "@/lib/consent";
import { deferToNextFrame } from "@/lib/deferredEffect";
import { FOCUS_RING } from "@/lib/focusRing";

export default function CookieConsentBanner() {
  // Starts false on both server and client so there's nothing for hydration
  // to mismatch on; whether to actually show the banner depends on
  // localStorage, which is only checked client-side after mount below.
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    if (getStoredConsent()) return;
    return deferToNextFrame(() => setVisible(true));
  }, []);

  // Separate effect so "visible" renders once at its initial (off-screen,
  // transparent) position before "entered" flips and the CSS transition
  // actually has something to animate from.
  useEffect(() => {
    if (!visible) return;
    return deferToNextFrame(() => setEntered(true));
  }, [visible]);

  function dismiss(choice: ConsentChoice) {
    storeConsent(choice);
    setEntered(false);
    window.setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  const primaryButtonClasses = `font-body text-sm font-semibold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 rounded-full px-5 py-2.5 transition-colors ${FOCUS_RING}`;
  const secondaryButtonClasses = `font-body text-sm text-white border border-white/20 hover:bg-white/10 rounded-full px-5 py-2.5 transition-colors ${FOCUS_RING}`;
  const tertiaryButtonClasses = `font-body text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-full px-5 py-2.5 transition-colors ${FOCUS_RING}`;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className={`fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 md:pb-6 pointer-events-none transition-all duration-300 ease-out ${
        entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-6 md:p-7">
        {!showPreferences ? (
          <>
            <p className="font-body text-sm text-zinc-300 leading-relaxed">
              We use essential local storage to run this site, and would like
              your permission for optional analytics to help us improve it.
              Read our{" "}
              <Link
                href="/cookies"
                className={`text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors rounded ${FOCUS_RING}`}
              >
                Cookie Policy
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                type="button"
                onClick={() => dismiss("all")}
                className={primaryButtonClasses}
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => dismiss("essential")}
                className={secondaryButtonClasses}
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                aria-expanded={showPreferences}
                className={tertiaryButtonClasses}
              >
                Preferences
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="font-body text-sm text-zinc-300 leading-relaxed mb-5">
              Choose which non-essential storage you&apos;re comfortable with.
            </p>
            <div className="space-y-3">
              <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 px-4 py-3">
                <span className="font-body text-sm text-zinc-300">
                  Essential
                  <span className="block text-xs text-zinc-500">
                    Required to remember this choice. Always on.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked
                  disabled
                  aria-checked="true"
                  aria-label="Essential storage, always on"
                  className={`h-4 w-4 rounded accent-cyan-500 ${FOCUS_RING}`}
                />
              </label>
              <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 px-4 py-3 cursor-pointer">
                <span className="font-body text-sm text-zinc-300">
                  Analytics
                  <span className="block text-xs text-zinc-500">
                    Helps us understand how the site is used.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                  aria-checked={analyticsEnabled}
                  aria-label="Allow analytics storage"
                  className={`h-4 w-4 rounded accent-cyan-500 ${FOCUS_RING}`}
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                type="button"
                onClick={() => dismiss(analyticsEnabled ? "all" : "essential")}
                className={primaryButtonClasses}
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className={tertiaryButtonClasses}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
