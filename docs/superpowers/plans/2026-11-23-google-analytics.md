# Google Analytics on sombra.tech Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The Google tag `GTM-KBGCBD3Q` on each page of the production site, loaded only after the visitor accepts in a consent banner, and a true privacy page.

**Architecture:** `lib/consent.ts` reads and writes the stored choice. `lib/googleTag.ts` starts the tag and deletes the GA cookies. A client component `components/ConsentBanner.tsx` in the root layout joins them. A small client button in the footer opens the banner again.

**Tech Stack:** Next.js 15 (App Router), React 19, CSS modules, `node --test` (Node 24, which strips TypeScript types).

**Spec:** `docs/superpowers/specs/2026-11-23-google-analytics-design.md`

## Global Constraints

- Container ID `GTM-KBGCBD3Q`; script `https://www.googletagmanager.com/gtm.js?id=GTM-KBGCBD3Q`.
- Storage key `sombra-consent`, value `{ "v": 1, "analytics": "granted" | "denied", "at": <ms> }`, life 182 days.
- No request to a Google host before Accept. Reject and Accept have the same size and style.
- The tag loads only when `process.env.VERCEL_ENV === "production"`. The banner shows in each build.
- No new dependency. Vercel Analytics stays. Colors from the tokens of `app/globals.css`; one typeface; no motion (`.impeccable.md`).
- Tests on Node 24: `PATH=$HOME/.nvm/versions/node/v24.13.0/bin:$PATH`. The default `node` (v20) cannot load `.ts` files.
- Git: Jayant runs every git command.

## Review Focus

1. A stored choice that is old, of another version, or not JSON: the banner must show again, never a crash. Task 1 tests it.
2. `localStorage` throws (a private window): the banner must still work for the page. Task 2 wraps each access in `try`.
3. The start function runs twice (Accept, then a remount): one `gtm.js` only. Task 1 tests it.
4. Reject after Accept on `www.sombra.tech`: GA sets its cookies on `.sombra.tech`, so the delete must cover parent domains. Task 1 tests the cookie writes.
5. The banner on a 360px phone: the two buttons stay on screen and cover no footer link that the visitor needs. Jayant checks it by hand.

---

### Task 1: the choice and the tag (logic, tests first)

**Files:**
- Create: `lib/consent.ts`, `lib/googleTag.ts`, `lib/consent.test.ts`
- Modify: `package.json` (`"test": "node --test lib/*.test.ts"`)

**Interfaces (Produces):**
- `lib/consent.ts`:
  - `export type Choice = "granted" | "denied"`
  - `export const CONSENT_KEY = "sombra-consent"`
  - `export function readChoice(raw: string | null, now: number): Choice | null`
  - `export function writeChoice(choice: Choice, now: number): string`
- `lib/googleTag.ts`:
  - `export const GTM_SRC: string`
  - `export function googleTagEnabled(vercelEnv: string | undefined): boolean`
  - `export function startGoogleTag(win: TagWindow, doc: TagDocument): void` (`TagWindow` has `dataLayer?: unknown[]` and a `started` flag; `TagDocument` has `createElement("script")` and `head.appendChild`)
  - `export function clearGaCookies(doc: { cookie: string }, hostname: string): void`

