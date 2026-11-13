import s from "./Values.module.css";

const VALUES = [
  { title: "Protection is a responsibility.", body: "We anticipate risk, build for resilience, and protect what others entrust to us." },
  { title: "Privacy is foundational.", body: "Privacy is a principle that shapes every decision, system, and product from the beginning." },
  { title: "Freedom is the outcome.", body: "Technology should expand human agency. We build to give people greater choice, autonomy, and freedom of movement." },
];

/** Figma 356:7501 — "Frame 169–171 slider" (lock → shield → key, then a loop copy) + values list. */
export function Values() {
  return (
    <section className={s.section}>
      <div className={s.slider} aria-hidden="true">
        <div className={s.track}>
          {[1, 2, 3, 1].map((n, i) => (
            <img key={i} src={`/images/values/value-${n}.jpg`} width={720} height={732} alt="" loading="lazy" />
          ))}
        </div>
      </div>
      <div className={s.copy}>
        <h2 className={s.title}>The values<br />that guide us.</h2>
        <ol className={s.list}>
          {VALUES.map((v, i) => (
            <li key={v.title} className={s.item}>
              <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className={s.itemTitle}>{v.title}</span>
                <span className={s.body}>{v.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
