"use client";

import { useEffect, useRef } from "react";
import { useForm, ValidationError } from "@formspree/react";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        params: { sitekey: string; theme?: "light" | "dark" },
      ) => number;
    };
    onRecaptchaLoad?: () => void;
  }
}

function Recaptcha() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!RECAPTCHA_SITE_KEY || !container) return;

    const widgetTheme = () =>
      document.documentElement.getAttribute("data-theme") === "eclipse"
        ? "dark"
        : "light";

    const render = () => {
      if (!window.grecaptcha?.render) return;
      // grecaptcha refuses to render twice into the same element, so mount
      // each widget in a fresh child div (also makes re-renders idempotent
      // under React strict mode's double-run effects).
      container.replaceChildren();
      const slot = document.createElement("div");
      container.appendChild(slot);
      window.grecaptcha.render(slot, {
        sitekey: RECAPTCHA_SITE_KEY,
        theme: widgetTheme(),
      });
    };

    // The widget's theme is fixed at render time - re-render it when the
    // site theme toggles so it follows eclipse/dusk/grid.
    const observer = new MutationObserver(render);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    if (window.grecaptcha?.render) {
      render();
    } else {
      window.onRecaptchaLoad = render;
      if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
        const script = document.createElement("script");
        script.src =
          "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="waitlist-captcha" />;
}

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
        {/* The reCAPTCHA widget must sit inside the <form>: Formspree
            serializes the form's FormData, which picks up the widget's
            g-recaptcha-response textarea along with the email. */}
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
          {RECAPTCHA_SITE_KEY && !done && <Recaptcha />}
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
