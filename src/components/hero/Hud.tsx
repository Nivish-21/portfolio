"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { hud } from "@/lib/content";

interface StatProps {
  label: string;
  target: number;
  suffix: string;
  delayMs: number;
}

function CountStat({ label, target, suffix, delayMs }: StatProps) {
  const [value, setValue] = useState(0);
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;

        const durationMs = 900;
        const start = performance.now() + delayMs;

        const tick = (now: number) => {
          const elapsed = now - start;
          if (elapsed < 0) {
            requestAnimationFrame(tick);
            return;
          }
          const progress = Math.min(1, elapsed / durationMs);
          setValue(Math.round(progress * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, delayMs, reducedMotion]);

  const displayValue = reducedMotion ? target : value;

  return (
    <div ref={ref} className="px-5 py-3 border-r border-line-strong last:border-r-0">
      <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted">{label}</div>
      <div className="font-display font-bold text-3xl leading-tight tabular-nums">
        {String(displayValue).padStart(2, "0")}{" "}
        <small className="text-sm font-medium text-muted">{suffix}</small>
      </div>
    </div>
  );
}

export function Hud() {
  return (
    <div className="relative w-fit max-w-full mt-6">
      <span
        aria-hidden="true"
        className="absolute -top-2.5 right-3 z-10 flex items-center gap-1.5 bg-bg px-1.5 font-mono text-[9px] tracking-[0.14em] text-accent"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        LIVE
      </span>
      <div
        className="flex flex-wrap border border-line-strong bg-panel-raised"
        style={{ boxShadow: "0 0 28px -6px color-mix(in oklab, var(--color-accent) 45%, transparent)" }}
      >
        <CountStat label="Shipped" target={hud.shipped} suffix="builds" delayMs={600} />
        <CountStat label="Live coverage" target={hud.liveCoverage} suffix="districts" delayMs={700} />
        <div className="px-5 py-3 border-r border-line-strong">
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted">Best sector</div>
          <div
            className="font-display font-bold text-3xl leading-tight text-purple"
            style={{ textShadow: "0 0 18px color-mix(in oklab, var(--color-purple) 65%, transparent)" }}
          >
            {hud.bestSector}
          </div>
        </div>
        <CountStat label="Discipline" target={hud.discipline} suffix="run + build" delayMs={800} />
      </div>
    </div>
  );
}
