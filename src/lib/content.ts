/**
 * The case files.
 *
 * Every project is a case, every bug a suspect, every fix a deduction. The
 * shape below is the whole site: a crime, the suspects you can eliminate, the
 * culprit that survives, and the evidence — which is either a repository you
 * can go and read, or a seal, because some of it genuinely cannot be shown.
 */

/** A line of enquiry that went nowhere. Struck out, with the reason it failed. */
export interface Suspect {
  claim: string;
  ruledOut: string;
}

/**
 * Where the proof lives. `repo` links out. `sealed` does not, and says so in
 * character — CaboCab is a client system and the agent system is stealth, so
 * there is nothing to link and pretending otherwise would be dishonest.
 */
export type Evidence =
  | { kind: "repo"; href: string; label: string }
  | { kind: "sealed"; note: string };

export interface Case {
  /** Zero-padded, and stable: the case number is how a case is referred to. */
  no: string;
  title: string;
  /** The plain fact under the evocative title, so a recruiter can still scan. */
  meta: string;
  crime: string;
  suspects: Suspect[];
  culprit: string;
  fix: string;
  evidence: Evidence;
  /** How long the build actually took, so it never reads as production work. */
  timeBoxed?: string;
}

export const cases: Case[] = [
  {
    no: "01",
    title: "The Fare That Lied",
    meta: "CaboCab · OSRM",
    crime:
      "Riders were being charged for distances they had not travelled. The meter was honest. The map was honest. The number was still wrong.",
    suspects: [
      {
        claim: "The GPS signal was noisy",
        ruledOut: "filtering helped, and the gap survived",
      },
      {
        claim: "The pricing maths was off",
        ruledOut: "the arithmetic checked out every time",
      },
    ],
    culprit: "We were measuring in a straight line. Roads are not straight.",
    fix: "Route it through the real road network with OSRM.",
    evidence: {
      kind: "sealed",
      note: "Client system. The evidence stays in the building.",
    },
  },
  {
    no: "02",
    title: "The Flood of False Alarms",
    meta: "vulntriage · PyPI",
    crime:
      "Every scan returned hundreds of critical CVEs. Nobody could act on hundreds. So nobody acted on any of them, and the one that mattered sat in the pile.",
    suspects: [
      {
        claim: "Too many dependencies",
        ruledOut: "cutting them changed nothing",
      },
      {
        claim: "The scanner was wrong",
        ruledOut: "every finding was technically true",
      },
    ],
    culprit: "It ranked by severity. Severity is not the same as reachable.",
    fix: "Re-rank by real exploitability. NVD, CISA KEV, EPSS.",
    evidence: {
      kind: "repo",
      href: "https://github.com/Nivish-21/vulntriage",
      label: "Read the evidence",
    },
  },
  {
    no: "03",
    title: "The Agent That Lied Confidently",
    meta: "Stealth · live",
    crime:
      "The output was fluent, well-argued, and wrong. It never hesitated. That was the tell: nothing in the system was ever asked to check its own work.",
    suspects: [
      {
        claim: "A weak model",
        ruledOut: "a stronger one lied more persuasively",
      },
      {
        claim: "A bad prompt",
        ruledOut: "six agents just contradicted each other instead",
      },
    ],
    culprit:
      "No shared memory, and no grader. Confidence with nothing behind it.",
    fix: "A shared context layer, and a loop that grades its own drafts.",
    evidence: {
      kind: "sealed",
      note: "Stealth company. This file stays shut.",
    },
  },
  {
    no: "04",
    title: "The Job That Died at Row 60,000",
    meta: "Scraper · 100k+ rows",
    crime:
      "A bulk image pull across a very large dataset. It ran for hours, fell over near the end, and there was no way to do anything but start again from zero.",
    suspects: [
      {
        claim: "The network dropped",
        ruledOut: "retries did not save the run",
      },
      {
        claim: "It ran out of memory",
        ruledOut: "it died at the same place with room to spare",
      },
    ],
    culprit: "O(n) lookups, and no memory of where it had got to.",
    fix: "O(1) lookups, checkpointed. Crash it, resume it, same row.",
    evidence: {
      kind: "repo",
      href: "https://github.com/Nivish-21/Scraper",
      label: "Read the evidence",
    },
  },
  {
    no: "05",
    title: "The Message That Arrived Twice",
    meta: "CaboCab · chat SDK",
    crime:
      "Riders saw the same message land twice. Sometimes three times. Everyone assumed a bug in the client, because that is always the easy answer.",
    suspects: [
      {
        claim: "The client re-rendered",
        ruledOut: "the duplicates were real, and in the database",
      },
      {
        claim: "A double tap on send",
        ruledOut: "it happened with no user in the room at all",
      },
    ],
    culprit: "A retry that had no way of knowing it was the same message.",
    fix: "Idempotency keys, so a retry is recognised, not repeated.",
    evidence: {
      kind: "sealed",
      note: "Client system. The evidence stays in the building.",
    },
  },
  {
    no: "06",
    title: "The Cables Cut in the Red Sea",
    meta: "CaboCab · Sept 2025",
    crime:
      "In September 2025, submarine cables in the Red Sea were cut and a large part of the region's connectivity degraded. Drivers were mid-trip. The app stayed up.",
    suspects: [
      {
        claim: "Wait for the network to come back",
        ruledOut: "it did not, for a long time",
      },
      {
        claim: "Fail loudly and stop",
        ruledOut: "a driver on a live trip cannot stop",
      },
    ],
    culprit:
      "Anything that assumes the network is a bet you will eventually lose.",
    fix: "A location sync designed offline first, well before it was needed.",
    evidence: {
      kind: "sealed",
      note: "Client system. The evidence stays in the building.",
    },
  },
  {
    no: "07",
    title: "The Claim Nobody Could Trace",
    meta: "ClaimBand · hackathon",
    crime:
      "An insurance claim gets approved, denied, or escalated, and afterwards nobody can say which agent decided what, or why. An unauditable decision is not a decision.",
    suspects: [
      {
        claim: "Use one framework for everything",
        ruledOut: "it still could not show its working",
      },
    ],
    culprit: "The agents had no shared room, so no hand-off was ever recorded.",
    fix: "Four agents, one shared context room, a full audit trail.",
    evidence: {
      kind: "repo",
      href: "https://github.com/Nivish-21/Band-of-agents",
      label: "Read the evidence",
    },
    timeBoxed: "7 days",
  },
  {
    no: "08",
    title: "The Pothole Nobody Reported Twice",
    meta: "civichero · hackathon",
    crime:
      "Citizens report a civic problem once. It vanishes into a queue, nothing visibly happens, and they never report anything again. The reporting was not the broken part.",
    suspects: [
      {
        claim: "People do not care",
        ruledOut: "they cared enough to report it the first time",
      },
    ],
    culprit: "Nothing ever closed the loop back to the person who reported it.",
    fix: "Gemini Vision triages it, an agent plans it, the community closes it.",
    evidence: {
      kind: "repo",
      href: "https://github.com/Nivish-21/civichero",
      label: "Read the evidence",
    },
    timeBoxed: "7 days",
  },
  {
    no: "09",
    title: "The Form Nobody Finished",
    meta: "QueueCutter · US/India/UK",
    crime:
      "Government paperwork was going unread halfway through. The words were plain English. Nobody could tell what the form was actually asking for, or what would get it rejected.",
    suspects: [
      {
        claim: "The forms needed simpler language",
        ruledOut:
          "the plain-English rewrite still lost people at the same point",
      },
      {
        claim: "People just didn't have the documents",
        ruledOut: "most gave up before reaching the document list at all",
      },
    ],
    culprit:
      "Nobody could see the rejection coming until after they'd already submitted.",
    fix: "Turn the form into a guided conversation, and score the rejection risk before submission, not after.",
    evidence: {
      kind: "repo",
      href: "https://github.com/Nivish-21/QueueCutter",
      label: "Read the evidence",
    },
  },
  {
    no: "10",
    title: "The Bot That Never Overstepped",
    meta: "Switchboard · Telegram ops desk",
    crime:
      "An agent that can post messages and search the web is one bad turn away from spamming a channel or replying to a stranger. Most of the danger was never the model being wrong — it was what it was allowed to do about it.",
    suspects: [
      {
        claim: "Just don't give it write access",
        ruledOut: "then it can't do the one job it exists for",
      },
      {
        claim: "Retry it if a send fails",
        ruledOut: "a retried message is a duplicated message",
      },
    ],
    culprit:
      "An action with no boundary, and a retry with no memory of what it already did.",
    fix: "Allowlist every real action by exact user/channel ID, and durably claim each inbound update once, so a retry can't fire it twice.",
    evidence: {
      kind: "repo",
      href: "https://github.com/Nivish-21/Hermes",
      label: "Read the evidence",
    },
    timeBoxed: "an afternoon",
  },
];

