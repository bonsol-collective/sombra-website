import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// APK Galeria (Autograph Type Design) — licensed by Sombra / Bonsol Labs.
const galeria = localFont({
  src: "./fonts/APKGaleria-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-galeria",
  display: "swap",
});

// Vercel preview builds link their own image (sombra.tech still serves the live site's image).
const SITE_URL =
  process.env.VERCEL_ENV === "preview" && process.env.VERCEL_BRANCH_URL
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : "https://sombra.tech";

// One title and one text for the page and for the link previews (Discord, Telegram, X, LinkedIn, Slack).
const PREVIEW_TITLE = "Sombra — The new privacy standard powering the next era of money.";
const DESCRIPTION =
  "The new privacy standard powering the next era of money. Sombra keeps balances, payroll and B2B settlements confidential on Solana, with post-quantum cryptography.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sombra",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  authors: [{ name: "Bonsol Labs", url: "https://bonsol.org" }],
  creator: "Bonsol Labs",
  publisher: "Bonsol Labs",
  openGraph: {
    title: PREVIEW_TITLE,
    description: DESCRIPTION,
    url: "https://sombra.tech",
    siteName: "Sombra",
    locale: "en_US",
    images: [
      {
        // A new file name for each new image: Discord, X, LinkedIn and Slack keep a copy of an image by its URL.
        // A query string (`og.png?v=2`) was not enough for Discord (seen on 14 Nov 2026).
        url: "/og-2026-11.png",
        width: 1200,
        height: 630,
        alt: PREVIEW_TITLE,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PREVIEW_TITLE,
    description: DESCRIPTION,
    images: ["/og-2026-11.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

/**
 * JSON-LD structured data. Four interlinked entities:
 *   - Organization: Bonsol Labs (the publisher)
 *   - WebSite: sombra.tech
 *   - SoftwareApplication: Sombra (FinanceApplication — signals to
 *     search engines and LLMs what this product is)
 *   - CreativeWork: the whitepaper PDF
 *
 * Linked via @id references so crawlers understand the relationships
 * (publisher of website, publisher of software, author of whitepaper).
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://bonsol.org/#organization",
      name: "Bonsol Labs",
      url: "https://bonsol.org",
      description:
        "ZK company building post-quantum privacy infrastructure.",
      sameAs: [
        "https://x.com/bonsol_labs",
        "https://t.me/+l2s8ejQ170U2ZDUx",
        "https://discord.gg/cSrTYAT2US",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://sombra.tech/#website",
      url: "https://sombra.tech",
      name: "Sombra",
      description:
        "Post-quantum privacy on Solana. Private trading and transfers, built for the quantum era.",
      publisher: { "@id": "https://bonsol.org/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://sombra.tech/#software",
      name: "Sombra",
      url: "https://sombra.tech",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Post-quantum private UTXO transfers on Solana. Signature-free ownership proofs via Kyber-768 and RISC0 STARKs.",
      image: "https://sombra.tech/og-2026-11.png",
      publisher: { "@id": "https://bonsol.org/#organization" },
    },
    {
      "@type": "CreativeWork",
      "@id": "https://sombra.tech/whitepaper.pdf",
      name: "Sombra Whitepaper",
      url: "https://sombra.tech/whitepaper.pdf",
      encodingFormat: "application/pdf",
      author: { "@id": "https://bonsol.org/#organization" },
      publisher: { "@id": "https://bonsol.org/#organization" },
      isPartOf: { "@id": "https://sombra.tech/#website" },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={galeria.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
