"use client";

import { useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
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

const TONE_GLOW: Record<"g" | "y" | "r", string> = {
  g: "0 0 8px 1px var(--color-green)",
  y: "0 0 8px 1px var(--color-yellow)",
  r: "0 0 10px 2px var(--color-red)",
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

/** Rev-light strip that doubles as the page scroll-progress indicator; hovering lights it up to the cursor's position, like an F1 shift light. */
export function RevLights() {
  const scrollLit = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.min(SEGMENTS - 1, Math.max(0, Math.floor(ratio * SEGMENTS)));
    setHoverIndex(index);
  };

  const hovering = hoverIndex !== null && !reducedMotion;
  const lit = reducedMotion ? SEGMENTS : hovering ? hoverIndex + 1 : scrollLit;
  const atRedline = hovering && hoverIndex === SEGMENTS - 1;

  return (
    <div
      ref={containerRef}
      className={`flex gap-1 h-3 cursor-pointer ${atRedline ? "animate-pulse" : ""}`}
      role="progressbar"
      aria-label="Scroll progress"
      aria-valuenow={Math.round((lit / SEGMENTS) * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIndex(null)}
    >
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const tone = segmentTone(i);
        const isLit = i < lit;
        const isActive = hovering && i === hoverIndex;
        return (
          <span
            key={i}
            className={`flex-1 rounded-[1px] transition-[opacity,transform] duration-150 ${TONE_CLASS[tone]} ${
              isActive ? "scale-y-125" : ""
            }`}
            style={{
              opacity: isLit ? 1 : 0.3,
              boxShadow: isActive ? TONE_GLOW[tone] : "none",
            }}
          />
        );
      })}
    </div>
  );
}
