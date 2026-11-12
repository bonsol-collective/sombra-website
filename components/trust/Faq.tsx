import { ButtonLink } from "../ButtonLink";
import s from "./Faq.module.css";

const FAQ: { q: string; a?: string[] }[] = [
  {
    q: "Is Sombra a mixer?",
    a: [
      "No. Sombra is an institutional private payment protocol with compliance built into the architecture.",
      "Scoped weekly audit access and zero-knowledge disclosure proofs work on devnet today, with deposit screening and clean-funds proofs on the roadmap. Funds can always exit to a public Solana address.",
    ],
  },
  // TODO(copy): Figma has no answers for these yet; they render as plain rows until written.
  { q: "Who can see our transactions?" },
  { q: "Can an auditor verify our activity?" },
  { q: "What happens when quantum computers arrive?" },
  { q: "Where are institutional funds held?" },
];

/** Figma 3:6176 (desktop) / 340:64 (mobile). Native <details>; the first one starts open. */
export function Faq() {
  return (
    <section className={s.section}>
      <div className={s.side}>
        <h2 className={s.title}>FAQ</h2>
        <ButtonLink href="https://docs.sombra.tech" arrow>Read the docs</ButtonLink>
      </div>
      <div className={s.list}>
        {FAQ.map(({ q, a }, i) =>
          a ? (
            <details key={q} className={s.item} open={i === 0}>
              <summary className={s.q}>
                {q}
                <span className={s.chevron}><img src="/brand/chevron-down.svg" width={24} height={24} alt="" /></span>
              </summary>
              <div className={s.a}>{a.map((p) => <p key={p}>{p}</p>)}</div>
            </details>
          ) : (
            <div key={q} className={s.item}><p className={s.q}>{q}</p></div>
          ),
        )}
      </div>
    </section>
  );
}
