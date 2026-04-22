import type { Metadata } from "next";
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-geist",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sombra.tech"),
  title: "Post-quantum privacy on Solana",
  description:
    "Sombra brings quantum-safe privacy to Solana. Private trading and transfers, built for the quantum era.",
  openGraph: {
    title: "Post-quantum privacy on Solana",
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
    title: "Post-quantum privacy on Solana",
    description:
      "Sombra brings quantum-safe privacy to Solana. Private trading and transfers, built for the quantum era.",
    images: ["/og.png"],
    creator: "@bonsol_labs",
    site: "@bonsol_labs",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dusk"
      className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sombra-theme');if(t==='eclipse'||t==='dusk'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
