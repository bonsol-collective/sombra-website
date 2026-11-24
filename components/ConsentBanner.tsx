"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CONSENT_KEY, CONSENT_OPEN_EVENT, readChoice, writeChoice, type Choice } from "@/lib/consent";
import { clearGaCookies, startGoogleTag, type TagDocument, type TagWindow } from "@/lib/googleTag";
import s from "./ConsentBanner.module.css";

// Storage can throw (a private window, blocked site data). Then the choice holds for this page only.
function storedChoice(): Choice | null {
  try {
    return readChoice(window.localStorage.getItem(CONSENT_KEY), Date.now());
  } catch {
    return null;
  }
}
function storeChoice(choice: Choice) {
  try {
    window.localStorage.setItem(CONSENT_KEY, writeChoice(choice, Date.now()));
  } catch {
    /* The banner asks again on the next page load. */
  }
}

/**
 * The cookie choice of each visitor. Nothing from Google loads before Accept. Reject is as easy as Accept, and "Cookie
 * settings" in the footer opens the banner again. `tagEnabled` is false on Vercel previews and in `next dev`: the banner
 * still shows, but no Google script loads.
 */
export function ConsentBanner({ tagEnabled }: { tagEnabled: boolean }) {
  const [open, setOpen] = useState(false);
  const tagRan = useRef(false);

  const startTag = useCallback(() => {
    if (!tagEnabled) return;
    startGoogleTag(window as unknown as TagWindow, document as unknown as TagDocument);
    tagRan.current = true;
  }, [tagEnabled]);

  // The stored choice is read after the first render, so the server HTML and the first client render agree.
  useEffect(() => {
    const choice = storedChoice();
    if (choice === "granted") startTag();
    else if (choice === null) setOpen(true);
    const show = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, show);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, show);
  }, [startTag]);

  const accept = () => {
    storeChoice("granted");
    setOpen(false);
    startTag();
  };

  const reject = () => {
    storeChoice("denied");
    setOpen(false);
    // GA cookies can stay from an earlier Accept. A tag that runs on this page stops only with a reload.
    clearGaCookies(document, window.location.hostname);
    if (tagRan.current) window.location.reload();
  };

  if (!open) return null;
  return (
    <section className={s.banner} role="region" aria-label="Cookie choice">
      <p className={s.text}>
        We use Google Analytics cookies to see how people use this site, only if you accept.{" "}
        <Link href="/privacy">Privacy Policy</Link>
      </p>
      <div className={s.actions}>
        <button type="button" className="btn btn--sm btn--pine" onClick={reject}>
          Reject
        </button>
        <button type="button" className="btn btn--sm btn--pine" onClick={accept}>
          Accept
        </button>
      </div>
    </section>
  );
}
