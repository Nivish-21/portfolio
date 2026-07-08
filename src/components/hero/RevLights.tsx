"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SEGMENTS = 18; // 18 blocks ≈ the 18,000-rpm V8 redline (~1k rpm each)
const GREEN_END = 8; // blocks 1–8 green
const RED_END = 14; // blocks 9–14 red; 15–18 electric-blue "shift" zone

// ─── Tunable feel — safe to tweak live ──────────────────────────────────────
const IDLE_CENTRE = 2.4; // idle rests here, in blocks (2.5 ≈ 2,500 rpm)
const IDLE_AMP = 0.035; // ± travel in blocks (0.2 → the 2,300–2,700 rpm band)
const IDLE_SPEED = 60; // idle vibration speed — higher = faster flicker
const FLASH_SPEED = 42; // redline shift-light strobe speed (blue↔white)
// ────────────────────────────────────────────────────────────────────────────

type Tone = "g" | "r" | "s";

function segmentTone(i: number): Tone {
  if (i < GREEN_END) return "g";
  if (i < RED_END) return "r";
  return "s";
}

const TONE_VAR: Record<Tone, string> = {
  g: "var(--color-green)",
  r: "var(--color-red)",
  s: "var(--color-shift)",
};

const SHIFT_FLASH = "#eaf6ff"; // near-white "shift now" flash colour

/**
 * Aesthetic F1 shift-light strip in the hero. Idles with a fast rev flicker in
 * the idle band; hovering fills precisely up to the cursor, and the electric-
 * blue redline zone strobes blue↔white like a real shift light. Decorative.
 */
export function RevLights() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [now, setNow] = useState(0);
  const [hoverLevel, setHoverLevel] = useState<number | null>(null);

  // Single rAF clock; everything below is derived from `now` at render time.
  // Paused while the hero is off-screen. (No rAF at all under reduced motion.)
  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    let running = false;
    const tick = () => {
      setNow(performance.now());
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [reducedMotion]);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    setHoverLevel(ratio * SEGMENTS);
  };

  const t = now / 1000;
  // Two summed sines → a fast, organic idle flicker (not a robotic single sine).
  const osc =
    0.6 * Math.sin(t * IDLE_SPEED) +
    0.4 * Math.sin(t * IDLE_SPEED * 1.65 + 1.3);
  const idleLevel = reducedMotion ? IDLE_CENTRE : IDLE_CENTRE + osc * IDLE_AMP;
  const shown = hoverLevel ?? idleLevel;
  const litFull = Math.floor(shown);
  const frac = shown - litFull;
  const flashOn = !reducedMotion && Math.sin(t * FLASH_SPEED) > 0;

  return (
    <div
      ref={containerRef}
      className="flex h-3 cursor-pointer gap-1"
      aria-hidden="true"
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverLevel(null)}
    >
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const tone = segmentTone(i);
        // Fill by width, like a real rev bar: full below the level, a partial
        // slice on the block the level sits in.
        const fill = i < litFull ? 1 : i === litFull ? frac : 0;
        const flashing = tone === "s" && fill > 0 && flashOn;
        return (
          <div
            key={i}
            className="relative h-full flex-1 overflow-hidden rounded-[1px]"
            style={{
              backgroundColor: `color-mix(in oklab, ${TONE_VAR[tone]} 15%, transparent)`,
            }}
          >
            <span
              className="absolute inset-y-0 left-0 rounded-[1px]"
              style={{
                width: `${fill * 100}%`,
                backgroundColor: flashing ? SHIFT_FLASH : TONE_VAR[tone],
                boxShadow:
                  fill > 0
                    ? flashing
                      ? `0 0 8px ${SHIFT_FLASH}`
                      : `0 0 5px color-mix(in oklab, ${TONE_VAR[tone]} 55%, transparent)`
                    : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
