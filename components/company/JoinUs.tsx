import Image from "next/image";
import { ButtonLink } from "../ButtonLink";
import s from "./JoinUs.module.css";

/** Figma 3:6296 (desktop) / 341:1984 (mobile). */
export function JoinUs() {
  return (
    <section className={s.section}>
      <Image className={s.bg} src="/images/mountains.jpg" alt="" fill sizes="100vw" />
      <h2 className={s.title}>Join us in building the foundation of private value.</h2>
      {/* TODO(link): no careers page yet — points at Bonsol Labs until one exists. */}
      <ButtonLink href="https://bonsol.org" variant="white" arrow>See open roles</ButtonLink>
    </section>
  );
}
