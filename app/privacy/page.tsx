import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Sombra",
  description:
    "How Sombra handles user data. We don't collect personal data, we don't run analytics, and your private keys never leave your device.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "May 6, 2026";

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="legal">
        <header className="legal-header">
          <div className="legal-eyebrow">Legal</div>
          <h1 className="legal-title">Privacy Policy</h1>
          <div className="legal-meta">Last updated: {LAST_UPDATED}</div>
        </header>

        <article className="legal-body">
          <section>
            <h2>Summary</h2>
            <p>
              Sombra is a self-custody, post-quantum privacy wallet for Solana.
              We don&rsquo;t collect personal data, we don&rsquo;t run
              analytics, and your private keys never leave your device. Below
              is the full breakdown of what data exists, where it lives, and
              what crosses a network.
            </p>
          </section>

          <section>
            <h2>1. Who we are</h2>
            <p>
              The Sombra wallet (the &ldquo;Wallet&rdquo;) is published by
              Bonsol Labs Inc. (&ldquo;Bonsol&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;). This Privacy Policy covers the Sombra browser
              extension, the Sombra prover daemon, and the marketing site at{" "}
              <a href="https://sombra.tech">sombra.tech</a>.
            </p>
          </section>

          <section>
            <h2>2. Data we do not collect</h2>
            <ul>
              <li>No accounts, no sign-up, no email required to use the Wallet.</li>
              <li>No analytics or telemetry inside the Wallet (no Sentry, PostHog, Google Analytics, Mixpanel, or equivalents).</li>
              <li>No tracking cookies inside the Wallet.</li>
              <li>No clipboard scanning, no keystroke logging, no screen capture.</li>
              <li>No sale of data. Ever. There is no data to sell.</li>
            </ul>
          </section>

          <section>
            <h2>3. Data stored locally on your device</h2>
            <p>
              The Wallet uses your browser&rsquo;s local extension storage
              (<code>chrome.storage.local</code>). Nothing in this list is
              transmitted to Bonsol.
            </p>
            <ul>
              <li>
                <strong>Encrypted vault</strong> — your seed phrase and Kyber
                secret key, encrypted with a key derived from your password
                via PBKDF2 (600,000 iterations, SHA-256) and sealed with
                AES-256-GCM. The unencrypted secret only exists in volatile
                memory while the Wallet is unlocked, and is wiped on lock or
                after 5 minutes of inactivity.
              </li>
              <li>
                <strong>Public wallet data</strong> — your Solana public
                address, your Kyber public key, and your derived vault
                identifier.
              </li>
              <li>
                <strong>Cached UTXOs and balances</strong> — to render your
                portfolio instantly when you re-open the popup, the Wallet
                caches the <strong>decrypted</strong> UTXO list (token
                amounts, sender/receiver vault identifiers) in{" "}
                <code>chrome.storage.local</code>. This cache is not encrypted
                at rest with your password &mdash; it is rebuilt on each sync
                after unlock. File-system access to the Chrome profile can
                therefore reveal your decrypted transaction history; we
                recommend treating Sombra as a hot wallet and avoiding use on
                shared or untrusted machines.
              </li>
              <li>
                <strong>Pending job state</strong> — the status of in-flight
                deposits, transfers, and withdrawals so the Wallet can
                reconnect to a job after you close the popup.
              </li>
              <li>
                <strong>Token registry cache</strong> — a copy of the on-chain
                registered SPL token list.
              </li>
              <li>
                <strong>Settings</strong> — your prover mode, network
                selection, and other UI preferences.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Network requests the Wallet makes</h2>
            <p>
              The Wallet does not phone home to Bonsol. The network endpoints
              it talks to are listed in the extension&rsquo;s manifest under{" "}
              <code>host_permissions</code> and are limited to the following:
            </p>
            <ul>
              <li>
                <strong>Solana RPC</strong> — the Solana JSON-RPC endpoint you
                configure (DevNet or Mainnet). Used to read on-chain state
                (your ledger, vaults, token accounts) and to submit
                transactions you authorize. The RPC operator may log standard
                request metadata such as your IP address; consider running
                your own RPC or routing through a privacy-preserving proxy if
                that is a concern.
              </li>
              <li>
                <strong>QFire relay</strong> — Bonsol-operated relay used to
                publish ZK proofs and to forward node-signed attestation
                transactions to Solana. QFire receives the proof bytes and
                your sender vault identifier. Because the proof&rsquo;s public
                journal commits to the receiver vault PDAs, the on-chain UTXO
                hashes you are spending, and (for withdrawals) the destination
                Solana wallet, token, and amount, QFire sees those values too
                &mdash; but all of them are also visible on the public Solana
                ledger by design. QFire does NOT receive your private keys,
                your seed phrase, or the cleartext token amounts and token
                types of vault-to-vault transfers; those remain encrypted in
                the on-chain UTXO payload, decryptable only by the receiver.
              </li>
              <li>
                <strong>Remote prover</strong> (default) — by default, the
                proof inputs needed to generate your ZK proof are sent over
                TLS to a Bonsol-operated proving server. These inputs are
                derived from data you have decrypted in your browser&rsquo;s
                memory and include: your wallet&rsquo;s Kyber public key
                (which identifies your wallet to the prover), the decrypted
                contents of the UTXOs you are spending (token amounts and
                types), the receiver vault PDAs and decrypted token amounts
                of any transfers, and the destination Solana wallet, token,
                and amount of any withdrawal. Your password, your seed
                phrase, your Kyber secret key, and your encrypted vault are
                never sent. <strong>In the current build this means the
                proving server operator is technically a trusted third party
                with read access to your decrypted transaction inputs while
                a proof is being generated.</strong> The remote prover is
                being developed with hardware-attested execution (AMD SEV-SNP
                CPU + Nvidia GPU attestation) so that even Bonsol operators
                cannot read proof inputs in transit or at rest; hardware
                attestation is not yet enabled in the MVP build. Users who
                require zero trust in the proving operator can switch prover
                mode to &ldquo;Local&rdquo; in Settings (this requires
                separately installing the Sombra prover daemon and disables
                remote proving entirely).
              </li>
              <li>
                <strong>Local prover daemon</strong> (advanced, opt-in) — if
                you separately download and install the Sombra prover daemon
                and switch prover mode in Settings, proofs are generated on
                your own machine. The Wallet talks to the daemon only via
                Chrome native messaging; nothing leaves your device for proof
                generation in this mode.
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Cryptographic design</h2>
            <p>
              Sombra is built on post-quantum primitives. Asymmetric encryption
              uses Kyber-768 (NIST ML-KEM-768). Hashing uses SHA-256.
              Zero-knowledge proofs use RISC0 STARKs. No part of the protocol
              relies on elliptic curve cryptography for confidentiality. Solana
              account signing still uses Ed25519, which is a property of the
              Solana network, not the Sombra protocol.
            </p>
            <p>
              Two distinct symmetric ciphers are used at different layers:
            </p>
            <ul>
              <li>
                <strong>On-chain UTXO payloads</strong> are encrypted with{" "}
                <strong>ChaCha20-Poly1305</strong>. For each UTXO, the sender
                uses Kyber-768 to encapsulate a fresh 32-byte shared secret
                against the receiver vault&rsquo;s Kyber public key; that
                shared secret is used directly as the ChaCha20-Poly1305 key.
                Only the receiver &mdash; who holds the matching Kyber secret
                key &mdash; can decapsulate the same secret and decrypt the
                payload.
              </li>
              <li>
                <strong>The local encrypted vault</strong> (the file containing
                your seed phrase and Kyber secret key in browser storage) is
                sealed with <strong>AES-256-GCM</strong>, using a key derived
                from your password via PBKDF2 (600,000 iterations, SHA-256).
                See Section 3 for the full at-rest description.
              </li>
            </ul>

            <p>
              <strong>What Sombra hides, and what it does not.</strong>
              Token amounts and token types of vault-to-vault transfers are 
              encrypted on-chain and only the receiver can decrypt them. 
              Vault identifiers are pseudonymous hashes of Kyber public keys, 
              not tied to a real-world identity unless the user reveals their 
              public key off-chain. What Sombra does <em>not</em> hide is the 
              existence and timing of transactions, the sender and receiver 
              vault identifiers (visible on the public Solana ledger), 
              and the destination wallet, token, and amount of any withdrawal
              back to a regular Solana wallet (these have to be public so 
              the SPL token program can execute the transfer). 
              Anyone evaluating Sombra for a specific threat model 
              should review this trade-off carefully.
            </p>
          </section>

          <section>
            <h2>6. Permissions the extension requests</h2>
            <ul>
              <li>
                <code>storage</code> — to persist your encrypted vault, cached
                state, and settings on your device.
              </li>
              <li>
                <code>nativeMessaging</code> — to communicate with the local
                Sombra prover daemon.
              </li>
              <li>
                <code>alarms</code> — to schedule background checks on
                in-flight proof submissions so a stuck or slow proof can be
                detected and recovered even when the popup is closed.
              </li>
              <li>
                <code>host_permissions</code> — limited to the Solana RPC, the
                QFire relay, and the remote prover URL (the Wallet uses the
                remote prover by default; the local daemon path uses native
                messaging instead, which doesn&rsquo;t require an HTTPS host
                permission). No content scripts; the extension never reads or
                modifies any website you visit.
              </li>
            </ul>
          </section>

          <section>
            <h2>7. Marketing site (sombra.tech)</h2>
            <p>
              The marketing site uses Vercel hosting and Vercel Analytics for
              aggregate traffic measurement (page views, referrers,
              user-agent). Vercel Analytics is cookieless and does not build a
              cross-site profile of you. The waitlist form, when used, sends
              your email address to Formspree, which acts as a processor on
              our behalf for the sole purpose of contacting you about beta
              access. You can ask us to delete it at any time.
            </p>
          </section>

          <section>
            <h2>8. Children</h2>
            <p>
              Sombra is not intended for users under 13 (or under 16 in the
              EU). We do not knowingly collect data from minors.
            </p>
          </section>

          <section>
            <h2>9. Changes to this policy</h2>
            <p>
              When this policy changes in a material way, we will update the
              date above and announce the change in the Wallet&rsquo;s release
              notes. Continued use of the Wallet after a change constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              Questions, deletion requests, or security disclosures:{" "}
              <a href="mailto:sombra@bonsol.org">sombra@bonsol.org</a>.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
