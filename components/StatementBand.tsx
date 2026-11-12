import Image from "next/image";
import s from "./StatementBand.module.css";

/** Figma 53:17142 (desktop) / 234:1294 (mobile). */
export function StatementBand() {
  return (
    <section className={s.section}>
      <div className={s.card}>
        <Image className={s.bg} src="/images/rock-dark.jpg" alt="" fill sizes="100vw" />
        <div className={s.frame}>
          <p className={s.text}>
            The world’s first privacy layer on Solana secured with <br className={s.br} />
            post-quantum security and regulatory compliance from genesis.
          </p>
        </div>
      </div>
    </section>
  );
}
