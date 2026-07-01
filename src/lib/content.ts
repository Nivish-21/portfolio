export interface DeltaRow {
  label: string;
  value: string;
  tone: "mark" | "gain" | "best";
}

export interface Project {
  code: string;
  name: string;
  summary: string;
  baseline: string;
  optimised: string;
  result: string;
  resultTone: "mark" | "gain" | "best";
  href?: string;
}

export const projects: Project[] = [
  {
    code: "P.01",
    name: "CaboCab — offline write resilience",
    summary:
      "Writes failed during the Sept 2025 Red Sea cable-cut outages. Queued locally, synced automatically on reconnect — designing for the network you actually have, not the one you wish you had.",
    baseline: "writes failing during outages",
    optimised: "queued + auto-sync on reconnect",
    result: "6 districts, 2 apps, live in production",
    resultTone: "best",
  },
  {
    code: "P.02",
    name: "vulntriage — CVE re-ranking",
    summary:
      "pip-audit dumps every known CVE, ranked by raw CVSS. vulntriage re-ranks by real exploitability using NVD, CISA KEV, and EPSS data, so you fix what's actually reachable in your code first.",
    baseline: "raw CVSS, alert fatigue",
    optimised: "reachable-first, real exploitability",
    result: "published on PyPI, runs on your own CLI subscription",
    resultTone: "best",
  },
  {
    code: "P.03",
    name: "ClaimBand — multi-agent claims adjudication",
    summary:
      "Built for the Band of Agents Hackathon in a week. Four agents, three different frameworks (LangGraph, Gemini SDK, CrewAI), coordinating over one shared context room for insurance claims — with a full audit trail.",
    baseline: "single-framework, no cross-agent trust",
    optimised: "shared room, structured hand-offs, audit trail",
    result: "APPROVE / DENY / ESCALATE, traceable end to end",
    resultTone: "gain",
  },
  {
    code: "P.04",
    name: "civichero — gamified civic triage",
    summary:
      "Built for the BlockseBlock hackathon. Citizens photograph a civic problem, Gemini Vision triages it in under 2 seconds, an agent plans the resolution, and a 3-role community loop closes the ticket.",
    baseline: "manual civic reporting, no routing",
    optimised: "Gemini triage + agentic resolution plan",
    result: "XP, achievements, leaderboard — real community loop",
    resultTone: "gain",
  },
  {
    code: "P.05",
    name: "QueueCutter — AI paperwork copilot",
    summary:
      "Government forms across the US, India, and the UK are confusing by design. QueueCutter turns them into a guided conversation, scores rejection risk, and produces a ready-to-submit filled PDF.",
    baseline: "bureaucratic forms, high rejection rates",
    optimised: "guided conversation + rejection-risk scoring",
    result: "7 forms, 3 countries, escalation paths built in",
    resultTone: "gain",
  },
  {
    code: "P.06",
    name: "Scraper — crash-resilient bulk image pull",
    summary:
      "Bulk image downloads across 100k–200k+ row datasets. Started as one script; five files later, each one exists because something broke — file-existence checks, redirect handling, candidate scoring.",
    baseline: "O(n) checks, single image candidate, no resume",
    optimised: "O(1) lookups, 12-candidate scoring, checkpointed resume",
    result: "crash at row 47,000 resumes at row 47,000",
    resultTone: "gain",
  },
  {
    code: "P.07",
    name: "Stealth agent system — regulated procurement",
    summary:
      "A stealth AI agent system for a regulated, overlooked market. Six specialised agents cover discovery, scoring, drafting, and compliance — with a self-correcting loop where one model drafts and another grades the work.",
    baseline: "manual discovery, manual drafting",
    optimised: "6-agent pipeline, self-correcting draft/grade loop",
    result: "working MVP, deployed",
    resultTone: "mark",
  },
];

export interface LogEntry {
  time: string;
  kind: "train" | "ship";
  text: string;
}

export const log: LogEntry[] = [
  { time: "06:45", kind: "train", text: "8km tempo, held sub-4:30 pace" },
  {
    time: "14:20",
    kind: "ship",
    text: "shipped offline write-queue — cut sync failures on flaky networks",
  },
  { time: "19:30", kind: "train", text: "leg day, then debugged map-matching drift" },
  {
    time: "09:10",
    kind: "ship",
    text: "vulntriage v0.15.2 — fixed the undeclared-dependency crash",
  },
  { time: "06:20", kind: "train", text: "easy 6km recovery run" },
  {
    time: "21:00",
    kind: "ship",
    text: "ClaimBand: wired 3 frameworks into one shared context room",
  },
];

export const hud = {
  shipped: 8,
  liveCoverage: 6,
  bestSector: "PyPI",
  discipline: 2,
};

export const contact = {
  email: "nivishv2004@gmail.com",
  github: "https://github.com/Nivish-21",
  linkedin: "https://www.linkedin.com/in/nivish-vincent-raj/",
};
