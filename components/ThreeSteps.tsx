"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckRing, Icon, WithdrawPanel } from "./Mock";
import m from "./Mock.module.css";
import { useFit } from "./useFit";
import s from "./ThreeSteps.module.css";

const STEPS = [
  { title: "Shield", body: "Deposit USDC, USDT, or any SPL token from your institutional Solana wallet into Sombra in a single transaction." },
  { title: "Pay privately", body: "Settle with any Sombra address. The chain verifies the transfer without seeing who paid whom, how much, or which token moved." },
  { title: "Withdraw anytime", body: "Move funds back to a public Solana address whenever your operations require it." },
];
const STEP_MS = 6000; // = the 6s scene and progress-bar animations in the CSS

const Badge = ({ className, children }: { className: string; children: ReactNode }) => (
  <div className={`${s.badgeWrap} ${className}`}>
    <span className={s.badge}><span className={s.tick}><Icon name="check" weight={2.2} /></span>{children}</span>
  </div>
);

const Party = ({ className, icon, name, address }: { className: string; icon: "upRight" | "down"; name: string; address: string }) => (
  <div className={`${s.party} ${className}`}>
    <span className={s.partyIcon}><Icon name={icon} size={14} /></span>
    <span className={s.partyName}>{name}</span>
    <span className={s.address}><Icon name="shield" />{address}</span>
  </div>
);

const Vault = ({ className }: { className: string }) => (
  <div className={`${s.vault} ${className}`}>
    <div className={s.vaultShape}>
      <img src="/brand/logomark_white.svg" alt="" />
      <div className={s.notes}>
        {[s.n1, s.n2, s.n3].map((n) => <span key={n} className={n}><Icon name="shield" />•••</span>)}
      </div>
    </div>
  </div>
);

const Masked = ({ className }: { className: string }) => (
  <div className={`${s.masked} ${className}`}>
    {["From", "To", "Amount", "Token"].map((k) => <div key={k}><span>{k}</span><span>•••••</span></div>)}
  </div>
);

const Receipt = ({ className }: { className: string }) => (
  <div className={`${m.panel} ${s.receipt} ${className}`}>
    <CheckRing className={s.ring} />
    <span className={s.allSet}>All set!</span>
    <div className={`${m.box} ${s.receiptBox}`}>
      <div className={m.kv}><span>Sent</span><span><Icon name="shield" size={13} />250,000 Token</span></div>
      <div className={m.kv}><span>Received</span><span><Icon name="globe" size={13} />250,000 TUSD</span></div>
      <div className={m.kv}><span>To</span><span>7xKXtg…9fQa</span></div>
      <div className={m.kv}><span>Network fee</span><span>0.000005 SOL</span></div>
    </div>
  </div>
);

const RECORDS = [["down", "Deposit", "4:25 AM"], ["shield", "Private send", "4:26 AM"], ["shield", "Private send", "4:28 AM"], ["shield", "Private send", "4:31 AM"]] as const;

/** Desktop stage scenes: an 860×480 board (design canvas "Three steps — animated"). */
const DESKTOP = [
  <>
    <span className={`${s.label} ${s.dWallet}`}><Icon name="globe" size={18} />Public wallet</span>
    <div className={`${s.coin} ${s.c1}`}><i className={s.tusdRing} />100,000 TUSD</div>
    <div className={`${s.coin} ${s.c2}`}><i className={s.usdt} />80,000 USDT</div>
    <div className={`${s.coin} ${s.c3}`}><i className={s.spl} />Any SPL token</div>
    <Vault className={s.dVault} />
    <Badge className={s.dShielded}>
      Shielded in one transaction
      <span className={s.private}><Icon name="shield" size={11} />Private</span>
    </Badge>
  </>,
  <>
    <Party className={`${s.dYou} ${s.fadeIn}`} icon="upRight" name="You" address="0x91fc…a07b" />
    <Party className={`${s.dRecipient} ${s.recv}`} icon="down" name="Recipient" address="0x7423…41d4" />
    <span className={s.dWire} />
    <div className={`${s.send} ${s.dSend}`}><Icon name="shield" size={14} />Private send</div>
    <span className={`${s.label} ${s.dRecords}`}>What Solana records</span>
    <span className={s.dBaseline} />
    {RECORDS.map(([icon, kind, time], i) => (
      <div key={time} className={s.record} style={{ left: 30 + i * 144 }}>
        <span><Icon name={icon} />{kind}</span>
        <div><span>Amount</span><span>•••</span></div>
        <span>{time}</span>
      </div>
    ))}
    <Masked className={s.dMasked} />
    <Badge className={s.dVerified}>Proof verified</Badge>
  </>,
  <>
    <WithdrawPanel className={s.dWithdraw} buttonClassName={s.press} />
    <span className={`${s.label} ${s.dOpen}`}><Icon name="clock" size={18} />Open any time. No lockups, no withdrawal windows.</span>
    <div className={s.fly}>
      <div className={s.maskOut}><i />••••••</div>
      <div className={s.maskIn}><i />250,000 TUSD</div>
    </div>
    <Receipt className={s.dReceipt} />
  </>,
];

