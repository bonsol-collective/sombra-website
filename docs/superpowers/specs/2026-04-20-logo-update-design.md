# Logo update — design spec

**Date:** 2026-04-20
**Scope:** Replace favicon and nav logo mark with a new design.

## Context

The current brand mark is a CSS-only eclipse (two radial gradients carved into a disc). It's fine, but:

- The existing favicon (`app/icon.svg`) is a direct copy of that eclipse; both look identical at tiny sizes.
- We want a mark that (a) reflects the "S" for Sombra and (b) gestures at the Solana ecosystem the product is built on, without being a full Solana copy.

After visual brainstorming, we converged on the **flat redacted-disc with slanted bars** concept:

- Cream disc (dark on light themes).
- Two Solana-style parallelogram bars (~20° slant), offset from each other to suggest an S diagonal and borrow Solana's speed-bar language.
- Amber core dot between the bars.

## Final design

Structure, single viewBox `0 0 32 32`:

```
Layer 1: cream disc           → <circle cx="16" cy="16" r="15" fill="{surface}"/>
Layer 2: top slanted bar      → <path d="M 1 10.2 L 20 10.2 L 26 13 L 7 13 Z" fill="{ink}"/>
Layer 3: bottom slanted bar   → <path d="M 6 19 L 25 19 L 31 21.8 L 12 21.8 Z" fill="{ink}"/>
Layer 4: amber core           → <circle cx="16" cy="16" r="2.6" fill="{accent}"/>

Layers 2–3 are clipped to the disc via a mask on the cream circle.
```

Token mapping — nav mark (inline SVG) uses CSS vars directly:

| Role        | Nav SVG fill      | Eclipse (dark) resolves to | Dusk (light) resolves to | Grid (light) resolves to |
|-------------|-------------------|----------------------------|--------------------------|--------------------------|
| `{surface}` | `var(--fg)`       | `#f4ede3` cream            | `#2a1d14` dark           | `#111110` near-black     |
| `{ink}`     | `var(--bg)`       | `#0a0908` near-black       | `#f4ebe0` cream          | `#f0ede4` off-white      |
| `{accent}`  | `var(--accent)`   | `#e8a056` amber            | `#d26b3a` orange         | `#c63d22` burnt red      |

The favicon (`app/icon.svg`) hardcodes the Eclipse palette since browsers render favicons with a single palette.

Key dimensions verified at 16px (favicon), 22px (nav), 64px (large):

- Bar thickness: ~2.8 units → visible at 16px.
- Gap between bar inner edges: 6 units.
- Dot radius 2.6 → ~0.4 unit clearance from both bar edges (won't touch).
- Slant: ~20° (steeper than the original 14° for Solana-style motion).

## Files to change

1. **`app/icon.svg`** — replace the eclipse gradient with the new flat design. Uses the dark-theme colors hardcoded (favicons are single-render; browsers don't theme them).
2. **`components/Nav.tsx`** — replace `<span className="nav-logo-mark">` with an inline SVG that uses CSS variables (`var(--bg)`, `var(--fg)`, `var(--accent)`) so the nav mark adapts per theme.
3. **`app/globals.css`** — simplify `.nav-logo-mark` to be a plain 22×22 container (remove the radial-gradient trick and `background-color`), since the SVG now carries the visual.

## Verification

1. `npm run dev`, open the site:
   - Nav mark renders the new design in all three themes (Eclipse, Dusk, Grid) and swaps colors correctly on theme toggle.
   - Tab favicon shows the new design on hard refresh.
   - At browser zoom 67% and 150%, the mark stays crisp (no blurring of slanted edges).
2. `npx tsc --noEmit` is clean.
