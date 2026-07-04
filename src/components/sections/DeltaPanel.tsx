"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { CommitTrail } from "./CommitTrail";

import { TONE_TEXT, TONE_LABEL, TONE_GLOW } from "@/lib/tones";

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
      className="group relative flex h-full w-full flex-col bg-panel border border-line-strong border-t-[3px] border-t-accent p-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_-8px_color-mix(in_oklab,var(--color-accent)_55%,transparent)]"
    >
      <div className="absolute top-3 right-3.5 flex items-center gap-2">
        {project.hackathon && (
          <span className="border border-purple/50 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase leading-none tracking-[0.12em] text-purple">
            Hackathon
          </span>
        )}
        <span className="font-mono text-[11px] text-muted">{project.code}</span>
      </div>
      <h3
        className={`font-display font-bold uppercase text-lg tracking-[0.02em] mb-1 min-h-14 line-clamp-2 ${
          project.hackathon ? "pr-32" : "pr-14"
        }`}
      >
        {project.name}
      </h3>
      <p className="text-sm text-muted max-w-[46ch] mb-4 min-h-[100px] line-clamp-5">
        {project.summary}
      </p>

      <div className="mt-auto">
        <dl className="flex flex-col gap-0">
          <div className="grid grid-cols-[80px_96px_1fr] items-center gap-3 py-1.5 border-t border-dashed border-line-strong font-mono text-xs">
            <dt className="uppercase tracking-[0.08em] text-muted">Baseline</dt>
            <dd>
              <div className="h-2 rounded-[1px] bg-ink/10 relative overflow-hidden">
                <span
                  className="absolute inset-y-0 left-0 rounded-[1px] bg-line-strong transition-[width] duration-700"
                  style={{
                    width: filled ? "46%" : "0%",
                    transitionTimingFunction:
                      "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </div>
            </dd>
            <dd className="text-yellow font-semibold min-h-8 line-clamp-2">
              {project.baseline}
            </dd>
          </div>
          <div className="grid grid-cols-[80px_96px_1fr] items-center gap-3 py-1.5 border-t border-dashed border-line-strong font-mono text-xs">
            <dt className="uppercase tracking-[0.08em] text-muted">
              Optimised
            </dt>
            <dd>
              <div className="h-2 rounded-[1px] bg-ink/10 relative overflow-hidden">
                <span
                  className="absolute inset-y-0 left-0 rounded-[1px] bg-green transition-[width] duration-700 delay-150"
                  style={{
                    width: filled ? "92%" : "0%",
                    transitionTimingFunction:
                      "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </div>
            </dd>
            <dd className="text-green font-semibold min-h-8 line-clamp-2">
              {project.optimised}
            </dd>
          </div>
          <div className="grid grid-cols-[80px_1fr_auto] items-center gap-3 py-1.5 border-t border-dashed border-line-strong font-mono text-xs">
            <dt className="uppercase tracking-[0.08em] text-muted">Result</dt>
            <dd className="text-ink min-h-12 line-clamp-3">{project.result}</dd>
            <dd
              className={`font-bold ${TONE_TEXT[project.resultTone]}`}
              style={
                TONE_GLOW[project.resultTone]
                  ? { textShadow: TONE_GLOW[project.resultTone] }
                  : undefined
              }
            >
              {TONE_LABEL[project.resultTone]}
            </dd>
          </div>
        </dl>

        {project.repo ? (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            &rarr; View repo
          </a>
        ) : (
          <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-2">
            &#128274; Private build
          </span>
        )}

        <CommitTrail code={project.code} />
      </div>
    </article>
  );
}
