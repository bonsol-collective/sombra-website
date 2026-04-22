# OpenGraph Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a hero-derived 1200×630 social preview image plus OpenGraph + Twitter Card metadata so `sombra.tech` renders a branded card when shared on X, Slack, iMessage, Discord, etc.

**Architecture:** A hidden `/og-preview` Next.js route renders a fixed 1200×630 composition using a scoped CSS module. A one-time Playwright screenshot captures it to `public/og.png`. `app/layout.tsx` exports `openGraph` + `twitter` metadata referencing that PNG. The route and module stay in the repo so the image is regenerable on design changes.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, CSS Modules, Playwright (invoked via `npx`, not added as a dep).

**Note on testing:** There is no test runner in this repo and the deliverables are (a) a visual composition and (b) static HTML `<meta>` tags. Verification steps use the browser (dev server + page source) rather than a test framework.

**Spec:** `docs/superpowers/specs/2026-04-22-og-preview-design.md`

---

### Task 1: Build the `/og-preview` composition

**Files:**
- Create: `app/og-preview/og-preview.module.css`
- Create: `app/og-preview/page.tsx`

This task delivers the rendered route. The page is a server component; the CSS module scopes preview-only styles so they don't ship in `globals.css`. Colors reuse the CSS custom properties already set by `html[data-theme="dusk"]` in `app/layout.tsx` (`--bg`, `--fg`, `--fg-dim`, `--fg-mute`, `--accent`, `--line`, `--line-2`) so the image tracks any future theme tweaks.

- [ ] **Step 1: Create the CSS module**

Create `app/og-preview/og-preview.module.css`:

```css
.canvas {
  width: 1200px;
  height: 630px;
  overflow: hidden;
  position: relative;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-geist), system-ui, sans-serif;
}

.gridBg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--line) 1px, transparent 1px);
  background-size: 80px 80px;
  -webkit-mask-image: radial-gradient(circle at 72% 50%, black 0%, transparent 70%);
  mask-image: radial-gradient(circle at 72% 50%, black 0%, transparent 70%);
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 72px;
  gap: 60px;
}

.left {
  display: flex;
  flex-direction: column;
  max-width: 620px;
}

.tagline {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin-bottom: 24px;
}

.taglineDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent);
}

.headline {
  font-family: var(--font-instrument-serif), 'Times New Roman', serif;
  font-size: 96px;
  line-height: 0.92;
  letter-spacing: -0.03em;
  font-weight: 400;
  margin: 0;
}

.headline i {
  font-style: italic;
  color: var(--accent);
}

.divider {
  margin-top: 32px;
  margin-bottom: 18px;
  width: 48px;
  height: 1px;
  background: var(--line-2);
}

.footnote {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--fg-mute);
}

.eclipse {
  position: relative;
  width: 440px;
  height: 440px;
  flex-shrink: 0;
}

.sun {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%,
    var(--accent) 0%,
    color-mix(in oklab, var(--accent) 80%, var(--bg)) 45%,
    color-mix(in oklab, var(--accent) 40%, var(--bg)) 70%,
    transparent 100%);
  filter: blur(6px);
}

.corona {
  position: absolute;
  inset: -30%;
  border-radius: 50%;
  background: radial-gradient(circle,
    transparent 44%,
    color-mix(in oklab, var(--accent) 25%, transparent) 46%,
    transparent 60%);
  opacity: 0.6;
}

.shadow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%,
    var(--fg) 0%,
    var(--fg) 48%,
    transparent 51%);
  opacity: 0.92;
  transform: translate(-28px, 14px) scale(1.02);
}
```

- [ ] **Step 2: Create the page component**

Create `app/og-preview/page.tsx`:

