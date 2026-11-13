import Image from "next/image";
import { ButtonLink } from "./ButtonLink";
import s from "./Hero.module.css";

/**
 * Figma Home hero (320:82751 desktop, 234:160 mobile).
 * ponytail: Figma fills this with a video; we ship its poster frame until the
 * mp4 is supplied, then swap in <video autoPlay muted loop playsInline poster>.
 */
export function Hero() {
  return (
    <section className={s.hero}>
      <Image className={s.bg} src="/images/hero-canyon.jpg" alt="" fill priority sizes="100vw" />
      <h1 className={s.title}>
        The new privacy standard <br className={s.br} />powering the next era of money.
      </h1>
      <p className={s.sub}>
        We keep individual and organizational balances, payroll, and B2B settlements confidential.
        <br />
        Privacy built to last with post-quantum cryptography.
      </p>
      <ButtonLink href="/demo" arrow className={s.cta}>Get started</ButtonLink>
    </section>
  );
}
