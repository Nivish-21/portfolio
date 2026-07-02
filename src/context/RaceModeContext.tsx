"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

export type LapTone = "mark" | "gain" | "best" | "off";
export type RaceTarget = "start" | "cp1" | "cp2" | "finish";

export interface LapResult {
  lapMs: number;
  splits: [number, number, number]; // S1, S2, S3 in ms
  tone: LapTone;
  isNewPersonalBest: boolean;
}

interface RaceModeContextType {
  active: boolean;
  toggle: () => void;
  nextTarget: RaceTarget;
  splitTimes: number[]; // running splits for the in-progress lap
  onMarkerHit: (marker: "start" | "cp1" | "cp2") => void;
  lastResult: LapResult | null;
  personalBestMs: number | null;
  lapStartedAt: number | null;
  clearFinishCooldown: () => void;
}

const RaceModeContext = createContext<RaceModeContextType | undefined>(undefined);
const PB_KEY = "race-personal-best-ms";
const OFF_PACE_RATIO = 1.08;
const OFF_PACE_FLOOR_MS = 500;

export function RaceModeProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [nextTarget, setNextTarget] = useState<RaceTarget>("start");
  const [splitTimes, setSplitTimes] = useState<number[]>([]);
  const [lastResult, setLastResult] = useState<LapResult | null>(null);
  const [lapStartedAt, setLapStartedAt] = useState<number | null>(null);
  const [personalBestMs, setPersonalBestMs] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(PB_KEY);
    return raw ? Number(raw) : null;
  });
  const lapStartRef = useRef<number | null>(null);
  const splitMarksRef = useRef<number[]>([]);
  const justFinishedRef = useRef(false);

  const toggle = useCallback(() => {
    setActive((prev) => !prev);
    setNextTarget("start");
    setSplitTimes([]);
    setLastResult(null);
    setLapStartedAt(null);
    lapStartRef.current = null;
    splitMarksRef.current = [];
    justFinishedRef.current = false;
  }, []);

  const clearFinishCooldown = useCallback(() => {
    justFinishedRef.current = false;
  }, []);

  const onMarkerHit = useCallback(
    (marker: "start" | "cp1" | "cp2") => {
      const now = performance.now();

      // Lap Start (only if we're waiting for start AND not in finish cooldown)
      if (marker === "start" && nextTarget === "start" && lapStartRef.current === null && !justFinishedRef.current) {
        lapStartRef.current = now;
        setLapStartedAt(now);
        splitMarksRef.current = [now];
        setLastResult(null);
        setSplitTimes([]);
        setNextTarget("cp1");
        return;
      }

      // CP1 Hit
      if (marker === "cp1" && nextTarget === "cp1" && lapStartRef.current !== null) {
        splitMarksRef.current.push(now);
        setSplitTimes([now - lapStartRef.current]);
        setNextTarget("cp2");
        return;
      }

      // CP2 Hit
      if (marker === "cp2" && nextTarget === "cp2" && lapStartRef.current !== null) {
        splitMarksRef.current.push(now);
        const s1 = splitMarksRef.current[1] - lapStartRef.current;
        const s2 = now - splitMarksRef.current[1];
        setSplitTimes([s1, s2]);
        setNextTarget("finish");
        return;
      }

      // Finish/Lap End
      if (marker === "start" && nextTarget === "finish" && lapStartRef.current !== null) {
        const start = lapStartRef.current;
        const cp1Time = splitMarksRef.current[1];
        const cp2Time = splitMarksRef.current[2];
        const lapMs = now - start;
        const s1 = cp1Time - start;
        const s2 = cp2Time - cp1Time;
        const s3 = now - cp2Time;

        let tone: LapTone;
        const isNewPB = personalBestMs === null || lapMs < personalBestMs;
        if (personalBestMs === null) {
          tone = "mark";
        } else if (isNewPB) {
          tone = "gain"; // may be upgraded to "best" in Toast if it's #1 globally
        } else if (lapMs <= personalBestMs * OFF_PACE_RATIO + OFF_PACE_FLOOR_MS) {
          tone = "mark";
        } else {
          tone = "off";
        }

        if (isNewPB) {
          window.localStorage.setItem(PB_KEY, String(lapMs));
          setPersonalBestMs(lapMs);
        }

        setLastResult({ lapMs, splits: [s1, s2, s3], tone, isNewPersonalBest: isNewPB });
        setNextTarget("start");
        setLapStartedAt(null);
        justFinishedRef.current = true;
        lapStartRef.current = null;
        splitMarksRef.current = [];
      }
    },
    [nextTarget, personalBestMs]
  );

  return (
    <RaceModeContext.Provider
      value={{ active, toggle, nextTarget, splitTimes, onMarkerHit, lastResult, personalBestMs, lapStartedAt, clearFinishCooldown }}
    >
      {children}
    </RaceModeContext.Provider>
  );
}

export function useRaceModeContext() {
  const context = useContext(RaceModeContext);
  if (!context) {
    throw new Error("useRaceModeContext must be used within a RaceModeProvider");
  }
  return context;
}
