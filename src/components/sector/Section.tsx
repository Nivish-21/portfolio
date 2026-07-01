"use client";

import type { ReactNode } from "react";
import { useSectorTiming } from "@/hooks/useSectorTiming";
import { SectorMarker } from "./SectorMarker";

interface SectionProps {
  id: string;
  sectorLabel: string;
  title: string;
  meta?: string;
  /** Estimated seconds an attentive reader spends on this section's content. */
  targetSeconds: number;
  children: ReactNode;
}

export function Section({ id, sectorLabel, title, meta, targetSeconds, children }: SectionProps) {
  const { ref, status } = useSectorTiming(id, sectorLabel, title, targetSeconds);

  return (
    <section
      id={id}
      ref={(node) => {
        ref.current = node;
      }}
      className="mx-auto w-full max-w-content px-6 md:px-8"
    >
      <div className="flex flex-wrap items-baseline gap-4 border-t-2 border-ink pt-3 mb-6">
        <SectorMarker label={sectorLabel} status={status} />
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
