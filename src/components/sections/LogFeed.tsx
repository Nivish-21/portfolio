import { Section } from "@/components/sector/Section";
import { log } from "@/lib/content";

const KIND_STYLES = {
  train: { dot: "bg-green", label: "TRAIN" },
  ship: { dot: "bg-accent", label: "SHIP" },
};

export function LogFeed() {
  return (
    <Section
      id="log"
      sectorLabel="S1"
      title="The Log"
      meta={`${log.length} entries recorded`}
      targetSeconds={14}
    >
      <p className="max-w-[60ch] text-muted mb-6">
        Two disciplines, one loop. Real training entries next to real ship entries — raw first,
        refined after.
      </p>
      <ol className="flex flex-col gap-0">
        {log.map((entry, i) => {
          const style = KIND_STYLES[entry.kind];
          return (
            <li
              key={`${entry.time}-${i}`}
              className="flex items-start gap-4 py-3 border-t border-dashed border-line-strong first:border-t-0"
            >
              <span className="font-mono text-xs text-muted w-14 shrink-0 pt-0.5">{entry.time}</span>
              <span
                className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${style.dot}`}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted w-14 shrink-0 pt-0.5">
                {style.label}
              </span>
              <span className="text-sm md:text-base">{entry.text}</span>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
