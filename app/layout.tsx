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
  title: "Sombra — post-quantum privacy on Solana",
  description:
    "Sombra brings quantum-safe privacy to Solana. Private trading and transfers, built for the quantum era.",
  openGraph: {
    title: "Sombra — post-quantum privacy on Solana",
    description:
      "Private trading and transfers on Solana. Quantum-safe from day one.",
    url: "https://sombra.tech",
    siteName: "Sombra",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Sombra — Step into the shadow.",
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
