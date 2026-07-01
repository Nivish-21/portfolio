"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PATH_D =
  "M0,200 L120,200 L150,120 L210,120 L240,60 L360,60 L390,150 L520,150 L560,40 L680,40 L720,170 L840,170 L880,90 L1000,90";

/** Self-drawing GPS/telemetry trace behind the hero headline. */
export function TelemetryTrace() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path || reducedMotion) return;

    let cancelled = false;

    (async () => {
      const gsap = (await import("gsap")).default;
      if (cancelled) return;

      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.6,
        delay: 0.3,
        ease: "power2.out",
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-24 h-[260px] w-full opacity-50"
      viewBox="0 0 1000 260"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={PATH_D}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2}
        strokeOpacity={0.6}
      />
    </svg>
  );
}
