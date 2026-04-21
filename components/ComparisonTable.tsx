import { CryptoTerm } from "./CryptoTerm";

/**
 * ComparisonTable — Sombra vs Tornado vs Zcash.
 *
 * Rendered as a real <table> for accessibility. A disciplined ruled grid —
 * no card wrapper, no zebra-stripe. Sombra column header in accent.
 *
 * Positive cells do NOT render in accent (the Sombra column header already
 * carries accent; filling every positive cell would turn the column into a
 * solid ember stripe and undermine the accent's rarity). Positive cells
 * read as fg (strong, present); negative as fg-mute (muted absence);
 * muted as fg-dim (qualified).
 */

type Tone = "pos" | "neg" | "muted";
type Cell = { text: string; tone: Tone; term?: string };

interface Row {
  label: string;
  sombra: Cell;
  tornado: Cell;
  zcash: Cell;
}

const ROWS: Row[] = [
  {
    label: "Quantum-safe",
    sombra: { text: "Kyber-768", tone: "pos", term: "Kyber-768" },
    tornado: { text: "No — ECC", tone: "neg", term: "ECC" },
    zcash: { text: "No — ECC", tone: "neg", term: "ECC" },
  },
  {
    label: "Signature-free",
    sombra: { text: "Yes", tone: "pos" },
    tornado: { text: "No", tone: "neg" },
    zcash: { text: "No", tone: "neg" },
  },
  {
    label: "Multi-token",
    sombra: { text: "Any SPL token", tone: "pos" },
    tornado: { text: "Fixed denominations", tone: "muted" },
    zcash: { text: "ZEC only", tone: "muted" },
  },
  {
    label: "Amount privacy",
    sombra: { text: "Yes", tone: "pos" },
    tornado: { text: "Fixed only", tone: "muted" },
    zcash: { text: "Yes", tone: "pos" },
  },
  {
    label: "No nullifiers",
    sombra: { text: "Yes", tone: "pos" },
    tornado: { text: "No", tone: "neg" },
    zcash: { text: "No", tone: "neg" },
  },
  {
    label: "Proof system",
    sombra: { text: "STARK", tone: "pos", term: "STARK" },
    tornado: { text: "SNARK (ECC)", tone: "muted" },
    zcash: { text: "SNARK (ECC)", tone: "muted" },
  },
];

function renderCell(cell: Cell) {
  const content = cell.term ? (
    <CryptoTerm term={cell.term} variant="bare">
      {cell.text}
    </CryptoTerm>
  ) : (
    cell.text
  );
  return <span className={`compare-cell compare-cell--${cell.tone}`}>{content}</span>;
}

export function ComparisonTable() {
  return (
    <div id="compare" className="compare-wrap">
      <table className="compare">
        <thead>
          <tr>
            <th scope="col" className="compare-h-property">
              Property
            </th>
            <th scope="col" className="compare-h-sombra">
              Sombra
            </th>
            <th scope="col" className="compare-h-other">
              Tornado
            </th>
            <th scope="col" className="compare-h-other">
              Zcash
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="compare-row-label">
                {row.label}
              </th>
              <td>{renderCell(row.sombra)}</td>
              <td>{renderCell(row.tornado)}</td>
              <td>{renderCell(row.zcash)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
