import { Lettering } from "./Lettering";

/**
 * Comic lettering, in the detective register.
 *
 * A racing panel shouts. A detective panel breathes: rain on the window,
 * footsteps coming up behind you, then the moment it clicks. Three sounds, each
 * doing a job — ambient, on hover, on solve. Nothing fires on load except the
 * rain, and nothing fires everywhere.
 *
 * Decorative by definition, so it is hidden from assistive tech.
 */
export type SfxKind = "rain" | "step" | "solve";

const WORD: Record<SfxKind, string> = {
  rain: "Shhhhhh…",
  step: "Tap… tap…",
  solve: "Gotcha!",
};

const STYLE: Record<SfxKind, string> = {
  // Runs DOWN the edge of the cover, the way rain is lettered into a panel
  // border. Vertical writing-mode, not a rotate: a rotate keeps the layout box
  // horizontal and throws the glyphs off the canvas.
  // `text-orientation: upright` keeps each letter the right way up as the word
  // runs down the page. Without it the glyphs rotate onto their sides and read
  // as debris rather than lettering.
  rain: "absolute right-[2.5%] top-10 hidden text-[clamp(1.1rem,2vw,1.6rem)] leading-none tracking-[0.32em] text-transparent [-webkit-text-stroke:1.1px_rgba(228,223,210,0.26)] [text-orientation:upright] [writing-mode:vertical-rl] lg:block",
  // Footsteps approaching the file you are about to open.
  step: "absolute bottom-2.5 right-4 text-2xl text-transparent [-webkit-text-stroke:1.5px_rgba(232,180,92,0.75)] opacity-0 translate-x-3 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:opacity-100 group-hover:translate-x-0 group-open:!opacity-0",
  // The reveal. Slams in once, when the case is opened.
  solve:
    "absolute -top-3.5 right-5 text-[clamp(1.9rem,4.4vw,3.25rem)] text-void [-webkit-text-stroke:2.5px_var(--color-thread)] [text-shadow:4px_4px_0_rgba(232,180,92,0.9)] motion-safe:animate-[sfx-slam_0.5s_cubic-bezier(0.2,1.5,0.35,1)_forwards] motion-reduce:opacity-100",
};

export function Sfx({ kind }: { kind: SfxKind }) {
  return (
    <Lettering
      aria-hidden="true"
      className={`pointer-events-none select-none uppercase ${STYLE[kind]}`}
    >
      {WORD[kind]}
    </Lettering>
  );
}
