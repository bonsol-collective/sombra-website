import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo" aria-label="Sombra - home">
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
        <a href="#waitlist" className="nav-cta">
          <span className="nav-cta-full">Join waitlist →</span>
          <span className="nav-cta-short">Join →</span>
        </a>
      </div>
    </nav>
  );
}
