import { Section } from "@/components/sector/Section";
import { experience, education } from "@/lib/content";

export function Experience() {
  return (
    <Section
      id="experience"
      sectorLabel="S1"
      title="Experience"
      meta={`${experience.length} roles`}
    >
      <div className="flex flex-col gap-4">
        {experience.map((entry) => (
          <article
            key={entry.org}
            className="relative bg-panel border border-line-strong border-t-[3px] border-t-accent p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
              <h3 className="font-display font-bold uppercase text-lg tracking-[0.02em]">
                {entry.role}
              </h3>
              <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-accent">
                {entry.dates}
              </span>
            </div>
            <p className="text-sm text-muted mb-1">{entry.org}</p>
            {entry.note && (
              <p className="font-mono text-[11px] text-muted-2 mb-3">{entry.note}</p>
            )}
            <ul className="flex flex-col gap-1.5 mt-3">
              {entry.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2 text-sm border-t border-dashed border-line-strong pt-1.5 first:border-t-0 first:pt-0"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  {highlight}
                </li>
              ))}
            </ul>
          </article>
        ))}
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border border-line-strong bg-panel/60 p-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Education</span>
            <h3 className="font-display font-bold uppercase text-base tracking-[0.02em] mt-0.5">
              {education.degree}
            </h3>
            <p className="text-sm text-muted">{education.institution}</p>
          </div>
          <div className="text-right font-mono text-xs">
            <div className="text-muted">{education.dates}</div>
            <div className="text-accent">{education.detail}</div>
          </div>
        </div>
      </div>
    </Section>
  );
}
