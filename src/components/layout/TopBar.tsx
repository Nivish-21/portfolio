"use client";

import { useEffect, useState } from "react";
import { useArcade } from "@/context/ArcadeContext";
import { raceControlMessages, type RaceFlag } from "@/lib/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface NavItem {
  id: string;
  label: string;
  sector: string;
  flag: RaceFlag;
}

const NAV: NavItem[] = [
  { id: "experience", label: "Experience", sector: "S1", flag: "green" },
  { id: "work", label: "Work", sector: "S2", flag: "green" },
  { id: "skills", label: "Skills", sector: "S3", flag: "yellow" },
  { id: "superlicence", label: "Licence", sector: "S4", flag: "blue" },
  { id: "roles", label: "Roles", sector: "S5", flag: "green" },
  { id: "contact", label: "Radio", sector: "S6", flag: "chequered" },
];

const FLAG_VAR: Record<Exclude<RaceFlag, "chequered">, string> = {
  green: "var(--color-green)",
  yellow: "var(--color-yellow)",
  red: "var(--color-red)",
  blue: "var(--color-shift)",
};
const CHEQUERED =
  "repeating-conic-gradient(#fff 0 25%, #0a0f0e 0 50%) 0 0 / 4px 4px";

function FlagDot({ flag, size }: { flag: RaceFlag; size: number }) {
  const dims = { width: size, height: size };
  if (flag === "chequered") {
    return (
      <span
        aria-hidden="true"
        className="shrink-0 rounded-[1px]"
        style={{ ...dims, background: CHEQUERED }}
      />
    );
  }
  const color = FLAG_VAR[flag];
  return (
    <span
      aria-hidden="true"
      className="shrink-0 rounded-full"
      style={{ ...dims, background: color, boxShadow: `0 0 6px ${color}` }}
    />
  );
}

export function TopBar() {
  const { openArcade } = useArcade();
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(NAV[0].id);
  const [signalIndex, setSignalIndex] = useState(0);

  // Scroll-spy: the sector whose section sits in the upper-middle band of the
  // viewport is "active" — the Race Control announcer, folded into the nav.
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActiveId(top.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.5, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Rotating status pill beside the badge.
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(
      () => setSignalIndex((n) => (n + 1) % raceControlMessages.length),
      3200,
    );
    return () => clearInterval(id);
  }, [reducedMotion]);

  const signal = raceControlMessages[signalIndex];

  return (
    <div className="sticky top-0 z-40 border-b border-line-strong bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-content items-center gap-3 px-6 md:px-8">
        <span className="shrink-0 rounded-sm bg-ink px-2.5 py-0.5 font-display text-lg font-extrabold tracking-[0.04em] text-bg">
          NVR
        </span>

        <span className="hidden items-center gap-1.5 rounded-full border border-line-strong px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted md:inline-flex">
          <FlagDot flag={signal.flag} size={7} />
          <span key={signalIndex} className="race-fade">
            {signal.text}
          </span>
        </span>

        <nav
          aria-label="Main navigation"
          className="ml-auto hidden items-center gap-1 lg:flex"
        >
          {NAV.map((item) => {
            const active = item.id === activeId;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active ? "true" : undefined}
                // Inline borderColor: a base `* { border-color }` rule overrides
                // Tailwind's border-* utilities, so set it directly here.
                style={{
                  borderColor: active
                    ? "color-mix(in oklab, var(--color-accent) 45%, transparent)"
                    : "transparent",
                }}
                className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active
                    ? "bg-accent/10 text-ink"
                    : "text-muted hover:bg-panel/60 hover:text-ink"
                }`}
              >
                <span
                  className={`text-[9px] font-bold tracking-[0.08em] ${
                    active ? "text-accent" : "text-muted-2"
                  }`}
                >
                  {item.sector}
                </span>
                {item.label}
                {active && <FlagDot flag={item.flag} size={8} />}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={openArcade}
          className="ml-auto shrink-0 cursor-pointer rounded-sm bg-accent px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-on-accent transition-colors hover:brightness-110 lg:ml-0"
        >
          ▸ Pit Arcade
        </button>
      </div>
    </div>
  );
}
