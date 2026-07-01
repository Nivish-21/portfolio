"use client";

import { useState, useCallback } from "react";
import { useSectorTimingContext } from "@/context/SectorTimingContext";
import { projects } from "@/lib/content";

export interface TermLine {
  type: "input" | "output" | "system";
  text: string;
}

export function useRaceEngineer() {
  const { sectors } = useSectorTimingContext();
  const [history, setHistory] = useState<TermLine[]>([
    { type: "system", text: "COMMS UPLINK ESTABLISHED OVER CHANNEL NVR-21." },
    { type: "system", text: "TYPE /help OR /commands FOR DIRECT DOWNLINK CODES." },
  ]);

  const addLine = useCallback((line: TermLine) => {
    setHistory((prev) => [...prev, line]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const runCommand = useCallback((input: string) => {
    const raw = input.trim();
    if (!raw) return;

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
      addLine({ type: "output", text: "  /status   - Live telemetry and active sector reading status." });
      addLine({ type: "output", text: "  /about    - Core parameters on founding CTO Nivish Vincent Raj." });
      addLine({ type: "output", text: "  /projects - List delta project logs. Use '/projects [1-7]' for details." });
      addLine({ type: "output", text: "  /clear    - Flush the terminal logs." });
      return;
    }

    if (cmd === "/status") {
      addLine({ type: "output", text: "🏎️ REAL-TIME LAP STATUS & TELEMETRY:" });
      const sectorList = [
        { id: "log", label: "S1", title: "The Log", targetSec: 14 },
        { id: "work", label: "S2", title: "Featured Work", targetSec: 84 },
        { id: "skills", label: "S3", title: "Skills", targetSec: 10 },
        { id: "beat", label: "S4", title: "Off the Clock", targetSec: 9 },
        { id: "contact", label: "S5", title: "Radio Check", targetSec: 6 },
      ];

      sectorList.forEach((s) => {
        const data = sectors[s.id];
        const status = data ? data.status.toUpperCase() : "PENDING";
        const dwell = data ? (data.dwellMs / 1000).toFixed(1) : "0.0";
        addLine({
          type: "output",
          text: `  ${s.label} (${s.title}): [${status}] ${dwell}s / ${s.targetSec}.0s`
        });
      });
      return;
    }

    if (cmd === "/about") {
      addLine({ type: "output", text: "FOUNDING CTO // NIVISH VINCENT RAJ" });
      addLine({ type: "output", text: "Headline: Founding CTO @ CaboCab & Stealth AI startup." });
      addLine({ type: "output", text: "Core Practice: Building real-time backend systems, low-latency APIs, and multi-agent AI loops." });
      addLine({ type: "output", text: "Disciplines: Code optimization, F1 mechanics, running, and positional chess." });
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
          addLine({ type: "output", text: "INVALID CHANNEL. SELECT PROJECT FROM 1 TO 7." });
        }
      } else {
        addLine({ type: "output", text: "PROJECT ARCHIVE DOWNLINK:" });
        projects.forEach((p, idx) => {
          addLine({ type: "output", text: `  P.0${idx + 1}: ${p.name}` });
        });
        addLine({ type: "output", text: "Use '/projects [1-7]' (e.g. /projects 2) to read project delta." });
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
      addLine({ type: "output", text: "CABOCAB TELEMETRY: Real-time geospatial matching (OSRM) + offline resilience. Syncs write failures automatically on reconnect. Active in 6 districts." });
      return;
    }
    if (lowerInput.includes("agent") || lowerInput.includes("ai") || lowerInput.includes("orchestration")) {
      addLine({ type: "output", text: "AI LABS: Expertise in multi-agent environments. Orchestrated LangGraph, Gemini, and CrewAI over shared adjudication contexts. Built 6-agent compliance loops." });
      return;
    }
    if (lowerInput.includes("run") || lowerInput.includes("gym") || lowerInput.includes("tempo")) {
      addLine({ type: "output", text: "FITNESS READOUT: sub-4:30/km tempo running + gym loops. Optimization of heart rate and speed parameters compounds directly into code stamina." });
      return;
    }
    if (lowerInput.includes("chess")) {
      addLine({ type: "output", text: "CHESS ENGINE: Patience, positional advantage accumulation. Building a solid foundation before executing code commits is equivalent to structuring a board chess opening." });
      return;
    }
    if (lowerInput.includes("email") || lowerInput.includes("contact")) {
      addLine({ type: "output", text: "CONTACT PARAMETERS: Transmit signals via the 'Radio Check' contact form, or direct email to nivishv2004@gmail.com." });
      return;
    }

    // Default unrecognized input
    addLine({ type: "output", text: "COPY THAT, DRIVER. SIGNAL IS FUZZY ON THIS CHANNEL." });
    addLine({ type: "output", text: "USE /commands FOR DIRECT TELEMETRY DOWNLINK REGISTRY." });
  }, [sectors, addLine, clearHistory]);

  return { history, runCommand, clearHistory };
}
