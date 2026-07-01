const NAV_LINKS = [
  { href: "#log", label: "The Log" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Radio" },
];

export function TopBar() {
  return (
    <div className="sticky top-0 z-10 border-b border-line-strong bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-content items-center gap-3.5 px-6 md:px-8">
        <span className="font-display font-extrabold text-lg tracking-[0.04em] bg-ink text-bg px-2.5 py-0.5 rounded-sm">
          NVR
        </span>
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted hidden sm:inline">
          Ship first &middot; Scale later
        </span>
        <nav className="ml-auto flex gap-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs tracking-[0.08em] uppercase text-ink hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
