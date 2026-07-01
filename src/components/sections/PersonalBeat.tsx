import { Section } from "@/components/sector/Section";
import { StravaWidget } from "./StravaWidget";

const ARENAS = [
  {
    tag: "F1",
    text: "Aero shaves a tenth. A refactor shaves a millisecond. Same discipline, different units.",
  },
  {
    tag: "Running + gym",
    text: "When the build breaks, I go break a sweat. Mornings on the road, evenings in the terminal.",
  },
  {
    tag: "Chess",
    text: "Small positional edges, compounded, patiently — the same way I plan a system before I touch code.",
  },
];

export function PersonalBeat() {
  return (
    <Section id="beat" sectorLabel="S4" title="Off the clock" targetSeconds={9}>
      <p className="max-w-[64ch] text-muted mb-6">
        Different arenas, one habit: ship the raw version, then make the small corrections that
        actually compound.
      </p>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ARENAS.map((arena) => (
            <div key={arena.tag} className="bg-panel border border-line-strong p-5">
              <span className="font-display font-bold uppercase text-sm tracking-[0.04em] text-accent">
                {arena.tag}
              </span>
              <p className="text-sm mt-2">{arena.text}</p>
            </div>
          ))}
        </div>
        <StravaWidget />
      </div>
    </Section>
  );
}
