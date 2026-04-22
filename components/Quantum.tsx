"use client";

import { useEffect, useState } from "react";
import { ComparisonTable } from "./ComparisonTable";
import { CryptoTerm } from "./CryptoTerm";

function QuantumVisual() {
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
  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const angle = (t * 0.4) % (Math.PI * 2);

  return (
    <div className="quantum-visual">
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
        <defs>
          <radialGradient id="qg1" cx="50%" cy="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={160} fill="url(#qg1)" />
        {Array.from({ length: 14 }).map((_, i) =>
          Array.from({ length: 14 }).map((_, j) => {
            const x = 40 + i * 26;
            const y = 40 + j * 26;
            const dx = x - cx;
            const dy = y - cy;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > 170) return null;
            const theta = Math.atan2(dy, dx);
            const diff = Math.abs(
              ((theta - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI,
            );
            const near = 1 - Math.min(1, diff / 0.35);
            return (
              <circle
                key={`${i}-${j}`}
                cx={x}
                cy={y}
                r={1.5 + near * 2}
                fill="var(--fg)"
                opacity={0.35 + near * 0.5}
              />
            );
          }),
        )}
        <line
          x1={cx}
          y1={cy}
          x2={cx + Math.cos(angle) * 170}
          y2={cy + Math.sin(angle) * 170}
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.7"
        />
        <circle
          cx={cx}
          cy={cy}
          r={10}
          fill="var(--bg)"
          stroke="var(--accent)"
          strokeWidth="1"
        />
        <circle cx={cx} cy={cy} r={4} fill="var(--accent)" />
        <circle
          cx={cx}
          cy={cy}
          r={36}
          fill="none"
          stroke="var(--accent)"
          strokeDasharray="2 4"
          opacity="0.4"
        />
        <circle
          cx={cx}
          cy={cy}
          r={80}
          fill="none"
          stroke="var(--line-2)"
          strokeDasharray="1 6"
        />
        <text
          x="16"
          y="28"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--fg-mute)"
          letterSpacing="2"
        >
          LATTICE · R^n
        </text>
        <text
          x={size - 16}
          y={size - 16}
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--fg-mute)"
          textAnchor="end"
          letterSpacing="2"
        >
          LWE · CRYSTALS-KYBER
        </text>
      </svg>
    </div>
  );
}

export function Quantum() {
  return (
    <section id="quantum" className="quantum">
      <div className="section-inner">
        <div className="section-kicker">Post-quantum, today</div>
        <div className="quantum-grid">
          <QuantumVisual />
          <div className="quantum-copy">
            <h2 className="section-title">
              <i>Harvest now,</i> decrypt later.
            </h2>
            <p>
              Adversaries are harvesting encrypted traffic today, waiting for
              tomorrow’s quantum computers to run Shor’s algorithm and break
              elliptic-curve keys. Sombra ships NIST-standardized lattice
              cryptography right now
              —{" "}
              <CryptoTerm term="Kyber-768" variant="inline">
                Kyber-768
              </CryptoTerm>{" "}
              for key exchange,{" "}
              <CryptoTerm term="RISC0 STARK" variant="inline">
                RISC0 STARKs
              </CryptoTerm>{" "}
              for ownership proofs. No elliptic curves to break, no signatures
              to forge.
            </p>
            <div className="quantum-stats">
              <div className="quantum-stat">
                <div className="quantum-stat-label">Key exchange</div>
                <div className="quantum-stat-value">
                  <CryptoTerm term="ML-KEM-768" variant="bare">
                    <>
                      ML-KEM<small>768</small>
                    </>
                  </CryptoTerm>
                </div>
              </div>
              <div className="quantum-stat">
                <div className="quantum-stat-label">Encryption</div>
                <div className="quantum-stat-value">
                  <CryptoTerm term="ChaCha20-Poly1305" variant="bare">
                    <>
                      ChaCha20<small>Poly1305</small>
                    </>
                  </CryptoTerm>
                </div>
              </div>
              <div className="quantum-stat">
                <div className="quantum-stat-label">Proof system</div>
                <div className="quantum-stat-value">
                  <CryptoTerm term="RISC0 STARK" variant="bare">
                    <>
                      RISC0<small>STARK</small>
                    </>
                  </CryptoTerm>
                </div>
              </div>
              <div className="quantum-stat">
                <div className="quantum-stat-label">GPU proof time</div>
                <div className="quantum-stat-value">
                  ~2<small>s · RTX 3090</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ComparisonTable />
      </div>
    </section>
  );
}
