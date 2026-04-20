"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

function shieldHash(i: number, j: number) {
  return ((i * 73856093) ^ (j * 19349663)) >>> 0;
}

function PillarVisualShield() {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="160" style={{ maxWidth: 140 }}>
      <defs>
        <radialGradient id="pv1" cx="50%" cy="40%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: 10 }).map((_, i) =>
        Array.from({ length: 10 }).map((_, j) => {
          const dx = (i - 4.5) / 4.5;
          const dy = (j - 4.5) / 4.5;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > 1) return null;
          const size = 1.2 + (1 - d) * 1.4;
          const op = 1 - d * 0.7;
          const h = shieldHash(i, j);
          const flickers = h % 100 < 35;
          const delay = ((h >>> 3) % 7000) / 1000;
          const duration = 5 + ((h >>> 9) % 4000) / 1000;
          const style: React.CSSProperties = flickers
            ? ({
                opacity: op,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                ["--dot-op" as string]: op,
              } as React.CSSProperties)
            : { opacity: op };
          return (
            <circle
              key={`${i}-${j}`}
              cx={12 + i * 11}
              cy={12 + j * 11}
              r={size}
              fill="var(--fg)"
              className={flickers ? "shield-flicker" : undefined}
              style={style}
            />
          );
        })
      )}
      <circle cx="60" cy="50" r="36" fill="url(#pv1)" />
    </svg>
  );
}

const COST_FEES = [
  "0.000005 SOL",
  "0.000008 SOL",
  "0.000006 SOL",
  "0.000011 SOL",
  "0.000007 SOL",
  "0.000009 SOL",
];

const COST_TIMES = ["412 ms", "389 ms", "428 ms", "398 ms", "451 ms", "407 ms"];

function PillarVisualSwap() {
  const [feeTick, setFeeTick] = useState(0);
  const [timeTick, setTimeTick] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const feeId = setInterval(() => setFeeTick((t) => t + 1), 1400);
    const timeId = setInterval(() => setTimeTick((t) => t + 1), 1100);
    return () => {
      clearInterval(feeId);
      clearInterval(timeId);
    };
  }, [reduced]);

  const fee = COST_FEES[feeTick % COST_FEES.length];
  const time = COST_TIMES[timeTick % COST_TIMES.length];

  return (
    <svg viewBox="0 0 160 120" width="100%" height="160" style={{ maxWidth: 180 }}>
      <text
        key={`fee-${feeTick}`}
        x="80"
        y="36"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--fg)"
        className={reduced ? undefined : "cost-tick"}
      >
        {fee}
      </text>
      <text
        key={`time-${timeTick}`}
        x="80"
        y="54"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--mono)"
        fontSize="9"
        fill="var(--fg-dim)"
        className={reduced ? undefined : "cost-tick"}
      >
        {time}
      </text>

      <line
        x1="36"
        y1="80"
        x2="124"
        y2="80"
        stroke="var(--line-2)"
        strokeWidth="0.8"
        strokeDasharray="1 3"
      />

      <g>
        <circle cx="28" cy="80" r="6" fill="none" stroke="var(--fg-dim)" strokeWidth="1" />
        <circle cx="28" cy="80" r="2" fill="var(--fg)" />
      </g>
      <g>
        <circle cx="132" cy="80" r="6" fill="none" stroke="var(--fg-dim)" strokeWidth="1" />
        <circle cx="132" cy="80" r="2" fill="var(--fg)" />
      </g>

      <text
        x="28"
        y="100"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--mono)"
        fontSize="8"
        fill="var(--fg)"
      >
        SOL
      </text>
      <text
        x="132"
        y="100"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--mono)"
        fontSize="8"
        fill="var(--fg)"
      >
        USDC
      </text>
    </svg>
  );
}

const LATTICE_HOP_POINTS: Array<[number, number]> = Array.from(
  { length: 12 },
  (_, k) => {
    const i = 1 + Math.floor(k / 3);
    const j = 1 + (k % 3);
    return [15 + i * 22, 15 + j * 22];
  }
);

