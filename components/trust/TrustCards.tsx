import type { ReactNode } from "react";
import { CheckRing, Icon, WithdrawPanel } from "../Mock";
import m from "../Mock.module.css";
import s from "./TrustCards.module.css";

const RANGE = [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0]; // 12 weeks, 5 granted

const auditKeys = (
  <div className={`${m.panel} ${s.mock}`}>
    <div className={m.head}><Icon name="back" size={16} />Audit access</div>
    <div className={m.box}>
      <div className={m.kv}><span>Range</span><span><Icon name="calendar" />6 Apr – 11 May 2026</span></div>
      <div className={s.weeks}>{RANGE.map((on, i) => <i key={i} className={on ? s.on : undefined} />)}</div>
    </div>
    <div className={m.list}>
      <div className={m.row}><span>Incoming payments</span><span className={s.ok}><Icon name="check" weight={2} />View</span></div>
      <div className={m.row}><span>Outgoing payments</span><span className={s.ok}><Icon name="check" weight={2} />View</span></div>
      <div className={`${m.row} ${s.dim}`}><span>Move funds</span><span className={s.ok}><Icon name="lock" />Not allowed</span></div>
    </div>
  </div>
);

const disclosureProof = (
  <div className={`${m.panel} ${s.mock} ${s.proof}`}>
    <CheckRing />
    <span className={s.verdict}>Proof verified</span>
    <div className={`${m.box} ${s.stretch}`}>
      <div className={m.kv}><span>Holds at least</span><span className={s.big}><Icon name="shield" size={14} />1,000,000 TUSD</span></div>
      <div className={m.kv}><span>Counterparties</span><span>Hidden</span></div>
      <div className={m.kv}><span>Transaction history</span><span>Hidden</span></div>
      <div className={m.kv}><span>Signature</span><span>21C6ntPT…ufdLV1</span></div>
    </div>
  </div>
);

const KEYS = [
  { icon: "lock", name: "Spend key", does: "Moves funds" },
  { icon: "eye", name: "View key", does: "Reads balances" },
  { icon: "fileText", name: "Audit key", does: "Reads history" },
] as const;
const keySeparation = (
  <div className={`${m.panel} ${s.mock} ${s.keys}`}>
    <div className={`${m.box} ${s.phrase}`}>
      <span>Recovery phrase</span>
      <div>{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <span key={n}>{n} ••••</span>)}</div>
    </div>
    <span className={`${m.swap} ${s.swapSm}`}><Icon name="down" size={14} /></span>
    <div className={m.list}>
      {KEYS.map((k) => (
        <div key={k.name} className={`${m.row} ${s.key}`}>
          <span className={s.badge}><Icon name={k.icon} size={14} /></span>
          <span className={s.grow}>{k.name}</span>
          <span className={s.muted}>{k.does}</span>
        </div>
      ))}
    </div>
  </div>
);

const EVENTS = [
  { icon: "down", title: "Deposit screened", meta: "Before entry · 4:25 AM", result: "Low risk" },
  { icon: "shieldCheck", title: "Clean-funds proof", meta: "Association set · 4:26 AM", result: "Proven" },
  { icon: "flag", title: "Flagged deposit", meta: "Retroactive review · 4:31 AM", result: "Privacy revoked", flagged: true },
] as const;
const complianceSuite = (
  <div className={`${m.panel} ${s.mock} ${s.wider}`}>
    <div className={m.head}><Icon name="back" size={16} />Compliance</div>
    <div className={s.tabs}>
      <span className={s.tabOn}><Icon name="shield" />Deposits</span>
      <span><Icon name="file" />Proofs</span>
    </div>
    <span>Today</span>
    <div className={s.events}>
      {EVENTS.map((e) => (
        <div key={e.title} className={s.event} data-flagged={"flagged" in e || undefined}>
          <span className={s.dot}><Icon name={e.icon} size={16} /></span>
          <span className={s.grow}>{e.title}<small>{e.meta}</small></span>
          <span className={s.result}>{"flagged" in e ? null : <Icon name="check" weight={2} />}{e.result}</span>
        </div>
      ))}
    </div>
  </div>
);

const TOP = [
  { title: "Time-scoped audit keys.", body: "Grant an auditor, tax advisor, or regulator read-only access to incoming and outgoing payments for an exact range of weeks—nothing before it, nothing after it, and zero ability to move funds.", mock: auditKeys },
  { title: "Zero-knowledge disclosure proofs.", body: "Cryptographically prove specific holdings and their status to an auditor without handing over your full transaction history.", mock: disclosureProof },
  { title: "Strict key separation.", body: "Spending, viewing, and outgoing audit records use separate keys derived from one recovery phrase. Sharing a view never shares control.", mock: keySeparation },
];
const BOTTOM = [
  { title: "Always-Open Public Exit", body: "Your organization retains custody and can withdraw to a public Solana address at any time.", mock: <WithdrawPanel className={`${s.mock} ${s.wide}`} /> },
  { title: "Compliance Suite", body: "Pre-deposit risk screening at entry, zero-knowledge clean-funds proofs (association sets), and retroactive privacy revocation for flagged deposits.", mock: complianceSuite },
];

function Card({ title, body, mock }: { title: string; body: string; mock: ReactNode }) {
  return (
    <article className={s.card}>
      <h3 className={s.cardTitle}>{title}</h3>
      <p className={s.cardBody}>{body}</p>
      <div className={s.art} aria-hidden="true">{mock}</div>
    </article>
  );
}

/** Figma 53:17121 (desktop) / 340:43 (mobile); card graphics from the design canvas
 *  page "Market-defining security and compliance." */
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
