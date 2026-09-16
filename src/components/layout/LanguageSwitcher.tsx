"use client";

import { LOCALES, LOCALE_NAMES, useLanguage, type Locale } from "@/lib/i18n/LanguageContext";
import { FOCUS_RING } from "@/lib/focusRing";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md p-1"
    >
      {LOCALES.map((code: Locale) => {
        const isActive = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={isActive}
            aria-label={LOCALE_NAMES[code]}
            className={`rounded-full px-2.5 py-1 font-mono text-xs tracking-wider transition-colors ${FOCUS_RING} ${
              isActive
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                : "text-zinc-500 hover:text-zinc-300 border border-transparent"
            }`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
