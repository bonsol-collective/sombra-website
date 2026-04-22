"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useScramble } from "@/hooks/useScramble";

type Row = {
  time: string;
  from: string;
  to: string;
  amount: string;
  status: string;
};

const LEDGER_ROWS: Row[] = [
  {
    time: "12:04:18",
    from: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA...",
    to: "Hn5kKnDBw1XvNzoS4bRxLuP2WCmVz5...",
    amount: "128.40 SOL",
    status: "Settled",
  },
  {
    time: "12:04:02",
    from: "BPFLoaderUpgradeab1e11111111...",
    to: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZz...",
    amount: "2,410.00 USDC",
    status: "Settled",
  },
  {
    time: "12:03:47",
    from: "GvQvq7nBCMqSjTZK6XpTRzJWaA9...",
    to: "So11111111111111111111111111...",
    amount: "0.84 SOL",
    status: "Settled",
  },
  {
    time: "12:03:29",
    from: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk...",
    to: "FdRmVhYb8dAj2AB6xVbXZJWzQTnT...",
    amount: "15,820.00 USDC",
    status: "Settled",
  },
  {
    time: "12:03:10",
    from: "AxZfZ9TYnQPx3q9bB3wzKqE4Ysv...",
    to: "Ciq6B5TzjXpHfMYqtnVpPdVzjRC...",
    amount: "42.00 SOL",
    status: "Settled",
  },
];

function hide(str: string, char = "•") {
  return char.repeat(Math.min(22, str.length));
}

function LedgerRow({
  row,
  shielded,
  active,
}: {
  row: Row;
  shielded: boolean;
  active: boolean;
}) {
  const fromScram = useScramble(shielded ? hide(row.from) : row.from, {
    duration: 700,
    active,
  });
  const toScram = useScramble(shielded ? hide(row.to) : row.to, {
    duration: 700,
    active,
  });
  const amtScram = useScramble(
    shielded ? "•••••• " + row.amount.split(" ")[1] : row.amount,
    { duration: 600, active },
  );
  return (
    <div className="ledger-row">
      <div className="ledger-time">{row.time}</div>
      <div className={"ledger-addr" + (shielded ? " redacted" : "")}>
        {fromScram}
      </div>
      <div className={"ledger-addr" + (shielded ? " redacted" : "")}>
        {toScram}
      </div>
      <div className={"ledger-amount" + (shielded ? " redacted" : "")}>
        {amtScram}
      </div>
      <div className="ledger-status">{shielded ? "Shielded" : row.status}</div>
    </div>
  );
}

export function PrivacyDemo() {
  const [mode, setMode] = useState<"public" | "shielded">("public");
  const shielded = mode === "shielded";
  const [ref, inView] = useInView<HTMLElement>();

  return (
    <section id="privacy" className="privacy" ref={ref}>
      <div className="section-inner">
        <div className="section-kicker">Shielded by default</div>
        <div className="privacy-grid">
          <div className="privacy-copy">
            <h2 className="section-title">
              Same chain. <br />
              <i>Different</i> visibility.
            </h2>
            <p>
              Solana is fast and cheap - and radically transparent. Every
              transfer, every wallet, every position, visible forever. Sombra
              wraps your activity in a zero-knowledge envelope, so the chain
              sees that something happened, but not what, not how much, and
              not between whom.
            </p>
            <div
              className="privacy-toggle"
              role="tablist"
              aria-label="Ledger view mode"
            >
              <button
                type="button"
                role="tab"
                id="privacy-tab-public"
                aria-selected={!shielded}
                aria-controls="privacy-tabpanel"
                tabIndex={!shielded ? 0 : -1}
                className={!shielded ? "active" : ""}
                onClick={() => setMode("public")}
              >
                Public chain
              </button>
              <button
                type="button"
                role="tab"
                id="privacy-tab-shielded"
                aria-selected={shielded}
                aria-controls="privacy-tabpanel"
                tabIndex={shielded ? 0 : -1}
                className={shielded ? "active" : ""}
                onClick={() => setMode("shielded")}
              >
                Shielded
              </button>
            </div>
          </div>
          <div
            className="ledger"
            id="privacy-tabpanel"
            role="tabpanel"
            aria-labelledby={
              shielded ? "privacy-tab-shielded" : "privacy-tab-public"
            }
            aria-label="Transaction ledger demo"
          >
            <div className="ledger-head">
              <div>Time</div>
              <div>From</div>
              <div>To</div>
              <div style={{ textAlign: "right" }}>Amount</div>
              <div style={{ textAlign: "right" }}>Status</div>
            </div>
            {LEDGER_ROWS.map((r, i) => (
              <LedgerRow key={i} row={r} shielded={shielded} active={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
