"use client";

import { useEffect, useRef, useState } from "react";
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

/** Rev-light strip that doubles as the page scroll-progress indicator. */
export function RevLights() {
  const [lit, setLit] = useState(0);
  const reducedMotion = useReducedMotion();
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setLit(SEGMENTS);
      return;
    }

    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setLit(Math.round(Math.min(1, Math.max(0, progress)) * SEGMENTS));
      frameRef.current = null;
    };

    const onScroll = () => {
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [reducedMotion]);

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
