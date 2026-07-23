import { testimony } from "@/lib/content";
import { Lettering } from "@/components/case/Lettering";
import { Tab } from "@/components/case/Tab";

/**
 * The experience, as signed statements: typed on paper, punched and filed.
 *
 * The redaction bar over the stealth company's market is not a gimmick. That
 * detail genuinely cannot be published, and blacking it out is a more honest
 * way to say so than quietly leaving a hole in the sentence.
 */
export function Testimony() {
  return (
    <section aria-labelledby="testimony-heading">
      <Tab id="testimony-heading">Testimony</Tab>

      <div className="grid gap-7 pt-7 md:grid-cols-2">
        {testimony.map((s) => (
          <article
            key={s.org}
            className="relative bg-file p-7 pl-11 text-void shadow-[0_20px_34px_-18px_#000]"
          >
            {/* punched holes down the filing margin */}
            <span
              aria-hidden="true"
              className="absolute bottom-7 left-2.5 top-7 w-[7px] bg-[radial-gradient(circle_at_50%_12px,var(--color-void)_3.4px,transparent_3.6px)] bg-[length:7px_34px] bg-repeat-y"
            />

            <Lettering
              as="h3"
              className="block text-xl uppercase tracking-wide text-void"
            >
              {s.org}
            </Lettering>
            <p className="mb-4 mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#7d7566]">
              {s.role} · {s.dates}
            </p>

            <ul className="list-disc pl-4 font-mono">
              {s.lines.map((line) => (
                <li
                  key={line}
                  className="mb-1.5 text-[12.5px] leading-relaxed text-[#35312a]"
                >
                  {line}
                </li>
              ))}
              {s.redacted ? (
                <li className="mb-1.5 text-[12.5px] leading-relaxed text-[#35312a]">
                  Operating in{" "}
                  <span
                    className="select-none rounded-[1px] bg-[#1a1814] px-1.5 text-transparent"
                    title="Redacted"
                  >
                    {s.redacted}
                  </span>
                  , which is rather the point of a stealth company.
                </li>
              ) : null}
            </ul>

            <p className="mt-4 border-t border-void/20 pt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#8d8677]">
              {s.signOff}
            </p>

            {s.link ? (
              <a
                href={s.link}
                className="group/ev mt-3 inline-flex items-center gap-2 border border-lamp/45 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-lamp transition-colors hover:bg-lamp hover:text-on-lamp focus-visible:bg-lamp focus-visible:text-on-lamp"
              >
                Visit the site
                <b
                  aria-hidden="true"
                  className="transition-transform group-hover/ev:translate-x-1"
                >
                  →
                </b>
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
