"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/sector/Section";
import {
  certifications,
  SUPERLICENCE_THRESHOLD,
  type Certification,
} from "@/lib/content";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const TOTAL = certifications.reduce((sum, c) => sum + c.points, 0);
const MAX_POINTS = Math.max(...certifications.map((c) => c.points));
const EASE_OUT_BACK = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/** Official monochrome brand marks (Simple Icons), keyed by issuer. Inlined so
 * the logos ship with the bundle and inherit the row colour via currentColor. */
const ISSUER_LOGOS: Record<string, string> = {
  Anthropic:
    "M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z",
  Oracle:
    "M16.412 4.412h-8.82a7.588 7.588 0 0 0-.008 15.176h8.828a7.588 7.588 0 0 0 0-15.176zm-.193 12.502H7.786a4.915 4.915 0 0 1 0-9.828h8.433a4.914 4.914 0 1 1 0 9.828z",
  Palantir:
    "M20.147 18L12 21.178 3.853 18 2.5 20.343 12 24l9.5-3.657L20.147 18zM12 0a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 16.078a6.568 6.568 0 1 1 0-13.136 6.568 6.568 0 0 1 0 13.136z",
};

/** Issuer lockup for the timing column — brand mark paired with the wordmark.
 * Falls back to the name alone when no logo is registered. */
function IssuerLogo({ issuer }: { issuer: string }) {
  const path = ISSUER_LOGOS[issuer];
  return (
    <span className="flex w-[128px] shrink-0 items-center gap-2">
      {path && (
        <svg
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
          fill="currentColor"
          className="h-4 w-4 shrink-0 text-muted"
        >
          <path d={path} />
        </svg>
      )}
      <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
        {issuer}
      </span>
    </span>
  );
}

/** Colour a row by weight so the rare credentials read louder than the free ones. */
function grade(points: number): { text: string; bar: string } {
  if (points >= 15) return { text: "text-green", bar: "bg-green" };
  if (points >= 8) return { text: "text-accent", bar: "bg-accent" };
  return { text: "text-muted", bar: "bg-line-strong" };
}

export function Superlicence() {
  const { ref, revealed } = useRevealOnScroll<HTMLDivElement>();
  const reducedMotion = useReducedMotion();
  const [tally, setTally] = useState(0);

  // Count the eligibility total up from zero when the panel scrolls into view.
  useEffect(() => {
    if (!revealed) return;
    if (reducedMotion) {
      const frame = requestAnimationFrame(() => setTally(TOTAL));
      return () => cancelAnimationFrame(frame);
    }
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setTally(Math.round(eased * TOTAL));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed, reducedMotion]);

  const cleared = tally >= SUPERLICENCE_THRESHOLD;

  return (
    <Section
      id="superlicence"
      sectorLabel="S4"
      title="Superlicence"
      meta="FIA SUPER LICENCE · ELIGIBILITY"
    >
      <div
        ref={ref}
        className="relative flex flex-col border border-line-strong border-t-[3px] border-t-accent bg-panel p-5 sm:p-6"
      >
        <ul className="flex flex-col">
          {certifications.map((cert, i) => (
            <CertRow
              key={cert.name}
              cert={cert}
              index={i}
              revealed={revealed}
            />
          ))}
        </ul>

        <div className="mt-5 border-t border-line-strong pt-4">
          <div className="flex items-end justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Eligibility
            </span>
            <span className="font-mono text-sm tabular-nums">
              <span
                className={`font-bold ${cleared ? "text-green" : "text-accent"}`}
              >
                {tally}
              </span>
              <span className="text-muted-2">
                {" "}
                / {SUPERLICENCE_THRESHOLD} PTS
              </span>
            </span>
          </div>
          <div className="relative mt-2 h-2 overflow-hidden rounded-[1px] bg-ink/10">
            <span
              className="absolute inset-y-0 left-0 rounded-[1px] bg-green transition-[width] duration-1000"
              style={{
                width: revealed
                  ? `${Math.min((TOTAL / SUPERLICENCE_THRESHOLD) * 100, 100)}%`
                  : "0%",
                transitionTimingFunction: EASE_OUT_BACK,
              }}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <span
              className={`border px-2.5 py-1 font-display text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
                cleared
                  ? "border-green/60 text-green"
                  : "border-line-strong text-muted-2"
              }`}
              style={
                cleared
                  ? {
                      textShadow:
                        "0 0 12px color-mix(in oklab, var(--color-green) 55%, transparent)",
                    }
                  : undefined
              }
            >
              {cleared ? "✓ Cleared to race" : "Tallying…"}
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}

function CertRow({
  cert,
  index,
  revealed,
}: {
  cert: Certification;
  index: number;
  revealed: boolean;
}) {
  const g = grade(cert.points);
  const delay = Math.min(index * 90, 400);

  return (
    <li
      className={`border-t border-dashed border-line-strong py-3.5 transition-[opacity,transform] duration-500 first:border-t-0 first:pt-0 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      style={{ transitionDelay: revealed ? `${delay}ms` : "0ms" }}
    >
      <div className="flex items-center gap-3">
        <IssuerLogo issuer={cert.issuer} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="flex-1 text-sm font-medium leading-snug text-ink">
              {cert.name}
            </span>
            <span
              className={`shrink-0 font-mono text-sm font-bold tabular-nums ${g.text}`}
            >
              +{cert.points}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="w-[64px] shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-2">
              {cert.issued}
            </span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-[1px] bg-ink/10">
              <span
                className={`absolute inset-y-0 left-0 rounded-[1px] transition-[width] duration-700 ${g.bar}`}
                style={{
                  width: revealed
                    ? `${(cert.points / MAX_POINTS) * 100}%`
                    : "0%",
                  transitionDelay: revealed ? `${delay + 120}ms` : "0ms",
                  transitionTimingFunction: EASE_OUT_BACK,
                }}
              />
            </div>
            <a
              href={cert.url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Verify →
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
