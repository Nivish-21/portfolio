"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRaceEngineer } from "@/hooks/useRaceEngineer";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function RaceEngineerConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { history, runCommand } = useRaceEngineer();
  const consoleEndRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  }, [history, isOpen, reducedMotion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;

    runCommand(val);
    setInputValue("");
  };

  const getLineColor = (type: string) => {
    if (type === "input") return "text-muted";
    if (type === "system") return "text-purple font-semibold";
    return "text-accent";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-panel border border-accent hover:bg-accent hover:text-on-accent px-4 py-2.5 rounded-sm shadow-[0_0_10px_rgba(0,210,190,0.15)] text-accent font-bold uppercase tracking-[0.1em] transition-all cursor-pointer"
        >
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          [ Comms Panel ]
        </button>
      )}

      {/* Terminal Window */}
      {isOpen && (
        <div className="w-[calc(100vw-32px)] max-w-[380px] h-[360px] md:h-[400px] bg-bg border border-accent rounded-sm shadow-[0_0_20px_rgba(0,210,190,0.25)] flex flex-col overflow-hidden relative">
          {/* Scanline / CRT overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(18,16,16,0)+50%,rgba(0,0,0,0.25)+50%),linear-gradient(to_right,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] opacity-15" />

          {/* Header */}
          <div className="bg-panel border-b border-line-strong px-4 py-2.5 flex justify-between items-center relative z-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
              <span className="font-bold text-accent tracking-[0.08em] uppercase text-[10px]">
                Radio Link // PIT PANEL
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-red transition-colors uppercase tracking-[0.05em] cursor-pointer"
            >
              [ Minimize ]
            </button>
          </div>

          {/* Terminal output console */}
          <div
            role="log"
            aria-label="Race engineer console output"
            aria-live="polite"
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 relative z-10 select-text"
          >
            {history.map((line, idx) => (
              <div key={idx} className={`leading-relaxed break-words ${getLineColor(line.type)}`}>
                {line.type === "input" && <span className="text-accent/60 mr-2">$</span>}
                {line.text}
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>

          {/* Prompt Form Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-line-strong bg-panel px-4 py-3 flex items-center gap-2 relative z-10 shrink-0"
          >
            <span className="text-accent font-bold select-none">$</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type message or /commands..."
              aria-label="Command input"
              className="flex-1 bg-transparent border-none text-accent focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent focus-visible:outline-offset-2 placeholder-accent/40 font-mono text-xs w-full"
              autoFocus
              disabled={!isOpen}
            />
          </form>
        </div>
      )}
    </div>
  );
}
