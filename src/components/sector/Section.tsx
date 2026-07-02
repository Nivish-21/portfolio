"use client";

import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  sectorLabel: string;
  title: string;
  meta?: string;
  children: ReactNode;
}

export function Section({ id, sectorLabel, title, meta, children }: SectionProps) {
  return (
    <section id={id} className="snap-section relative mx-auto w-full max-w-content px-6 md:px-8">
      <div className="flex flex-wrap items-baseline gap-4 border-t-2 border-ink pt-3 mb-6">
        <span className="font-display font-extrabold text-[13px] tracking-[0.08em] px-2 py-0.5 rounded-sm uppercase bg-line-strong text-ink">
          {sectorLabel}
        </span>
        <h2 className="font-display font-bold uppercase text-xl md:text-2xl tracking-[0.02em]">
          {title}
        </h2>
        {meta && (
          <span className="ml-auto font-mono text-[11px] tracking-[0.1em] text-muted">
            {meta}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
