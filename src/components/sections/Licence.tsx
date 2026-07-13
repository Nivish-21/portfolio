import { credentials, takingCases } from "@/lib/content";
import { Lettering } from "@/components/case/Lettering";
import { Tab } from "@/components/case/Tab";

/**
 * The credentials, and what he will take on.
 *
 * Every badge links to the issuer's own verification page. An unverifiable
 * claim on a portfolio is decoration, and a recruiter treats it as such.
 */
export function Licence() {
  return (
    <>
      <section aria-labelledby="licence-heading">
        <Tab id="licence-heading">Licence to practise</Tab>

        <div className="grid gap-4 pt-7 sm:grid-cols-2 lg:grid-cols-4">
          {credentials.map((c) => (
            <a
              key={c.name}
              href={c.verifyUrl}
              className="group border border-lamp/30 bg-gradient-to-b from-lamp/[0.09] to-transparent p-5 transition-[border-color,transform] duration-200 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-lamp focus-visible:-translate-y-0.5 focus-visible:border-lamp"
            >
              <Lettering className="mb-1.5 block text-[15px] uppercase tracking-[0.09em] text-lamp">
                {c.issuer}
              </Lettering>
              <span className="block text-[13px] leading-snug text-file/[0.78]">
                {c.name}
              </span>
              <time className="mt-2.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ash-2">
                {c.issued}
              </time>
              <span className="mt-2.5 block font-mono text-[10px] uppercase tracking-[0.13em] text-ash transition-colors group-hover:text-lamp group-focus-visible:text-lamp">
                Verify credential →
              </span>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="taking-heading">
        <Tab id="taking-heading">Taking cases</Tab>
        <ul className="flex list-none flex-wrap gap-x-8 gap-y-2.5 pt-7">
          {takingCases.map((role) => (
            <li key={role}>
              <Lettering className="text-[clamp(1.1rem,2.4vw,1.75rem)] uppercase tracking-wide">
                <span aria-hidden="true" className="text-thread">
                  ▸{" "}
                </span>
                {role}
              </Lettering>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
