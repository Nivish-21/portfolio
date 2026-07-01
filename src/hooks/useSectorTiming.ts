"use client";

import { useEffect, useRef } from "react";
import { useSectorTimingContext } from "@/context/SectorTimingContext";

export type SectorStatus = "pending" | "yellow" | "green" | "purple";

const IDLE_TIMEOUT_MS = 8000;
const ACTIVE_THRESHOLD = 0.5;
const YELLOW_BAND = 0.6;
const PURPLE_LOW = 0.85;
const PURPLE_HIGH = 1.25;

function grade(dwellMs: number, targetMs: number): SectorStatus {
  if (dwellMs <= 0) return "pending";
  const ratio = dwellMs / targetMs;
  if (ratio < YELLOW_BAND) return "yellow";
  if (ratio >= PURPLE_LOW && ratio <= PURPLE_HIGH) return "purple";
  return "green";
}

/**
 * Times how long a visitor actively dwells on a section and updates the global
 * SectorTimingContext. Pauses on tab-hidden and on idle so away-time never
 * inflates the reading credit. Throttles context updates to maintain performance.
 */
export function useSectorTiming(
  id: string,
  label: string,
  title: string,
  targetSeconds: number
) {
  const { registerSector, updateSectorTime, sectors } = useSectorTimingContext();
  const ref = useRef<HTMLElement | null>(null);

  // Read status from context
  const sectorData = sectors[id];
  const status = sectorData ? sectorData.status : "pending";

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const dwellMsRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);
  const isIdleRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastContextUpdateRef = useRef(0);

  // Register on mount
  useEffect(() => {
    registerSector(id, label, title, targetSeconds);
  }, [id, label, title, targetSeconds, registerSector]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targetMs = targetSeconds * 1000;
    let frameId: number;

    const resetIdleTimer = () => {
      isIdleRef.current = false;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        isIdleRef.current = true;
      }, IDLE_TIMEOUT_MS);
    };

    const tick = (now: number) => {
      const running =
        isActiveRef.current && !isIdleRef.current && document.visibilityState === "visible";
      const nowMs = performance.now();

      if (running) {
        if (lastTickRef.current !== null) {
          dwellMsRef.current += now - lastTickRef.current;
          const nextStatus = grade(dwellMsRef.current, targetMs);

          const statusChanged = nextStatus !== statusRef.current;
          const shouldThrottleUpdate = nowMs - lastContextUpdateRef.current > 250;

          if (statusChanged || shouldThrottleUpdate) {
            updateSectorTime(id, dwellMsRef.current, nextStatus);
            lastContextUpdateRef.current = nowMs;
          }
        }
        lastTickRef.current = now;
      } else {
        if (lastTickRef.current !== null) {
          const nextStatus = grade(dwellMsRef.current, targetMs);
          updateSectorTime(id, dwellMsRef.current, nextStatus);
          lastContextUpdateRef.current = nowMs;
        }
        lastTickRef.current = null;
      }

      frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActiveRef.current = entry.isIntersecting;
      },
      { threshold: ACTIVE_THRESHOLD }
    );
    observer.observe(el);

    const activityEvents: Array<keyof WindowEventMap> = ["scroll", "mousemove", "keydown"];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetIdleTimer, { passive: true }));
    resetIdleTimer();

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [id, targetSeconds, updateSectorTime]);

  return { ref, status };
}
