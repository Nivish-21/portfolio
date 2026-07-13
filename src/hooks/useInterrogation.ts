"use client";

import { useState, useCallback } from "react";
import { cases, contact, evidenceBoard } from "@/lib/content";

export interface TermLine {
  type: "input" | "output" | "system";
  text: string;
}

const GREETING: TermLine[] = [
  { type: "system", text: "INTERVIEW ROOM. RECORDING." },
  {
    type: "system",
    text: "ASK ME SOMETHING. /help IF YOU DO NOT KNOW WHERE TO START.",
  },
];

const HELP: string[] = [
  "/cases              every file, open and sealed",
  "/case <n>           one file. the crime, the suspects, the culprit",
  "/suspects <n>       who I ruled out, and why",
  "/evidence <n>       where the proof is, if you are allowed to see it",
  "/sealed             the files I will not open",
  "/tools              what I reached for, and on which case",
  "/who                who is answering",
  "/contact            how to reach me",
  "/clear              wipe the tape",
];

/**
 * The interrogation.
 *
 * The old race-engineer console was the most-played-with thing on the site, so
 * it survives the pivot — but as the detective world's own interactive rather
 * than a leftover. It answers in character, and when you ask it for something it
 * genuinely cannot give you, it refuses in character too, which is the honest
 * answer anyway.
 */
export function useInterrogation() {
  const [history, setHistory] = useState<TermLine[]>(GREETING);

  const addLines = useCallback((lines: TermLine[]) => {
    setHistory((prev) => [...prev, ...lines]);
  }, []);

  const runCommand = useCallback(
    (input: string) => {
      const raw = input.trim();
      if (!raw) return;

      const [cmd, ...rest] = raw.split(/\s+/);
      const arg = rest[0]?.replace(/^0+/, "") ?? "";
      const out = (...texts: string[]): TermLine[] =>
        texts.map((text) => ({ type: "output" as const, text }));

      if (cmd.toLowerCase() === "/clear") {
        setHistory(GREETING);
        return;
      }

      setHistory((prev) => [...prev, { type: "input", text: raw }]);

      const findCase = () => cases.find((c) => c.no.replace(/^0+/, "") === arg);

      switch (cmd.toLowerCase()) {
        case "/help":
          addLines(out(...HELP));
          return;

        case "/cases":
          addLines(
            out(
              ...cases.map(
                (c) =>
                  `CASE ${c.no}  ${c.title.toUpperCase().padEnd(34)} ${
                    c.evidence.kind === "sealed" ? "[SEALED]" : "[OPEN]"
                  }`,
              ),
            ),
          );
          return;

        case "/case": {
          const c = findCase();
          if (!c) {
            addLines(out(`No case ${arg || "?"}. Try /cases.`));
            return;
          }
          addLines(
            out(
              `CASE ${c.no} — ${c.title.toUpperCase()}   (${c.meta})`,
              "",
              c.crime,
              "",
              ...c.suspects.map(
                (s) => `  RULED OUT: ${s.claim} — ${s.ruledOut}`,
              ),
              "",
              `  CULPRIT:   ${c.culprit}`,
              `  FIX:       ${c.fix}`,
              "",
              "Q.E.D.",
            ),
          );
          return;
        }

        case "/suspects": {
          const c = findCase();
          if (!c) {
            addLines(out(`No case ${arg || "?"}. Try /cases.`));
            return;
          }
          addLines(
            out(
              `CASE ${c.no} — who I ruled out:`,
              ...c.suspects.map((s) => `  ✗ ${s.claim} — ${s.ruledOut}`),
              `  ✓ ${c.culprit}`,
            ),
          );
          return;
        }

        case "/evidence": {
          const c = findCase();
          if (!c) {
            addLines(out(`No case ${arg || "?"}. Try /cases.`));
            return;
          }
          addLines(
            c.evidence.kind === "repo"
              ? out(`CASE ${c.no}: ${c.evidence.href}`)
              : out(`CASE ${c.no} IS SEALED.`, c.evidence.note),
          );
          return;
        }

        case "/sealed":
          addLines(
            out(
              "Four files stay shut. Three are a client's system, one is a stealth",
              "company, and I do not get to publish other people's code.",
              "",
              ...cases
                .filter((c) => c.evidence.kind === "sealed")
                .map((c) => `  CASE ${c.no}  ${c.title}`),
              "",
              "Ask me about the reasoning instead. That part is mine.",
            ),
          );
          return;

        case "/tools":
          addLines(
            out(
              ...evidenceBoard.map((p) => `  ${p.tool.padEnd(16)} ${p.usedOn}`),
            ),
          );
          return;

        case "/who":
          addLines(
            out(
              "Nivish Vincent Raj. Founding CTO, two companies, both zero to one.",
              "I ship it raw, and then I prove it.",
            ),
          );
          return;

        case "/contact":
          addLines(
            out(
              `  ${contact.email}`,
              `  ${contact.github}`,
              `  ${contact.linkedin}`,
            ),
          );
          return;

        default:
          addLines(out(`I do not follow "${cmd}". Try /help.`));
      }
    },
    [addLines],
  );

  return { history, runCommand };
}
