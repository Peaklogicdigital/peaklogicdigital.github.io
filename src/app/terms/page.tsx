import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import TermsContent from "@/components/legal/TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply to using peaklogicdigital.com and engaging PeakLogic Digital.",
};

export default function TermsPage() {
  return (
    <main className="relative bg-transparent">
      <LegalPageShell page="terms">
        <TermsContent />
      </LegalPageShell>
    </main>
  );
}