/** Mobile stage scenes: a 330×400 board (design canvas "Three steps — mobile"). */
const MOBILE = [
  <>
    <span className={`${s.label} ${s.mWallet}`}><Icon name="globe" size={14} />Public wallet</span>
    <div className={`${s.coin} ${s.mCoin} ${s.mc1}`}><i className={s.tusd} />100k TUSD</div>
    <div className={`${s.coin} ${s.mCoin} ${s.mc2}`}><i className={s.usdt} />80k USDT</div>
    <div className={`${s.coin} ${s.mCoin} ${s.mc3}`}><i className={s.spl} />Any SPL</div>
    <Vault className={s.mVault} />
    <Badge className={s.mShielded}>Shielded in one transaction</Badge>
  </>,
  <>
    <Party className={`${s.mParty} ${s.fadeIn}`} icon="upRight" name="You" address="0x91fc…a07b" />
    <span className={s.mWire} />
    <div className={`${s.send} ${s.mSend}`}><Icon name="shield" />Private send</div>
    <Party className={`${s.mParty} ${s.mRecipient} ${s.recv}`} icon="down" name="Recipient" address="0x7423…41d4" />
    <span className={`${s.label} ${s.mRecords}`}>What Solana records</span>
    <Masked className={s.mMasked} />
    <Badge className={s.mVerified}>Proof verified</Badge>
  </>,
  <>
    <WithdrawPanel className={s.mWithdraw} buttonClassName={s.press} />
    <Receipt className={s.mReceipt} />
    <span className={`${s.label} ${s.mOpen}`}><Icon name="clock" size={14} />No lockups, no withdrawal windows.</span>
  </>,
];

/** Figma 3:6078 / mobile 347:4195; step cards + animated stage from the design canvas page
 *  "Three steps. One chain. Zero bridges.". Auto-advances every 6s while on screen. */
export function ThreeSteps() {
  const [open, setOpen] = useState(0);
  const [run, setRun] = useState(0); // bumping it replays the scene and restarts the timer
  const [live, setLive] = useState(false);
  const section = useRef<HTMLElement>(null);
  const stage = useFit(868);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      setLive(e.isIntersecting);
      if (e.isIntersecting) setRun((r) => r + 1);
    }, { threshold: 0.35 });
    io.observe(section.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setOpen((o) => (o + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [open, live, run]);

  const pick = (i: number) => { setOpen(i); setRun((r) => r + 1); };
  const key = `${open}-${run}`;

  return (
    <section ref={section} className={s.section}>
      <h2 className={`t-h2 ${s.title}`}>
        <span className={s.muted}>Three steps.<br />One chain.<br /></span>Zero bridges.
      </h2>
      <div className={s.row}>
        <ol className={s.steps}>
          {STEPS.map((step, i) => (
            <li key={step.title} className={s.step} data-open={open === i || undefined}>
              <button type="button" className={s.toggle} aria-expanded={open === i} aria-controls={`step-${i}`} onClick={() => pick(i)}>
                {step.title}
              </button>
              <p id={`step-${i}`} className={s.body} hidden={open !== i}>{step.body}</p>
              {open === i && <span key={key} className={s.prog} aria-hidden="true"><i /></span>}
            </li>
          ))}
        </ol>
        <div ref={stage} className={s.stage} aria-hidden="true">
          <div key={`d${key}`} className={s.boardD}>{DESKTOP[open]}</div>
          <div key={`m${key}`} className={s.boardM}>{MOBILE[open]}</div>
        </div>
      </div>
    </section>
  );
}
