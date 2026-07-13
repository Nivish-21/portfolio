"use client";

import { useEffect, useRef, useState } from "react";
import { useInterrogation } from "@/hooks/useInterrogation";
import { Lettering } from "@/components/case/Lettering";

/**
 * The interview room: a terminal you can question, docked bottom-right.
 *
 * Collapsed to a single button until asked for, so it never competes with the
 * case files for attention.
 */
export function InterrogationTerminal() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { history, runCommand } = useInterrogation();
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 border border-lamp/45 bg-void/90 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-lamp backdrop-blur transition-colors hover:bg-lamp hover:text-on-lamp"
      >
        Question me
      </button>
    );
  }

  return (
    <aside
      aria-label="Interrogation terminal"
      className="fixed bottom-5 right-5 z-50 flex h-[22rem] w-[min(26rem,calc(100vw-2.5rem))] flex-col border border-lamp/40 bg-void/95 backdrop-blur"
    >
      <header className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
        <Lettering className="text-sm uppercase tracking-[0.16em] text-lamp">
          Interview room
        </Lettering>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close the interview"
          className="font-mono text-xs uppercase tracking-widest text-ash transition-colors hover:text-file"
        >
          ✕
        </button>
      </header>

      <div
        ref={logRef}
        aria-live="polite"
        className="flex-1 overflow-y-auto px-3.5 py-3 font-mono text-[11.5px] leading-relaxed"
      >
        {history.map((line, i) => (
          <p
            key={`${i}-${line.text}`}
            className={
              line.type === "input"
                ? "text-lamp"
                : line.type === "system"
                  ? "text-ash"
                  : "whitespace-pre-wrap text-file/85"
            }
          >
            {line.type === "input" ? `> ${line.text}` : line.text}
          </p>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runCommand(value);
          setValue("");
        }}
        className="flex items-center gap-2 border-t border-line px-3.5 py-2.5"
      >
        <span aria-hidden="true" className="font-mono text-xs text-lamp">
          &gt;
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Ask a question"
          placeholder="/help"
          className="w-full bg-transparent font-mono text-[11.5px] text-file outline-none placeholder:text-ash-2"
        />
      </form>
    </aside>
  );
}
