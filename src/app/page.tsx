import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import CoreServices from "@/components/sections/CoreServices";
import SelectedWork from "@/components/sections/SelectedWork";
import OperationalFlow from "@/components/sections/OperationalFlow";
import Pricing from "@/components/sections/Pricing";
import Bridge from "@/components/sections/Bridge";
import Contact from "@/components/sections/Contact";
import ScrollSkewWrapper from "@/components/layout/ScrollSkewWrapper";
import ThreePreloader from "@/components/layout/ThreePreloader";

export default function Home() {
  return (
    <main className="relative bg-transparent">
      <ThreePreloader />
      <ScrollSkewWrapper>
        <Hero />
        <Services />
        <CoreServices />
        <SelectedWork />
        <OperationalFlow />
        <Pricing />
        <Bridge />
        <Contact />
      </ScrollSkewWrapper>
    </main>
  );
}
