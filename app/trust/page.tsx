import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustHero } from "@/components/trust/TrustHero";
import { TrustCards } from "@/components/trust/TrustCards";

export const metadata: Metadata = {
  title: "Trust & Compliance — Sombra",
  description:
    "Post-quantum privacy with compliance built in: time-scoped audit keys, zero-knowledge disclosure proofs and an always-open public exit.",
  alternates: { canonical: "/trust" },
};

export default function TrustPage() {
  return (
    <>
      <Nav />
      <main className="page">
        <TrustHero />
        <TrustCards />
      </main>
      <Footer />
    </>
  );
}
