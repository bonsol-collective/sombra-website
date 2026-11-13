"use client";

import { useForm, ValidationError } from "@formspree/react";

export function Waitlist() {
  const [state, handleSubmit] = useForm("mqewlyko");
  const done = state.succeeded;

  return (
    <section id="waitlist" className="waitlist">
      <div className="waitlist-inner">
        <div className="waitlist-kicker">Step into the shadow.</div>
        <h2>
          The beta. <i>Q2 2026.</i>
        </h2>
        <p>Early access to the shadow.</p>
        <form className="waitlist-form-outer" onSubmit={handleSubmit}>
          <div className={"waitlist-form" + (done ? " submitted" : "")}>
            <input
              type="email"
              name="email"
              placeholder="you@domain.xyz"
              required
              autoComplete="email"
              disabled={done || state.submitting}
            />
            {/* Honeypot: Formspree silently drops submissions where
                _gotcha is filled. */}
            <input
              type="text"
              name="_gotcha"
              className="waitlist-honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <button type="submit" disabled={done || state.submitting}>
              {done
                ? "✓ You're in"
                : state.submitting
                  ? "Sending…"
                  : "Get the invite →"}
            </button>
          </div>
        </form>
        <ValidationError
          field="email"
          errors={state.errors}
          className="waitlist-form-error"
        />
        <ValidationError
          errors={state.errors}
          className="waitlist-form-error"
        />
      </div>
    </section>
  );
}
