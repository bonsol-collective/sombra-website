"use client";

import { useEffect, useRef } from "react";
import "./value-flow.css";
import { DESKTOP_HTML, MOBILE_HTML } from "./valueFlowMarkup";
import s from "./ValueFlow.module.css";

/** Scales a fixed-size artboard to its container via the --k custom property. */
function useFit(artboardWidth: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      if (e.contentRect.width) el.style.setProperty("--k", String(e.contentRect.width / artboardWidth));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [artboardWidth]);
  return ref;
}

/**
 * "How value moves through the shielded pool." — 14s CSS/SVG loop ported verbatim from the
 * Value flow HTML exports (.agent/reference/value-flow). Exported hex colors are kept as-is
 * inside the artboards (SVG presentation attributes can't take CSS variables).
 */
export function ValueFlow() {
  const desktop = useFit(2300);
  const mobile = useFit(390);
  return (
    <section id="flow" className={s.section}>
      <h2 className={`t-h2 ${s.title}`}>How value moves<br />through the shielded pool.</h2>
      <div ref={desktop} className={s.desktop}>
        <div className={`vf-d ${s.stageD}`} dangerouslySetInnerHTML={{ __html: DESKTOP_HTML }} />
      </div>
      <div ref={mobile} className={s.mobile}>
        <div className={`vf-m ${s.stageM}`} dangerouslySetInnerHTML={{ __html: MOBILE_HTML }} />
      </div>
    </section>
  );
}
