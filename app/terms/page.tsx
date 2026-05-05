import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — Sombra",
  description:
    "Terms governing your use of the Sombra wallet, prover daemon, and sombra.tech.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "May 5, 2026";

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="legal">
        <header className="legal-header">
          <div className="legal-eyebrow">Legal</div>
          <h1 className="legal-title">Terms of Service</h1>
          <div className="legal-meta">Last updated: {LAST_UPDATED}</div>
        </header>

        <article className="legal-body">
          <section>
            <h2>Summary</h2>
            <p>
              Sombra is self-custody software, provided as-is, with no
              warranty. You are responsible for your own keys, your own funds,
              and your own jurisdiction&rsquo;s rules. If you don&rsquo;t
              agree with these terms, don&rsquo;t use the software.
            </p>
          </section>

          <section>
            <h2>1. Agreement</h2>
            <p>
              These Terms of Service (the &ldquo;Terms&rdquo;) govern your
              access to and use of the Sombra browser extension, the Sombra
              prover daemon, and the website at{" "}
              <a href="https://sombra.tech">sombra.tech</a> (collectively, the
              &ldquo;Software&rdquo;), all published by Bonsol Labs Inc.
              (&ldquo;Bonsol&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By
              installing, opening, or using the Software you agree to these
              Terms.
            </p>
          </section>

          <section>
            <h2>2. Self-custody and key management</h2>
            <p>
              The Software is non-custodial. Your seed phrase and private keys
              live on your device, encrypted with a password you choose. We
              never see your password, your seed phrase, or your decrypted
              keys, and we cannot recover any of them on your behalf. If you
              lose your seed phrase or your password, your funds are lost
              permanently.
            </p>
            <p>You are solely responsible for:</p>
            <ul>
              <li>Backing up your seed phrase in a secure, offline location.</li>
              <li>Choosing a password you can remember and that others cannot guess.</li>
              <li>Protecting the device where the Wallet is installed.</li>
              <li>Verifying every transaction before authorizing it.</li>
              <li>Verifying download integrity for the prover daemon binary.</li>
            </ul>
          </section>

          <section>
            <h2>3. No financial advice</h2>
            <p>
              The Software is a tool. It is not investment advice, tax advice,
              or legal advice. Any decision to acquire, transfer, or dispose
              of digital assets is yours alone. Cryptoasset prices are
              volatile and you may lose all of your funds.
            </p>
          </section>

          <section>
            <h2>4. Compliance with local law</h2>
            <p>
              You agree to comply with all laws and regulations applicable to
              you, including sanctions, anti-money-laundering rules, and tax
              obligations. You will not use the Software in any jurisdiction
              where its use is prohibited, and you will not use it on behalf
              of any sanctioned person or entity. If your jurisdiction
              requires a license to use privacy-enhancing financial software,
              you are responsible for obtaining it.
            </p>
          </section>

          <section>
            <h2>5. Third-party networks and services</h2>
            <p>
              The Software interacts with the Solana blockchain and with
              Bonsol-operated infrastructure (QFire relay, optional remote
              prover). Solana is a decentralized public network operated by
              third parties; we have no control over it, its validators, or
              its forks. Outages, congestion, reorganizations, or chain forks
              on Solana may delay, prevent, or alter your transactions. We
              are not liable for these events.
            </p>
          </section>

          <section>
            <h2>6. No warranty</h2>
            <p>
              THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
              AVAILABLE&rdquo;, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS
              FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR THE ABSENCE OF
              BUGS, ERRORS, OR VULNERABILITIES. WE DO NOT WARRANT THAT THE
              SOFTWARE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE AGAINST
              EVERY POSSIBLE ATTACK.
            </p>
          </section>

          <section>
            <h2>7. Limitation of liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BONSOL AND
              ITS AFFILIATES, OFFICERS, EMPLOYEES, AND CONTRIBUTORS WILL NOT
              BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
              OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF FUNDS, LOSS OF DATA,
              LOSS OF PROFITS, OR LOSS OF GOODWILL, ARISING OUT OF OR
              RELATED TO YOUR USE OF THE SOFTWARE. NOTHING IN THESE TERMS
              EXCLUDES LIABILITY THAT CANNOT BE EXCLUDED UNDER APPLICABLE LAW.
            </p>
          </section>

          <section>
            <h2>8. No refunds</h2>
            <p>
              The Software is free to use. Bonsol does not collect
              subscription fees from end users for the Wallet. On-chain
              network fees, prover fees, and any third-party fees are not
              paid to Bonsol and are not refundable.
            </p>
          </section>

          <section>
            <h2>9. Updates and discontinuation</h2>
            <p>
              We may update the Software at any time, including to add, remove,
              or change features, fix security issues, or comply with law.
              Some updates will be required to keep the Wallet functional. We
              may also discontinue the Software entirely; if we do, your
              encrypted vault remains on your device and your seed phrase
              continues to control your on-chain funds.
            </p>
          </section>

          <section>
            <h2>10. Intellectual property and license</h2>
            <p>
              The Software is licensed, not sold. The source code is governed
              by the license file included with each component (currently
              Business Source License 1.1). Trademarks &ldquo;Sombra&rdquo; and
              &ldquo;Bonsol&rdquo; remain the property of Bonsol Labs Inc.
            </p>
          </section>

          <section>
            <h2>11. Governing law</h2>
            <p>
              These Terms are governed by the laws of the jurisdiction of
              Bonsol Labs Inc.&rsquo;s registered office, without regard to
              conflict-of-laws rules. Any dispute arising from these Terms or
              your use of the Software will be resolved in the courts of that
              jurisdiction, unless mandatory consumer-protection law in your
              country of residence provides otherwise.
            </p>
            <p>
              <em>
                [Note for review: replace with the specific jurisdiction
                (e.g., &ldquo;the State of Delaware, United States&rdquo;)
                before publishing.]
              </em>
            </p>
          </section>

          <section>
            <h2>12. Changes to these Terms</h2>
            <p>
              We may revise these Terms from time to time. The current version
              is always at <a href="https://sombra.tech/terms">sombra.tech/terms</a>{" "}
              with the &ldquo;last updated&rdquo; date above. Continued use of
              the Software after a change constitutes acceptance of the new
              Terms.
            </p>
          </section>

          <section>
            <h2>13. Contact</h2>
            <p>
              Legal notices and inquiries:{" "}
              <a href="mailto:sombra@bonsol.org">sombra@bonsol.org</a>.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
