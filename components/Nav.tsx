"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "./ButtonLink";
import s from "./Nav.module.css";

const LINKS = [
  { href: "/", label: "Product" },
  { href: "/trust", label: "Trust & Compliance" },
  { href: "/company", label: "Company" },
];

/**
 * Figma Navbar (458:136) + Navigation / Mobile (340:32).
 * `overlay`: transparent over a photo hero, solid once scrolled, hovered or opened.
 */
export function Nav({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const clear = overlay && !scrolled && !open;

  return (
    <>
      <header className={`${s.nav} ${clear ? s.clear : ""}`}>
        <Link href="/" className={s.logo} aria-label="Sombra — home">
          <img className={s.markInk} src="/brand/mark-ink.svg" width={24} height={24} alt="" />
          <img className={s.markWhite} src="/brand/mark-white.svg" width={24} height={24} alt="" />
        </Link>

        <nav className={s.links} aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>

        <div className={s.actions}>
          <ButtonLink href="https://docs.sombra.tech" variant="grey" arrow className={s.action}>
            Read docs
          </ButtonLink>
          <ButtonLink href="/demo" variant="grey" className={s.action}>
            Contact
          </ButtonLink>
        </div>

        <button
          type="button"
          className={s.menuToggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <img src="/brand/menu.svg" width={24} height={24} alt="" />
        </button>

        {open && (
          <div id="mobile-menu" className={s.panel}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className={s.panelActions}>
              <ButtonLink href="https://docs.sombra.tech" variant="grey" arrow>Read docs</ButtonLink>
              <ButtonLink href="/demo" variant="pine">Contact</ButtonLink>
            </div>
          </div>
        )}
      </header>
      {!overlay && <div className={s.spacer} aria-hidden="true" />}
    </>
  );
}
