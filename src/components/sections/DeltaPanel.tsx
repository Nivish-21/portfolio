"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";

const TONE_TEXT: Record<Project["resultTone"], string> = {
  mark: "text-yellow",
  gain: "text-green",
  best: "text-purple",
};

const TONE_LABEL: Record<Project["resultTone"], string> = {
  mark: "MARK",
  gain: "GAIN",
  best: "BEST",
};

export function DeltaPanel({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className="relative bg-panel border border-line-strong border-t-[3px] border-t-accent p-5"
    >
      <span className="absolute top-3 right-3.5 font-mono text-[11px] text-muted">
        {project.code}
      </span>
      <h3 className="font-display font-bold uppercase text-lg tracking-[0.02em] mb-1 pr-14">
        {project.name}
      </h3>
      <p className="text-sm text-muted max-w-[46ch] mb-4">{project.summary}</p>

      <dl className="flex flex-col gap-0">
        <div className="grid grid-cols-[80px_1fr_auto] items-center gap-3 py-1.5 border-t border-dashed border-line-strong font-mono text-xs">
          <dt className="uppercase tracking-[0.08em] text-muted">Baseline</dt>
          <dd>
            <div className="h-2 rounded-[1px] bg-ink/10 relative overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 rounded-[1px] bg-line-strong transition-[width] duration-700 ease-out"
                style={{ width: filled ? "46%" : "0%" }}
              />
            </div>
          </dd>
          <dd className="text-yellow font-semibold">{project.baseline}</dd>
        </div>
        <div className="grid grid-cols-[80px_1fr_auto] items-center gap-3 py-1.5 border-t border-dashed border-line-strong font-mono text-xs">
          <dt className="uppercase tracking-[0.08em] text-muted">Optimised</dt>
          <dd>
            <div className="h-2 rounded-[1px] bg-ink/10 relative overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 rounded-[1px] bg-green transition-[width] duration-700 ease-out delay-150"
                style={{ width: filled ? "92%" : "0%" }}
              />
            </div>
          </dd>
          <dd className="text-green font-semibold">{project.optimised}</dd>
        </div>
        <div className="grid grid-cols-[80px_1fr_auto] items-center gap-3 py-1.5 border-t border-dashed border-line-strong font-mono text-xs">
          <dt className="uppercase tracking-[0.08em] text-muted">Result</dt>
          <dd className="text-ink">{project.result}</dd>
          <dd className={`font-bold ${TONE_TEXT[project.resultTone]}`}>
            {TONE_LABEL[project.resultTone]}
          </dd>
        </div>
      </dl>
    </article>
  );
}
