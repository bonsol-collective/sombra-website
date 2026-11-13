"use client";

import { useEffect, useRef } from "react";
import type { QuantumFridge } from "./quantumFridge";
import s from "./TrustHero.module.css";

/** Trust hero visual: the "Quantum fridge — glass seal, white" Three.js export, loaded client-side only. */
export function QuantumFridgeArt() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fridge = useRef<QuantumFridge | null>(null);

  useEffect(() => {
    let dead = false;
    let cleanup = () => {};
    import("./quantumFridge").then(({ QuantumFridge }) => {
      const el = box.current;
      if (dead || !el || !canvas.current) return;
      const q = new QuantumFridge(canvas.current, getComputedStyle(el).backgroundColor);
      fridge.current = q;
      // Reduced motion: one frame with the model assembled inside the risen glass.
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ro = new ResizeObserver(([e]) => {
        q.resize(e.contentRect.width, e.contentRect.height);
        if (still) q.still(7.5);
      });
      ro.observe(el);
      // Only animate while on screen.
      const io = new IntersectionObserver(([e]) => (e.isIntersecting && !still ? q.start() : q.stop()));
      io.observe(el);
      cleanup = () => { ro.disconnect(); io.disconnect(); q.dispose(); fridge.current = null; };
    });
    return () => { dead = true; cleanup(); };
  }, []);

  return (
    <div
      ref={box}
      className={s.visual}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        fridge.current?.pointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => fridge.current?.leave()}
    >
      <canvas
        ref={canvas}
        className={s.canvas}
        role="img"
        aria-label="3D wireframe of a quantum computer's dilution refrigerator splitting apart and rejoining, sealed inside a glass enclosure that rises around it"
      />
    </div>
  );
}
