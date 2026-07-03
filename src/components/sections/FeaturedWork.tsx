"use client";

import { useRef, useState, useEffect } from "react";
import { Section } from "@/components/sector/Section";
import { projects } from "@/lib/content";
import { DeltaPanel } from "./DeltaPanel";

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

export function FeaturedWork() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { ref: revealRef, revealed } = useRevealOnScroll<HTMLDivElement>();

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollByCards = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: direction * 380, behavior: "smooth" });
  };

  return (
    <Section
      id="work"
      sectorLabel="S2"
      title="Featured — the delta on each build"
      meta={`${projects.length} laps recorded`}
    >
      <div ref={revealRef} className="relative">
        <div
          ref={scrollerRef}
          className="scrollbar-none flex items-start gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 pb-2"
        >
          {projects.map((project, idx) => (
            <div
              key={project.code}
              className={`flex w-[85vw] max-w-[380px] shrink-0 snap-start transition-transform duration-500 ${
                revealed ? "translate-x-0" : "-translate-x-4"
              }`}
              style={{
                transitionDelay: revealed ? `${Math.min(idx * 75, 600)}ms` : "0ms",
                transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <DeltaPanel project={project} />
            </div>
          ))}
        </div>
        
        <div className="mt-3 flex flex-col gap-2.5">
          {/* Progress bar row */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              Scroll for more laps &rarr;
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-sm bg-line-strong">
              <div
                className="h-full rounded-sm bg-accent transition-[width] duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
          </div>

          {/* Buttons row */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label="Scroll to previous project"
              className="cursor-pointer border border-line-strong px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              aria-label="Scroll to next project"
              className="cursor-pointer border border-line-strong px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