- [ ] **Step 1: Write the failing tests** in `lib/consent.test.ts`:
  - `a stored choice holds for 182 days`: `readChoice(writeChoice("granted", t), t + 181 * DAY) === "granted"`; at `t + 183 * DAY` it is `null`; the same for `"denied"`.
  - `a missing, broken or other-version choice asks again`: `null` for `null`, `"x"`, `"{}"`, `'{"v":2,"analytics":"granted","at":0}'`, an `analytics` value of `"yes"`, a future `at`.
  - `the tag runs on the production site only`: `googleTagEnabled("production")` is true; `"preview"`, `"development"`, `undefined` are false.
  - `the tag starts with ads denied, then loads gtm.js one time`: with a fake window and document, call `startGoogleTag` two times. `dataLayer` holds exactly 3 `arguments` objects (`Array.from` on each), in order: `consent default {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'}`, `set ads_data_redaction true`, `js <Date>`. The document got exactly one script, with `async === true` and `src === GTM_SRC`.
  - `reject deletes the GA cookies for the host and each parent domain`: a fake document with `cookie` reading `"a=1; _ga=x; _ga_ABC=y"` and a setter that records writes. After `clearGaCookies(doc, "www.sombra.tech")`, the writes expire `_ga` and `_ga_ABC` with no domain, with `domain=www.sombra.tech` and with `domain=sombra.tech` (`Max-Age=0; path=/`). Nothing for `a`.

- [ ] **Step 2: Run and see them fail.** `PATH=…v24…:$PATH npm test`. Expected: FAIL, the modules are missing; the 5 `demoRequest` tests pass.

- [ ] **Step 3: Write `lib/consent.ts` and `lib/googleTag.ts`.** `gtag` pushes its `arguments` object (Google's snippet; an array does not work as a gtag command). The parent domains of `a.b.c` are `a.b.c` and `b.c`, never a single label.

- [ ] **Step 4: Run and see them pass.** Expected: 10 tests pass.

### Task 2: the banner and Cookie settings (UI)

**Files:**
- Create: `components/ConsentBanner.tsx`, `components/ConsentBanner.module.css`, `components/CookieSettingsButton.tsx`
- Modify: `app/layout.tsx` (render `<ConsentBanner tagEnabled={googleTagEnabled(process.env.VERCEL_ENV)} />` in `<body>`), `components/Footer.tsx` (the button in the Company column), `components/Footer.module.css` (the button looks like the links)

**Interfaces:**
- Consumes: Task 1.
- Produces: the window event `"sombra-consent-open"` (the footer button sends it; the banner shows on it).

- [ ] **Step 1: Write the banner.** It reads the choice in `useEffect` (no hydration mismatch). A stored `"granted"` with `tagEnabled` starts the tag. No choice: show. Accept: store, start the tag when `tagEnabled`, hide. Reject: store; when the tag ran on this page or a stored `"granted"` was replaced, `clearGaCookies` and `location.reload()`; else hide. Copy: "We use Google Analytics cookies to see how people use this site, only if you accept." and a `Privacy Policy` link.
- [ ] **Step 2: Style it** with the tokens: paper card, line border, ink text 14px, max width 560px, bottom 16px, full width less 16px on phones. Both buttons `btn btn--sm btn--pine`.
- [ ] **Step 3: Check.** `npx impeccable --json components/ConsentBanner.tsx components/CookieSettingsButton.tsx` gives `[]`. `npm run build` (Node 24) passes. With `npm run dev`, Jayant sees the banner, Reject, Accept and Cookie settings.

### Task 3: the privacy page

**Files:**
- Modify: `app/privacy/page.tsx` (metadata description, Summary, section 8, section 9, `LAST_UPDATED`)

- [ ] **Step 1: Write the text** of the spec section "The privacy page".
- [ ] **Step 2: Check.** `npm run build` passes. Chris reads `/privacy` before the merge.

### Commit (Jayant)

```bash
W=~/Desktop/bonsol/sombra-website
git -C $W add lib/consent.ts lib/googleTag.ts lib/consent.test.ts package.json components/ConsentBanner.tsx components/ConsentBanner.module.css components/CookieSettingsButton.tsx components/Footer.tsx components/Footer.module.css app/layout.tsx app/privacy/page.tsx docs/superpowers/specs/2026-11-23-google-analytics-design.md docs/superpowers/plans/2026-11-23-google-analytics.md
git -C $W commit -m "analytics: Google Analytics after consent, a banner for each visitor, Cookie settings in the footer, and the privacy page"
```
