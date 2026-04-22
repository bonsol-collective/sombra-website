import { CryptoTerm } from "./CryptoTerm";

/**
 * ProofBand - one hairline mono line naming the primitives that make Sombra
 * quantum-safe. Sits below Hero, above Pillars. Catches skim-readers in 2 s.
 *
 * Accent colour is reserved for the two primitives that carry the quantum-safe
 * claim (Kyber-768 + RISC0 STARK). Everything else is fg-dim so ember stays
 * rare.
 */

interface BandItem {
  label: string;
  term?: string;
  accent?: boolean;
}

const ITEMS: BandItem[] = [
  { label: "Kyber-768", term: "Kyber-768", accent: true },
  { label: "RISC0 STARK", term: "RISC0 STARK", accent: true },
  { label: "ChaCha20-Poly1305", term: "ChaCha20-Poly1305" },
  { label: "Solana L1", term: "Solana L1" },
  { label: "~1.8-2 s proof (RTX 3090)" },
];

export function ProofBand() {
  return (
    <section
      id="primitives"
      aria-label="Cryptographic primitives"
      className="proof-band"
    >
      <div className="proof-band-inner" role="list">
        {ITEMS.map((item, i) => (
          <span className="proof-band-item" role="listitem" key={item.label}>
            {item.term ? (
              <CryptoTerm term={item.term} variant="bare">
                <span
                  className={
                    "proof-band-label" +
                    (item.accent ? " proof-band-label--accent" : "")
                  }
                >
                  {item.label}
                </span>
              </CryptoTerm>
            ) : (
              <span
                className={
                  "proof-band-label" +
                  (item.accent ? " proof-band-label--accent" : "")
                }
              >
                {item.label}
              </span>
            )}
            {i < ITEMS.length - 1 && (
              <span aria-hidden className="proof-band-sep">
                ·
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
