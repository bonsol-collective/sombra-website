import s from "./TypeIn.module.css";

/**
 * Figma "text animation": characters (whitespace skipped) fade in left→right once per
 * 10s loop, starting at `start` ms with `step` ms between characters.
 */
export function TypeIn({ text, start, step }: { text: string; start: number; step: number }) {
  let i = 0;
  return (
    <>
      {[...text].map((ch, k) =>
        ch.trim() ? (
          <span key={k} className={s.ch} style={{ animationDelay: `${start + step * i++}ms` }}>{ch}</span>
        ) : (
          ch
        ),
      )}
    </>
  );
}
