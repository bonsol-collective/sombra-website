/**
 * The visitor's analytics choice from the consent banner. It is stored in `localStorage`: storing a consent choice needs no
 * consent. A choice holds for 182 days (about 6 months), then the banner asks again.
 */
export type Choice = "granted" | "denied";

export const CONSENT_KEY = "sombra-consent";
/** The window event that opens the banner again (the "Cookie settings" button of the footer). */
export const CONSENT_OPEN_EVENT = "sombra-consent-open";
/** A new version asks each visitor again (for example when the privacy text changes what the site collects). */
const VERSION = 1;
const LIFE_MS = 182 * 24 * 60 * 60 * 1000;

/** The stored choice when it is valid and not older than 182 days. Else `null`: the banner asks. */
export function readChoice(raw: string | null, now: number): Choice | null {
  if (raw === null) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null) return null;
  const { v, analytics, at } = value as Record<string, unknown>;
  if (v !== VERSION || (analytics !== "granted" && analytics !== "denied") || typeof at !== "number") return null;
  return at <= now && now - at < LIFE_MS ? analytics : null;
}

export function writeChoice(choice: Choice, now: number): string {
  return JSON.stringify({ v: VERSION, analytics: choice, at: now });
}
