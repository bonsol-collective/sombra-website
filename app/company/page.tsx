import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Mission } from "@/components/company/Mission";
import { Belief } from "@/components/company/Belief";

export const metadata: Metadata = {
  title: "Company — Sombra",
  description:
    "We exist to build financial privacy that is designed to last in a changing world. Meet the mission and values behind Sombra.",
  alternates: { canonical: "/company" },
};

export default function CompanyPage() {
  return (
    <>
      <Nav overlay />
      <main className="page">
        <Mission />
        <Belief />
      </main>
      <Footer />
    </>
  );
}
