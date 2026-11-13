import Image from "next/image";
import split from "../Split.module.css";
import s from "./Belief.module.css";

/** Figma 26:21 (desktop) / 356:9468 (mobile). */
export function Belief() {
  return (
    <section className={split.split}>
      <div className={split.copy}>
        <h2 className={split.title}>At the heart of Sombra<br />is a simple belief.</h2>
        <div className={`${split.sub} ${s.text}`}>
          <p>
            Sombra means shade—a word that also carries the sense of shelter, defence, and protection.
            In nature, shade is the reach of something strong: foundation creates resilience; resilience
            creates protection; protection preserves privacy; and privacy makes freedom possible.
          </p>
          <p>We bring that same principle to on-chain finance. Your freedom begins with the right foundation.</p>
        </div>
      </div>
      <div className={`${split.media} ${s.media}`}>
        <Image className={`${split.bg} ${s.bg}`} src="/images/rock-shade.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />
      </div>
    </section>
  );
}
