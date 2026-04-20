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

const GRAPH_NODES: ReadonlyArray<{ x: number; y: number }> = [
  { x: 22, y: 50 },   // 0: SOL source
  { x: 50, y: 22 },   // 1
  { x: 50, y: 78 },   // 2
  { x: 80, y: 12 },   // 3
  { x: 80, y: 50 },   // 4
  { x: 80, y: 88 },   // 5
  { x: 110, y: 26 },  // 6
  { x: 110, y: 74 },  // 7
  { x: 134, y: 50 },  // 8: USDC dest
];

const GRAPH_EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [0, 2], [0, 4],
  [1, 3], [1, 4], [2, 4], [2, 5],
  [3, 6], [4, 6], [4, 7], [5, 7],
  [6, 8], [7, 8], [4, 8],
];

const GRAPH_SOURCE = 0;
const GRAPH_DEST = 8;

const GRAPH_DEPTHS: ReadonlyArray<number> = (() => {
  const d = new Array<number>(GRAPH_NODES.length).fill(Infinity);
  const adj: number[][] = GRAPH_NODES.map(() => []);
  for (const [u, v] of GRAPH_EDGES) {
    adj[u].push(v);
    adj[v].push(u);
  }
  d[GRAPH_SOURCE] = 0;
  const queue: number[] = [GRAPH_SOURCE];
  while (queue.length) {
    const n = queue.shift()!;
    for (const m of adj[n]) {
      if (d[m] > d[n] + 1) {
        d[m] = d[n] + 1;
        queue.push(m);
      }
    }
  }
  return d;
})();

const GRAPH_MAX_DEPTH = Math.max(...GRAPH_DEPTHS);

// Edges oriented outward from source that carry a propagating packet (one level → next level).
const GRAPH_PROP_EDGES: ReadonlyArray<readonly [number, number]> = GRAPH_EDGES
  .map(([u, v]) => (GRAPH_DEPTHS[u] < GRAPH_DEPTHS[v] ? ([u, v] as const) : ([v, u] as const)))
  .filter(([u, v]) => GRAPH_DEPTHS[v] - GRAPH_DEPTHS[u] === 1);

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

  const STEP = 0.18;
  const PULSE_DUR = 0.42;
  const PROP_DONE = GRAPH_MAX_DEPTH * STEP;
  const HOLD = 0.55;
  const FADE = 0.32;
  const CYCLE = PROP_DONE + HOLD + FADE;

  const local = reduced ? PROP_DONE : t % CYCLE;
  const fadeAmt =
    local > PROP_DONE + HOLD
      ? Math.min(1, (local - PROP_DONE - HOLD) / FADE)
      : 0;
  const alpha = 1 - fadeAmt;

  const easeInOut = (x: number) =>
    x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

  const destActivation = GRAPH_DEPTHS[GRAPH_DEST] * STEP;
  const destAge = local - destActivation;
  const destRingActive = !reduced && destAge >= 0 && destAge < PULSE_DUR + HOLD;
  const destRingPhase = destRingActive
    ? Math.min(1, destAge / (PULSE_DUR + HOLD))
    : 0;

  return (
    <svg viewBox="0 0 160 120" width="100%" height="160" style={{ maxWidth: 180 }}>
      <g style={{ opacity: alpha }}>
        {GRAPH_EDGES.map(([u, v], i) => (
          <line
            key={`e-${i}`}
            x1={GRAPH_NODES[u].x}
            y1={GRAPH_NODES[u].y}
            x2={GRAPH_NODES[v].x}
            y2={GRAPH_NODES[v].y}
            stroke="var(--line-2)"
            strokeWidth="0.6"
          />
        ))}

        {!reduced &&
          GRAPH_PROP_EDGES.map(([u, v], i) => {
            const startTime = GRAPH_DEPTHS[u] * STEP;
            if (local < startTime || local > startTime + STEP) return null;
            const p = (local - startTime) / STEP;
            const ep = easeInOut(p);
            const x = GRAPH_NODES[u].x + (GRAPH_NODES[v].x - GRAPH_NODES[u].x) * ep;
            const y = GRAPH_NODES[u].y + (GRAPH_NODES[v].y - GRAPH_NODES[u].y) * ep;
            return (
              <g key={`p-${i}`}>
                <circle cx={x} cy={y} r="3" fill="var(--accent)" opacity="0.22" />
                <circle cx={x} cy={y} r="1.4" fill="var(--accent)" />
              </g>
            );
          })}

        {GRAPH_NODES.map((n, i) => {
          const act = GRAPH_DEPTHS[i] * STEP;
          const age = local - act;
          if (age < 0 || age > PULSE_DUR) return null;
          const pp = age / PULSE_DUR;
          const isEnd = i === GRAPH_SOURCE || i === GRAPH_DEST;
          return (
            <circle
              key={`pulse-${i}`}
              cx={n.x}
              cy={n.y}
              r={2 + pp * (isEnd ? 9 : 5)}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.8"
              opacity={(1 - pp) * (isEnd ? 0.65 : 0.45)}
            />
          );
        })}

        {destRingActive && (
          <circle
            cx={GRAPH_NODES[GRAPH_DEST].x}
            cy={GRAPH_NODES[GRAPH_DEST].y}
            r={6 + destRingPhase * 10}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.8"
            opacity={(1 - destRingPhase) * 0.4}
          />
        )}

        {GRAPH_NODES.map((n, i) => {
          const activated = local >= GRAPH_DEPTHS[i] * STEP;
          const isSource = i === GRAPH_SOURCE;
          const isDest = i === GRAPH_DEST;
          if (isSource || isDest) {
            return (
              <g key={`n-${i}`}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="5.5"
                  fill="none"
                  stroke={activated ? "var(--accent)" : "var(--fg-mute)"}
                  strokeWidth="1"
                  opacity={activated ? 0.85 : 0.6}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="2"
                  fill={activated ? "var(--accent)" : "var(--fg-mute)"}
                />
              </g>
            );
          }
          return (
            <circle
              key={`n-${i}`}
              cx={n.x}
              cy={n.y}
              r="1.6"
              fill={activated ? "var(--accent)" : "var(--fg-mute)"}
              opacity={activated ? 1 : 0.55}
            />
          );
        })}

        <text
          x={GRAPH_NODES[GRAPH_SOURCE].x}
          y={68}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--mono)"
          fontSize="8"
          fill="var(--fg)"
        >
          SOL
        </text>
        <text
          x={GRAPH_NODES[GRAPH_DEST].x}
          y={68}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--mono)"
          fontSize="8"
          fill="var(--fg)"
        >
          USDC
        </text>
      </g>
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
