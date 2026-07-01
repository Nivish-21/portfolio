"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SEGMENTS = 12;
const GREEN_END = 6;
const YELLOW_END = 9;

function segmentTone(index: number): "g" | "y" | "r" {
  if (index < GREEN_END) return "g";
  if (index < YELLOW_END) return "y";
  return "r";
}

const TONE_CLASS: Record<"g" | "y" | "r", string> = {
  g: "bg-green",
  y: "bg-yellow",
  r: "bg-red",
};

function subscribe(callback: () => void) {
  let frame: number | null = null;
  const onChange = () => {
    if (frame === null) {
      frame = requestAnimationFrame(() => {
        frame = null;
        callback();
      });
    }
  };
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange, { passive: true });
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
    if (frame !== null) cancelAnimationFrame(frame);
  };
}

function getSnapshot(): number {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  return Math.round(Math.min(1, Math.max(0, progress)) * SEGMENTS);
}

function getServerSnapshot(): number {
  return 0;
}

/** Rev-light strip that doubles as the page scroll-progress indicator. */
export function RevLights() {
  const scrollLit = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reducedMotion = useReducedMotion();
  const lit = reducedMotion ? SEGMENTS : scrollLit;

  return (
    <div
      className="flex gap-1 h-3"
      role="progressbar"
      aria-label="Scroll progress"
      aria-valuenow={Math.round((lit / SEGMENTS) * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const tone = segmentTone(i);
        const isLit = i < lit;
        return (
          <span
            key={i}
            className={`flex-1 rounded-[1px] transition-opacity duration-150 ${TONE_CLASS[tone]}`}
            style={{ opacity: isLit ? 1 : 0.3 }}
          />
        );
      })}
    </div>
  );
}
