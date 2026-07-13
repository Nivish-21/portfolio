import { contact, education } from "@/lib/content";
import { Lettering } from "@/components/case/Lettering";
import { ContactForm } from "./ContactForm";

const LINKS = [
  { label: "Email", href: `mailto:${contact.email}`, value: contact.email },
  { label: "GitHub", href: contact.github, value: "Nivish-21" },
  { label: "LinkedIn", href: contact.linkedin, value: "nivish-vincent-raj" },
];

/** The way out. */
export function Contact() {
  return (
    <>
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="mt-20 border border-lamp/35 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(232,180,92,0.1),transparent_70%)] p-8 sm:p-10"
      >
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Lettering
              as="h2"
              id="contact-heading"
              className="block text-[clamp(1.5rem,4vw,2.75rem)] uppercase leading-tight"
            >
              Got a case nobody
              <br />
              can <b className="font-normal text-lamp">close</b>?
            </Lettering>

            <div className="mt-7 flex max-w-md flex-col">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex items-center justify-between gap-4 border-t border-line-strong py-3.5 transition-colors first:border-t-0 hover:text-lamp"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors group-hover:text-lamp">
                    {link.label}
                  </span>
                  <span className="text-base font-semibold md:text-lg">
                    {link.value} &rarr;
                  </span>
                </a>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <footer className="pb-16 pt-10 text-center font-mono text-[10px] uppercase tracking-[0.26em] text-ash-2">
        {education.degree} · {education.institution.split(",")[0]} ·{" "}
        {education.dates} · Case file ends
      </footer>
    </>
  );
}
