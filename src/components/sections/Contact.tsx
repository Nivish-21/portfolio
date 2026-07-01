import { Section } from "@/components/sector/Section";
import { contact } from "@/lib/content";

const LINKS = [
  { label: "Email", href: `mailto:${contact.email}`, value: contact.email },
  { label: "GitHub", href: contact.github, value: "Nivish-21" },
  { label: "LinkedIn", href: contact.linkedin, value: "nivish-vincent-raj" },
];

export function Contact() {
  return (
    <Section id="contact" sectorLabel="S5" title="Radio check" targetSeconds={6}>
      <p className="max-w-[56ch] text-muted mb-6">
        Building something that needs a systems-minded founding engineer? Send a signal.
      </p>
      <div className="flex flex-col gap-0 max-w-md">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            className="group flex items-center justify-between gap-4 py-3.5 border-t border-line-strong first:border-t-0 hover:text-accent transition-colors"
          >
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted group-hover:text-accent transition-colors">
              {link.label}
            </span>
            <span className="font-display font-semibold text-lg">{link.value} &rarr;</span>
          </a>
        ))}
      </div>
    </Section>
  );
}
