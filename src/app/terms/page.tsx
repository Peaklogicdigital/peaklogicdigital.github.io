import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply to using peaklogicdigital.com and engaging PeakLogic Digital.",
};

export default function TermsPage() {
  return (
    <main className="relative bg-transparent">
      <LegalPageShell title="Terms of Service" lastUpdated="September 2026">
        <p>
          These terms cover two things: using this website, and, at a high
          level, engaging PeakLogic Digital for work. The specifics of any
          actual project — scope, price, timeline — are agreed separately in
          writing before work begins; nothing here overrides that agreement.
        </p>

        <h2>Using this website</h2>
        <p>
          You&apos;re welcome to browse, read, and reach out through the
          contact form. You agree not to use the site to do anything
          unlawful, to attempt to disrupt or gain unauthorized access to it
          or the systems behind it, or to scrape or harvest it at scale
          without our permission.
        </p>

        <h2>What we offer</h2>
        <p>
          PeakLogic Digital designs and builds websites, and layers on
          supporting systems, digital presence management, booking
          integrations, brand and print work, and lead-response automation,
          as described elsewhere on this site. Pricing shown on the site is
          indicative and can change; the price for actual work is whatever is
          confirmed in writing before that work starts.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The design, code, and content of this website belong to PeakLogic
          Digital unless stated otherwise. Deliverables produced for a client
          project — the client&apos;s own site, brand assets, and similar —
          are governed by the ownership terms in that project&apos;s
          agreement, not by this page.
        </p>

        <h2>No warranty</h2>
        <p>
          This website is provided as-is. We try to keep it accurate and
          available, but we don&apos;t guarantee it will be uninterrupted,
          error-free, or fit for a particular purpose, and we&apos;re not
          liable for issues arising from your use of it, to the extent the
          law allows us to limit that liability.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms as the site or services change.
          Continuing to use the site after an update means you accept the
          current version.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent through the contact form on
          the <Link href="/">homepage</Link>.
        </p>
      </LegalPageShell>
    </main>
  );
}
