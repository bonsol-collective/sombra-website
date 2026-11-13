import m from "./motion.module.css";
import { TypeIn } from "./TypeIn";
import s from "./OverlayArts.module.css";

const cls = (id: string) => m["n" + id.replace(":", "_")] ?? "";

/**
 * Wallets / De-Fi / Checkout cards: the Figma export with its moving parts erased
 * (public/images/coprocessor/*-base.png), plus those parts re-drawn on top with Figma's motion.
 * Positions are Figma card coordinates.
 */

/** "06.02 Private send" (242:53220): amount and recipient type in, the arrow nudges. */
export function WalletsArt() {
  return (
    <>
      <img src="/images/coprocessor/wallets-base.png" alt="" />
      <p className={s.payAmount}><TypeIn text="*****" start={1000} step={100} /></p>
      <p className={s.receive}><TypeIn text="******************" start={1600} step={44.4} /></p>
      <img className={`${s.arrow} ${cls("242:53259")}`} src="/images/coprocessor/wallet-arrow.svg" width={24} height={24} alt="" />
    </>
  );
}

/** "Developer dashboard" (242:42132): the privacy tile pulses, its shield pops and the check redraws. */
export function DefiArt() {
  return (
    <>
      <img src="/images/coprocessor/defi-base.png" alt="" />
      <div className={`${s.tile} ${cls("242:42170")}`}>
        <span className={`${s.shield} ${cls("242:42189")}`}>
          <img src="/images/coprocessor/defi-shield.svg" width={17.5} height={21.5} alt="" />
          <svg className={s.check} width="7.5" height="5.5" viewBox="0 0 7.5 5.5" fill="none">
            <path className={cls("242:42199")} pathLength={1} d="M0.75 2.75L2.75 4.75L6.75 0.75" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </>
  );
}

/** "Merchant checkout" (242:29789): the method is tapped, the card field focuses and fills in. */
export function CheckoutArt() {
  return (
    <>
      <img src="/images/coprocessor/checkout-base.png" alt="" />
      <img className={`${s.method} ${cls("242:29809")}`} src="/images/coprocessor/checkout-tile.png" width={187} height={67} alt="" />
      <div className={`${s.input} ${cls("242:29827")}`}>
        <img className={s.cardIcon} src="/images/coprocessor/checkout-card-icon.svg" width={11.78} height={11.78} alt="" />
        <p className={`${s.cardNumber} ${cls("242:29838")}`}><TypeIn text="**** **** **** ****" start={1140} step={68.8} /></p>
        <p className={`${s.cardNumber} ${cls("261:37")}`}><TypeIn text="**** **** **** ****" start={6300} step={68.8} /></p>
      </div>
    </>
  );
}
