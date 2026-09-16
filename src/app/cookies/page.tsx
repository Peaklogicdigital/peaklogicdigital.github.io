import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import CookiesContent from "@/components/legal/CookiesContent";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies and local storage peaklogicdigital.com uses.",
};

export default function CookiesPage() {
  return (
    <main className="relative bg-transparent">
      <LegalPageShell page="cookies">
        <CookiesContent />
      </LegalPageShell>
    </main>
  );
}
