"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { CryptoTerm } from "./CryptoTerm";

/**
 * HowItWorks — three stations explaining Sombra's UTXO lifecycle:
 * Encrypt → Prove → Transact. Sits between Pillars and PrivacyDemo.
 *
 * Station markers: a 10px square; first filled accent, others outlined.
 * Fade-up on scroll via useInView. No framer-motion required.
 */

interface Step {
  key: "encrypt" | "prove" | "transact";
  index: string;
  title: string;
  primitive: ReactNode;
  body: ReactNode;
}

const STEPS: Step[] = [
  {
    key: "encrypt",
    index: "01",
    title: "Encrypt",
    primitive: (
      <>
        <CryptoTerm term="ChaCha20-Poly1305" variant="bare">
          ChaCha20-Poly1305
        </CryptoTerm>{" "}
        ·{" "}
        <CryptoTerm term="Kyber-768" variant="bare">
          Kyber-768
        </CryptoTerm>
      </>
    ),
    body: (
      <>
        Your payload is wrapped in authenticated encryption, keyed by a{" "}
        <CryptoTerm term="Kyber-768" variant="inline">
          Kyber-768
        </CryptoTerm>{" "}
        shared secret. One-time use, per{" "}
        <CryptoTerm term="UTXO" variant="inline">
          UTXO
        </CryptoTerm>
        . Only the receiver can read it.
      </>
    ),
  },
  {
    key: "prove",
    index: "02",
    title: "Prove",
    primitive: (
      <>
        <CryptoTerm term="RISC0 STARK" variant="bare">
          RISC0 STARK
        </CryptoTerm>{" "}
        · ~1.8–2&nbsp;s on RTX&nbsp;3090
      </>
    ),
    body: (
      <>
        A RISC0 zkVM proves you own the inputs and the values balance —
        without revealing them.{" "}
        <CryptoTerm term="STARK" variant="inline">
          STARKs
        </CryptoTerm>{" "}
        are hash-based, so the proof itself stays hard under quantum attack.
      </>
    ),
  },
  {
    key: "transact",
    index: "03",
    title: "Transact",
    primitive: (
      <>
        <CryptoTerm term="Solana L1" variant="bare">
          Solana L1
        </CryptoTerm>{" "}
        · attestation quorum
      </>
    ),
    body: (
      <>
        The proof and ciphertext land on{" "}
        <CryptoTerm term="Solana L1" variant="inline">
          Solana
        </CryptoTerm>
        . Attesting nodes verify and commit a finalization vote. Ownership is
        never signed — only proven.
      </>
    ),
  },
];

export function HowItWorks() {
  const [ref, inView] = useInView<HTMLElement>();

  return (
    <section
      id="flow"
      aria-labelledby="flow-heading"
      className="flow"
      ref={ref}
    >
      <div className="section-inner">
        <div className="section-kicker">How it works</div>
        <h2 id="flow-heading" className="section-title">
          One UTXO. <i>Three moments.</i>
        </h2>
        <ol className="flow-grid">
          {STEPS.map((step, i) => (
            <li
              key={step.key}
              className={
                "flow-station" +
                (i === 0 ? " flow-station--leading" : "") +
                (inView ? " is-visible" : "")
              }
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span aria-hidden className="flow-marker" />
              <div className="flow-index">
                {step.index} · {step.title}
              </div>
              <h3 className="flow-title">{step.title}.</h3>
              <div className="flow-primitive">{step.primitive}</div>
              <p className="flow-body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
