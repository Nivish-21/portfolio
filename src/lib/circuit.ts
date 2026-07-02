export type ZoneType = "normal" | "corner" | "drs";

export interface CircuitPoint {
  xPct: number; // 0-100, percentage of page width
  yPct: number; // 0-100, percentage of total page height (document height, not viewport)
  zone: ZoneType;
  checkpoint?: "start" | "cp1" | "cp2";
}

// A paperclip/oval circuit: start/finish straight at the top, outbound lane down the
// right side (this leg is the DRS straight), a hairpin near the bottom, return lane back
// up the left side, closing the loop at start/finish. Treat these exact percentages as a
// first draft — screenshot the rendered result and adjust until it visibly reads as a
// closed circuit with real corners, not a wandering line.
export const CIRCUIT: CircuitPoint[] = [
  { xPct: 55, yPct: 2, zone: "normal", checkpoint: "start" },
  { xPct: 75, yPct: 6, zone: "corner" },
  { xPct: 85, yPct: 14, zone: "drs" },
  { xPct: 82, yPct: 28, zone: "drs" }, // DRS straight runs down the right side through Hero/FeaturedWork
  { xPct: 78, yPct: 40, zone: "corner", checkpoint: "cp1" }, // near FeaturedWork
  { xPct: 60, yPct: 50, zone: "corner" },
  { xPct: 40, yPct: 58, zone: "corner" }, // hairpin — tight turn from right side to left side
  { xPct: 25, yPct: 68, zone: "normal", checkpoint: "cp2" }, // near Skills, left side
  { xPct: 20, yPct: 80, zone: "corner" },
  { xPct: 22, yPct: 60, zone: "normal" }, // return lane starts heading back up, left side
  { xPct: 25, yPct: 40, zone: "normal" },
  { xPct: 30, yPct: 20, zone: "corner" },
  { xPct: 40, yPct: 8, zone: "corner" },
  { xPct: 55, yPct: 2, zone: "normal" }, // closes the loop back at start/finish
];

export const ZONE_SPEED_MULTIPLIER: Record<ZoneType, number> = {
  normal: 1,
  corner: 0.55,
  drs: 1.7,
};

export const OFF_TRACK_PX = 90;
export const OFF_TRACK_MULTIPLIER = 0.5;
export const CHECKPOINT_RADIUS_PX = 70;

export function distToSegment(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  const l2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * (b.x - a.x)), p.y - (a.y + t * (b.y - a.y)));
}
