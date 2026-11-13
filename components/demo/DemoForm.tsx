"use client";

import { useState, type FormEvent } from "react";
import { Recaptcha } from "../Recaptcha";
import s from "./DemoForm.module.css";

const FAILED = "We could not send your request. Try again, or email sombra@bonsol.org.";
const MESSAGES: Record<string, string> = {
  invalid: "Check the fields and try again.",
  captcha: "Complete the captcha, then submit again.",
};

/** Figma 3:6348 (desktop) / 340:152 (mobile). The request goes to `/api/demo`, which stores it in the team sheet. */
export function DemoForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const busy = state !== "idle";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { "g-recaptcha-response": captcha, ...fields } = Object.fromEntries(new FormData(event.currentTarget));
    setState("sending");
    setError(null);
    try {
      const answer = await fetch("/api/demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...fields, captcha }),
      });
      const result = (await answer.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (answer.ok && result?.ok) {
        setState("sent");
        return;
      }
      setError(MESSAGES[result?.error ?? ""] ?? FAILED);
    } catch {
      setError(FAILED);
    }
    // A captcha answer works one time only, so the next try needs a new one.
    (window as { grecaptcha?: { reset?: () => void } }).grecaptcha?.reset?.();
    setState("idle");
  }

  return (
    <section className={s.section}>
      <h1 className={s.title}>See how Sombra<br />can work for you.</h1>
      <p className={s.lede}>Get a demo to see how Sombra can empower your team.</p>

      <form className={s.form} onSubmit={submit}>
        <div className={s.pair}>
          <label className={s.label}>First Name*<input className="field" name="firstName" autoComplete="given-name" maxLength={100} required disabled={busy} /></label>
          <label className={s.label}>Last Name*<input className="field" name="lastName" autoComplete="family-name" maxLength={100} required disabled={busy} /></label>
        </div>
        <label className={s.label}>Job title*<input className="field" name="jobTitle" autoComplete="organization-title" maxLength={150} required disabled={busy} /></label>
        <label className={s.label}>Work email*<input className="field" type="email" name="email" autoComplete="email" maxLength={254} defaultValue={defaultEmail} required disabled={busy} /></label>
        <label className={s.label}>Company name*<input className="field" name="company" autoComplete="organization" maxLength={150} required disabled={busy} /></label>
        <label className={s.label}>Tell us more<textarea className="field" name="message" maxLength={4000} disabled={busy} /></label>
        {/* Honeypot: a person never sees this field. The server stores nothing when it is filled. */}
        <input type="text" name="_gotcha" className={s.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {state !== "sent" && <Recaptcha className={s.captcha} />}

        <div className={s.foot}>
          <p className={s.note} role="status">
            {state === "sent" ? "Thanks — we’ll be in touch shortly." : "We’ll use these details to respond to your walkthrough request."}
          </p>
          <button className={`btn btn--pine ${s.submit}`} type="submit" disabled={busy}>
            {state === "sent" ? "Sent" : state === "sending" ? "Sending…" : "Submit"}
          </button>
        </div>
        {error && <p className={s.error} role="alert">{error}</p>}
      </form>
    </section>
  );
}
