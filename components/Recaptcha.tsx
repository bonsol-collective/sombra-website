"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: { render: (container: HTMLElement, params: { sitekey: string; theme?: "light" | "dark" }) => number };
    onRecaptchaLoad?: () => void;
  }
}

/**
 * reCAPTCHA v2 checkbox. Must sit inside the <form>: Formspree serializes the form's
 * FormData, which picks up the widget's g-recaptcha-response textarea.
 */
export function Recaptcha({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!SITE_KEY || !container) return;
    const render = () => {
      if (!window.grecaptcha?.render) return;
      // grecaptcha refuses to render twice into one element (strict-mode double effects).
      container.replaceChildren();
      const slot = document.createElement("div");
      container.appendChild(slot);
      window.grecaptcha.render(slot, { sitekey: SITE_KEY, theme: "light" });
    };
    if (window.grecaptcha?.render) render();
    else {
      window.onRecaptchaLoad = render;
      if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }, []);

  return SITE_KEY ? <div ref={ref} className={className} /> : null;
}