/** A signed statement. `redacted` blacks out in the markup, honestly. */
export interface Statement {
  org: string;
  role: string;
  dates: string;
  lines: string[];
  /** Text that must be blacked out. The stealth company genuinely cannot be named. */
  redacted?: string;
  signOff: string;
}

export const testimony: Statement[] = [
  {
    org: "CaboCab",
    role: "Founding CTO & Technical Lead",
    dates: "Jun 2024 → now",
    lines: [
      "Sole technical owner. Idea, architecture, and a ride-hailing platform live in production today.",
      "Built the chat SDK end to end. Idempotency keys, so a message can never double-deliver.",
      "Inherited a half-built escalation watcher and finished it. Tiered alerts over WhatsApp, email, Twilio.",
      "Built a driver feedback pipeline. WhatsApp for reporting, S3 for the image uploads.",
      "Found and killed a Google Maps API cost anomaly by going through the Cloud billing data.",
      "Still in production, and now running in more districts through other builders who took it on.",
    ],
    signOff: "Statement of the witness · signed NVR",
  },
  {
    org: "Stealth AI agent system",
    role: "Founder",
    dates: "Jun 2026 → now",
    lines: [
      "Six agents over a shared context layer, with a draft and grade loop that corrects its own work.",
      "Built solo and AI-native. Claude Code and Cursor in the daily loop.",
      "Same zero to one speed as CaboCab, from day one.",
      "Live and in active use, now being rearchitected toward a genuinely agentic core.",
    ],
    redacted: "a market I cannot name",
    signOff: "Statement withheld in part · by request",
  },
];

