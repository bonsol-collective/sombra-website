import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo" aria-label="Sombra — home">
        <span className="nav-logo-mark" aria-hidden="true"></span>
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
