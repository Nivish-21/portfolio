import { Lettering } from "./Lettering";

/**
 * A case you are not allowed to read.
 *
 * This is not a decorative flourish: CaboCab is a client system and the agent
 * system is a stealth company, so there is genuinely no repository to link. The
 * seal says so plainly rather than quietly omitting the link and hoping nobody
 * notices which cases have one.
 */
export function Seal({ note }: { note: string }) {
  return (
    <p className="mt-4 inline-flex items-center gap-2.5 border border-thread-text/45 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ash">
      <Lettering
        aria-hidden="true"
        className="grid size-5 shrink-0 place-items-center overflow-hidden rounded-full bg-thread text-[8px] leading-none text-void"
      >
        Sealed
      </Lettering>
      {note}
    </p>
  );
}
