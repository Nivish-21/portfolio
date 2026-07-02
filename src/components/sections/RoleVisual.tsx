import type { RoleVisualKind } from "@/lib/content";

/** F1-themed line-art visuals for each role card — hand-drawn SVG matching the site's existing
 * illustration technique (car sprite, telemetry trace), not photography. Each motif ties to the
 * role's own status tag: ON GRID -> starting grid, LIGHTS OUT -> start signal, PIT WALL -> radio
 * headset (strategy/comms), FORMATION LAP -> steering wheel (hands-on control from lap one). */

function GridVisual() {
  return (
    <svg viewBox="0 0 100 56" className="h-full w-full" aria-hidden="true">
      <line x1="8" y1="48" x2="92" y2="48" stroke="currentColor" strokeWidth="2" />
      {[16, 34, 52, 70].map((x, i) => (
        <g key={x}>
          <rect x={x} y={i % 2 === 0 ? 22 : 30} width="10" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        </g>
      ))}
      <line x1="8" y1="12" x2="8" y2="48" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
    </svg>
  );
}

function LightsVisual() {
  return (
    <svg viewBox="0 0 100 56" className="h-full w-full" aria-hidden="true">
      <rect x="10" y="10" width="80" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {[22, 38, 54, 70, 86].map((cx) => (
        <circle key={cx} cx={cx} cy="17" r="4" fill="currentColor" />
      ))}
      <line x1="50" y1="24" x2="50" y2="46" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <path d="M28 46 L50 46 L72 46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function HeadsetVisual() {
  return (
    <svg viewBox="0 0 100 56" className="h-full w-full" aria-hidden="true">
      <path d="M22 32 A28 24 0 0 1 78 32" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="16" y="30" width="10" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="74" y="30" width="10" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M26 42 Q40 52 50 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="44" r="2.5" fill="currentColor" />
    </svg>
  );
}

function WheelVisual() {
  return (
    <svg viewBox="0 0 100 56" className="h-full w-full" aria-hidden="true">
      <circle cx="50" cy="28" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M32 28 A18 18 0 0 1 50 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M68 28 A18 18 0 0 1 50 46" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="44" y="20" width="12" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="32" r="1.6" fill="currentColor" />
      <circle cx="60" cy="32" r="1.6" fill="currentColor" />
    </svg>
  );
}

const VISUALS: Record<RoleVisualKind, () => React.JSX.Element> = {
  grid: GridVisual,
  lights: LightsVisual,
  headset: HeadsetVisual,
  wheel: WheelVisual,
};

export function RoleVisual({ kind, className }: { kind: RoleVisualKind; className?: string }) {
  const Visual = VISUALS[kind];
  return (
    <div className={`h-20 w-full border border-line-strong bg-ink/10 p-3 ${className ?? ""}`}>
      <Visual />
    </div>
  );
}
