import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ProofBand } from "@/components/ProofBand";
import { Pillars } from "@/components/Pillars";
import { HowItWorks } from "@/components/HowItWorks";
import { PrivacyDemo } from "@/components/PrivacyDemo";
import { Quantum } from "@/components/Quantum";
import { Waitlist } from "@/components/Waitlist";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main className="page">
      <Hero />
      <ProofBand />
      <Pillars />
      <HowItWorks />
      <PrivacyDemo />
      <Quantum />
      <Waitlist />
      </main>
      <Footer />
    </>
  );
}
