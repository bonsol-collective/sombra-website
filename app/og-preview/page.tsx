import type { Metadata } from "next";
import styles from "./og-preview.module.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** 1200×630 source for public/og.png — see README "Social preview image". */
export default function OgPreviewPage() {
  return (
    <div className={styles.canvas}>
      <img className={styles.bg} src="/images/hero-canyon.jpg" alt="" />
      <img className={styles.mark} src="/brand/logomark_white.svg" width={40} height={40} alt="" />
      <h1 className={styles.headline}>The new privacy standard<br />powering the next era of money.</h1>
      <p className={styles.footnote}>Post-quantum privacy on Solana · sombra.tech</p>
    </div>
  );
}
