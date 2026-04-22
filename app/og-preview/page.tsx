import type { Metadata } from "next";
import styles from "./og-preview.module.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OgPreviewPage() {
  return (
    <div className={styles.canvas}>
      <div className={styles.gridBg} aria-hidden />
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.tagline}>
            <span className={styles.taglineDot} />
            Step into the shadow.
          </div>
          <h1 className={styles.headline}>
            Trade in the <i>shadow.</i>
          </h1>
          <div className={styles.divider} />
          <div className={styles.footnote}>
            Sombra — post-quantum privacy on Solana
          </div>
        </div>
        <div className={styles.eclipse}>
          <div className={styles.corona} />
          <div className={styles.sun} />
          <div className={styles.shadow} />
        </div>
      </div>
    </div>
  );
}
