"use client";

import { useEffect } from "react";

const LINKS = [
  { href: "#product", label: "Product" },
  { href: "#flow", label: "Flow" },
  { href: "#privacy", label: "Privacy" },
  { href: "#quantum", label: "Quantum" },
  { href: "#waitlist", label: "Waitlist" },
];

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      className={"mobile-menu" + (open ? " is-open" : "")}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Site navigation"
    >
      <button
        type="button"
        className="mobile-menu-close"
        aria-label="Close menu"
        onClick={onClose}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="17" y1="3" x2="3" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <nav className="mobile-menu-nav">
        <ul>
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={onClose}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
