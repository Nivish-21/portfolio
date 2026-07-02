"use client";

import { useRaceModeContext } from "@/context/RaceModeContext";

interface HudPanelProps {
  lapMs: number;
  currentZone: string;
}

export function HudPanel({ lapMs, currentZone }: HudPanelProps) {
  const { nextTarget, personalBestMs } = useRaceModeContext();

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${Math.floor(millis / 10)
      .toString()
      .padStart(2, "0")}`;
  };

  const targetLabel = {
    start: "START / FINISH",
    cp1: "CP1 // S1",
    cp2: "CP2 // S2",
    finish: "FINISH // S3",
  }[nextTarget] || nextTarget;

  return (
    <div className="pointer-events-none fixed top-[180px] right-4 z-50 flex flex-col gap-3">
      {/* Lap Timer */}
      <div className="bg-panel/90 border border-line-strong px-3 py-2 font-mono text-[11px] text-accent uppercase tracking-[0.08em]">
        <div className="text-muted-2 text-[9px] mb-0.5">LAPTIME</div>
        <div className="text-base">{formatTime(lapMs)}</div>
      </div>

      {/* Next Target */}
      <div className="bg-panel/90 border border-line-strong px-3 py-2 font-mono text-[10px] text-ink uppercase tracking-[0.08em]">
        <div className="text-muted-2 text-[9px] mb-0.5">NEXT</div>
        <div>{targetLabel}</div>
      </div>

      {/* Current Zone */}
      <div className="bg-panel/90 border border-line-strong px-3 py-2 font-mono text-[9px] text-muted uppercase tracking-[0.06em]">
        {currentZone}
      </div>

      {/* Personal Best */}
      {personalBestMs !== null && (
        <div className="bg-panel/90 border border-line-strong px-3 py-2 font-mono text-[9px] text-yellow uppercase tracking-[0.06em]">
          <div className="text-muted-2 text-[8px] mb-0.5">PB</div>
          <div>{formatTime(personalBestMs)}</div>
        </div>
      )}
    </div>
  );
}
