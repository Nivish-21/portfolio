import { evidenceBoard } from "@/lib/content";
import { Tab } from "@/components/case/Tab";

/**
 * The skills, as a corkboard.
 *
 * Each tool is pinned to the case it actually cracked. It does NOT claim a
 * frequency ("daily", "often") — that is unfalsifiable, and for most of these it
 * would also be untrue. "OSRM — the fare that lied" is a claim someone can go
 * and check, which is the only kind worth making.
 *
 * The red thread is a real line running behind the pins, not a texture.
 */
export function EvidenceBoard() {
  return (
    <section aria-labelledby="board-heading">
      <Tab id="board-heading">The evidence board</Tab>

      <p className="mb-3 mt-6 text-[13px] text-ash">
        Every tool is pinned to the case it cracked. Hover one.
      </p>

      <div className="relative flex flex-wrap items-start gap-3.5 border border-file/[0.16] px-6 py-8">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
        >
          <polyline
            points="6,9 24,26 42,10 61,27 79,11 94,25"
            fill="none"
            stroke="var(--color-thread)"
            strokeOpacity="0.5"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points="9,27 30,11 52,28 73,9 92,27"
            fill="none"
            stroke="var(--color-thread)"
            strokeOpacity="0.3"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {evidenceBoard.map((pin) => (
          <span
            key={pin.tool}
            className={`group relative z-10 flex flex-col gap-0.5 px-3.5 py-2.5 font-mono text-[12.5px] text-void shadow-[0_10px_18px_-10px_#000] transition-transform duration-200 ease-[var(--ease-out-expo)] odd:-rotate-1 even:rotate-1 hover:rotate-0 hover:-translate-y-0.5 ${
              pin.primary ? "bg-lamp font-bold" : "bg-file"
            }`}
          >
            {/* the pin holding it to the board */}
            <span
              aria-hidden="true"
              className="absolute -top-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-thread shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            />
            {pin.tool}
            <em className="max-h-0 overflow-hidden text-[10px] not-italic tracking-normal text-[#7d7566] opacity-0 transition-[max-height,opacity] duration-300 group-hover:max-h-5 group-hover:opacity-100">
              {pin.usedOn}
            </em>
          </span>
        ))}
      </div>
    </section>
  );
}
