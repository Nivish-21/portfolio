import { Lettering } from "@/components/case/Lettering";

/**
 * The thesis, stated once and never repeated: how he works, and why the rest of
 * the site is shaped like a case file rather than a list of jobs.
 */
export function Method() {
  return (
    <section aria-labelledby="method-heading" className="pt-20">
      <h2 id="method-heading" className="sr-only">
        The method
      </h2>
      <div className="grid border border-file/[0.16] md:grid-cols-2">
        <div className="border-b border-file/[0.16] p-8 md:border-b-0 md:border-r">
          <Lettering className="mb-4 block text-[clamp(1.5rem,3.4vw,2.375rem)] uppercase leading-tight">
            Every bug is a <b className="font-normal text-thread">suspect</b>.
          </Lettering>
          <p className="mb-3 text-base font-semibold leading-relaxed text-file/[0.78]">
            A system that misbehaves is not a mystery. It is a case. Something
            in there is lying to you, and the evidence is already on the table.
          </p>
          <p className="text-base font-semibold leading-relaxed text-file/[0.78]">
            You line up the suspects, you eliminate them one at a time, and
            whatever survives is the culprit. It does not matter how unlikely it
            looked at the start.
          </p>
        </div>

        <div className="p-8">
          <Lettering className="mb-4 block text-[clamp(1.5rem,3.4vw,2.375rem)] uppercase leading-tight">
            Ship first.{" "}
            <b className="font-normal text-thread">Then prove it.</b>
          </Lettering>
          <p className="mb-3 text-base font-semibold leading-relaxed text-file/[0.78]">
            Version one is allowed to be ugly. It goes live, it meets real
            users, and it hands me the evidence I could not have guessed at from
            a whiteboard.
          </p>
          <p className="text-base font-semibold leading-relaxed text-file/[0.78]">
            Then I optimise. Not by taste, and not by instinct, but because the
            case is closed and I can show my working.
          </p>
          <p
            className="mt-4 font-mono text-xs uppercase tracking-[0.26em] text-lamp"
            title="Latin: thus it is proved. What you write at the end of a proof."
          >
            Quod erat demonstrandum
          </p>
        </div>
      </div>
    </section>
  );
}
