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
    <div className="flex flex-wrap border border-line-strong bg-panel w-fit max-w-full mt-6">
      <CountStat label="Shipped" target={hud.shipped} suffix="builds" delayMs={600} />
      <CountStat label="Live coverage" target={hud.liveCoverage} suffix="districts" delayMs={700} />
      <div className="px-5 py-3 border-r border-line-strong">
        <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted">Best sector</div>
        <div className="font-display font-bold text-3xl leading-tight text-purple">{hud.bestSector}</div>
      </div>
      <CountStat label="Discipline" target={hud.discipline} suffix="run + build" delayMs={800} />
    </div>
  );
}
