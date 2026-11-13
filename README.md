# sombra-website

Marketing site for Sombra — a private, post-quantum product by [Bonsol Labs](https://bonsol.org).

Live at [sombra.tech](https://sombra.tech).

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- TypeScript
- The demo request form posts to `/api/demo`, which stores each request in a Google Sheet ([setup](docs/demo-sheet.md))
- Deployed on [Vercel](https://vercel.com)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build locally
- `npm run lint` — lint with Next.js defaults
- `npm test` — tests of the demo request checks (Node 22.18 or later)

## Structure

```
app/              # Routes: / (home), /trust, /company, /demo, /privacy, /terms, /og-preview
app/fonts/        # APK Galeria (licensed by Sombra / Bonsol Labs)
app/globals.css   # Design tokens (--color-*), buttons, fields, legal pages
components/       # Nav, Footer, ButtonLink + one component (+ CSS module) per home section
components/trust/ components/company/ components/demo/   # per-page sections
public/images/    # Photography and illustrations exported from Figma
```

Design source: Figma "Sombra – Product Design". The value-flow animation
(`components/ValueFlow.tsx`) is generated from the designer's HTML export.

## Deployment

Production deploys happen on push to `main`. To deploy manually:

```bash
vercel --prod
```

The `sombra.tech` domain is aliased to the production deployment.

## Social preview image

The OpenGraph image at `public/og-2026-11.png` is captured from the hidden `/og-preview` route and must be regenerated after any design change that affects it. Dev mode overlays a Next.js indicator on the page, so regeneration uses a production build.

```bash
npm run build
PORT=3100 npm run start &
npx playwright install chromium  # first time only
npx playwright screenshot \
  --viewport-size=1200,630 \
  --wait-for-timeout=3000 \
  http://localhost:3100/og-preview \
  public/og-2026-11.png
kill %1
```

Commit the regenerated `public/og-2026-11.png`. When the image changes, give the file a new name and update the three references in `app/layout.tsx`: social platforms keep a copy of the old image by its URL.
