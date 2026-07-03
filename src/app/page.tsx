import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { Experience } from "@/components/sections/Experience";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Skills } from "@/components/sections/Skills";
import { OpenToRoles } from "@/components/sections/OpenToRoles";
import { Contact } from "@/components/sections/Contact";
import { RaceEngineerConsole } from "@/components/sections/RaceEngineerConsole";
import { ArcadeProvider } from "@/context/ArcadeContext";
import { PitArcade } from "@/components/arcade/PitArcade";

export default function Home() {
  return (
    <ArcadeProvider>
      <div className="flex flex-col flex-1 relative">
        <TopBar />
        <Hero />
        <main className="flex flex-col gap-[var(--space-section)] pb-[var(--space-section)]">
          <Experience />
          <FeaturedWork />
          <Skills />
          <OpenToRoles />
          <Contact />
        </main>
        <Footer />
        <RaceEngineerConsole />
        <PitArcade />
      </div>
    </ArcadeProvider>
  );
}
