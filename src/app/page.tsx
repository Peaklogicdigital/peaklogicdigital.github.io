import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Bridge from "@/components/sections/Bridge";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative bg-transparent">
      <Hero />
      <Services />
      <Bridge />
      <Contact />
    </main>
  );
}
