import m from "./motion.module.css";
import { TypeIn } from "./TypeIn";
import s from "./PayrollArt.module.css";

// Sheet guide lines (Figma 242:11715–31): x, y, width in sheet px.
const LINES: [string, number, number, number][] = [
  ["n242_11715", 172.13, 30.45, 68.853],
  ["n242_11731", 64.88, 58.26, 176.106],
  ["n242_11727", 15.89, 71.5, 225.097],
  ["n242_11719", 34.43, 91.36, 68.853],
  ["n242_11723", 172.13, 91.36, 68.853],
];

/** Figma "Invoice payment" (242:11665): the cheque fills in, then "Send payment" → "✓ Payment sent". */
export function PayrollArt() {
  return (
    <div className={s.card}>
      <div className={s.preview}>
        <div className={s.sheet}>
          <svg className={s.lines} viewBox="0 0 255.552 121.817">
            {LINES.map(([cls, x, y, w]) => (
              <line key={cls} className={m[cls]} x1={x} y1={y} x2={x + w} y2={y} pathLength={1} />
            ))}
          </svg>
          <p className={`${s.t} ${m.n242_11686}`} style={{ left: 15.89, top: 48.99, lineHeight: 2, whiteSpace: "pre" }}>
            {"Pay to the order of    **********\n                                          ******************"}
          </p>
          <p className={`${s.t} ${m.n242_11690}`} style={{ left: 217, top: 48.99, lineHeight: 2 }}>**********</p>
          <p className={`${s.t} ${m.n242_11694}`} style={{ left: 157.71, top: 23.75 }}>Date</p>
          <p className={`${s.t} ${m.n242_11698}`} style={{ left: 233, top: 15.89, fontSize: 4 }}>5678</p>
          <p className={`${s.t} ${m.n242_11707}`} style={{ left: 225.1, top: 62.1 }}>USDT</p>
          <p className={`${s.t} ${m.n242_11711}`} style={{ left: 15.36, top: 84.27 }}>Memo</p>
          <p className={`${s.num} ${m.n242_11703}`}><TypeIn text="2134567 56789 43567890" start={1500} step={40} /></p>
          <p className={`${s.num} ${m.n333_193}`}><TypeIn text="2134567 56789 43567890" start={6500} step={40} /></p>
          <div className={`${s.outline} ${m.n242_11735}`} />
        </div>
      </div>
      <div className={s.controls}>
        <div className={s.sent}>
          <span className={`${s.check} ${m.n242_11754}`}>
            <svg width="19.7333" height="14.4" viewBox="0 0 19.7333 14.4" fill="none">
              <path className={m.n242_11758} pathLength={1} d="M18.4 1.33333L6.66667 13.0667L1.33333 7.73333" stroke="#293935" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={m.n242_11765}>Payment sent</span>
        </div>
        <div className={`${s.send} ${m.n242_11769}`}>Payment sent</div>
      </div>
    </div>
  );
}
