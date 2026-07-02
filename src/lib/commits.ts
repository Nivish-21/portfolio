import rawCommits from "./git-commits.json";

export interface CommitEntry {
  version: number;
  message: string;
}

const commitsByCode = rawCommits as Record<string, CommitEntry[]>;

export function getCommitTrail(code: string): CommitEntry[] {
  return commitsByCode[code] ?? [];
}
