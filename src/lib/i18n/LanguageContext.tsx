"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { deferToNextFrame } from "@/lib/deferredEffect";
import en from "./locales/en.json";
import es from "./locales/es.json";
import cat from "./locales/cat.json";
import ro from "./locales/ro.json";

export type Locale = "en" | "es" | "cat" | "ro";
export const LOCALES: Locale[] = ["en", "es", "cat", "ro"];

type Dictionary = typeof en;

const DICTIONARIES: Record<Locale, Dictionary> = { en, es, cat, ro };

// Each locale's own display name, independent of the currently active
// locale - used for labelling the switcher's buttons.
export const LOCALE_NAMES: Record<Locale, string> = {
  en: en.meta.name,
  es: es.meta.name,
  cat: cat.meta.name,
  ro: ro.meta.name,
};

const STORAGE_KEY = "peaklogic-locale";

function resolveBrowserLocale(): Locale {
  const languages =
    typeof navigator !== "undefined"
      ? navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language]
      : [];

  for (const lang of languages) {
    const base = lang.toLowerCase();
    if (base.startsWith("ca")) return "cat";
    if (base.startsWith("es")) return "es";
    if (base.startsWith("ro")) return "ro";
    if (base.startsWith("en")) return "en";
  }
  return "en";
}

function getPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
  t: (path: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Resolve the starting locale (stored choice, else browser language) once
  // the client is available. Deferred a frame, matching the codebase's
  // established pattern for effects that set state on mount, so this never
  // competes with first paint.
  useEffect(() => {
    return deferToNextFrame(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored && (LOCALES as string[]).includes(stored)) {
          setLocaleState(stored as Locale);
          return;
        }
      } catch {
        // localStorage can throw in private/blocked contexts; fall through
        // to the browser-language guess below.
      }
      setLocaleState(resolveBrowserLocale());
    });
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sound/analytics-style no-op: the switch still applies for this
      // session, it just won't be remembered on the next visit.
    }
  }

  const dict = DICTIONARIES[locale];

  const t = useMemo(() => {
    return (path: string, vars?: Record<string, string | number>) => {
      const value = getPath(dict, path);
      let result = typeof value === "string" ? value : path;
      if (vars) {
        for (const [key, val] of Object.entries(vars)) {
          result = result.split(`{${key}}`).join(String(val));
        }
      }
      return result;
    };
  }, [dict]);

  const value = useMemo(
    () => ({ locale, setLocale, dict, t }),
    [locale, dict, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
