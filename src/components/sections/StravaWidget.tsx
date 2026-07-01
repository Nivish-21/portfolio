"use client";

import { useEffect, useState } from "react";

interface TelemetryRun {
  name: string;
  distanceKm: number;
  paceMinKm: string;
  durationMin: string;
  avgHeartRate: number;
  avgCadence: number;
  zones: { z2: number; z3: number; z4: number };
  date: string;
  source: "live" | "mock";
}

export function StravaWidget() {
  const [data, setData] = useState<TelemetryRun | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/strava")
      .then((res) => res.json())
      .then((d) => {
        if (active) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load run telemetry:", err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-bg border border-line-strong p-5 font-mono text-xs text-muted flex items-center justify-center gap-3 h-44">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
        fetching active workout telemetry...
      </div>
    );
  }

  if (!data) return null;

  const isLive = data.source === "live";

  return (
    <div className="bg-panel border border-line-strong p-5 relative overflow-hidden">
      {/* Grid Pattern BG */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--color-ink) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-strong pb-3">
          <div>
            <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-accent">
              Workout Diagnostic Logs
            </span>
            <h4 className="font-display font-bold text-sm uppercase tracking-[0.04em] text-ink mt-0.5">
              {data.name}
            </h4>
          </div>
          <span
            className={`font-mono text-[9px] tracking-[0.12em] px-2 py-0.5 rounded-sm uppercase ${
              isLive ? "bg-green text-on-accent font-bold" : "bg-line-strong text-muted"
            }`}
          >
            {isLive ? "[ Comms: Strava Sync ]" : "[ Cached telemetry ]"}
          </span>
        </div>

        {/* Diagnostic HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {/* Distance */}
          <div className="bg-bg border border-line-strong/60 p-3">
            <span className="font-mono text-[9px] tracking-[0.1em] text-muted block mb-1">
              DISTANCE
            </span>
            <span className="font-display font-bold text-xl text-ink tabular-nums">
              {data.distanceKm.toFixed(2)}{" "}
              <small className="text-[10px] font-normal text-muted">KM</small>
            </span>
          </div>

          {/* Pace */}
          <div className="bg-bg border border-line-strong/60 p-3">
            <span className="font-mono text-[9px] tracking-[0.1em] text-muted block mb-1">
              PACE
            </span>
            <span className="font-display font-bold text-xl text-ink tabular-nums">
              {data.paceMinKm}{" "}
              <small className="text-[10px] font-normal text-muted">/KM</small>
            </span>
          </div>

          {/* Duration */}
          <div className="bg-bg border border-line-strong/60 p-3 col-span-2 sm:col-span-1">
            <span className="font-mono text-[9px] tracking-[0.1em] text-muted block mb-1">
              TIME
            </span>
            <span className="font-display font-bold text-xl text-ink tabular-nums">
              {data.durationMin}
            </span>
          </div>

          {/* Heart Rate */}
          <div className="bg-bg border border-line-strong/60 p-3">
            <span className="font-mono text-[9px] tracking-[0.1em] text-muted block mb-1">
              HEART RATE
            </span>
            <span className="font-display font-bold text-xl text-ink tabular-nums flex items-baseline gap-1">
              {data.avgHeartRate}{" "}
              <small className="text-[10px] font-normal text-muted">BPM</small>
              {data.avgHeartRate >= 155 && (
                <span className="h-1.5 w-1.5 rounded-full bg-red shrink-0 inline-block align-middle ml-1" title="Threshold Zone" />
              )}
            </span>
          </div>

          {/* Cadence */}
          <div className="bg-bg border border-line-strong/60 p-3">
            <span className="font-mono text-[9px] tracking-[0.1em] text-muted block mb-1">
              CADENCE
            </span>
            <span className="font-display font-bold text-xl text-ink tabular-nums">
              {data.avgCadence}{" "}
              <small className="text-[10px] font-normal text-muted">SPM</small>
            </span>
          </div>
        </div>

        {/* HR Zone Distribution Telemetry */}
        <div className="bg-bg border border-line-strong/60 p-4">
          <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-2.5">
            Heart Rate Intensity Zone Profile
          </span>

          {/* Multi-segment Progress Bar */}
          <div className="flex h-3 rounded-[1px] overflow-hidden bg-line-strong/40 mb-3 select-none">
            {/* Zone 2 */}
            <div
              style={{ width: `${data.zones.z2}%` }}
              className="bg-green transition-all"
              title={`Zone 2 (Aerobic): ${data.zones.z2}%`}
            />
            {/* Zone 3 */}
            <div
              style={{ width: `${data.zones.z3}%` }}
              className="bg-yellow transition-all"
              title={`Zone 3 (Tempo): ${data.zones.z3}%`}
            />
            {/* Zone 4 */}
            <div
              style={{ width: `${data.zones.z4}%` }}
              className="bg-purple transition-all"
              title={`Zone 4 (Threshold): ${data.zones.z4}%`}
            />
          </div>

          {/* Zone Legend labels */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] text-muted">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-green" />
              <span>Zone 2: {data.zones.z2}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-yellow" />
              <span>Zone 3: {data.zones.z3}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-purple" />
              <span>Zone 4: {data.zones.z4}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
