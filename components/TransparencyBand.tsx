import Image from "next/image";
import s from "./TransparencyBand.module.css";

/** Figma 3:6101 (desktop) / 234:2342 (mobile). */
export function TransparencyBand() {
  return (
    <section className={s.section}>
      <Image className={s.bg} src="/images/canyon-band.jpg" alt="" fill sizes="100vw" />
      <p className={s.eyebrow}>Transparency</p>
      <p className={s.text}>
        Confidentiality begins with your first private transfer. A gasless relayer submits private
        transfers on your behalf so your fee-paying wallet is never linked.
      </p>
    </section>
  );
}
