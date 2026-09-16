import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PeakLogic Digital collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="relative bg-transparent">
      <LegalPageShell title="Privacy Policy" lastUpdated="September 2026">
        <p>
          This policy explains what information PeakLogic Digital
          (&quot;we&quot;, &quot;us&quot;) collects through
          peaklogicdigital.com, why we collect it, and the choices you have.
          We collect as little as we can get away with.
        </p>

        <h2>What we collect</h2>
        <p>
          <strong>Contact form submissions.</strong> When you submit the
          project inquiry form, we collect the name, email address, and
          message you provide. This is sent directly to us through Web3Forms,
          a third-party form-processing service, and used only to respond to
          your inquiry.
        </p>
        <p>
          <strong>Cookie preference.</strong> If you make a choice in the
          cookie consent banner, we store that choice in your browser&apos;s
          local storage so we don&apos;t ask again. This is not sent to us or
          to any third party.
        </p>
        <p>
          We do not run analytics, advertising, or tracking scripts on this
          site today. If that changes, it will only run after you explicitly
          opt in through the cookie consent banner, and this policy and our{" "}
          <Link href="/cookies">Cookie Policy</Link> will be updated to describe it.
        </p>

        <h2>Third-party processors</h2>
        <p>
          Contact form submissions are processed by{" "}
          <a
            href="https://web3forms.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Web3Forms
          </a>
          , which delivers the submission to us and is bound by its own
          privacy policy. We don&apos;t control, and aren&apos;t responsible
          for, how Web3Forms itself handles data in transit.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep inquiry details for as long as reasonably necessary to
          respond to you and, where a project goes ahead, for the duration of
          that engagement plus a reasonable period afterward for our own
          records. You can ask us to delete it sooner at any time.
        </p>

        <h2>Your rights</h2>
        <p>You can ask us at any time to:</p>
        <ul>
          <li>tell you what data we hold about you,</li>
          <li>correct anything that&apos;s inaccurate,</li>
          <li>delete data we no longer need a reason to keep, and</li>
          <li>stop using your data for a particular purpose.</li>
        </ul>
        <p>
          Send that request through the contact form on the homepage,
          including enough detail (like the email address you used) for us to
          find your record.
        </p>

        <h2>Security</h2>
        <p>
          This site is served entirely over HTTPS. We don&apos;t operate our
          own database of visitor data — the only place inquiry details live
          is in the inbox they&apos;re delivered to and, briefly, in
          Web3Forms&apos; systems while delivering them.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we materially change what we collect or why, we&apos;ll update
          the date at the top of this page.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy, or a request under &quot;Your
          rights&quot; above, can be sent through the contact form on the{" "}
          <Link href="/">homepage</Link>.
        </p>
      </LegalPageShell>
    </main>
  );
}
