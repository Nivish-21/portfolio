import { TopBar } from "@/components/layout/TopBar";
import { Hero } from "@/components/hero/Hero";
import { LogFeed } from "@/components/sections/LogFeed";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Skills } from "@/components/sections/Skills";
import { PersonalBeat } from "@/components/sections/PersonalBeat";
import { LapSummary } from "@/components/sections/LapSummary";
import { Contact } from "@/components/sections/Contact";
import { SectorTimingProvider } from "@/context/SectorTimingContext";

export default function Home() {
  return (
    <SectorTimingProvider>
      <div className="flex flex-col flex-1">
        <TopBar />
        <Hero />
        <main className="flex flex-col gap-[var(--space-section)] pb-[var(--space-section)]">
          <LogFeed />
          <FeaturedWork />
          <Skills />
          <PersonalBeat />
          <LapSummary />
          <Contact />
        </main>
      </div>
    </SectorTimingProvider>
  );
}
