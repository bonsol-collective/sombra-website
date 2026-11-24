# Google Analytics on sombra.tech: design

Date: 23 Nov 2026, changed 24 Nov. Asked by Chris. Approach approved by Jayant on 24 Nov: a consent banner for each visitor (option B below), after a design review.

## Intent

Chris made a Google tag (`GTM-KBGCBD3Q`, "Sombra Website") in Google Analytics and wants it on every page of sombra.tech. Sombra sells privacy, and it pitches EU institutions. Thus the site asks each visitor first, and the privacy page says what the site collects.

## Goals

- The Google tag on every page of the production site, for each visitor who accepts.
- Nothing from Google loads before Accept, and nothing after Reject.
- A true privacy page.

## Non-goals

- No ads, no ads cookies, no remarketing.
- No custom events (for example a demo-form event). A later change can add them.
- No change to Vercel Analytics (cookieless). It stays and counts each visitor.
- No change to reCAPTCHA on the demo form (the privacy page names it).

## Anti-goals

- A request to Google before Accept.
- Reject is harder or less visible than Accept.
- The banner on each page load after a choice.
- Preview builds and local development send data to GA.

## Approaches

| | Approach | Trade-off |
|---|---|---|
| A | Consent Mode v2 region defaults, no banner. | Rejected by the review: in "denied" regions GA still sends pings with the IP address and the browser data, and ePrivacy Art. 5(3) covers more than cookies. |
| A2 | A geo check: Google loads only outside the EEA, UK and CH. | No banner, but GA has no EU data. |
| **B (chosen)** | A banner for each visitor. Google loads only after Accept. | The strictest. A banner on the first visit, and GA counts only visitors who accept. Vercel Analytics still counts all. |

## Design

### The choice

- Stored in `localStorage` under `sombra-consent`: `{ "v": 1, "analytics": "granted" | "denied", "at": <ms> }`. Storing a consent choice needs no consent.
- A stored choice holds for 182 days (about 6 months). After that, or with another `v`, the banner shows again.
- When `localStorage` fails (a private window, blocked storage), the choice holds for that page only.

### The banner

- A client component in the root layout (`app/layout.tsx`), so it is on each page.
- Shows when no valid choice is stored. Fixed at the bottom of the page: it covers no content in the flow and moves no layout. No motion.
- Text: one short sentence, a link to `/privacy`, and two buttons, **Reject** and **Accept**, with the same size and style.
- Not a modal: no focus trap, and the page stays usable. `role="region"` with a label.
- A footer button **Cookie settings** (Company column) opens the banner again.

### The Google tag

- Loads only after Accept (now, or from a stored "granted" choice at page load), and only when `process.env.VERCEL_ENV === "production"`. A Vercel preview and `next dev` show the banner but load no Google script.
- One start function does, in order: `dataLayer` and `gtag()` (the Google snippet), `gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })`, `gtag('set', 'ads_data_redaction', true)`, `gtag('js', new Date())`, then it appends `https://www.googletagmanager.com/gtm.js?id=GTM-KBGCBD3Q` (async). It runs one time per page.
- Reject after an earlier Accept: store "denied", delete the `_ga` and `_ga_*` cookies (for the host and each parent domain), and reload the page, so no Google script stays.

### The privacy page (`app/privacy/page.tsx`)

- The metadata description and the Summary: "We don't collect personal data" becomes a sentence about the Wallet only.
- Section 8 (marketing site): Vercel Analytics (cookieless). Google Analytics only after Accept in the banner: the `_ga` cookies (up to 2 years), Google processes the IP address and the browser data as our processor, no advertising use; Cookie settings in the footer changes the choice. The demo form: the fields (name, job title, email, company, message) go to a Google Sheet of Bonsol Labs; Google reCAPTCHA checks the form when it is on, and it sets its own cookie. Remove the Formspree text.
- Section 9 (retention): "Waitlist email" becomes "Demo requests"; add "Website analytics" (the GA retention setting).
- `LAST_UPDATED`: the release day.

## Left to the builder

- The exact banner and privacy text. Chris reads it before the merge.

## Steps for Chris in GA (not code)

- The container has the GA4 destination, and it is published.
- Admin: Google signals off; data sharing "Google products & services" off (else Google is not only our processor); data retention 2 months; no Google Ads link; "Page changes based on browser history events" on.

## Checks after the deploy

- A first visit: the banner shows, and the network panel has no request to a Google host.
- Reject: no Google request, and no `_ga` cookie, also after a reload.
- Accept: `gtm.js` loads, `_ga` cookies appear, Tag Assistant or the GA **Retest** sees the tag.
- Cookie settings, then Reject: the `_ga` cookies are gone after the reload.
- GA DebugView: one `page_view` for each page change in the site.