```tsx
import type { Metadata } from "next";
import styles from "./og-preview.module.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OgPreviewPage() {
  return (
    <div className={styles.canvas}>
      <div className={styles.gridBg} aria-hidden />
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.tagline}>
            <span className={styles.taglineDot} />
            Step into the shadow.
          </div>
          <h1 className={styles.headline}>
            Trade in the <i>shadow.</i>
          </h1>
          <div className={styles.divider} />
          <div className={styles.footnote}>
            Sombra — post-quantum privacy on Solana
          </div>
        </div>
        <div className={styles.eclipse}>
          <div className={styles.corona} />
          <div className={styles.sun} />
          <div className={styles.shadow} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Start the dev server**

Run: `npm run dev`
Expected: dev server listening on `http://localhost:3000`.

- [ ] **Step 4: Visually verify the composition**

Open `http://localhost:3000/og-preview` in a browser.

Checklist:
- Canvas is exactly 1200×630 (DevTools → Inspect the `.canvas` div → check computed size)
- Background is warm cream (`#f4ebe0`), text is dark brown
- Serif headline "Trade in the shadow." reads with "shadow." in italic orange
- Orange pulsing dot + uppercase mono "Step into the shadow." tagline sits above the headline
- Mono footnote "Sombra — post-quantum privacy on Solana" sits below a short divider rule
- Eclipse (corona + sun + shadow) sits on the right, orange crescent visible where the shadow is offset up-and-left
- Grid pattern is visible around the eclipse and fades out toward the text on the left

If any of the above is wrong, adjust the CSS module and re-check. Iterate until it reads correctly at 1:1 zoom.

- [ ] **Step 5: Commit**

```bash
git add app/og-preview/og-preview.module.css app/og-preview/page.tsx
git commit -m "feat: add /og-preview composition for social preview image"
```

---

### Task 2: Generate `public/og.png`

**Files:**
- Create: `public/og.png` (binary)

Playwright is invoked via `npx` so nothing is added to `package.json`. The first run downloads Chromium on demand.

- [ ] **Step 1: Ensure the dev server is still running**

From Task 1 Step 3. If not, run `npm run dev` again.

- [ ] **Step 2: Install Playwright's Chromium (first-time only)**

Run: `npx playwright install chromium`
Expected: downloads Chromium (~150MB) into Playwright's cache. Skip this step if already installed.

- [ ] **Step 3: Take the screenshot**

Run:

```bash
npx playwright screenshot \
  --viewport-size=1200,630 \
  http://localhost:3000/og-preview \
  public/og.png
```

Expected: command exits 0, `public/og.png` created.

- [ ] **Step 4: Verify the PNG**

Run: `file public/og.png`
Expected output contains: `PNG image data, 1200 x 630`.

Open `public/og.png` in Preview (macOS) or a browser:
- Dimensions exactly 1200×630
- Matches what you saw at `/og-preview` — same composition, fonts rendered, no dev-tools overlay, no scrollbars

If the image is blank or fonts look like fallbacks, the Next.js Google Fonts may still have been loading when the screenshot fired. Retry after a few seconds, or add `--wait-for-timeout=2000` to the Playwright command.

- [ ] **Step 5: Commit**

```bash
git add public/og.png
git commit -m "feat: add generated OG preview image"
```

---

### Task 3: Add OpenGraph + Twitter metadata to layout

**Files:**
- Modify: `app/layout.tsx` (the `metadata` export, currently lines 27–31)

- [ ] **Step 1: Replace the metadata export**

Replace the existing `metadata` export in `app/layout.tsx` with:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://sombra.tech"),
  title: "Sombra — post-quantum privacy on Solana",
  description:
    "Sombra brings quantum-safe privacy to Solana. Private trading and transfers, built for the quantum era.",
  openGraph: {
    title: "Sombra — post-quantum privacy on Solana",
    description:
      "Sombra brings quantum-safe privacy to Solana. Private trading and transfers, built for the quantum era.",
    url: "https://sombra.tech",
    siteName: "Sombra",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Sombra — trade in the shadow",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sombra — post-quantum privacy on Solana",
    description:
      "Sombra brings quantum-safe privacy to Solana. Private trading and transfers, built for the quantum era.",
    images: ["/og.png"],
    creator: "@bonsol_labs",
    site: "@bonsol_labs",
  },
};
```

- [ ] **Step 2: Verify the dev server still serves the home page**

Visit `http://localhost:3000/` — it should render as before.

