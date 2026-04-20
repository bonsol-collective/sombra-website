"use client";

import { useEffect, useState, type ReactNode } from "react";

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
          return (
            <circle
              key={`${i}-${j}`}
              cx={12 + i * 11}
              cy={12 + j * 11}
              r={size}
              fill="var(--fg)"
              opacity={1 - d * 0.7}
            />
          );
        })
      )}
      <circle cx="60" cy="50" r="36" fill="url(#pv1)" />
    </svg>
  );
}

function PillarVisualSwap() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const loop = (now: number) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const a = (Math.sin(t * 0.8) + 1) / 2;
  return (
    <svg viewBox="0 0 160 120" width="100%" height="160" style={{ maxWidth: 180 }}>
      <g stroke="var(--fg)" strokeWidth="1" fill="none">
        <circle cx={30} cy={40 + a * 20} r="18" opacity="0.9" />
        <circle cx={130} cy={80 - a * 20} r="18" opacity="0.9" />
      </g>
      <path
        d={`M 48 ${40 + a * 20} Q 80 60, 112 ${80 - a * 20}`}
        stroke="var(--accent)"
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
      />
      <text
        x="30"
        y={40 + a * 20}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--mono)"
        fontSize="9"
        fill="var(--fg)"
      >
        SOL
      </text>
      <text
        x="130"
        y={80 - a * 20}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--mono)"
        fontSize="9"
        fill="var(--fg)"
      >
        USDC
      </text>
    </svg>
  );
}

function PillarVisualLattice() {
  return (
    <svg viewBox="0 0 140 120" width="100%" height="160" style={{ maxWidth: 180 }}>
      {Array.from({ length: 6 }).map((_, i) =>
        Array.from({ length: 5 }).map((_, j) => {
          const x = 15 + i * 22;
          const y = 15 + j * 22;
          return (
            <g key={`${i}-${j}`}>
              <circle cx={x} cy={y} r="2" fill="var(--fg)" />
              {i < 5 && (
                <line x1={x} y1={y} x2={x + 22} y2={y} stroke="var(--line-2)" />
              )}
              {j < 4 && (
                <line x1={x} y1={y} x2={x} y2={y + 22} stroke="var(--line-2)" />
              )}
            </g>
          );
        })
      )}
      <circle cx={59} cy={59} r="5" fill="var(--accent)" />
      <circle
        cx={59}
        cy={59}
        r="12"
        fill="none"
        stroke="var(--accent)"
        strokeDasharray="2 2"
        opacity="0.5"
      />
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
