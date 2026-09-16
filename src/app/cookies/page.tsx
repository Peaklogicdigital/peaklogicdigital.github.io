import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies and local storage peaklogicdigital.com uses.",
};

export default function CookiesPage() {
  return (
    <main className="relative bg-transparent">
      <LegalPageShell title="Cookie Policy" lastUpdated="September 2026">
        <p>
          This site doesn&apos;t set any tracking or advertising cookies
          today. Here&apos;s exactly what it does store, and the choices you
          have.
        </p>

        <h2>What we actually use</h2>
        <p>
          <strong>Cookie consent preference.</strong> When you choose
          &quot;Accept All&quot;, &quot;Essential Only&quot;, or save
          preferences in the cookie banner, that choice is saved in your
          browser&apos;s local storage — not a cookie — purely so we don&apos;t
          ask again on your next visit. It never leaves your browser.
        </p>
        <p>
          That&apos;s the only thing this site stores in your browser right
          now. There is no analytics, advertising, or third-party tracking
          script running.
        </p>

        <h2>If that changes</h2>
        <p>
          The &quot;Accept All&quot; and &quot;Preferences&quot; options in
          the banner exist so that if we add an analytics tool in the future
          (to understand traffic and improve the site), it will only run for
          visitors who&apos;ve opted in — never by default. This page will be
          updated to name the tool and what it stores before that happens.
        </p>

        <h2>Third-party cookies</h2>
        <p>
          Submitting the contact form sends your details to{" "}
          <a
            href="https://web3forms.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Web3Forms
          </a>
          , a third-party form processor, which may set its own cookies as
          part of handling that request. That&apos;s governed by their policy,
          not this one.
        </p>

        <h2>Controlling storage yourself</h2>
        <p>
          You can clear your cookie consent choice at any time by clearing
          this site&apos;s local storage in your browser&apos;s settings, or
          by using a private/incognito window. Most browsers also let you
          block local storage and cookies entirely on a per-site basis.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If what we store changes, we&apos;ll update the date at the top of
          this page and, for anything non-essential, ask again through the
          banner.
        </p>
      </LegalPageShell>
    </main>
  );
}
