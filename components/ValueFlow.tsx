"use client";

import { useEffect, useRef } from "react";
import { useFit } from "./useFit";
import "./value-flow.css";
import { DESKTOP_HTML, MOBILE_HTML } from "./valueFlowMarkup";
import s from "./ValueFlow.module.css";

// Where each phase of the export's 14s timeline has finished playing (seconds):
// Deposit (0–20%), Blend in (–34%), Send privately (–56%), Withdraw (–92%, before the fade-out).
const STOPS = [2.8, 4.76, 7.84, 12.9];
const FORWARD = 1.5; // playback speed when scrolling down (×real time)
const BACKWARD = 3; //  …and when rewinding

/**
 * "How value moves through the shielded pool." — the Value flow HTML exports
 * (.agent/reference/value-flow), driven by scroll: the section pins, and each quarter of the
 * scroll plays the next phase of the timeline and holds it. Exported hex colors are kept as-is
 * inside the artboards (SVG presentation attributes can't take CSS variables).
 */
export function ValueFlow() {
  const section = useRef<HTMLElement>(null);
  const desktop = useFit(2300);
  const mobile = useFit(390);

  useEffect(() => {
    const el = section.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = 0;
    let last = 0;
    let raf = 0;

    const goal = () => {
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      if (r.top > vh * 0.5) return 0; // not reached yet: nothing played
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      return STOPS[Math.min(STOPS.length - 1, Math.floor(p * STOPS.length))];
    };
    const tick = (now: number) => {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      const g = goal();
      t = g > t ? Math.min(g, t + dt * FORWARD) : Math.max(g, t - dt * BACKWARD);
      // Every CSS animation in the artboards shares the 14s timeline: park them all at t.
      for (const a of el.getAnimations({ subtree: true })) {
        a.pause();
        a.currentTime = t * 1000;
      }
      raf = requestAnimationFrame(tick);
    };
    // Only drive the timeline while the section is on screen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) { last = 0; raf = requestAnimationFrame(tick); }
      if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(el);
    // Start parked at 0 so nothing plays on its own before the section is reached.
    for (const a of el.getAnimations({ subtree: true })) { a.pause(); a.currentTime = 0; }
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={section} id="flow" className={s.section}>
      <div className={s.pin}>
        <h2 className={`t-h2 ${s.title}`}>How value moves<br />through the shielded pool.</h2>
        <div ref={desktop} className={s.desktop}>
          <div className={`vf-d ${s.stageD}`} dangerouslySetInnerHTML={{ __html: DESKTOP_HTML }} />
        </div>
        <div ref={mobile} className={s.mobile}>
          <div className={`vf-m ${s.stageM}`} dangerouslySetInnerHTML={{ __html: MOBILE_HTML }} />
        </div>
      </div>
    </section>
  );
}
