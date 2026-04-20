import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Pillars } from "@/components/Pillars";
import { PrivacyDemo } from "@/components/PrivacyDemo";
import { Quantum } from "@/components/Quantum";
import { Waitlist } from "@/components/Waitlist";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />
      <Pillars />
      <PrivacyDemo />
      <Quantum />
      <Waitlist />
      <Footer />
    </>
  );
}
