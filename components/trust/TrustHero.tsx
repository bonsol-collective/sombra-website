import { ButtonLink } from "../ButtonLink";
import s from "./TrustHero.module.css";

/** Figma 3:6149 (desktop) / 340:37 (mobile). */
export function TrustHero() {
  return (
    <section className={s.section}>
      {/* TODO(design): Figma shows a checkerboard image placeholder here. */}
      <div className={s.visual} aria-hidden="true" />
      <div className={s.copy}>
        <h1 className={s.title}>Critical privacy<br />infrastructure for<br />on-chain finance.</h1>
        <p className={`t-body ${s.text}`}>
          Other privacy protocols rely on classical encryption that future quantum computers will
          decrypt retroactively. Sombra seals financial records with NIST post-quantum cryptography
          (ML-KEM-768) from day one.
        </p>
        <ButtonLink href="/demo">Request demo</ButtonLink>
      </div>
    </section>
  );
}
