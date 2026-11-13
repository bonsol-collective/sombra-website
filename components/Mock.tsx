import m from "./Mock.module.css";

/* Product-UI mock pieces shared by the Trust cards and the Three steps stage
   (design canvas "Sombra Website": pages "Market-defining security and compliance." and
   "Three steps. One chain. Zero bridges."). Decorative: callers wrap them in aria-hidden. */

const SHIELD = "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z";
const FILE = "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z";
const ICONS = {
  shield: <path d={SHIELD} />,
  shieldCheck: <><path d={SHIELD} /><path d="m9 12 2 2 4-4" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  back: <path d="m15 18-6-6 6-6" />,
  down: <path d="M12 5v14M19 12l-7 7-7-7" />,
  upRight: <path d="M7 17 17 7M7 7h10v10" />,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  eye: <><path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" /><circle cx="12" cy="12" r="3" /></>,
  file: <><path d={FILE} /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></>,
  fileText: <><path d={FILE} /><path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8" /></>,
  flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><path d="M4 22v-7" /></>,
};

export function Icon({ name, size = 12, weight = 1.5 }: { name: keyof typeof ICONS; size?: number; weight?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={weight}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/** The green "done" disc in three rings. */
export function CheckRing({ className = "" }: { className?: string }) {
  return (
    <span className={`${m.ring} ${className}`}>
      <span><span><Icon name="check" size={18} weight={2} /></span></span>
    </span>
  );
}

/** Wallet "Withdraw" screen: private Token → public address. */
export function WithdrawPanel({ className = "", buttonClassName = "" }: { className?: string; buttonClassName?: string }) {
  return (
    <div className={`${m.panel} ${className}`}>
      <div className={m.head}><Icon name="back" size={16} />Withdraw</div>
      <div className={m.progress}>
        <span><i className={m.on} />Amount</span>
        <span><i />Review</span>
        <span><i />Withdraw</span>
      </div>
      <div className={m.swapPair}>
        <div className={m.box}>
          <div className={m.kv}><span>From</span><span><Icon name="shield" />Private</span></div>
          <div className={m.kv}>
            <span className={m.token}><i />Token</span>
            <span className={m.amount}>250,000</span>
          </div>
        </div>
        <span className={m.swap}><Icon name="down" size={16} /></span>
        <div className={`${m.box} ${m.tight}`}>
          <div className={m.kv}><span>To</span><span><Icon name="globe" />Public</span></div>
          <span className={m.address}>7xKXtg2CW87d97…9fQa</span>
        </div>
      </div>
      <span className={`${m.cta} ${buttonClassName}`}>Preview withdrawal</span>
    </div>
  );
}
