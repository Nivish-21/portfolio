"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BEST_KEY = "nvr-lightsout-best";
const COLS = 5;

type Phase = "idle" | "arming" | "armed" | "done";
type MsgTone = "" | "go" | "jump" | "res";

const TONE_CLASS: Record<MsgTone, string> = {
  "": "text-ink",
  go: "text-green",
  jump: "text-red",
  res: "text-yellow",
};

function verdict(ms: number): string {
  if (ms < 200) return "Superhuman. Stewards are reviewing your start.";
  if (ms < 250) return "F1-grade reaction. Seat available at the front.";
  if (ms < 330) return "Sharp. Points finish.";
  if (ms < 450) return "Midfield start. Warm up those tyres.";
  return "Box box. Have a coffee and go again.";
}

export function ReactionTest({ onBack }: { onBack: () => void }) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const phaseRef = useRef<Phase>("idle");
  const t0Ref = useRef(0);

  const [lit, setLit] = useState<boolean[]>(Array(COLS).fill(false));
  const [phase, setPhaseState] = useState<Phase>("idle");
  const [msg, setMsg] = useState("It's race week");
  const [sub, setSub] = useState("Five lights. Wait for lights out. Tap or press space.");
  const [tone, setTone] = useState<MsgTone>("");
  const [btnLabel, setBtnLabel] = useState("Start");
  const [best, setBest] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = Number(localStorage.getItem(BEST_KEY));
    return stored > 0 ? stored : null;
  });

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setLit(Array(COLS).fill(false));
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setPhase("arming");
    setTone("");
    setMsg("Watch the lights…");
    setSub("Lights out means GO");
    setBtnLabel("…");
    for (let i = 0; i < COLS; i++) {
      timersRef.current.push(
        setTimeout(() => setLit((prev) => prev.map((v, idx) => (idx === i ? true : v))), 300 + i * 520)
      );
    }
    const out = 300 + COLS * 520 + 400 + Math.random() * 1600;
    timersRef.current.push(
      setTimeout(() => {
        setLit(Array(COLS).fill(false));
        setPhase("armed");
        t0Ref.current = performance.now();
        setTone("go");
        setMsg("GO GO GO");
      }, out)
    );
  }, [clearTimers]);

  const react = useCallback(() => {
    if (phaseRef.current === "arming") {
      clearTimers();
      setPhase("done");
      setTone("jump");
      setMsg("JUMP START");
      setSub("Penalty — you moved before lights out. Drive-through for you.");
      setBtnLabel("Try again");
      return;
    }
    if (phaseRef.current === "armed") {
      const ms = Math.round(performance.now() - t0Ref.current);
      setPhase("done");
      setTone("res");
      setMsg(`${ms} ms`);
      setBtnLabel("Go again");
      const prev = Number(localStorage.getItem(BEST_KEY)) || Infinity;
      if (ms < prev) {
        localStorage.setItem(BEST_KEY, String(ms));
        setBest(ms);
        setSub(`${verdict(ms)} · NEW LAP RECORD`);
      } else {
        setSub(verdict(ms));
      }
    }
  }, [clearTimers]);

  // Space bar controls the whole ritual, matching tap-to-play.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      const p = phaseRef.current;
      if (p === "idle" || p === "done") start();
      else react();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start, react]);

  // Cancel any pending timers if the game unmounts mid-sequence.
  useEffect(() => clearTimers, [clearTimers]);

  const onZonePointerDown = () => {
    if (phaseRef.current === "arming" || phaseRef.current === "armed") react();
  };

  const onButtonClick = () => {
    if (phase === "idle" || phase === "done") start();
  };

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="flex gap-3" aria-hidden="true">
        {lit.map((on, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-sm border border-line-strong bg-bg p-2.5"
          >
            {[0, 1].map((row) => (
              <span
                key={row}
                className="h-5 w-5 rounded-full border transition-colors duration-75"
                style={
                  on
                    ? { background: "#ea5a44", borderColor: "#ea5a44", boxShadow: "0 0 16px rgba(234,90,68,.6)" }
                    : { background: "#1d2725", borderColor: "#0e1413" }
                }
              />
            ))}
          </div>
        ))}
      </div>

      <div
        onPointerDown={onZonePointerDown}
        role="application"
        aria-label="Reaction test. Press start, wait for lights out, tap or press space."
        className="cursor-pointer select-none p-3"
      >
        <p
          className={`font-display text-[clamp(1.4rem,3.4vw,2.1rem)] font-bold uppercase italic tracking-[0.04em] ${TONE_CLASS[tone]}`}
        >
          {msg}
        </p>
        <p className="mx-auto mt-1 max-w-[52ch] font-mono text-[11px] tracking-[0.1em] text-muted-2">
          {sub}
        </p>
      </div>

      <button
        type="button"
        onClick={onButtonClick}
        className="cursor-pointer bg-accent px-8 py-3 font-display text-sm font-bold uppercase italic tracking-[0.16em] text-on-accent transition-colors hover:brightness-110"
      >
        {btnLabel}
      </button>

      {best !== null && (
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-purple">
          Lap record {best} ms
        </p>
      )}

      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em] text-muted-2 transition-colors hover:text-ink"
      >
        ◂ back to garage
      </button>
    </div>
  );
}
