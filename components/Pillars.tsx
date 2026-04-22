"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const PILLAR_BEAT_MS = 2000;

function usePillarBeat(periodMs: number = PILLAR_BEAT_MS) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    setTick(Math.floor(performance.now() / periodMs));
    const schedule = () => {
      const now = performance.now();
      const untilNextBeat = periodMs - (now % periodMs);
      timeoutId = setTimeout(() => {
        setTick(Math.floor(performance.now() / periodMs));
        schedule();
      }, untilNextBeat);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, [periodMs]);
  return tick;
}

function shieldHash(i: number, j: number) {
  return ((i * 73856093) ^ (j * 19349663)) >>> 0;
}

function PillarVisualShield() {
  const tick = usePillarBeat();
  const [flashing, setFlashing] = useState(false);
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
    setFlashing(true);
    const id = setTimeout(() => setFlashing(false), 240);
    return () => clearTimeout(id);
  }, [tick, reduced]);

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
          const displayOpacity = flickers && flashing ? 0 : op;
          return (
            <circle
              key={`${i}-${j}`}
              cx={12 + i * 11}
              cy={12 + j * 11}
              r={size}
              fill="var(--fg)"
              opacity={displayOpacity}
              style={{
                transition: "opacity 180ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          );
        })
      )}
      <circle cx="60" cy="50" r="36" fill="url(#pv1)" />
    </svg>
  );
}

const COST_AMOUNTS = [
  " 12.40 SOL",
  " 84.26 SOL",
  "128.50 SOL",
  " 42.00 SOL",
  "216.30 SOL",
  " 95.84 SOL",
];

const COST_TIMES = ["412 ms", "389 ms", "428 ms", "398 ms", "451 ms", "407 ms"];

function FlipChar({ char }: { char: string }) {
  const [current, setCurrent] = useState(char);
  const [outgoing, setOutgoing] = useState<string | null>(null);
  const prevRef = useRef(char);

  useEffect(() => {
    if (char === prevRef.current) return;
    setOutgoing(prevRef.current);
    setCurrent(char);
    prevRef.current = char;
    const id = setTimeout(() => setOutgoing(null), 440);
    return () => clearTimeout(id);
  }, [char]);

  const render = (c: string) => (c === " " ? "\u00A0" : c);

  return (
    <span className="flip-char" aria-hidden="true">
      <span key={current} className="flip-char-in">
        {render(current)}
      </span>
      {outgoing !== null && (
        <span key={outgoing} className="flip-char-out">
          {render(outgoing)}
        </span>
      )}
    </span>
  );
}

function PillarVisualSwap() {
  const tick = usePillarBeat();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const effectiveTick = reduced ? 0 : tick;
  const amount = COST_AMOUNTS[effectiveTick % COST_AMOUNTS.length];
  const time = COST_TIMES[effectiveTick % COST_TIMES.length];

  return (
    <div
      className="swap-visual"
      role="img"
      aria-label={`Transfer ${amount}, settles in ${time}`}
    >
      <div className="swap-counter">
        <div className="swap-header">
          <span>SOL</span>
          <span className="swap-header-arrow" aria-hidden="true">→</span>
          <span>USDC</span>
        </div>
        <div className="swap-rows">
          <div className="swap-amount">
            {[...amount].map((ch, i) => (
              <FlipChar key={i} char={ch} />
            ))}
          </div>
          <div className="swap-time">
            {[...time].map((ch, i) => (
              <FlipChar key={i} char={ch} />
            ))}
          </div>
        </div>
      </div>
    </div>
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
  const tick = usePillarBeat();
  const idxRef = useRef(5);
  const lastTickRef = useRef<number | null>(null);
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
    if (lastTickRef.current === tick) return;
    if (lastTickRef.current === null) {
      lastTickRef.current = tick;
      return;
    }
    lastTickRef.current = tick;
    setVisible(false);
    const fadeOut = setTimeout(() => {
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
    }, 260);
    return () => clearTimeout(fadeOut);
  }, [tick, reduced]);

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
      title: "Solana native.",
      body: "Private transfers settle in seconds. No bridges to trust, no wrapped tokens to hold - Sombra is just Solana with a privacy layer.",
    },
    {
      num: "03 / Post-quantum",
      visual: <PillarVisualLattice />,
      title: "Built for the next era.",
      body: "Lattices, not elliptic curves. Hard to break - today and after.",
    },
  ];
  return (
    <section id="product" className="pillars">
      <div className="section-inner">
        <div className="section-kicker">What Sombra does</div>
        <h2 className="section-title">
          Private. Fast. <i>Future-proof.</i>
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
