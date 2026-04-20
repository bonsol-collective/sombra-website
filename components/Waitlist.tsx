"use client";

import { useForm, ValidationError } from "@formspree/react";

export function Waitlist() {
  const [state, handleSubmit] = useForm("mqewlyko");
  const done = state.succeeded;

  return (
    <section id="waitlist" className="waitlist">
      <div className="waitlist-inner">
        <h2>
          Step into the <i>shadow.</i>
        </h2>
        <p>
          Private, post-quantum beta opens Q2 2026. Limited to the first 500
          wallets.
        </p>
        <form
          className={"waitlist-form" + (done ? " submitted" : "")}
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            placeholder="you@domain.xyz"
            required
            autoComplete="email"
            disabled={done || state.submitting}
          />
          <button type="submit" disabled={done || state.submitting}>
            {done
              ? "✓ On the list"
              : state.submitting
                ? "Joining…"
                : "Join waitlist"}
          </button>
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
        <div className="waitlist-meta">
          <span>No wallet required</span>
          <span>·</span>
          <span>Unsubscribe anytime</span>
        </div>
      </div>
    </section>
  );
}
