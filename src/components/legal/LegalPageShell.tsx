import Link from "next/link";
import type { ReactNode } from "react";
import { FOCUS_RING } from "@/lib/focusRing";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
];

export default function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="px-6 md:px-16 py-24">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className={`inline-flex items-center gap-2 font-mono text-xs text-cyan-400/80 tracking-widest hover:text-cyan-300 transition-colors rounded ${FOCUS_RING}`}
        >
          ← BACK TO PEAKLOGIC
        </Link>

        <h1 className="font-display font-black text-4xl md:text-6xl text-zinc-100 mt-8 mb-2 tracking-tight">
          {title}
        </h1>
        <p className="font-body text-zinc-500 text-sm mb-12">
          Last updated {lastUpdated}
        </p>

        <div
          className="font-body text-zinc-400 leading-relaxed space-y-6
            [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-zinc-100 [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:first:mt-0
            [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4
            [&_strong]:text-zinc-200 [&_strong]:font-semibold
            [&_a]:text-cyan-400 [&_a]:transition-colors [&_a]:hover:text-cyan-300 [&_a]:hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] [&_a]:rounded"
        >
          {children}
        </div>

        <nav className="mt-20 pt-8 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-3">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-sm text-zinc-500 hover:text-cyan-400 transition-colors rounded ${FOCUS_RING}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
