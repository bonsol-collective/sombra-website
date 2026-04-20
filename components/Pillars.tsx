"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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

const SWAP_SOL_CX = 30;
const SWAP_SOL_CY = 50;
const SWAP_USDC_CX = 130;
const SWAP_USDC_CY = 70;
const SWAP_R = 18;
const SWAP_P0X = SWAP_SOL_CX + SWAP_R;
const SWAP_P0Y = SWAP_SOL_CY;
const SWAP_P1X = 80;
const SWAP_P1Y = 60;
const SWAP_P2X = SWAP_USDC_CX - SWAP_R;
const SWAP_P2Y = SWAP_USDC_CY;

function swapBezier(u: number): [number, number] {
  const iu = 1 - u;
  return [
    iu * iu * SWAP_P0X + 2 * iu * u * SWAP_P1X + u * u * SWAP_P2X,
    iu * iu * SWAP_P0Y + 2 * iu * u * SWAP_P1Y + u * u * SWAP_P2Y,
  ];
}

function PillarVisualSwap() {
  const [t, setT] = useState(0);
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
    let raf: number;
    const start = performance.now();
    const loop = (now: number) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const CYCLE = 0.95;
  const ZIP = 0.55;
  const local = reduced ? 0 : t % CYCLE;
  const raw = Math.min(1, local / ZIP);
  const eased =
    raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
  const [px, py] = swapBezier(eased);
  const zipping = local < ZIP;

  const trail = [0.06, 0.12, 0.18].map((d) => {
    const u = Math.max(0, eased - d);
    const [x, y] = swapBezier(u);
    return { x, y, u };
  });

  const pulsePhase = zipping ? 0 : Math.min(1, (local - ZIP) / (CYCLE - ZIP));
  const pulseActive = !zipping && !reduced;

  return (
    <svg viewBox="0 0 160 120" width="100%" height="160" style={{ maxWidth: 180 }}>
      <path
        d={`M ${SWAP_P0X} ${SWAP_P0Y} Q ${SWAP_P1X} ${SWAP_P1Y}, ${SWAP_P2X} ${SWAP_P2Y}`}
        stroke="var(--line-2)"
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
      />

      <g stroke="var(--fg)" strokeWidth="1" fill="none">
        <circle cx={SWAP_SOL_CX} cy={SWAP_SOL_CY} r={SWAP_R} opacity="0.9" />
        <circle cx={SWAP_USDC_CX} cy={SWAP_USDC_CY} r={SWAP_R} opacity="0.9" />
      </g>

      <text
        x={SWAP_SOL_CX}
        y={SWAP_SOL_CY}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--mono)"
        fontSize="9"
        fill="var(--fg)"
      >
        SOL
      </text>
      <text
        x={SWAP_USDC_CX}
        y={SWAP_USDC_CY}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--mono)"
        fontSize="9"
        fill="var(--fg)"
      >
        USDC
      </text>

      {pulseActive && (
        <circle
          cx={SWAP_USDC_CX}
          cy={SWAP_USDC_CY}
          r={SWAP_R + pulsePhase * 7}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity={(1 - pulsePhase) * 0.55}
        />
      )}

      {!reduced && zipping && (
        <>
          {trail
            .filter((d) => d.u > 0)
            .map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r="1.4"
                fill="var(--accent)"
                opacity={0.5 - i * 0.15}
              />
            ))}
          <circle cx={px} cy={py} r="3.5" fill="var(--accent)" opacity="0.3" />
          <circle cx={px} cy={py} r="2" fill="var(--accent)" />
        </>
      )}

      {reduced && (
        <circle
          cx={SWAP_USDC_CX - SWAP_R}
          cy={SWAP_USDC_CY}
          r="2"
          fill="var(--accent)"
        />
      )}
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
