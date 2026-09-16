"use client";

import Link from "next/link";
import { FOCUS_RING } from "@/lib/focusRing";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const LEGAL_LINKS = [
  { href: "/privacy", key: "privacy" },
  { href: "/terms", key: "terms" },
  { href: "/cookies", key: "cookies" },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-white/10 px-6 md:px-16 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-display font-bold text-white/70 text-sm tracking-widest">
          PEAKLOGIC
        </span>
        <nav
          aria-label={t("footer.legalNavLabel")}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-xs text-white/40 hover:text-cyan-400 transition-colors rounded ${FOCUS_RING}`}
            >
              {t(`footer.links.${link.key}`)}
            </Link>
          ))}
        </nav>
        <p className="font-body text-xs text-white/30">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
