import Link from "next/link";
import { FOCUS_RING } from "@/lib/focusRing";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 md:px-16 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-display font-bold text-white/70 text-sm tracking-widest">
          PEAKLOGIC
        </span>
        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-xs text-white/40 hover:text-cyan-400 transition-colors rounded ${FOCUS_RING}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="font-body text-xs text-white/30">
          © {new Date().getFullYear()} PeakLogic Digital
        </p>
      </div>
    </footer>
  );
}
