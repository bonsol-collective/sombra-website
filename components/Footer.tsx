import Link from "next/link";
import s from "./Footer.module.css";

const COLUMNS = [
  {
    title: "Protocol",
    links: [
      { href: "/#wallet", label: "Wallet" },
      { href: "https://docs.sombra.tech", label: "Docs" },
      { href: "/whitepaper.pdf", label: "White Paper" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "https://x.com/bonsol_labs", label: "X (Twitter)" },
      { href: "https://discord.gg/cSrTYAT2US", label: "Discord" },
      { href: "https://t.me/+l2s8ejQ170U2ZDUx", label: "Telegram" },
    ],
  },
];

/** Figma footer (458:544 desktop, 458:830 mobile). Sits under `.page`'s rounded bottom. */
export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.brand}>
          <img className={s.logoDesktop} src="/brand/footer-logo.svg" width={230} height={44} alt="Sombra" />
          <img className={s.logoMobile} src="/brand/footer-mark.svg" width={31} height={32} alt="Sombra" />
          <p className={s.tagline}>The foundation of private value.</p>
          {/* Hands the email to /demo, which prefills its form. */}
          <form className={s.signup} action="/demo" method="get">
            <input
              className={s.email}
              type="email"
              name="email"
              placeholder="What’s your work email?"
              aria-label="Work email"
              autoComplete="email"
              required
            />
            <button className="btn btn--canyon" type="submit">
              <span className={s.cta}>Book demo</span>
              <span className={s.ctaMobile}>Book a demo</span>
            </button>
          </form>
          <p className={s.copy}>© 2026 Bonsol Labs · All rights reserved.</p>
        </div>

        <nav className={s.columns} aria-label="Footer">
          {COLUMNS.map((c) => (
            <div key={c.title} className={s.column}>
              <p className={s.colTitle}>{c.title}</p>
              {c.links.map((l) => (
                <Link key={l.label} href={l.href}>{l.label}</Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <img className={s.wordmark} src="/brand/wordmark-footer.svg" width={1376} height={320} alt="" />
    </footer>
  );
}
