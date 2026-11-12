import { ButtonLink } from "./ButtonLink";
import s from "./PrivateDefi.module.css";

/** Figma 3:6025 (desktop) / 347:80 (mobile). */
export function PrivateDefi() {
  return (
    <section className={s.section}>
      <div className={s.copy}>
        <h2 className="t-h2">Private De-Fi.<br />Without compromises.</h2>
        <p className={`t-body ${s.text}`}>
          Get Solana’s speed, reach, and liquidity with the confidentiality you require—using
          native SPL tokens, without bridges or wrapped assets.
        </p>
        <ButtonLink href="/demo" arrow>Get started</ButtonLink>
      </div>
      {/* TODO(design): Figma has an "Animation:" placeholder here; no animation delivered yet. */}
      <div className={s.visual} aria-hidden="true" />
    </section>
  );
}
