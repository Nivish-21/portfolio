import { freelanceWork } from "@/lib/content";
import { Lettering } from "@/components/case/Lettering";
import { Tab } from "@/components/case/Tab";

/**
 * Freelance work.
 *
 * Also open on arrival, for the same reason the hackathon builds are: this is
 * someone else's system, built to their brief, not a mystery to solve for
 * yourself. No suspects, no culprit — just a client and a thing delivered.
 */
export function FreelanceWork() {
  return (
    <section aria-labelledby="freelance-heading">
      <Tab id="freelance-heading">Freelance work</Tab>

      <p className="mb-3 mt-6 text-[13px] text-ash">
        Paid work, built to a client brief. No mystery to withhold, so like the
        hackathon builds these are open on arrival.
      </p>

      <div className="grid gap-4 pt-3 md:grid-cols-2">
        {freelanceWork.map((job) => (
          <article
            key={job.client}
            className="flex flex-col border border-file/[0.16] bg-gradient-to-b from-file/[0.05] to-file/[0.01] p-5 transition-colors duration-300 hover:border-lamp/50"
          >
            <Lettering className="block text-[clamp(1.2rem,2.2vw,1.55rem)] uppercase leading-tight">
              {job.client}
            </Lettering>
            <i className="mt-1.5 font-mono text-[10px] uppercase not-italic tracking-[0.16em] text-ash-2">
              {job.role} · {job.dates}
            </i>

            <p className="mt-3 text-[13.5px] leading-relaxed text-file/80">
              {job.what}
            </p>

            <a
              href={job.link.href}
              className="group/ev mt-4 inline-flex items-center gap-2 self-start border border-lamp/45 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-lamp transition-colors hover:bg-lamp hover:text-on-lamp focus-visible:bg-lamp focus-visible:text-on-lamp"
            >
              {job.link.label}
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
