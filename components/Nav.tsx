"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo" aria-label="Sombra — home">
          <span className="nav-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <defs>
                <radialGradient id="nav-corona" cx="50%" cy="50%" r="50%">
                  <stop offset="52%" stopColor="var(--accent)" stopOpacity="0" />
                  <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.95" />
                  <stop offset="88%" stopColor="var(--accent)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="16" cy="16" r="16" fill="url(#nav-corona)" />
              <circle cx="16" cy="16" r="8.5" fill="var(--ink)" />
            </svg>
          </span>
          <span>Sombra</span>
        </Link>
        <div className="nav-links">
          <a href="#product">Product</a>
          <a href="#flow">Flow</a>
          <a href="#privacy">Privacy</a>
          <a href="#quantum">Quantum</a>
          <a href="#waitlist">Waitlist</a>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <button
            type="button"
            className="nav-menu-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
              <line x1="0" y1="1" x2="18" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="11" x2="18" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <a href="#waitlist" className="nav-cta">
            <span className="nav-cta-full">Join waitlist →</span>
            <span className="nav-cta-short">Join →</span>
          </a>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
