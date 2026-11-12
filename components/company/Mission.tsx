import Image from "next/image";
import s from "./Mission.module.css";

/**
 * Figma 356:9431 + 320:82780 (desktop) / 341:63 (mobile): two full-height panels over the
 * same hills photo — the photo stays pinned (sticky) while the two statements scroll past.
 */
export function Mission() {
  return (
    <section className={s.section}>
      <div className={s.pin} aria-hidden="true">
        <Image className={s.bg} src="/images/hills.jpg" alt="" fill priority sizes="100vw" />
      </div>
      <div className={s.panel}>
        <p className={s.eyebrow}>Our mission</p>
        <h1 className={s.lead}>We exist to build financial privacy that is <br className={s.br} />designed to last in a changing world.</h1>
      </div>
      <div className={s.panel}>
        <p className={s.eyebrow} aria-hidden="true">Our mission</p>
        <div className={s.story}>
          <p>
            New forms of computation will unlock extraordinary possibilities and test the foundations
            of financial privacy. The future cannot be built on infrastructure designed for the past.
            It needs a new foundation—one engineered to endure the pressure of innovation.
          </p>
          <p>That’s why we built Sombra.</p>
        </div>
      </div>
    </section>
  );
}
