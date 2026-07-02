import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { Experience } from "@/components/sections/Experience";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Skills } from "@/components/sections/Skills";
import { OpenToRoles } from "@/components/sections/OpenToRoles";
import { Contact } from "@/components/sections/Contact";
import { RaceEngineerConsole } from "@/components/sections/RaceEngineerConsole";
import { RaceModeProvider } from "@/context/RaceModeContext";
// Race Mode is paused for now — not implemented, not removed. RaceModeProvider stays active
// below since useRaceEngineer.ts still reads personalBestMs from it (already null-guarded).
// import { RaceCanvas } from "@/components/race/RaceCanvas";
// import { LapResultToast } from "@/components/race/LapResultToast";

export default function Home() {
  return (
    <RaceModeProvider>
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
        {/* <RaceCanvas /> */}
        {/* <LapResultToast /> */}
        <RaceEngineerConsole />
      </div>
    </RaceModeProvider>
  );
}
