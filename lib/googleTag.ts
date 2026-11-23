/**
 * The Google tag of "Sombra Website" in Google Analytics. It loads only after the visitor accepts in the consent banner,
 * and only on the production site.
 */
const GTM_ID = "GTM-KBGCBD3Q";
export const GTM_SRC = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

/** Vercel previews and `next dev` must not send visits to Google Analytics. */
export function googleTagEnabled(vercelEnv: string | undefined): boolean {
  return vercelEnv === "production";
}

type Script = { async: boolean; src: string };
export type TagWindow = { dataLayer?: unknown[]; sombraTagStarted?: boolean };
export type TagDocument = { createElement(tag: "script"): Script; head: { appendChild(el: Script): unknown } };

/**
 * Google's snippet, after the visitor accepted: the consent defaults (analytics yes, ads no), then `gtm.js`. A second
 * call does nothing, so one page never loads the tag two times.
 */
export function startGoogleTag(win: TagWindow, doc: TagDocument): void {
  if (win.sombraTagStarted) return;
  win.sombraTagStarted = true;
  const dataLayer: unknown[] = (win.dataLayer = win.dataLayer || []);
  // Google reads the `arguments` object of each call. An array in its place is another kind of entry.
  function gtag(..._args: unknown[]) {
    dataLayer.push(arguments);
  }
  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("set", "ads_data_redaction", true);
  gtag("js", new Date());
  const script = doc.createElement("script");
  script.async = true;
  script.src = GTM_SRC;
  doc.head.appendChild(script);
}

/**
 * Deletes the `_ga` and `_ga_<id>` cookies after a Reject. GA sets them on the highest domain it can (`.sombra.tech` for
 * `www.sombra.tech`), so the delete covers the host and each parent domain with two or more labels.
 */
export function clearGaCookies(doc: { cookie: string }, hostname: string): void {
  const names = doc.cookie
    .split(";")
    .map((c) => c.split("=")[0]!.trim())
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  const labels = hostname.split(".");
  const domains = labels.slice(0, -1).map((_, i) => labels.slice(i).join("."));
  for (const name of names) {
    doc.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains) doc.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
  }
}
