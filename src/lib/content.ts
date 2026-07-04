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
  /** Built for a hackathon — flagged on the card so it reads as a time-boxed
   * build, not a production project. */
  hackathon?: boolean;
  href?: string;
  repo?: string;
}

export const projects: Project[] = [
  {
    code: "P.01",
    name: "vulntriage — CVE re-ranking",
    summary:
      "pip-audit ranks every CVE by raw CVSS. vulntriage re-ranks by real exploitability using NVD, CISA KEV, and EPSS — so you fix what's actually reachable first.",
    baseline: "raw CVSS, alert fatigue",
    optimised: "reachable-first, real exploitability",
    result: "published on PyPI, real users",
    resultTone: "best",
    repo: "https://github.com/Nivish-21/vulntriage",
  },
  {
    code: "P.02",
    name: "Stealth agent system — regulated procurement",
    summary:
      "A stealth AI agent system for a regulated, overlooked market. Six specialised agents cover discovery, scoring, and drafting — with a self-correcting loop that grades its own work.",
    baseline: "manual discovery, manual drafting",
    optimised: "6-agent pipeline, self-grading loop",
    result: "working MVP, deployed live",
    resultTone: "mark",
  },
  {
    code: "P.03",
    name: "Scraper — crash-resilient bulk image pull",
    summary:
      "Bulk image downloads across 100k+ row datasets. Started as one script; five files later, each one exists because something broke in production last time.",
    baseline: "O(n) checks, no resume",
    optimised: "O(1) lookups, checkpointed resume",
    result: "crash and resume, same row",
    resultTone: "gain",
    repo: "https://github.com/Nivish-21/Scraper",
  },
  {
    code: "P.04",
    name: "ClaimBand — multi-agent claims adjudication",
    summary:
      "Built for the Band of Agents Hackathon in a week. Four agents, three frameworks, one shared context room for insurance claims — with a full audit trail.",
    baseline: "single framework, no trust",
    optimised: "shared room, structured hand-offs",
    result: "approve, deny, escalate — traceable",
    resultTone: "gain",
    hackathon: true,
    repo: "https://github.com/Nivish-21/Band-of-agents",
  },
  {
    code: "P.05",
    name: "civichero — gamified civic triage",
    summary:
      "Built for the BlockseBlock hackathon. Citizens photograph a civic problem, Gemini Vision triages it in seconds, an agent plans the fix, and a community loop closes it.",
    baseline: "manual reporting, no routing",
    optimised: "Gemini triage, agentic resolution",
    result: "XP, achievements, real engagement",
    resultTone: "gain",
    hackathon: true,
    repo: "https://github.com/Nivish-21/civichero",
  },
];

export interface ExperienceEntry {
  role: string;
  org: string;
  dates: string;
  note?: string;
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
  {
    role: "Founding CTO & Technical Lead",
    org: "CaboCab — ride-hailing platform",
    dates: "Jun 2024 — Present",
    note: "part-time through final year of university, full-time from Jun 2025",
    highlights: [
      "Took CaboCab from zero to one — sole technical owner, from idea through architecture to a platform live in production today.",
      "Built the in-app chat SDK and the real-time reliability layer: WhatsApp + Twilio alert escalation, offline-first write resilience.",
      "Live in production, with reach extended into more districts through partnerships with other builders running it alongside mine.",
    ],
  },
  {
    role: "Founder",
    org: "Stealth AI agent system — regulated, overlooked market",
    dates: "2026 — Present",
    highlights: [
      "Six-agent architecture with a self-correcting draft/grade loop, running off a shared context layer.",
      "Built solo, end to end, with an AI-native workflow (Claude Code, Cursor) — the same 0-to-1 speed as CaboCab, from day one.",
      "Working MVP, deployed.",
    ],
  },
];

export const hud = {
  shipped: 5,
  liveCoverage: 6,
  bestSector: "CaboCab",
  discipline: 2,
};

export type RoleVisualKind = "grid" | "lights" | "headset" | "wheel";

export interface RoleCard {
  title: string;
  tag: string;
  status: string;
  color: "green" | "accent" | "purple" | "yellow";
  readiness: number;
  visual: RoleVisualKind;
}

export const openToRoles: RoleCard[] = [
  {
    title: "Backend Developer",
    tag: "APIs + systems",
    status: "ON GRID",
    color: "green",
    readiness: 90,
    visual: "grid",
  },
  {
    title: "Full-Stack Developer",
    tag: "End-to-end builds",
    status: "LIGHTS OUT",
    color: "accent",
    readiness: 95,
    visual: "lights",
  },
  {
    title: "Project Manager / Technical Lead",
    tag: "Strategy + delivery",
    status: "PIT WALL",
    color: "purple",
    readiness: 70,
    visual: "headset",
  },
  {
    title: "Founding Engineer",
    tag: "0 → 1, fast",
    status: "FORMATION LAP",
    color: "yellow",
    readiness: 95,
    visual: "wheel",
  },
];

export interface Education {
  degree: string;
  institution: string;
  dates: string;
  detail: string;
}

export const education: Education = {
  degree: "B.E. Computer Science Engineering",
  institution: "Loyola Institute of Technology and Science, Thovalai",
  dates: "Jun 2021 — May 2025",
  detail: "CGPA 8.18 / 10",
};

export const contact = {
  email: "nivishv2004@gmail.com",
  github: "https://github.com/Nivish-21",
  linkedin: "https://www.linkedin.com/in/nivish-vincent-raj/",
};
