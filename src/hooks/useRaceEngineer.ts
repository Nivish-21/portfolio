"use client";

import { useState, useCallback, useRef } from "react";
import { useRaceModeContext } from "@/context/RaceModeContext";
import { projects, contact } from "@/lib/content";

export interface TermLine {
  type: "input" | "output" | "system";
  text: string;
}

export function useRaceEngineer() {
  const { personalBestMs } = useRaceModeContext();
  const [history, setHistory] = useState<TermLine[]>([
    { type: "system", text: "COMMS UPLINK ESTABLISHED OVER CHANNEL NVR-21." },
    { type: "system", text: "TYPE /help OR /commands FOR DIRECT DOWNLINK CODES." },
  ]);
  const [, setLightsState] = useState<"idle" | "armed" | "go">("idle");
  const lightsStateRef = useRef<"idle" | "armed" | "go">("idle");
  const goTimeRef = useRef<number | null>(null);

  const setLightsStateAndRef = (val: "idle" | "armed" | "go") => {
    lightsStateRef.current = val;
    setLightsState(val);
  };

  const addLine = useCallback((line: TermLine) => {
    setHistory((prev) => [...prev, line]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const runCommand = useCallback((input: string) => {
    const raw = input.trim();
    if (!raw) return;

    // Intercept reaction triggers
    if (lightsStateRef.current === "armed") {
      setLightsStateAndRef("idle");
      addLine({ type: "output", text: "❌ JUMP START — anticipated the lights. Try /lights again." });
      return;
    }
    if (lightsStateRef.current === "go") {
      const reactionMs = Math.round(performance.now() - (goTimeRef.current ?? performance.now()));
      setLightsStateAndRef("idle");
      addLine({
        type: "output",
        text: `🏁 REACTION: ${reactionMs}ms — ${
          reactionMs < 200 ? "GENUINELY QUICK! Grid-ready." : reactionMs < 350 ? "Solid reaction time." : "A bit slow off the line."
        }`
      });
      return;
    }

    addLine({ type: "input", text: raw });

    const parts = raw.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();

    // Command routing
    if (cmd === "/clear") {
      clearHistory();
      return;
    }

    if (cmd === "/help" || cmd === "/commands") {
      addLine({ type: "output", text: "AVAILABLE COMMS DOWNLINKS:" });
      addLine({ type: "output", text: "  /status   - Personal-best lap telemetry." });
      addLine({ type: "output", text: "  /about    - Core parameters on founding CTO Nivish Vincent Raj." });
      addLine({ type: "output", text: `  /projects - List delta project logs. Use '/projects [1-${projects.length}]' for details.` });
      addLine({ type: "output", text: "  /lights   - F1 reaction-time start lights protocol." });
      addLine({ type: "output", text: "  /clear    - Flush the terminal logs." });
      return;
    }

    if (cmd === "/lights") {
      addLine({ type: "output", text: "🔴 LIGHTS OUT PROTOCOL ARMED. PRESS ENTER TO LAUNCH WHEN LIGHTS GO OUT." });
      setLightsStateAndRef("armed");
      
      const holdMs = 1200 + Math.random() * 1800; // unpredictable hold
      const sequence = [500, 500, 500, 500, holdMs];
      let elapsed = 0;
      
      sequence.forEach((delay, i) => {
        elapsed += delay;
        setTimeout(() => {
          if (lightsStateRef.current === "idle") return; // jump-started/aborted
          
          if (i < 4) {
            addLine({ type: "output", text: "🔴 ".repeat(i + 1) });
          } else {
            goTimeRef.current = performance.now();
            setLightsStateAndRef("go");
            addLine({ type: "output", text: "⚪ ⚪ ⚪ ⚪ ⚪ — LIGHTS OUT! GO GO GO!" });
          }
        }, elapsed);
      });
      return;
    }

    if (cmd === "/status") {
      addLine({ type: "output", text: "🏎️ RACE TELEMETRY:" });
      if (personalBestMs !== null) {
        addLine({ type: "output", text: `  Personal best lap: ${(personalBestMs / 1000).toFixed(3)}s` });
      } else {
        addLine({ type: "output", text: "  No lap recorded yet." });
      }
      addLine({ type: "output", text: "  Race Mode is paused for now — check back for a lap record soon." });
      return;
    }

    if (cmd === "/about") {
      addLine({ type: "output", text: "FOUNDING CTO // NIVISH VINCENT RAJ" });
      addLine({ type: "output", text: "Headline: Founding CTO @ CaboCab & Stealth AI startup." });
      addLine({ type: "output", text: "Core Practice: Building real-time backend systems, low-latency APIs, and multi-agent AI loops." });
      addLine({ type: "output", text: "Disciplines: AI-native building, F1 mechanics, running, and positional chess." });
      return;
    }

    if (cmd === "/projects") {
      if (arg) {
        // Find project by number
        const num = parseInt(arg.replace(/[^0-9]/g, ""), 10);
        if (num >= 1 && num <= projects.length) {
          const p = projects[num - 1];
          addLine({ type: "output", text: `[${p.code}] ${p.name.toUpperCase()}` });
          addLine({ type: "output", text: `Summary: ${p.summary}` });
          addLine({ type: "output", text: `Baseline: ${p.baseline}` });
          addLine({ type: "output", text: `Optimised: ${p.optimised}` });
          addLine({ type: "output", text: `Result: ${p.result} [${p.resultTone.toUpperCase()}]` });
        } else {
          addLine({ type: "output", text: `INVALID CHANNEL. SELECT PROJECT FROM 1 TO ${projects.length}.` });
        }
      } else {
        addLine({ type: "output", text: "PROJECT ARCHIVE DOWNLINK:" });
        projects.forEach((p, idx) => {
          addLine({ type: "output", text: `  P.0${idx + 1}: ${p.name}` });
        });
        addLine({ type: "output", text: `Use '/projects [1-${projects.length}]' (e.g. /projects 2) to read project delta.` });
      }
      return;
    }

    // Natural Language / Keywords Fallback
    const lowerInput = raw.toLowerCase();

    if (lowerInput.includes("hello") || lowerInput.includes("hi ") || lowerInput.trim() === "hi") {
      addLine({ type: "output", text: "PIT WALL: Radio check clear, driver. Use /commands for telemetry access." });
      return;
    }
    if (lowerInput.includes("cabo") || lowerInput.includes("cabocab")) {
      addLine({ type: "output", text: "CABOCAB TELEMETRY: Real-time geospatial matching (OSRM) + offline resilience. Syncs write failures automatically on reconnect. Live in production, reach extended via partner builders." });
      return;
    }
    if (lowerInput.includes("agent") || lowerInput.includes("ai") || lowerInput.includes("orchestration")) {
      addLine({ type: "output", text: "AI LABS: Expertise in multi-agent environments. Orchestrated LangGraph, Gemini, and CrewAI over shared adjudication contexts. Built 6-agent compliance loops." });
      return;
    }
    if (lowerInput.includes("chess")) {
      addLine({ type: "output", text: "CHESS ENGINE: Patience, positional advantage accumulation. Building a solid foundation before executing code commits is equivalent to structuring a board chess opening." });
      return;
    }
    if (lowerInput.includes("email") || lowerInput.includes("contact")) {
      addLine({ type: "output", text: `CONTACT PARAMETERS: Transmit signals via the 'Radio Check' contact form, or direct email to ${contact.email}.` });
      return;
    }

    // Default unrecognized input
    addLine({ type: "output", text: "COPY THAT, DRIVER. SIGNAL IS FUZZY ON THIS CHANNEL." });
    addLine({ type: "output", text: "USE /commands FOR DIRECT TELEMETRY DOWNLINK REGISTRY." });
  }, [personalBestMs, addLine, clearHistory]);

  return { history, runCommand, clearHistory };
}
