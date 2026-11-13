import m from "./motion.module.css";
import { TypeIn } from "./TypeIn";
import s from "./CrossBorderArt.module.css";

const cls = (id: string) => m["n" + id.replace(":", "_")] ?? "";

// Figma rows 242:43578 / 43535 / 43621 with their flag, label and amount node ids.
const CHIPS = [
  { row: "242:43578", flag: "242:43588", to: "242:43593", stars: "242:43601", amountLabel: "242:43597", amount: "242:43606", x: 179, y: 205, img: "us", coin: "USDT", start: 642, step: 55.6 },
  { row: "242:43535", flag: "242:43545", to: "242:43550", stars: "242:43554", amountLabel: "242:43563", amount: "242:43559", x: 282, y: 288, img: "uk", coin: "SOL", start: 942, step: 62.5 },
  { row: "242:43621", flag: "242:43631", to: "242:43636", stars: "242:43640", amountLabel: "242:43649", amount: "242:43645", x: 136, y: 370, img: "in", coin: "USDC", start: 1242, step: 55.6 },
];

/** Figma "cross border payments" (242:43507): payment chips pop in over the map, then shrink away. */
export function CrossBorderArt() {
  return (
    <>
      <img src="/images/coprocessor/cross-border-map.png" alt="" />
      {CHIPS.map((c) => (
        <div key={c.row} className={`${s.chip} ${cls(c.row)}`} style={{ left: c.x, top: c.y }}>
          <span className={`${s.flag} ${cls(c.flag)}`}><img src={`/images/coprocessor/flag-${c.img}.png`} width={33} height={34} alt="" /></span>
          <span className={`${s.label} ${cls(c.to)}`} style={{ left: 57 }}>To</span>
          <span className={`${s.label} ${s.right} ${cls(c.amountLabel)}`}>Amount</span>
          <span className={`${s.value} ${cls(c.stars)}`} style={{ left: 57 }}>********</span>
          <span className={`${s.value} ${s.amount} ${cls(c.amount)}`}>
            <TypeIn text={`***** ${c.coin}`} start={c.start} step={c.step} />
          </span>
        </div>
      ))}
    </>
  );
}
