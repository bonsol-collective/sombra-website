"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

/** Opens the cookie banner again, so a visitor can change the choice as easily as they made it. */
export function CookieSettingsButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
