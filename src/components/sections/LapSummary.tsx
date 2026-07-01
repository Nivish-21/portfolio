"use client";

import { useState } from "react";
import { useSectorTimingContext } from "@/context/SectorTimingContext";
import type { SectorStatus } from "@/hooks/useSectorTiming";

const SECTOR_METADATA = [
  { id: "log", label: "S1", title: "The Log", targetSeconds: 14 },
  { id: "work", label: "S2", title: "Featured Work", targetSeconds: 84 },
  { id: "skills", label: "S3", title: "Skills", targetSeconds: 10 },
  { id: "beat", label: "S4", title: "Off the Clock", targetSeconds: 9 },
  { id: "contact", label: "S5", title: "Radio Check", targetSeconds: 6 },
];

const STATUS_CONFIG: Record<SectorStatus, { text: string; bg: string; textStyle: string }> = {
  pending: { text: "PENDING", bg: "bg-line-strong", textStyle: "text-ink/60" },
  yellow: { text: "OFF PACE", bg: "bg-yellow", textStyle: "text-on-accent font-extrabold" },
  green: { text: "CLEAN LAP", bg: "bg-green", textStyle: "text-on-accent font-extrabold" },
  purple: { text: "PB (BEST)", bg: "bg-purple", textStyle: "text-white font-extrabold" },
};

function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatLapTime(totalMs: number): string {
  const minutes = Math.floor(totalMs / 60000);
  const seconds = ((totalMs % 60000) / 1000).toFixed(2);
  return `${String(minutes).padStart(2, "0")}:${seconds.padStart(5, "0")}`;
}

export function LapSummary() {
  const { sectors } = useSectorTimingContext();
  const [copied, setCopied] = useState(false);

  // Compute stats based on static metadata + context overrides
  const computedSectors = SECTOR_METADATA.map((meta) => {
    const active = sectors[meta.id];
    return {
      ...meta,
      dwellMs: active ? active.dwellMs : 0,
      status: active ? active.status : ("pending" as SectorStatus),
    };
  });

  const totalDwellMs = computedSectors.reduce((acc, curr) => acc + curr.dwellMs, 0);

  // Calculate session status
  const statuses = computedSectors.map((s) => s.status);
  let sessionStatus = "IN PROGRESS";
  let sessionColor = "text-muted";

  if (!statuses.includes("pending")) {
    const isMostlyPurple = statuses.filter((s) => s === "purple").length >= 3;
    const hasYellow = statuses.includes("yellow");
    if (isMostlyPurple) {
      sessionStatus = "PURPLE LAP (PB)";
      sessionColor = "text-purple";
    } else if (hasYellow) {
      sessionStatus = "DIRTY LAP (OFF PACE)";
      sessionColor = "text-yellow";
    } else {
      sessionStatus = "CLEAN LAP";
      sessionColor = "text-green";
    }
  }

  const handleCopy = () => {
    const textLog = `🏎️ NVR Portfolio Telemetry Log:
${computedSectors
  .map(
    (s) =>
      `${s.label} (${s.title}): [${STATUS_CONFIG[s.status].text}] ${formatSeconds(s.dwellMs)} / ${s.targetSeconds}.0s`
  )
  .join("\n")}
------------------------------------
Lap Time: ${formatLapTime(totalDwellMs)} | Session: ${sessionStatus}
Check the telemetry at: ${window.location.origin}
`;

    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textLog).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch((err) => {
        console.error("Clipboard API failed, trying fallback", err);
        fallbackCopy(textLog);
      });
    } else {
      fallbackCopy(textLog);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Fallback: Unable to copy", err);
    }
    document.body.removeChild(textarea);
  };

  return (
    <section className="mx-auto w-full max-w-content px-6 md:px-8 mt-4">
      <div className="bg-panel border border-line-strong p-6 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(var(--color-ink) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line-strong pb-4 mb-5">
            <div>
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-accent">
                Session Diagnostics
              </span>
              <h2 className="font-display font-extrabold uppercase text-xl md:text-2xl tracking-[0.02em] mt-0.5">
                Lap Telemetry // Active Timing Sheet
              </h2>
            </div>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-line-strong hover:bg-accent hover:text-on-accent text-xs font-mono tracking-[0.08em] uppercase rounded-sm transition-colors cursor-pointer"
            >
              {copied ? "Log Synced ✓" : "Sync Telemetry Log"}
            </button>
          </div>

          {/* Timing Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-line-strong text-muted uppercase tracking-[0.08em]">
                  <th className="pb-3 w-16">Sector</th>
                  <th className="pb-3">Segment Name</th>
                  <th className="pb-3 text-right hidden sm:table-cell">Target</th>
                  <th className="pb-3 text-right">Active Dwell</th>
                  <th className="pb-3 text-right hidden md:table-cell">Delta</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {computedSectors.map((s) => {
                  const targetMs = s.targetSeconds * 1000;
                  const deltaMs = s.dwellMs - targetMs;
                  const config = STATUS_CONFIG[s.status];

                  return (
                    <tr key={s.id} className="hover:bg-bg/20 transition-colors">
                      <td className="py-3">
                        <span className="bg-bg border border-line-strong text-[11px] font-bold px-2 py-0.5 rounded-sm">
                          {s.label}
                        </span>
                      </td>
                      <td className="py-3 font-semibold uppercase text-ink">{s.title}</td>
                      <td className="py-3 text-right text-muted hidden sm:table-cell">
                        {s.targetSeconds.toFixed(1)}s
                      </td>
                      <td className="py-3 text-right text-ink tabular-nums">
                        {formatSeconds(s.dwellMs)}
                      </td>
                      <td className="py-3 text-right tabular-nums hidden md:table-cell">
                        {s.dwellMs === 0 ? (
                          <span className="text-muted">—</span>
                        ) : deltaMs <= 0 ? (
                          <span className="text-green">{(deltaMs / 1000).toFixed(1)}s</span>
                        ) : (
                          <span className="text-red">+{(deltaMs / 1000).toFixed(1)}s</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block text-[9px] tracking-[0.1em] px-2 py-0.5 rounded-sm uppercase ${config.bg} ${config.textStyle}`}
                        >
                          {config.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer stats summary */}
          <div className="mt-6 pt-5 border-t border-line-strong flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap items-baseline gap-6">
              <div>
                <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-0.5">
                  LAP TIME (TOTAL DWELL)
                </span>
                <span className="font-display font-bold text-2xl md:text-3xl text-ink tracking-[0.02em] tabular-nums">
                  {formatLapTime(totalDwellMs)}
                </span>
              </div>
              <div>
                <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-0.5">
                  SESSION GRADE
                </span>
                <span className={`font-display font-bold text-2xl md:text-3xl uppercase tracking-[0.02em] ${sessionColor}`}>
                  {sessionStatus}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-muted max-w-[40ch] font-mono leading-relaxed hidden lg:block">
              * Dwell timing uses IntersectionObserver to register layout sector entry. 
              AFK and idle time (8s timeout) are excluded from the telemetry log automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
