import {
  siPython,
  siTypescript,
  siJavascript,
  siOpenjdk,
  siReact,
  siNextdotjs,
  siTailwindcss,
  siVite,
  siNodedotjs,
  siExpress,
  siFastapi,
  siPostgresql,
  siMongodb,
  siRedis,
  siFirebase,
  siLanggraph,
  siGooglegemini,
  siAnthropic,
  siCrewai,
  siDocker,
  siGooglecloud,
  siVercel,
  siRender,
  siDigitalocean,
  siLinux,
  siNginx,
  siGit,
  siPytest,
  siPypi,
  siWhatsapp,
  siClaudecode,
  siCursor,
} from "simple-icons";

export interface Skill {
  name: string;
  hex: string;
  path: string;
  /** True for icons whose brand mark is near-black (e.g. #000000/#0A0A0A/#191919) —
   * these render invisibly against the dark panel background unless given a light
   * backdrop chip instead of a transparent one. */
  dark?: boolean;
}

export interface SkillFallback {
  name: string;
  label: string;
}

export type SkillEntry = Skill | SkillFallback;

export function isSkillFallback(entry: SkillEntry): entry is SkillFallback {
  return !("path" in entry);
}

export interface SkillGroup {
  label: string;
  items: SkillEntry[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "Python", hex: siPython.hex, path: siPython.path },
      { name: "TypeScript", hex: siTypescript.hex, path: siTypescript.path },
      { name: "JavaScript", hex: siJavascript.hex, path: siJavascript.path },
      { name: "Java", hex: siOpenjdk.hex, path: siOpenjdk.path, dark: true },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "React", hex: siReact.hex, path: siReact.path },
      { name: "Next.js", hex: siNextdotjs.hex, path: siNextdotjs.path, dark: true },
      { name: "Tailwind CSS", hex: siTailwindcss.hex, path: siTailwindcss.path },
      { name: "Vite", hex: siVite.hex, path: siVite.path },
    ],
  },
  {
    label: "Backend & data",
    items: [
      { name: "Node.js", hex: siNodedotjs.hex, path: siNodedotjs.path },
      { name: "Express", hex: siExpress.hex, path: siExpress.path, dark: true },
      { name: "FastAPI", hex: siFastapi.hex, path: siFastapi.path },
      { name: "PostgreSQL", hex: siPostgresql.hex, path: siPostgresql.path },
      { name: "MongoDB", hex: siMongodb.hex, path: siMongodb.path },
      { name: "Redis", hex: siRedis.hex, path: siRedis.path },
      { name: "Firebase", hex: siFirebase.hex, path: siFirebase.path },
      { name: "OSRM", label: "OSRM" },
    ],
  },
  {
    label: "AI & agents",
    items: [
      { name: "LangGraph", hex: siLanggraph.hex, path: siLanggraph.path },
      { name: "Gemini", hex: siGooglegemini.hex, path: siGooglegemini.path },
      { name: "Anthropic Claude", hex: siAnthropic.hex, path: siAnthropic.path, dark: true },
      { name: "CrewAI", hex: siCrewai.hex, path: siCrewai.path },
      { name: "Groq", label: "Groq" },
    ],
  },
  {
    label: "Cloud & infra",
    items: [
      { name: "Docker", hex: siDocker.hex, path: siDocker.path },
      { name: "AWS", label: "AWS" },
      { name: "Google Cloud", hex: siGooglecloud.hex, path: siGooglecloud.path },
      { name: "Vercel", hex: siVercel.hex, path: siVercel.path, dark: true },
      { name: "Render", hex: siRender.hex, path: siRender.path, dark: true },
      { name: "DigitalOcean", hex: siDigitalocean.hex, path: siDigitalocean.path },
      { name: "Linux", hex: siLinux.hex, path: siLinux.path },
      { name: "Nginx", hex: siNginx.hex, path: siNginx.path },
    ],
  },
  {
    label: "Tools & practice",
    items: [
      { name: "Git", hex: siGit.hex, path: siGit.path },
      { name: "Playwright", label: "PW" },
      { name: "pytest", hex: siPytest.hex, path: siPytest.path },
      { name: "PyPI", hex: siPypi.hex, path: siPypi.path },
      { name: "Twilio", label: "Twilio" },
      { name: "WhatsApp API", hex: siWhatsapp.hex, path: siWhatsapp.path },
      { name: "Claude Code", hex: siClaudecode.hex, path: siClaudecode.path, dark: true },
      { name: "Cursor", hex: siCursor.hex, path: siCursor.path, dark: true },
    ],
  },
];
