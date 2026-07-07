"use client";

import { Section } from "@/components/sector/Section";
import { openToRoles } from "@/lib/content";
import type { RoleCard } from "@/lib/content";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const COLOR_CLASSES: Record<
  RoleCard["color"],
  { border: string; text: string; bg: string }
> = {
  green: { border: "border-t-green", text: "text-green", bg: "bg-green" },
  accent: { border: "border-t-accent", text: "text-accent", bg: "bg-accent" },
  purple: { border: "border-t-purple", text: "text-purple", bg: "bg-purple" },
  yellow: { border: "border-t-yellow", text: "text-yellow", bg: "bg-yellow" },
};

export function OpenToRoles() {
  const { ref, revealed } = useRevealOnScroll<HTMLDivElement>();

  return (
    <Section
      id="roles"
      sectorLabel="S5"
      title="Open to Roles"
      meta="currently seeking full-time"
    >
      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {openToRoles.map((role) => {
          const c = COLOR_CLASSES[role.color];
          return (
            <div
              key={role.title}
              className={`relative flex flex-col gap-3 bg-panel border border-line-strong border-t-[3px] ${c.border} p-5`}
            >
              <span
                className={`self-start font-mono text-[10px] font-bold uppercase tracking-[0.1em] ${c.text}`}
              >
                {role.status}
              </span>
              <h3 className="font-display font-bold uppercase text-base tracking-[0.02em]">
                {role.title}
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                {role.tag}
              </span>
              <div className="mt-auto h-1.5 w-full overflow-hidden rounded-sm bg-line-strong">
                <span
                  className={`block h-full rounded-sm ${c.bg} transition-[width] duration-700`}
                  style={{
                    width: revealed ? `${role.readiness}%` : "0%",
                    transitionTimingFunction:
                      "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
