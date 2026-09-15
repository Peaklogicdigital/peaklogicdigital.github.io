import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import CoreServices from "@/components/sections/CoreServices";
import OperationalFlow from "@/components/sections/OperationalFlow";
import CredibilityMarkers from "@/components/sections/CredibilityMarkers";
import OperationalAudit from "@/components/sections/OperationalAudit";
import Bridge from "@/components/sections/Bridge";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative bg-transparent">
      <Hero />
      <Services />
      <CoreServices />
      <OperationalFlow />
      <CredibilityMarkers />
      <OperationalAudit />
      <Bridge />
      <Contact />
    </main>
  );
}
