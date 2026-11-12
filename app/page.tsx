import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { PrivateDefi } from "@/components/PrivateDefi";
import { StatementBand } from "@/components/StatementBand";
import { ValueFlow } from "@/components/ValueFlow";
import { Wallet } from "@/components/Wallet";
import { Swaps } from "@/components/Swaps";
import { CoProcessor } from "@/components/CoProcessor";
import { ThreeSteps } from "@/components/ThreeSteps";
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
      <Nav overlay />
      <main className="page">
      <Hero />
      <PrivateDefi />
      <StatementBand />
      <ValueFlow />
      <Wallet />
      <Swaps />
      <CoProcessor />
      <ThreeSteps />
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
