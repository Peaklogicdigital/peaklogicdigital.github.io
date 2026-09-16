import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import PrivacyContent from "@/components/legal/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PeakLogic Digital collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="relative bg-transparent">
      <LegalPageShell page="privacy">
        <PrivacyContent />
      </LegalPageShell>
    </main>
  );
}
