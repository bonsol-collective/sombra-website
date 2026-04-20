"use client";

import { useEffect, useState } from "react";

type ScrambleOpts = {
  duration?: number;
  active?: boolean;
  chars?: string;
};

export function useScramble(target: string, opts: ScrambleOpts = {}) {
  const {
    duration = 1200,
    active = true,
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789",
  } = opts;
  const [out, setOut] = useState(target);
  useEffect(() => {
    if (!active) {
      setOut(target);
      return;
    }
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      let s = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (ch === " " || ch === "\n") {
          s += ch;
          continue;
        }
        const lockAt = (i / target.length) * 0.85;
        if (p >= lockAt + 0.15) {
          s += ch;
        } else if (p >= lockAt) {
          s += Math.random() > 0.5 ? ch : chars[Math.floor(Math.random() * chars.length)];
        } else {
          s += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setOut(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration, chars]);
  return out;
}
