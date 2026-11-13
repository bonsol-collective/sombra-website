"use client";

import { useEffect, useRef } from "react";

/** Scales a fixed-size artboard to its container: sets --k = containerWidth / artboardWidth. */
export function useFit(artboardWidth: number) {
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
