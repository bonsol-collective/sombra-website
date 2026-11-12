import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DemoForm } from "@/components/demo/DemoForm";

export const metadata: Metadata = {
  title: "Request a demo — Sombra",
  description: "See how Sombra can keep your organization's balances, payroll and settlements confidential.",
  alternates: { canonical: "/demo" },
};

export default async function DemoPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams; // prefilled by the footer's "Book demo" field
  return (
    <>
      <Nav />
      <main className="page">
        <DemoForm defaultEmail={typeof email === "string" ? email : ""} />
      </main>
      <Footer />
    </>
  );
}
