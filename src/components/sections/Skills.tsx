import { Section } from "@/components/sector/Section";

const GROUPS = [
  {
    label: "Backend & systems",
    items: ["Node.js", "System design", "Real-time architecture", "OSRM / geospatial", "PostgreSQL"],
  },
  {
    label: "AI & agents",
    items: ["Multi-agent orchestration", "LangGraph", "Gemini SDK", "CrewAI", "RAG pipelines"],
  },
  {
    label: "Tools & practice",
    items: ["Python", "TypeScript", "Docker", "CI/CD", "Open-source (PyPI)"],
  },
];

export function Skills() {
  return (
    <Section id="skills" sectorLabel="S3" title="Skills" targetSeconds={10}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GROUPS.map((group) => (
          <div key={group.label} className="bg-panel border border-line-strong p-5">
            <h3 className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted mb-3">
              {group.label}
            </h3>
            <ul className="flex flex-col gap-2">
              {group.items.map((item) => (
                <li key={item} className="text-sm flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