/**
 * The evidence board. Each tool is pinned to the case it actually cracked —
 * not to a frequency ("daily", "often"), which is unfalsifiable and, for most
 * of these, untrue.
 */
export interface Pin {
  tool: string;
  /** Where it was used. This is the claim, and it has to be checkable. */
  usedOn: string;
  /** Reached for on nearly every case. Lit on the board. */
  primary?: boolean;
}

export const evidenceBoard: Pin[] = [
  { tool: "Python", usedOn: "Cases 02, 04", primary: true },
  { tool: "JavaScript", usedOn: "Cases 01, 05", primary: true },
  { tool: "TypeScript", usedOn: "Cases 03, 05", primary: true },
  { tool: "Claude Code", usedOn: "Every case since 2026", primary: true },
  { tool: "Node", usedOn: "Case 05 · the chat SDK", primary: true },
  { tool: "Postgres", usedOn: "Cases 01, 05, 09", primary: true },
  { tool: "OSRM", usedOn: "Case 01 · the fare that lied" },
  { tool: "Twilio", usedOn: "The escalation alerts" },
  { tool: "AWS S3", usedOn: "Driver feedback uploads" },
  { tool: "Next.js", usedOn: "Case 04 · Scraper" },
  { tool: "React", usedOn: "Cases 08, 09" },
  { tool: "OpenAI API", usedOn: "Case 09 · QueueCutter" },
  { tool: "Convex", usedOn: "Case 10 · Switchboard" },
  { tool: "Docker", usedOn: "Shipping all of it" },
  { tool: "Cursor", usedOn: "In the daily loop" },
  { tool: "PHP / Laravel", usedOn: "Where I started" },
];

export interface Credential {
  issuer: string;
  name: string;
  issued: string;
  /** The issuer's own verification page. An unverifiable claim is decoration. */
  verifyUrl: string;
}

export const credentials: Credential[] = [
  {
    issuer: "Palantir",
    name: "Winter Tech Fellowship",
    issued: "Jul 2026",
    verifyUrl: "https://verify.skilljar.com/c/8pz5mykb5cee",
  },
  {
    issuer: "Anthropic",
    name: "AI Fluency: Framework & Foundations",
    issued: "Jun 2026",
    verifyUrl: "https://verify.skilljar.com/c/2fwxu4p7ikpi",
  },
  {
    issuer: "Anthropic",
    name: "Claude 101",
    issued: "Jun 2026",
    verifyUrl: "https://verify.skilljar.com/c/znwonurjd2nk",
  },
  {
    issuer: "Oracle",
    name: "OCI Certified AI Foundations Associate",
    issued: "Oct 2025",
    verifyUrl:
      "https://catalog-education.oracle.com/pls/certview/sharebadge?id=3C4285627E1E0D476E66D051F3664A4CD5389499E718B6873EB16B6B21B3C455",
  },
];

export const takingCases = [
  "Backend",
  "Full-stack",
  "Technical lead",
  "Founding engineer",
];

export const education = {
  degree: "B.E. Computer Science",
  institution: "Loyola Institute of Technology and Science, Thovalai",
  dates: "2021 → 2025",
  detail: "CGPA 8.18",
};

export const contact = {
  email: "nivishv2004@gmail.com",
  github: "https://github.com/Nivish-21",
  linkedin: "https://www.linkedin.com/in/nivish-vincent-raj/",
};
