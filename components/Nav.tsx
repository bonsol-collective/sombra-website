import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo" aria-label="Sombra — home">
        <span className="nav-logo-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32">
            <mask id="nav-logo-mask">
              <rect width="32" height="32" fill="black" />
              <circle cx="16" cy="16" r="15" fill="white" />
            </mask>
            <circle cx="16" cy="16" r="15" fill="var(--fg)" />
            <g mask="url(#nav-logo-mask)" fill="var(--bg)">
              <path d="M 1 10.2 L 20 10.2 L 26 13 L 7 13 Z" />
              <path d="M 6 19 L 25 19 L 31 21.8 L 12 21.8 Z" />
            </g>
            <circle cx="16" cy="16" r="2.6" fill="var(--accent)" />
          </svg>
        </span>
        <span>Sombra</span>
      </Link>
      <div className="nav-links">
        <a href="#product">Product</a>
        <a href="#privacy">Privacy</a>
        <a href="#quantum">Quantum</a>
        <a href="#waitlist">Waitlist</a>
      </div>
      <div className="nav-actions">
        <ThemeToggle />
        <a href="#waitlist" className="nav-cta">
          Join waitlist →
        </a>
      </div>
    </nav>
  );
}
