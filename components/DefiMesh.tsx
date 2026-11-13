"use client";

import { useEffect, useRef, useState } from "react";
import s from "./DefiMesh.module.css";

// Ported from the "DeFi mesh — light theme" export (Main.dc.html), defaults speed 1, drift 18, parallax 40.
const BASE = [
  [160, 140], [400, 90], [640, 150], [250, 320], [560, 300], [140, 470], [420, 500], [680, 460],
  [60, 280], [300, 200], [520, 190], [750, 300], [400, 390], [760, 90], [250, 540], [560, 550],
];
const DEPTH = [1, 0.6, 0.9, 1.25, 0.8, 0.5, 1.1, 0.7, 0.4, 0.85, 1.15, 0.55, 1, 0.45, 0.9, 0.75];
// [from, to, packet duration s, packet delay s, reversed]
const EDGES = [
  [0, 1, 2.6, 0, 0], [1, 2, 3.1, -1.2, 1], [0, 3, 2.2, -0.6, 0],
  [2, 4, 2, -1.5, 0], [3, 4, 3.3, -0.9, 1], [3, 5, 2.1, -1.7, 0], [3, 6, 2.7, -0.4, 1], [4, 6, 2.4, -2.2, 0],
  [4, 7, 2.3, -1.1, 1], [2, 7, 3.4, -2.6, 0], [5, 6, 3, -0.7, 1], [6, 7, 2.9, -1.9, 0],
  [8, 0, 2.1, -0.8, 1], [8, 3, 2.4, -1.4, 0], [8, 5, 2.6, -0.2, 1], [9, 0, 2.2, -1.9, 0], [9, 1, 2.3, -0.5, 1],
  [9, 3, 1.9, -1.1, 0], [9, 12, 2.8, -2.3, 1], [10, 1, 2.2, -0.9, 0], [10, 2, 2.5, -1.6, 1], [10, 4, 1.8, -0.4, 0],
  [10, 9, 2.7, -2.1, 1], [11, 2, 2.4, -1.3, 0], [11, 4, 2.6, -0.6, 1], [11, 7, 2.1, -1.8, 0], [11, 13, 2.3, -0.1, 1],
  [13, 2, 2, -1, 0], [12, 3, 2.5, -2.4, 1], [12, 4, 2.4, -0.7, 0], [12, 6, 1.9, -1.5, 1], [14, 5, 2.3, -0.3, 0],
  [14, 6, 2.2, -1.7, 1], [15, 6, 2.4, -0.9, 0], [15, 7, 2.6, -2, 1],
];
const DRIFT = 18;
const PARALLAX = 40;

/** Drifting peer-to-peer network: nodes float, packets flow along edges, random nodes pulse. */
export function DefiMesh() {
  const [t, setT] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const sim = useRef({ shines: [] as { i: number; at: number }[], nextPick: 0, mouse: { x: 0, y: 0 }, target: { x: 0, y: 0 } });

  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const st = sim.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const time = (now - start) / 1000;
      if (time >= st.nextPick) {
        const n = Math.random() < 0.3 ? 2 : 1;
        for (let j = 0; j < n; j++) st.shines.push({ i: Math.floor(Math.random() * BASE.length), at: time });
        st.nextPick = time + 0.8 + Math.random();
      }
      st.shines = st.shines.filter((x) => time - x.at < 4);
      st.mouse.x += (st.target.x - st.mouse.x) * 0.06;
      st.mouse.y += (st.target.y - st.mouse.y) * 0.06;
      setT(time);
      raf = requestAnimationFrame(tick);
    };
    // Only animate while on screen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(tick);
      if (!e.isIntersecting) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const { mouse, shines } = sim.current;
  const pts = BASE.map(([bx, by], i) => [
    bx + DRIFT * Math.sin(t * (0.35 + i * 0.045) + i * 1.7) - mouse.x * PARALLAX * DEPTH[i],
    by + DRIFT * Math.cos(t * (0.3 + i * 0.05) + i * 2.3) - mouse.y * PARALLAX * DEPTH[i],
  ]);
  const glow = BASE.map(() => 0);
  const age = BASE.map(() => 9);
  for (const x of shines) {
    const a = t - x.at;
    if (a < 0) continue;
    const env = a < 0.9 ? 0.5 - 0.5 * Math.cos((Math.PI * a) / 0.9) : Math.max(0, 0.5 + 0.5 * Math.cos(Math.PI * Math.min(1, (a - 0.9) / 2.6)));
    glow[x.i] = Math.max(glow[x.i], env);
    age[x.i] = Math.min(age[x.i], a);
  }
  const nodes = pts.map(([x, y], i) => ({ x, y, sc: 0.55 + 0.45 * DEPTH[i], g: glow[i], p: Math.min(1, age[i] / 3.2) }));
  const line = (a: number, b: number) => `M${pts[a][0].toFixed(1)} ${pts[a][1].toFixed(1)} L${pts[b][0].toFixed(1)} ${pts[b][1].toFixed(1)}`;

  return (
    <div
      ref={box}
      className={s.mesh}
      onPointerMove={(ev) => {
        const b = ev.currentTarget.getBoundingClientRect();
        sim.current.target = { x: ((ev.clientX - b.left) / b.width - 0.5) * 2, y: ((ev.clientY - b.top) / b.height - 0.5) * 2 };
      }}
      onPointerLeave={() => { sim.current.target = { x: 0, y: 0 }; }}
    >
      <svg viewBox="0 0 800 580" role="img" aria-label="Decentralized finance network: value moving peer to peer between drifting nodes">
        <g>
          {EDGES.map(([a, b], k) => (
            <path key={k} className={s.edge} d={line(a, b)} opacity={0.06 + 0.12 * Math.min(1, (DEPTH[a] + DEPTH[b]) / 2)} />
          ))}
        </g>
        <g>
          {EDGES.map(([a, b, d, o, r], k) => (
            <path
              key={k}
              className={`${s.pkt} ${r ? s.rev : ""}`}
              pathLength={100}
              d={line(a, b)}
              opacity={Math.min(1, 0.25 + (0.6 * (DEPTH[a] + DEPTH[b])) / 2)}
              style={{ animationDuration: `${d}s`, animationDelay: `${o}s` }}
            />
          ))}
        </g>
        {/* Layered like the export: glows + rings, then node discs, then cores on top. */}
        <g>
          {nodes.map((n, i) => (
            <g key={i}>
              <circle className={s.fill} cx={n.x} cy={n.y} r={(12 + 10 * n.g) * n.sc} opacity={0.12 * n.g} />
              <circle className={s.ring} cx={n.x} cy={n.y} r={(12 + 26 * n.p) * n.sc} opacity={0.55 * (1 - n.p)} />
            </g>
          ))}
        </g>
        <g>
          {nodes.map((n, i) => (
            <circle key={i} className={s.node} cx={n.x} cy={n.y} r={12 * n.sc} strokeOpacity={Math.min(1, 0.3 + 0.6 * DEPTH[i])} />
          ))}
        </g>
        <g>
          {nodes.map((n, i) => (
            <circle key={i} className={s.fill} cx={n.x} cy={n.y} r={(3 + 6 * n.g) * n.sc} opacity={0.08 + 0.92 * n.g} />
          ))}
        </g>
      </svg>
    </div>
  );
}
