"use client";

import { useState, type FormEvent } from "react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setDone(true);
  };
  return (
    <section id="waitlist" className="waitlist">
      <div className="waitlist-inner">
        <h2>
          Step into the <i>shadow.</i>
        </h2>
        <p>
          Private, post-quantum beta opens Q3 2026. Limited to the first 10,000
          wallets.
        </p>
        <form
          className={"waitlist-form" + (done ? " submitted" : "")}
          onSubmit={submit}
        >
          <input
            type="email"
            placeholder="you@domain.xyz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={done}
          />
          <button type="submit">{done ? "✓ On the list" : "Join waitlist"}</button>
        </form>
        <div className="waitlist-meta">
          <span>No wallet required</span>
          <span>·</span>
          <span>Unsubscribe anytime</span>
        </div>
      </div>
    </section>
  );
}
