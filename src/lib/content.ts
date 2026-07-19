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

/** A smaller case closed inside a bigger one — its own crime, its own fix, no separate suspects. */
export interface SubCase {
  crime: string;
  fix: string;
}

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
  /** Other cases closed in the same file, listed after the headline fix. */
  subCases?: SubCase[];
}

export const cases: Case[] = [
  {
    no: "01",
    title: "The Fare That Lied",
    meta: "CaboCab · production platform",
    crime:
      "Riders were being charged for distances they had not travelled. The meter was honest. The map was honest. The number was still wrong — routes were running 5 to 10% short against the real road network.",
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
    fix: "Self-hosted OSRM map-matching, in Docker, reconstructs the real route from raw GPS traces — correcting the 5-10% drift and cutting fare disputes on long rides.",
    evidence: {
      kind: "sealed",
      note: "Client system. The evidence stays in the building.",
    },
    subCases: [
      {
        crime: "Riders saw the same message land twice. Sometimes three times.",
        fix: "Idempotency keys on the chat SDK, so a retry is recognised, not repeated.",
      },
      {
        crime:
          "A container memory leak the team had already marked fixed. Idle driver-customer WebSockets stayed open after the admin link closed, and accumulated.",
        fix: "Fixed the idle-connection handling, validated under real pilot load.",
      },
      {
        crime:
          "Submarine cables cut in the Red Sea (Sept 2025) took out the DigitalOcean VPS connection mid-trip.",
        fix: "Offline-first write resilience — data queues locally and syncs automatically on reconnect.",
      },
      {
        crime:
          "A third-party Maps API was quietly firing every 10 seconds per driver device instead of once, burning through the free tier at roughly ₹12,000 a day.",
        fix: "Traced the call pattern across the whole fleet and fixed the call logic.",
      },
      {
        crime:
          "10 production services with no eyes on them — outages surfaced only when a rider or driver complained.",
        fix: "Automated monitoring with WhatsApp and email alerts, escalating to founders and the board, with a Twilio call as the last resort.",
      },
      {
        crime:
          "Driver feedback after a ride went nowhere — no structured way to collect it, no photos.",
        fix: "A WhatsApp Business API pipeline with direct-to-S3 uploads, now used by support agents across 6 districts.",
      },
    ],
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
];

/**
 * A build shipped against a hackathon brief, under a clock.
 *
 * A case is a mystery uncovered. A hackathon is not: it is a thing built fast to
 * someone else's prompt, on a deadline. So a build has no suspects and no culprit,
 * and — unlike a sealed case — nothing to withhold, which is why the card is open
 * on arrival. The event and the time-box are what honestly mark it as a hackathon;
 * the repo is public, and there is one plain line of what it does.
 */
export interface Build {
  /** The project's own name. */
  name: string;
  /** The event it was built for. Carried on the card, so it always reads as a hackathon. */
  event: string;
  /** How long it actually took. Stamped like a punch-clock — the defining trait. */
  timeBox: string;
  /** One line: what it is, and the one interesting thing about how it works. */
  what: string;
  /** The repository. All public — unlike the sealed cases, none of this is withheld. */
  repo: string;
}

export const builds: Build[] = [
  {
    name: "Switchboard",
    event: "Hermes Buildathon by GrowthX®",
    timeBox: "an afternoon",
    what: "A Telegram ops-desk agent that can post messages and search the web, boxed inside a hard allowlist: every real action gated by exact user and channel ID, and every inbound update claimed once, so a retry can never fire it twice.",
    repo: "https://github.com/Nivish-21/Hermes",
  },
  {
    name: "ClaimBand",
    event: "Band of Agents Hackathon · Track 3",
    timeBox: "7 days",
    what: "Four agents sharing one context room to triage an insurance claim, with a full audit trail — every approve, deny, or escalate traceable to which agent decided it, and why.",
    repo: "https://github.com/Nivish-21/Band-of-agents",
  },
  {
    name: "civichero",
    event: "BlockseBlock Hackathon · Track 2",
    timeBox: "7 days",
    what: "Civic-issue reporting that closes the loop: Gemini Vision triages the report, an agent plans the fix, and the community confirms when it is done, so a problem reported once does not vanish into a queue.",
    repo: "https://github.com/Nivish-21/civichero",
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
      "Inherited a half-built escalation watcher and finished it. Covers 10 production services, tiered alerts over WhatsApp, email, Twilio.",
      "Built a driver feedback pipeline. WhatsApp for reporting, S3 for the image uploads, used by support agents across 6 districts.",
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
  { tool: "Python", usedOn: "Cases 01, 02, 04", primary: true },
  { tool: "JavaScript", usedOn: "Case 01", primary: true },
  { tool: "TypeScript", usedOn: "Case 03", primary: true },
  { tool: "Claude Code", usedOn: "Every case since 2026", primary: true },
  { tool: "Node", usedOn: "Case 05, and Switchboard", primary: true },
  { tool: "Postgres", usedOn: "Cases 01, 05", primary: true },
  { tool: "FastAPI", usedOn: "Case 01 · the chat SDK" },
  { tool: "OSRM", usedOn: "Case 01 · the fare that lied" },
  { tool: "Twilio", usedOn: "Case 01 · the escalation alerts" },
  { tool: "AWS S3", usedOn: "Case 01 · driver feedback uploads" },
  { tool: "Next.js", usedOn: "Case 04 · Scraper" },
  { tool: "React", usedOn: "Case 05, and civichero" },
  { tool: "OpenAI API", usedOn: "Case 05 · QueueCutter" },
  { tool: "Convex", usedOn: "Switchboard" },
  { tool: "Docker", usedOn: "Case 01 · self-hosting OSRM" },
  { tool: "Cursor", usedOn: "In the daily loop" },
  { tool: "PHP / Laravel", usedOn: "One small project, briefly" },
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
