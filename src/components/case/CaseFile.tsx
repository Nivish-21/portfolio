import type { Case } from "@/lib/content";
import { Lettering } from "./Lettering";
import { Sfx } from "./Sfx";
import { Seal } from "./Seal";

/**
 * One case, shut.
 *
 * A case that shows you its answer on arrival is not a case, so the file is
 * closed by default and the reader escalates it themselves:
 *
 *   closed  — the crime only, plus an invitation
 *   hover   — the investigation: the suspects surface, struck out, footsteps approach
 *   open    — the solve: the culprit, the fix, Q.E.D., and the evidence
 *
 * Built on a native <details> so it is keyboard-operable and works before the
 * JavaScript arrives, rather than a div pretending to be a disclosure.
 */
export function CaseFile({ file }: { file: Case }) {
  return (
    <details className="group relative border border-file/[0.18] bg-gradient-to-b from-file/[0.045] to-file/[0.015] transition-colors duration-300 open:border-lamp/40 hover:border-lamp/55">
      <summary className="grid cursor-pointer list-none grid-cols-1 md:grid-cols-[190px_1fr] [&::-webkit-details-marker]:hidden">
        <span className="flex flex-col gap-1.5 border-b border-file/[0.18] p-5 md:border-b-0 md:border-r">
          <b className="font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-lamp">
            Case {file.no}
          </b>
          <Lettering className="block text-[clamp(1.25rem,2.4vw,1.7rem)] uppercase leading-tight">
            {file.title}
          </Lettering>
          <i className="mt-auto pt-2 font-mono text-[10px] uppercase not-italic tracking-[0.16em] text-ash-2">
            {file.meta}
          </i>
        </span>

        <span className="relative block p-5 sm:px-6">
          <Sfx kind="step" />

          <span className="block text-[15px] font-semibold leading-relaxed text-file/80">
            {file.crime}
          </span>

          {/* The suspects surface on hover: the investigation, before the answer. */}
          <ul className="grid grid-rows-[0fr] list-none p-0 opacity-0 transition-[grid-template-rows,opacity] duration-[420ms] ease-[var(--ease-out-expo)] group-hover:grid-rows-[1fr] group-hover:opacity-100 group-open:grid-rows-[1fr] group-open:opacity-100">
            <li className="overflow-hidden">
              {file.suspects.map((s) => (
                <span
                  key={s.claim}
                  className="flex items-baseline gap-2.5 py-1 text-[13.5px] leading-snug"
                >
                  <span
                    aria-hidden="true"
                    className="w-3.5 shrink-0 text-xs text-thread-text"
                  >
                    ✗
                  </span>
                  <s className="text-ash-2 decoration-[1.5px]">{s.claim}</s>
                  <em className="text-xs not-italic text-ash-2">
                    — {s.ruledOut}
                  </em>
                </span>
              ))}
            </li>
          </ul>

          <span className="mt-3.5 inline-block border-b border-dashed border-ash-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-ash-2 transition-colors group-hover:border-lamp group-hover:text-lamp group-open:hidden">
            Open the file
          </span>
        </span>
      </summary>

      {/* The solve. */}
      <div className="relative px-5 pb-6 pt-1 sm:px-6 md:pl-[214px]">
        <Sfx kind="solve" />

        <p className="mb-3.5 text-[15.5px] font-bold leading-relaxed text-file">
          <b className="text-lamp">The culprit.</b> {file.culprit}
        </p>

        <p className="flex flex-wrap items-center justify-between gap-2.5 border-t border-dashed border-file/20 pt-3 text-[13px] font-bold uppercase tracking-wide">
          <span>
            Fix: <b className="text-lamp">{file.fix}</b>
          </span>
          <span className="flex flex-wrap items-center gap-2.5">
            {file.timeBoxed ? (
              <span className="border border-thread-text/50 px-2.5 py-1 font-mono text-[11px] font-normal tracking-[0.18em] text-thread-text">
                Closed in 7 days
              </span>
            ) : null}
            <span
              className="border border-lamp/40 px-2.5 py-1 font-mono text-[11px] font-normal tracking-[0.24em] text-lamp"
              title="Quod erat demonstrandum — thus it is proved"
            >
              Q.E.D.
            </span>
          </span>
        </p>

        {file.evidence.kind === "repo" ? (
          <a
            href={file.evidence.href}
            className="group/ev mt-4 inline-flex items-center gap-2 border border-lamp/45 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-lamp transition-colors hover:bg-lamp hover:text-on-lamp focus-visible:bg-lamp focus-visible:text-on-lamp"
          >
            {file.evidence.label}
            <b
              aria-hidden="true"
              className="transition-transform group-hover/ev:translate-x-1"
            >
              →
            </b>
          </a>
        ) : (
          <Seal note={file.evidence.note} />
        )}
      </div>
    </details>
  );
}
