"use client";

import { useEffect, useState } from "react";
import { useScrollY } from "@/hooks/useScrollY";
import { useMouseParallax } from "@/hooks/useMouseParallax";

function HeroEclipse({ scrollY, speed }: { scrollY: number; speed: number }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const loop = (now: number) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const parallax = useMouseParallax(18);

  const scrollNorm = Math.min(1, scrollY / 800);
  const idleX = Math.sin(t * 0.3 * speed) * 18;
  const idleY = Math.cos(t * 0.22 * speed) * 12;
  const x = idleX + parallax.x - scrollNorm * 40;
  const y = idleY + parallax.y * 0.5 + scrollNorm * 20;
  const scale = 1 + scrollNorm * 0.15;

  return (
    <div className="hero-canvas">
      <div className="hero-grid-bg" aria-hidden="true"></div>
      <div className="hero-eclipse">
        <div
          className="hero-corona"
          style={{ opacity: 0.55 + Math.sin(t * 0.6) * 0.1 }}
        ></div>
        <div className="hero-sun"></div>
        <div
          className="hero-shadow"
          style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }}
        ></div>
      </div>
    </div>
  );
}

type HeroProps = {
  tagline?: string;
  speed?: number;
};

export function Hero({
  tagline = "Step into the shadow.",
  speed = 1,
}: HeroProps) {
  const scrollY = useScrollY();
  return (
    <header className="hero">
      <HeroEclipse scrollY={scrollY} speed={speed} />
      <div className="hero-content">
        <div>
          <div className="hero-tagline">{tagline}</div>
          <h1 className="hero-title">
            Trade in the <i>shadow.</i>
          </h1>
        </div>
        <div className="hero-meta">
          <strong>Sombra</strong> brings quantum-safe privacy to Solana. Private
          trading and transfers, built for the quantum era.
        </div>
      </div>
      <div className="hero-footer">
        <div>
          <span className="hero-footer-dot"></span> Mainnet beta · Q2 2026
        </div>
        <div></div>
        <div>scroll to reveal ↓</div>
      </div>
    </header>
  );
}
