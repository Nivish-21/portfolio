"use client";

import { useCallback, useEffect, useState } from "react";
import { useArcade } from "@/context/ArcadeContext";
import { ApexRush } from "./ApexRush";
import { ReactionTest } from "./ReactionTest";

type View = "menu" | "race" | "lights";

function readRecord(key: string, unit: string, label: string): string {
  const v = Number(localStorage.getItem(key));
  return v > 0 ? `${label} ${v} ${unit}` : `NO ${label} YET`;
}

export function PitArcade() {
  const { open, closeArcade } = useArcade();
  const [view, setView] = useState<View>("menu");

  // Reset to the garage menu whenever the arcade is dismissed, so it reopens fresh.
  const handleClose = useCallback(() => {
    setView("menu");
    closeArcade();
  }, [closeArcade]);

  // Lock body scroll while open; Escape dismisses. No React state is set in the effect body —
  // the only setState happens inside the keydown handler (an event callback), which is allowed.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, handleClose]);

  if (!open) return null;

  // The arcade only ever renders client-side (closed during SSR), so reading localStorage here
  // is safe and keeps the record strips current each time we return to the menu.
  const raceRec = readRecord("nvr-race-best", "M", "TRACK RECORD");
  const loRec = readRecord("nvr-lightsout-best", "MS", "LAP RECORD");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pit arcade games"
      className="fixed inset-0 z-[250] flex flex-col bg-bg/[0.97] backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-line-strong px-6 py-3.5 md:px-8">
        <span className="font-display text-base font-bold uppercase italic tracking-[0.08em]">
          Pit <span className="text-accent">Arcade</span>
        </span>
        <button
          type="button"
          onClick={handleClose}
          className="cursor-pointer border border-line-strong px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-accent hover:text-ink"
        >
          Esc · Close
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-4">
        {view === "menu" && (
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => setView("race")}
              className="w-[min(300px,80vw)] border border-line-strong bg-panel p-6 text-left transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-accent"
            >
              <b className="mb-1.5 block font-display text-lg font-bold uppercase italic">
                Apex <span className="text-accent">Rush</span>
              </b>
              <span className="block font-mono text-[11px] leading-relaxed text-muted">
                60-second time attack. Steer through traffic, stay on track, stack distance. Arrows /
                A-D or touch left-right.
              </span>
              <span className="mt-2.5 block font-mono text-[10px] tracking-[0.1em] text-purple">
                {raceRec}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setView("lights")}
              className="w-[min(300px,80vw)] border border-line-strong bg-panel p-6 text-left transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-accent"
            >
              <b className="mb-1.5 block font-display text-lg font-bold uppercase italic">
                Lights <span className="text-accent">Out</span>
              </b>
              <span className="block font-mono text-[11px] leading-relaxed text-muted">
                The F1 start ritual. Five lights, random hold, GO on lights out. Tap or space. F1
                driver ≈ 200ms.
              </span>
              <span className="mt-2.5 block font-mono text-[10px] tracking-[0.1em] text-purple">
                {loRec}
              </span>
            </button>
          </div>
        )}

        {view === "race" && <ApexRush onBack={() => setView("menu")} />}
        {view === "lights" && <ReactionTest onBack={() => setView("menu")} />}
      </div>
    </div>
  );
}
