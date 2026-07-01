import type { SectorStatus } from "@/hooks/useSectorTiming";

interface SectorMarkerProps {
  label: string;
  status: SectorStatus;
}

const STATUS_STYLES: Record<SectorStatus, { bg: string; text: string; badge: string }> = {
  pending: { bg: "bg-line-strong", text: "text-ink", badge: "—" },
  yellow: { bg: "bg-yellow", text: "text-on-accent", badge: "OFF PACE" },
  green: { bg: "bg-green", text: "text-on-accent", badge: "CLEAN LAP" },
  purple: { bg: "bg-purple", text: "text-white", badge: "PB" },
};

/** Presentational only — status is timed by the enclosing <Section>. */
export function SectorMarker({ label, status }: SectorMarkerProps) {
  const style = STATUS_STYLES[status];

  return (
    <div className="flex items-center gap-3.5">
      <span
        className={`font-display font-extrabold text-[13px] tracking-[0.08em] px-2 py-0.5 rounded-sm uppercase transition-colors duration-300 ${style.bg} ${style.text}`}
      >
        {label}
      </span>
      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">
        {style.badge}
      </span>
    </div>
  );
}
