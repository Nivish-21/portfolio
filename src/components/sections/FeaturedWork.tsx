import { Section } from "@/components/sector/Section";
import { projects } from "@/lib/content";
import { DeltaPanel } from "./DeltaPanel";

export function FeaturedWork() {
  return (
    <Section
      id="work"
      sectorLabel="S2"
      title="Featured — the delta on each build"
      meta={`${projects.length} laps recorded`}
      targetSeconds={projects.length * 12}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <DeltaPanel key={project.code} project={project} />
        ))}
      </div>
    </Section>
  );
}
