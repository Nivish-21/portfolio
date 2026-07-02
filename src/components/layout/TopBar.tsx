"use client";

// Race Mode is paused for now — not implemented, not removed. Re-enabling is a matter of
// uncommenting the imports/hook/button block below (see also src/app/page.tsx).
// import { useEffect, useState } from "react";
// import { useRaceModeContext } from "@/context/RaceModeContext";
// import { useReducedMotion } from "@/hooks/useReducedMotion";

const NAV_LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#roles", label: "Roles" },
  { href: "#contact", label: "Radio" },
];

export function TopBar() {
  // const { active, toggle } = useRaceModeContext();
  // const reducedMotion = useReducedMotion();
  // const [isTouchDevice, setIsTouchDevice] = useState(false);

  // useEffect(() => {
  //   const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  //   const frame = requestAnimationFrame(() => setIsTouchDevice(isTouch));
  //   return () => cancelAnimationFrame(frame);
  // }, []);

  // const raceModeAvailable = !reducedMotion && !isTouchDevice;

  return (
    <div className="sticky top-0 z-40 border-b border-line-strong bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-content items-center gap-3.5 px-6 md:px-8">
        <span className="font-display font-extrabold text-lg tracking-[0.04em] bg-ink text-bg px-2.5 py-0.5 rounded-sm">
          NVR
        </span>
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted hidden sm:inline">
          Ship first &middot; Scale later
        </span>

        {/* Race Mode toggle — paused, see comment at top of file.
        {raceModeAvailable && (
          <button
            type="button"
            onClick={toggle}
            aria-pressed={active}
            className="ml-3 flex items-center gap-1.5 border border-line-strong px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-accent hover:text-accent cursor-pointer"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-accent animate-pulse" : "bg-line-strong"}`} />
            Race mode: {active ? "on" : "off"}
          </button>
        )}
        */}

        <nav aria-label="Main navigation" className="ml-auto flex gap-5">
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
