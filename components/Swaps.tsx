import Image from "next/image";
import split from "./Split.module.css";
import s from "./Swaps.module.css";

function Leg({ label, amount, unit }: { label: string; amount: string; unit: string }) {
  return (
    <div className={s.leg}>
      <div className={s.legHead}>
        <span className={s.muted}>{label}</span>
        <span className={s.private}>
          <img src="/images/swap/private.svg" width={14} height={14} alt="" />Private
        </span>
      </div>
      <p className={s.amount}>{amount} <span className={s.unit}>{unit}</span></p>
    </div>
  );
}

/** Figma 422:44368 (desktop) / 431:44519 (mobile). */
export function Swaps() {
  return (
    <section className={`${split.split} ${split.reverse}`}>
      <div className={split.copy}>
        <div className={split.text}>
          <h2 className={split.title}>Private swaps.</h2>
          <p className={split.sub}>
            Swap privately through Jupiter, directly inside Sombra. Access Solana liquidity while
            keeping your trade amounts and activity out of public view.
          </p>
        </div>
        {/* The app isn’t live yet: a static label, not a link. */}
        <span className={`btn ${s.soon}`}>Coming soon</span>
      </div>

      <div className={split.media}>
        <Image className={split.bg} src="/images/coast.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />
        <div className={`${split.glass} ${s.card}`} role="img" aria-label="Private swap of 100 USDT to 1.24 SOL">
          <div className={s.legs}>
            <Leg label="From" amount="100" unit="USDT" />
            <Leg label="To" amount="1.24" unit="SOL" />
            <span className={s.flip}><img src="/images/swap/swap.svg" width={24} height={24} alt="" /></span>
          </div>
          <span className={s.swap}>Swap</span>
        </div>
      </div>
    </section>
  );
}
