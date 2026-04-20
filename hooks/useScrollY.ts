"use client";

import { useEffect, useState } from "react";

export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf: number | null = null;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setY(window.scrollY);
        raf = null;
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return y;
}
