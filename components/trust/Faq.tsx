"use client";

import { useState } from "react";
import { ButtonLink } from "../ButtonLink";
import s from "./Faq.module.css";

const FAQ: { q: string; a: string[] }[] = [
  {
    q: "Is Sombra a mixer?",
    a: [
      "No. Sombra is an institutional private payment protocol with compliance built into the architecture.",
      "Scoped weekly audit access and zero-knowledge disclosure proofs work on devnet today, with deposit screening and clean-funds proofs on the roadmap. Funds can always exit to a public Solana address.",
    ],
  },
  {
    q: "Who can see our organization’s transactions?",
    a: ["Only your authorized wallet holders—and the auditors or regulators you explicitly grant access to, strictly for the week ranges you choose. Everyone else sees only that a valid private state transition occurred."],
  },
  {
    q: "Can an external auditor or regulator verify our activity?",
    a: ["Yes. Export a scoped viewing key for a specific range of weeks, or generate a zero-knowledge disclosure proof. Your auditor sees the exact period you grant and nothing outside it. They can never move your funds."],
  },
  {
    q: "What happens when quantum computers arrive?",
    a: ["Your historical and future financial records remain private. Sombra uses no elliptic-curve encryption for anything written to the public ledger, leaving nothing for a quantum computer to decrypt."],
  },
  {
    q: "Where are institutional funds held?",
    a: ["The Sombra program on Solana holds native SPL tokens directly in an on-chain program vault. Funds move only with a valid STARK proof and verifier approval."],
  },
];

/** Figma 3:6176 (desktop) / 340:64 (mobile). One row open at a time; the first starts open. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className={s.section}>
      <div className={s.side}>
        <h2 className={s.title}>Institutional FAQ</h2>
        <ButtonLink href="https://docs.sombra.tech" arrow>Read the docs</ButtonLink>
      </div>
      <div className={s.list}>
        {FAQ.map(({ q, a }, i) => (
          <div key={q} className={s.item} data-open={open === i || undefined}>
            <button
              type="button"
              className={s.q}
              aria-expanded={open === i}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen((o) => (o === i ? null : i))}
            >
              {q}
              <span className={s.chevron}><img src="/brand/chevron-down.svg" width={24} height={24} alt="" /></span>
            </button>
            {/* Height animates via grid rows 0fr → 1fr; inert keeps closed answers out of tab order and screen readers. */}
            <div id={`faq-${i}`} className={s.panel} inert={open !== i}>
              <div className={s.clip}>
                <div className={s.a}>{a.map((p) => <p key={p}>{p}</p>)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
