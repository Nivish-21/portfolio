import { builds } from "@/lib/content";
import { Lettering } from "@/components/case/Lettering";
import { Tab } from "@/components/case/Tab";

/**
 * Against the clock.
 *
 * The hackathon builds, deliberately NOT dressed as cases. A case is a mystery
 * uncovered — shut on arrival, opened by the reader. A hackathon build has no
 * mystery and nothing to withhold, so these are the opposite: open on arrival,
 * legible at a glance, and stamped with the one honest thing that marks them as
 * hackathons — the time that was on the clock.
 */
export function AgainstTheClock() {
  return (
    <section aria-labelledby="clock-heading">
      <Tab id="clock-heading">Against the clock</Tab>

      <p className="mb-3 mt-6 text-[13px] text-ash">
        Hackathon builds. A brief, a clock, a repo. No mystery to withhold, so
        unlike the case files these are open on arrival.
      </p>

      <div className="grid gap-4 pt-3 md:grid-cols-3">
        {builds.map((b) => (
          <article
            key={b.name}
            className="relative flex flex-col border border-file/[0.16] bg-gradient-to-b from-file/[0.05] to-file/[0.01] p-5 pt-7 transition-colors duration-300 hover:border-lamp/50"
          >
            {/* The punch-clock stamp: the time on the clock, the one thing that marks it a hackathon. */}
            <span className="absolute -top-3 right-4 rotate-[-2.5deg] border border-lamp/45 bg-void px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-lamp">
              <span aria-hidden="true">⏱ </span>
              {b.timeBox}
            </span>

            <Lettering className="block text-[clamp(1.2rem,2.2vw,1.55rem)] uppercase leading-tight">
              {b.name}
            </Lettering>
            <i className="mt-1.5 font-mono text-[10px] uppercase not-italic tracking-[0.16em] text-ash-2">
              {b.event}
            </i>

            <p className="mt-3 text-[13.5px] leading-relaxed text-file/80">
              {b.what}
            </p>

            <a
              href={b.repo}
              className="group/ev mt-4 inline-flex items-center gap-2 self-start border border-lamp/45 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-lamp transition-colors hover:bg-lamp hover:text-on-lamp focus-visible:bg-lamp focus-visible:text-on-lamp"
            >
              Read the code
              <b
                aria-hidden="true"
                className="transition-transform group-hover/ev:translate-x-1"
              >
                →
              </b>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
