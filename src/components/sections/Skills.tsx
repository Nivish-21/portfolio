"use client";

import { Section } from "@/components/sector/Section";
import { skillGroups, isSkillFallback, type SkillEntry } from "@/lib/skills";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

export function Skills() {
  const { ref: gridRef, revealed } = useRevealOnScroll<HTMLDivElement>();

  // Calculate continuous indices across all groups
  const allItems: Array<{ skill: SkillEntry; index: number }> = [];
  let count = 0;
  skillGroups.forEach((group) => {
    group.items.forEach((skill) => {
      count += 1;
      allItems.push({ skill, index: count });
    });
  });

  // Map each skill to its position by flattened index
  const skillToIndex = new Map(
    allItems.map(({ skill, index: idx }) => [skill.name, idx])
  );

  return (
    <Section id="skills" sectorLabel="S3" title="Skills">
      <div ref={gridRef} className="flex flex-col gap-6 relative">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <h3 className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted mb-3">
              {group.label}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
              {group.items.map((skill) => {
                const cellIndex = skillToIndex.get(skill.name) ?? 0;
                return (
                  <div
                    key={skill.name}
                    className={`group relative flex flex-col items-center gap-2 border border-line-strong bg-panel px-2 py-4 text-center transition-transform duration-500 hover:border-accent ${
                      revealed ? "translate-y-0" : "-translate-y-3"
                    }`}
                    style={{
                      transitionDelay: revealed ? `${Math.min(cellIndex * 25, 600)}ms` : "0ms",
                      transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    <span className="absolute top-1.5 left-1.5 font-mono text-[9px] text-muted-2">
                      {String(cellIndex).padStart(2, "0")}
                    </span>
                    {isSkillFallback(skill) ? (
                      <span
                        className="flex h-7 w-7 items-center justify-center border border-line-strong font-mono text-[8px] font-bold tracking-[0.02em] text-muted transition-colors group-hover:border-accent group-hover:text-accent"
                        aria-hidden="true"
                      >
                        {skill.label}
                      </span>
                    ) : skill.dark ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-ink/90">
                        <svg
                          role="img"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          style={{ fill: `#${skill.hex}` }}
                        >
                          <path d={skill.path} />
                        </svg>
                      </span>
                    ) : (
                      <svg
                        role="img"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-7 w-7 shrink-0"
                        style={{ fill: `#${skill.hex}` }}
                      >
                        <path d={skill.path} />
                      </svg>
                    )}
                    <span className="font-mono text-[9px] uppercase tracking-[0.04em] text-ink leading-tight">
                      {skill.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