- [ ] **Step 3: Inspect the rendered metadata**

In DevTools → Elements, expand `<head>` and confirm these tags are present:

- `<meta property="og:title" content="Sombra — post-quantum privacy on Solana">`
- `<meta property="og:description" content="Sombra brings quantum-safe privacy to Solana. Private trading and transfers, built for the quantum era.">`
- `<meta property="og:url" content="https://sombra.tech">`
- `<meta property="og:site_name" content="Sombra">`
- `<meta property="og:image" content="https://sombra.tech/og.png">` (absolute URL thanks to `metadataBase`)
- `<meta property="og:image:width" content="1200">`
- `<meta property="og:image:height" content="630">`
- `<meta property="og:image:alt" content="Sombra — trade in the shadow">`
- `<meta property="og:type" content="website">`
- `<meta property="og:locale" content="en_US">`
- `<meta name="twitter:card" content="summary_large_image">`
- `<meta name="twitter:title" content="Sombra — post-quantum privacy on Solana">`
- `<meta name="twitter:description" content="...">`
- `<meta name="twitter:image" content="https://sombra.tech/og.png">`
- `<meta name="twitter:creator" content="@bonsol_labs">`
- `<meta name="twitter:site" content="@bonsol_labs">`

- [ ] **Step 4: Confirm the image is served locally**

Visit `http://localhost:3000/og.png` — the PNG should load in the browser.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add OpenGraph and Twitter Card metadata"
```

---

### Task 4: Document the regeneration workflow in README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a "Social preview image" section**

Append a new section to `README.md` after the existing `## Deployment` section. The section has:

- An `H2` heading: `## Social preview image`
- A paragraph: `The OpenGraph image at \`public/og.png\` is generated from a hidden \`/og-preview\` route. To regenerate it after a design change:`
- A `bash` fenced code block containing exactly:

```
npm run dev
npx playwright install chromium  # first time only
npx playwright screenshot \
  --viewport-size=1200,630 \
  http://localhost:3000/og-preview \
  public/og.png
```

- A trailing line: `Commit the updated PNG.`

Use standard triple-backtick fences (```) around the bash block in the README itself.

- [ ] **Step 2: Verify the README renders correctly**

Open `README.md` in a markdown preview (VS Code, GitHub, etc.) and confirm the new section renders with the code block intact.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: document OG image regeneration"
```

---

### Task 5: Final verification

**Files:** none modified; verification only.

- [ ] **Step 1: Run a production build locally**

Stop the dev server (Ctrl-C), then run:

```bash
npm run build && npm run start
```

Expected: build succeeds with no errors or type failures. Server listens on `http://localhost:3000`.

- [ ] **Step 2: Verify metadata in the production build**

Visit `http://localhost:3000/`, View Source (Cmd-U). Search for `og:image` — confirm the full absolute URL (`https://sombra.tech/og.png`) appears.

Visit `http://localhost:3000/og.png` — confirm the image loads.

Visit `http://localhost:3000/og-preview` — confirm the composition still renders (we're intentionally keeping the route accessible for regeneration).

- [ ] **Step 3: Stop the server**

Ctrl-C the production server.

- [ ] **Step 4 (optional, after deploy): Validate with social platforms**

After the next production deploy reaches `sombra.tech`, paste `https://sombra.tech` into:

- Meta Sharing Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Twitter Card Validator: via posting the URL in an X draft (Twitter retired the standalone validator)

Confirm each renders the preview correctly. If a platform has the old metadata cached, use its "scrape again" action to refresh.

- [ ] **Step 5: No commit needed**

This task produces no file changes.
