# OpenGraph preview — design

Date: 2026-04-22

## Goal

Give `sombra.tech` a proper social preview: a 1200×630 hero-derived image, plus OpenGraph and Twitter Card metadata, so links shared on X, Discord, Slack, iMessage, etc. render with the Sombra brand instead of a blank card.

## Non-goals

- Per-page OG images. The home page is the only public surface right now; one site-wide image is enough.
- Dynamic OG generation via `opengraph-image.tsx` / `ImageResponse`. See "Alternatives considered."
- Dark (eclipse) theme variant. Dusk is the default and the right first impression.

## Part 1 — The image

### Approach

A dedicated internal route (`/og-preview`) renders a fixed 1200×630 canvas composed from the same CSS primitives as the hero. A one-time headless screenshot captures it to `public/og.png`. The route stays in the repo so the image can be regenerated whenever the hero design evolves.

This keeps full visual fidelity — the sun's radial gradient, corona glow, grid backdrop, and serif type all render through real CSS in a real browser — which `ImageResponse` cannot match (it lacks `filter: blur()`, `color-mix()`, and `backdrop-filter`, which are load-bearing for the hero aesthetic).

### Composition

1200×630, dusk theme (`--bg: #f4ebe0`, `--fg: #2a1d14`, `--accent: #d26b3a`).

Layout (left-weighted to mirror how the hero reads):

- **Left column** (~60% of canvas width, vertically centered):
  - Mono tagline "STEP INTO THE SHADOW." with the pulsing accent dot (static in the PNG), ~14px, `--fg-dim`
  - Serif headline "Trade in the **shadow.**" — "shadow." in italic, `--accent` color. Size ~96px, line-height 0.92, letter-spacing -0.03em
  - Mono footnote "Sombra — post-quantum privacy on Solana" — ~13px, `--fg-mute`, top-separated by the same 1px line rule used in the hero footer
- **Right column** (~40%):
  - Eclipse visual (corona + sun + shadow) sized to ~520px square, vertically centered. Same CSS rules as `.hero-eclipse`, `.hero-sun`, `.hero-corona`, `.hero-shadow` — no animation, shadow offset by a small fixed `(x, y)` so the crescent of sun reads clearly (roughly `translate(-28px, 14px) scale(1.02)`)
- **Full-canvas background**:
  - The `.hero-grid-bg` 80×80 grid, but with the mask re-centered on the eclipse (override to `radial-gradient(circle at 72% 50%, black 0%, transparent 70%)`) so the grid fades out around the title instead of fighting with it

No nav, no scroll indicator, no "mainnet beta" strip — those are chrome that doesn't belong in a preview.

### Route

New file: `app/og-preview/page.tsx` — a server component that renders the composition inside a fixed 1200×630 wrapper.

- Export a `metadata` object with `robots: { index: false, follow: false }` so the route doesn't show up in search.
- The wrapper uses inline styles (`width: 1200px; height: 630px; overflow: hidden`), so we don't need to touch `body`/`html`. Any slight scrollbar gets clipped by the Playwright viewport sized exactly to 1200×630.
- Not linked from anywhere; discoverable only by URL.

### Generation

One-time, manual, run locally when the design changes:

```bash
npm run dev  # serves /og-preview at http://localhost:3000/og-preview
npx playwright screenshot --viewport-size=1200,630 \
  http://localhost:3000/og-preview public/og.png
```

Playwright is invoked via `npx`, not added as a project dependency. Document the command in the README under a short "Regenerating the OG image" section.

## Part 2 — Metadata

Update `app/layout.tsx`'s existing `metadata` export:

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

`metadataBase` ensures relative `/og.png` resolves to an absolute URL in the rendered tags, which several crawlers require.

## Alternatives considered

- **Screenshot the live hero at 1200×630.** Rejected: the hero is designed for 100vh and centers the eclipse; at OG aspect the title sits awkwardly low and the eclipse is cramped.
- **Dynamic `opengraph-image.tsx` with `ImageResponse`.** Rejected: `ImageResponse` doesn't support `filter: blur()`, `color-mix()`, or `backdrop-filter` — the corona glow, soft sun, and grid-radial-mask would all need to be faked. Lower fidelity for no meaningful upside, since the metadata is stable.

## Testing

- Visit `/og-preview` locally and confirm composition at exactly 1200×630 (browser dev tools → device toolbar → custom viewport).
- After generating `public/og.png`: view source on `sombra.tech`, confirm `<meta property="og:image">` resolves to `https://sombra.tech/og.png` and returns 200.
- Paste the production URL into the Meta Sharing Debugger, Twitter Card Validator, and LinkedIn Post Inspector — confirm each renders the preview correctly.
- Optionally paste into iMessage / Slack / Discord for a real-world check.

## Files touched

- `app/layout.tsx` — extend `metadata` export with `metadataBase`, `openGraph`, `twitter`.
- `app/og-preview/page.tsx` — new file, 1200×630 hero composition.
- `public/og.png` — new binary, generated via the command above.
- `README.md` — short section documenting how to regenerate the image.
