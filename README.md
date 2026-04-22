# sombra-website

Marketing site for Sombra — a private, post-quantum product by [Bonsol Labs](https://bonsol.org).

Live at [sombra.tech](https://sombra.tech).

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- TypeScript
- [Formspree](https://formspree.io) for the waitlist form
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

## Structure

```
app/          # App Router entry, global styles, icon
components/   # Nav, Hero, Pillars, PrivacyDemo, Quantum, Waitlist, Footer, ThemeToggle
hooks/        # useInView, useMouseParallax, useScramble, useScrollY
```

## Deployment

Production deploys happen on push to `main`. To deploy manually:

```bash
vercel --prod
```

The `sombra.tech` domain is aliased to the production deployment.

## Social preview image

The OpenGraph image at `public/og.png` is captured from the hidden `/og-preview` route and must be regenerated after any design change that affects it. Dev mode overlays a Next.js indicator on the page, so regeneration uses a production build.

```bash
npm run build
PORT=3100 npm run start &
npx playwright install chromium  # first time only
npx playwright screenshot \
  --viewport-size=1200,630 \
  --wait-for-timeout=3000 \
  http://localhost:3100/og-preview \
  public/og.png
kill %1
```

Commit the regenerated `public/og.png`.
