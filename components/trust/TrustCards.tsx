import s from "./TrustCards.module.css";

const TOP = [
  { title: "Time-scoped audit keys.", body: "Grant an auditor, tax advisor, or regulator read-only access to incoming and outgoing payments for an exact range of weeks—nothing before it, nothing after it, and zero ability to move funds." },
  { title: "Zero-knowledge disclosure proofs.", body: "Cryptographically prove specific holdings and their status to an auditor without handing over your full transaction history." },
  { title: "Strict key separation.", body: "Spending, viewing, and outgoing audit records use separate keys derived from one recovery phrase. Sharing a view never shares control." },
];
const BOTTOM = [
  { title: "Always-Open Public Exit", body: "Your organization retains custody and can withdraw to a public Solana address at any time." },
  { title: "Compliance Suite", body: "Pre-deposit risk screening at entry, zero-knowledge clean-funds proofs (association sets), and retroactive privacy revocation for flagged deposits." },
];

function Card({ title, body }: { title: string; body: string }) {
  return (
    <article className={s.card}>
      <h3 className={s.cardTitle}>{title}</h3>
      <p className={s.cardBody}>{body}</p>
      {/* TODO(design): card visuals are empty in Figma. */}
    </article>
  );
}

/** Figma 53:17121 (desktop) / 340:43 (mobile). */
export function TrustCards() {
  return (
    <section className={s.section}>
      <h2 className="t-h2">Market-defining<br />security and compliance.</h2>
      <p className="t-body">
        Decentralized finance secured with post-quantum security and regulatory compliance from genesis.
      </p>
      <div className={s.grid}>
        <div className={s.top}>{TOP.map((c) => <Card key={c.title} {...c} />)}</div>
        <div className={s.bottom}>{BOTTOM.map((c) => <Card key={c.title} {...c} />)}</div>
      </div>
    </section>
  );
}
