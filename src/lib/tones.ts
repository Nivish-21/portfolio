export type ResultTone = "mark" | "gain" | "best" | "off";

export const TONE_TEXT: Record<ResultTone, string> = {
  mark: "text-yellow",
  gain: "text-green",
  best: "text-purple",
  off: "text-red",
};

export const TONE_LABEL: Record<ResultTone, string> = {
  mark: "MARK",
  gain: "GAIN",
  best: "BEST",
  off: "OFF PACE",
};

/** Text-shadow glow — reserved for the "best" tone only, so it marks the standout, not every tag. */
export const TONE_GLOW: Partial<Record<ResultTone, string>> = {
  best: "0 0 12px color-mix(in oklab, var(--color-purple) 70%, transparent)",
};
