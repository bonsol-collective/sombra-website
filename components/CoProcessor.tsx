import Image from "next/image";
import { ArtStage } from "./coprocessor/ArtStage";
import { PayrollArt } from "./coprocessor/PayrollArt";
import s from "./CoProcessor.module.css";

type Card = { art: string; title: string; body: string; Art?: () => React.ReactNode };

const CARDS: Card[] = [
  { art: "payroll", Art: PayrollArt, title: "Payroll", body: "Pay employees, contractors and vendors on-chain without putting salaries, rates or contract terms on the public record." },
  { art: "cross-border", title: "Cross-border payments", body: "Send stablecoins internationally while keeping amounts and counterparties private." },
  { art: "stocks", title: "Trade tokenised stocks", body: "Trade supported tokenised stocks and funds without revealing position size or trade direction." },
  { art: "deals", title: "Strategic Deals", body: "Execute acquisitions and token buybacks privately, so your moves don’t signal the market before you’re ready." },
  { art: "treasury", title: "Treasury", body: "Put your treasury plans into motion privately, from reserve management and rebalancing to transfers across entities." },
  { art: "wallets", title: "Wallets", body: "Give wallet users a more discreet way to send assets, with private transfers built into the experience." },
  { art: "defi", title: "De-Fi Applications", body: "Create financial products where users decide how much of their activity the world gets to see." },
  { art: "checkout", title: "Merchant Checkout", body: "Let customers pay in stablecoins while keeping the connection between their wallet and their purchase private." },
];

/**
 * Figma 3:6040 (desktop) / 347:93 (mobile). Animated cards render their art in HTML on a
 * 634×488 ArtStage with Figma's motion (coprocessor/motion.module.css); cards with no motion in
 * Figma use the exported art PNG (public/images/coprocessor).
 */
export function CoProcessor() {
  return (
    <section className={s.section}>
      <h2 className={`t-h2 ${s.title}`}>Privacy Co-Processor</h2>
      <div className={s.grid}>
        {CARDS.map((c) => (
          <article key={c.art} className={s.card}>
            <div className={s.text}>
              <h3 className={s.cardTitle}>{c.title}</h3>
              <p className={s.body}>{c.body}</p>
            </div>
            <div className={s.art}>
              {c.Art ? (
                <ArtStage><c.Art /></ArtStage>
              ) : (
                <Image src={`/images/coprocessor/${c.art}.png`} width={634} height={488} alt="" sizes="(max-width: 900px) 100vw, 634px" />
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