function PillarVisualLattice() {
  const idxRef = useRef(5);
  const [idx, setIdx] = useState(5);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [hopCount, setHopCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let fadeOut: ReturnType<typeof setTimeout>;
    let hold: ReturnType<typeof setTimeout>;
    const tick = () => {
      setVisible(false);
      fadeOut = setTimeout(() => {
        const prev = idxRef.current;
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * LATTICE_HOP_POINTS.length);
        }
        idxRef.current = next;
        setPrevIdx(prev);
        setIdx(next);
        setHopCount((h) => h + 1);
        setVisible(true);
        hold = setTimeout(tick, 1800);
      }, 260);
    };
    hold = setTimeout(tick, 1800);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(hold);
    };
  }, [reduced]);

  const [x, y] = LATTICE_HOP_POINTS[idx];
  const echo = prevIdx !== null ? LATTICE_HOP_POINTS[prevIdx] : null;

  return (
    <svg viewBox="0 0 140 120" width="100%" height="160" style={{ maxWidth: 180 }}>
      {Array.from({ length: 6 }).map((_, i) =>
        Array.from({ length: 5 }).map((_, j) => {
          const gx = 15 + i * 22;
          const gy = 15 + j * 22;
          return (
            <g key={`${i}-${j}`}>
              <circle cx={gx} cy={gy} r="2" fill="var(--fg)" />
              {i < 5 && (
                <line x1={gx} y1={gy} x2={gx + 22} y2={gy} stroke="var(--line-2)" />
              )}
              {j < 4 && (
                <line x1={gx} y1={gy} x2={gx} y2={gy + 22} stroke="var(--line-2)" />
              )}
            </g>
          );
        })
      )}
      {echo && (
        <circle
          key={hopCount}
          className="lattice-echo"
          cx={echo[0]}
          cy={echo[1]}
          fill="none"
          stroke="var(--accent)"
        />
      )}
      <g
        style={{
          transform: `translate(${x}px, ${y}px) scale(${visible ? 1 : 0.4})`,
          opacity: visible ? 1 : 0,
          transition:
            "opacity 260ms cubic-bezier(0.22, 1, 0.36, 1), transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <circle r="5" fill="var(--accent)" />
        <circle
          r="12"
          fill="none"
          stroke="var(--accent)"
          strokeDasharray="2 2"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

type Pillar = {
  num: string;
  visual: ReactNode;
  title: string;
  body: string;
};

export function Pillars() {
  const data: Pillar[] = [
    {
      num: "01 / Privacy",
      visual: <PillarVisualShield />,
      title: "Your positions, unseen.",
      body: "Shielded balances and transfers. Front-running bots, on-chain sleuths, and strangers all see the same thing: nothing.",
    },
    {
      num: "02 / Solana",
      visual: <PillarVisualSwap />,
      title: "Sub-second, sub-cent.",
      body: "Settle privately in under seconds with fees measured in fractions. Private doesn\u2019t have to mean slow or expensive.",
    },
    {
      num: "03 / Post-quantum",
      visual: <PillarVisualLattice />,
      title: "Built for the next era.",
      body: "Lattice-based ML-KEM and ML-DSA protect every shield, today \u2014 against the cryptanalysis of tomorrow.",
    },
  ];
  return (
    <section id="product" className="pillars">
      <div className="section-inner">
        <div className="section-kicker">What Sombra does</div>
        <h2 className="section-title">
          A private wallet, <i>three</i> things right.
        </h2>
        <div className="pillars-grid">
          {data.map((p, i) => (
            <div key={i} className="pillar">
              <div className="pillar-num">{p.num}</div>
              <div className="pillar-visual">{p.visual}</div>
              <h3 className="pillar-title">{p.title}</h3>
              <p className="pillar-body">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
