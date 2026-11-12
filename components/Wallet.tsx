import Image from "next/image";
import { ButtonLink } from "./ButtonLink";
import split from "./Split.module.css";
import s from "./Wallet.module.css";

const ACTIONS = ["Shield", "Transfer", "Receive", "Unshield"];
const PRIVATE = [
  { icon: "sol.png", name: "SOL", amount: "1.4981" },
  { icon: "nvidia.png", name: "NVIDIA xStock", amount: "100" },
  { icon: "usdc.png", name: "USDC", amount: "1,000" },
  { icon: "sombra", name: "SOMBRA", amount: "1,000" },
];

function Token({ icon, name, amount }: { icon: string; name: string; amount: string }) {
  return (
    <div className={s.row}>
      <span className={s.token}>
        {icon === "sombra" ? (
          <span className={s.sombra}>
            <img src="/images/wallet/sombra-bg.png" width={22} height={22} alt="" />
            <img className={s.sombraX} src="/images/wallet/sombra-x.svg" width={9} height={9} alt="" />
          </span>
        ) : (
          <img src={`/images/wallet/${icon}`} width={22} height={22} alt="" />
        )}
        {name}
      </span>
      <span className={s.amount}>{amount}</span>
    </div>
  );
}

/** Figma 422:44353 (desktop) / 431:44507 (mobile). */
export function Wallet() {
  return (
    <section id="wallet" className={split.split}>
      <div className={split.copy}>
        <div className={split.text}>
          <h2 className={split.title}>Your wallet.<br />Your business.</h2>
          <p className={split.sub}>
            A private wallet for Solana that puts you in control of what you share. Manage your
            assets, send and receive funds, and explore the ecosystem privately.
          </p>
        </div>
        <ButtonLink href="https://docs.sombra.tech" arrow>Get the wallet</ButtonLink>
      </div>

      <div className={split.media}>
        <Image className={split.bg} src="/images/grass.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />
        <div className={`${split.glass} ${s.card}`} role="img" aria-label="Sombra wallet showing private and public balances">
          <div className={s.actions}>
            {ACTIONS.map((a) => (
              <span key={a} className={s.action}>
                <img src={`/images/wallet/${a.toLowerCase()}.svg`} width={16} height={16} alt="" />
                {a}
              </span>
            ))}
          </div>
          <div className={s.panel}>
            <div className={s.head}>
              <span className={s.label}><img src="/images/wallet/private.svg" width={12} height={12} alt="" />Private</span>
              <span className={s.badge}><img src="/images/wallet/quantum-safe.svg" width={8} height={8} alt="" />Quantum-safe</span>
            </div>
            {PRIVATE.map((t) => <Token key={t.name} {...t} />)}
          </div>
          <div className={s.panel}>
            <div className={s.head}>
              <span className={s.label}><img src="/images/wallet/public.svg" width={12} height={12} alt="" />Public</span>
              <span className={s.badge}><img src="/images/wallet/not-quantum-safe.svg" width={8} height={8} alt="" />Not quantum safe</span>
            </div>
            <Token icon="usdc.png" name="USDC" amount="2.1234" />
          </div>
        </div>
      </div>
    </section>
  );
}
