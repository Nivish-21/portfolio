"use client";

import { useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getCommitTrail } from "@/lib/commits";

export function CommitTrail({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const commits = getCommitTrail(code);
  const panelId = `commit-trail-${code}`;

  if (commits.length === 0) return null;

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center gap-1.5 border-t border-dashed border-line-strong py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span
          aria-hidden="true"
          className="inline-block text-accent"
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: reducedMotion ? "none" : "transform var(--duration-fast) var(--ease-out-expo)",
          }}
        >
          ▸
        </span>
        <span className="underline decoration-dotted decoration-muted-2 underline-offset-2">
          Commit trail
        </span>
        <span className="text-muted-2">({commits.length})</span>
      </button>
      <div
        id={panelId}
        className="grid"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: reducedMotion ? "none" : "grid-template-rows var(--duration-normal) var(--ease-out-expo)",
        }}
      >
        <ul className="min-h-0 overflow-hidden">
          {commits.map((commit) => (
            <li key={commit.version} className="grid grid-cols-[auto_1fr] gap-x-3 py-1 text-xs">
              <code className="text-accent">v{commit.version}</code>
              <span className="text-muted line-clamp-1">{commit.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
