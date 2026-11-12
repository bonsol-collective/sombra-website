"use client";

import { useForm, ValidationError } from "@formspree/react";
import { Recaptcha } from "../Recaptcha";
import s from "./DemoForm.module.css";

// ponytail: shares the existing Formspree form with the old waitlist; `_subject` tells them apart.
const FORMSPREE_ID = "mqewlyko";

/** Figma 3:6348 (desktop) / 340:152 (mobile). */
export function DemoForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [state, handleSubmit] = useForm(FORMSPREE_ID);
  const busy = state.submitting || state.succeeded;

  return (
    <section className={s.section}>
      <h1 className={s.title}>See how Sombra<br />can work for you.</h1>
      <p className={s.lede}>Get a demo to see how Sombra can empower your team.</p>

      <form className={s.form} onSubmit={handleSubmit}>
        <input type="hidden" name="_subject" value="Demo request" />
        <div className={s.pair}>
          <label className={s.label}>First Name*<input className="field" name="firstName" autoComplete="given-name" required disabled={busy} /></label>
          <label className={s.label}>Last Name*<input className="field" name="lastName" autoComplete="family-name" required disabled={busy} /></label>
        </div>
        <label className={s.label}>Job title*<input className="field" name="jobTitle" autoComplete="organization-title" required disabled={busy} /></label>
        <label className={s.label}>Work email*<input className="field" type="email" name="email" autoComplete="email" defaultValue={defaultEmail} required disabled={busy} /></label>
        <ValidationError field="email" errors={state.errors} className={s.error} />
        <label className={s.label}>Company name*<input className="field" name="company" autoComplete="organization" required disabled={busy} /></label>
        <label className={s.label}>Tell us more<textarea className="field" name="message" disabled={busy} /></label>
        {/* Honeypot: Formspree silently drops submissions where _gotcha is filled. */}
        <input type="text" name="_gotcha" className={s.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {!state.succeeded && <Recaptcha className={s.captcha} />}

        <div className={s.foot}>
          <p className={s.note}>
            {state.succeeded ? "Thanks — we’ll be in touch shortly." : "We’ll use these details to respond to your walkthrough request."}
          </p>
          <button className={`btn btn--pine ${s.submit}`} type="submit" disabled={busy}>
            {state.succeeded ? "Sent" : state.submitting ? "Sending…" : "Submit"}
          </button>
        </div>
        <ValidationError errors={state.errors} className={s.error} />
      </form>
    </section>
  );
}
