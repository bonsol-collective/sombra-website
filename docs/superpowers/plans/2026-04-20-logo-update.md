# Logo Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the favicon and nav logo mark with the new flat redacted-disc-with-slanted-bars design from the approved spec.

**Architecture:** Two places render the mark — `app/icon.svg` (static favicon) and the `.nav-logo-mark` span in `components/Nav.tsx` (nav UI). The favicon hardcodes the Eclipse palette; the nav mark becomes inline SVG that uses CSS variables so it themes with the app. The existing CSS-gradient trick in `.nav-logo-mark` is removed.

**Tech Stack:** Next.js 15 App Router, React 19, static SVG, CSS variables.

**Spec reference:** `docs/superpowers/specs/2026-04-20-logo-update-design.md`.

**Verification approach:** No unit tests exist in this project. Verification is visual — start the dev server, inspect the nav mark across themes, and hard-refresh the tab to see the favicon.

---

## Task 1: Replace the favicon SVG

**Files:**
- Modify: `app/icon.svg` (full rewrite — it currently holds the old eclipse gradient mark)

**Goal:** Serve the new flat-bar design as the browser tab favicon. Hardcoded Eclipse palette.

- [ ] **Step 1: Overwrite `app/icon.svg` with the new design**

Open `app/icon.svg` and replace its entire contents with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <mask id="disc-mask">
    <rect width="32" height="32" fill="black"/>
    <circle cx="16" cy="16" r="15" fill="white"/>
  </mask>
  <circle cx="16" cy="16" r="15" fill="#f4ede3"/>
  <g mask="url(#disc-mask)" fill="#0a0908">
    <path d="M 1 10.2 L 20 10.2 L 26 13 L 7 13 Z"/>
    <path d="M 6 19 L 25 19 L 31 21.8 L 12 21.8 Z"/>
  </g>
  <circle cx="16" cy="16" r="2.6" fill="#e8a056"/>
</svg>
```

- [ ] **Step 2: Verify Next.js is still happy**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 3: Visually verify the favicon**

Run: `npm run dev` (or trust an existing dev server).
Open the site. **Hard-refresh the tab** (⌘⇧R on macOS) — browsers cache favicons aggressively.
Expected: the browser tab icon shows a cream disc with two slanted dark bars and an amber dot.

- [ ] **Step 4: Commit**

```bash
git add app/icon.svg
git commit -m "feat: new favicon with slanted-bar mark"
```

---

## Task 2: Replace the nav logo mark with inline SVG

**Files:**
- Modify: `components/Nav.tsx` (lines 5–11 — the `<Link>` contents)
- Modify: `app/globals.css` (the `.nav-logo-mark` rule, currently around lines 76–82)

**Goal:** Render the same design as inline SVG inside the nav, using CSS variables so it adapts per theme. Simplify the `.nav-logo-mark` class to be a plain 22×22 container for the SVG.

- [ ] **Step 1: Update `.nav-logo-mark` CSS to be a container**

Find the existing rule in `app/globals.css`:

```css
.nav-logo-mark {
  width: 22px; height: 22px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, var(--accent) 0%, var(--accent) 40%, transparent 41%),
              radial-gradient(circle at 65% 50%, var(--bg) 38%, transparent 39%);
  background-color: var(--fg);
  position: relative;
}
```

Replace it with:

```css
.nav-logo-mark {
  width: 22px; height: 22px;
  display: inline-flex;
  flex-shrink: 0;
}
.nav-logo-mark svg { width: 100%; height: 100%; display: block; }
```

- [ ] **Step 2: Add the inline SVG to `components/Nav.tsx`**

Find:

```tsx
<span className="nav-logo-mark" aria-hidden="true"></span>
```

Replace with:

```tsx
<span className="nav-logo-mark" aria-hidden="true">
  <svg viewBox="0 0 32 32">
    <mask id="nav-logo-mask">
      <rect width="32" height="32" fill="black" />
      <circle cx="16" cy="16" r="15" fill="white" />
    </mask>
    <circle cx="16" cy="16" r="15" fill="var(--fg)" />
    <g mask="url(#nav-logo-mask)" fill="var(--bg)">
      <path d="M 1 10.2 L 20 10.2 L 26 13 L 7 13 Z" />
      <path d="M 6 19 L 25 19 L 31 21.8 L 12 21.8 Z" />
    </g>
    <circle cx="16" cy="16" r="2.6" fill="var(--accent)" />
  </svg>
</span>
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 4: Visually verify in all three themes**

Run: `npm run dev` (or reuse a running server).
Open the site. For each of the three themes (toggle with the theme switcher — default is `dusk`), confirm the nav mark:
- Eclipse (dark): cream disc, dark bars, amber dot.
- Dusk (warm light): dark disc, cream bars, orange dot.
- Grid (brutal light): near-black disc, off-white bars, burnt-red dot.

Also confirm:
- The 10px gap between the mark and the word "Sombra" (from `.nav-logo gap: 10px`) is preserved.
- The mark stays crisp at 100%, 67%, and 150% browser zoom.

- [ ] **Step 5: Commit**

```bash
git add components/Nav.tsx app/globals.css
git commit -m "feat: themed nav logo mark as inline SVG"
```

---

## Self-review results

- **Spec coverage:** favicon file (Task 1), nav SVG markup (Task 2 Step 2), globals.css simplification (Task 2 Step 1), verification across themes (Task 2 Step 4). All spec items covered.
- **Placeholders:** none — every code block is literal.
- **Type consistency:** mask id `disc-mask` is favicon-only; nav uses `nav-logo-mask` to avoid id collision if both rendered on the same page (they aren't, but safer). CSS var names match globals.css.
