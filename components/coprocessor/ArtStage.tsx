"use client";

import { useFit } from "../useFit";
import s from "./ArtStage.module.css";

/**
 * Co-Processor card art in Figma's 634×488 card coordinates, scaled to the card width.
 * The card's text block covers y 0–133, so the stage is shifted up by that much.
 */
export function ArtStage({ children }: { children: React.ReactNode }) {
  const ref = useFit(634);
  return (
    <div ref={ref} className={s.fit} aria-hidden="true">
      <div className={s.stage}>{children}</div>
    </div>
  );
}
