"use client";

import { useState } from "react";
import s from "./ThreeSteps.module.css";

const STEPS = [
  { title: "Shield", body: "Deposit USDC, USDT, or any SPL token from your institutional Solana wallet into Sombra in a single transaction." },
  { title: "Pay privately", body: "Settle with any Sombra address. The chain verifies the transfer without seeing who paid whom, how much, or which token moved." },
  { title: "Withdraw anytime", body: "Move funds back to a public Solana address whenever your operations require it." },
];

/** Figma 3:6078 (+ open states 410:44278, 410:44299) / mobile 347:4195. One step open at a time. */
export function ThreeSteps() {
  const [open, setOpen] = useState(0);
  return (
    <section className={s.section}>
      <h2 className={`t-h2 ${s.title}`}>
        <span className={s.muted}>Three steps.<br />One chain.<br /></span>Zero bridges.
      </h2>
      <div className={s.row}>
        <ol className={s.steps}>
          {STEPS.map((step, i) => (
            <li key={step.title} className={s.step}>
              <button
                type="button"
                className={s.toggle}
                aria-expanded={open === i}
                aria-controls={`step-${i}`}
                onClick={() => setOpen(i)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>{step.title}</span>
              </button>
              <p id={`step-${i}`} className={s.body} hidden={open !== i}>{step.body}</p>
            </li>
          ))}
        </ol>
        <div className={s.visual} aria-hidden="true">
          {open === 0 && (
            <picture className={s.ring}>
              <source media="(prefers-reduced-motion: reduce)" srcSet="/images/steps/ring-still.png" />
              <img src="/images/steps/ring.webp" width={431} height={431} alt="" />
            </picture>
          )}
          {open === 1 && (
            <div className={s.stage}>
              {[1, 2, 3].map((n) => (
                <span key={n} className={`${s.coin} ${s[`coin${n}`]}`}>
                  <img src={`/images/steps/coin-${n}.png`} alt="" />
                </span>
              ))}
            </div>
          )}
          {open === 2 && (
            <div className={s.stage}>
              <img className={s.wallet} src="/images/steps/wallet.png" alt="" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
