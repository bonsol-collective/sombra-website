import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// APK Galeria (Autograph Type Design) — licensed by Sombra / Bonsol Labs.
const galeria = localFont({
  src: "./fonts/APKGaleria.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-galeria",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sombra.tech"),
  title: "Sombra",
  description:
    "The new privacy standard powering the next era of money. Sombra keeps balances, payroll and B2B settlements confidential on Solana, with post-quantum cryptography.",
  alternates: { canonical: "/" },
  authors: [{ name: "Bonsol Labs", url: "https://bonsol.org" }],
  creator: "Bonsol Labs",
  publisher: "Bonsol Labs",
  openGraph: {
    title: "Sombra — post-quantum privacy on Solana",
    description:
      "Private trading and transfers on Solana. Quantum-safe from day one.",
    url: "https://sombra.tech",
    siteName: "Sombra",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Sombra — The new privacy standard powering the next era of money.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sombra",
    description:
      "Private, post-quantum trading and transfers on Solana.",
    images: ["/og.png"],
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
      image: "https://sombra.tech/og.png",
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
