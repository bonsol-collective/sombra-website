import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { PrivateDefi } from "@/components/PrivateDefi";
import { StatementBand } from "@/components/StatementBand";
import { ValueFlow } from "@/components/ValueFlow";
import { Wallet } from "@/components/Wallet";
import { Swaps } from "@/components/Swaps";
import { CoProcessor } from "@/components/CoProcessor";
import { ThreeSteps } from "@/components/ThreeSteps";
import { TransparencyBand } from "@/components/TransparencyBand";
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
        <TransparencyBand />
      </main>
      <Footer />
    </>
  );
}
