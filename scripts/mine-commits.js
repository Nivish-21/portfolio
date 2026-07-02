/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const OUT_PATH = path.join(__dirname, "../src/lib/commits.json");

try {
  // Execute git log to get the last 8 commits
  // format: %h (short hash) | %s (subject) | %ad (author date) formatted as HH:MM
  const stdout = execSync(
    'git log -n 8 --pretty=format:"%h|%s|%ad" --date=format:"%H:%M"',
    { encoding: "utf-8" }
  );

  const commits = stdout
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, message, time] = line.split("|");
      return { hash, message, time };
    });

  // Ensure target folder exists
  const dir = path.dirname(OUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(commits, null, 2), "utf-8");
  console.log(`✓ Mined ${commits.length} local git commits successfully.`);
} catch (error) {
  console.error("Warning: Failed to mine git commits. Creating fallback logs.", error.message);
  // Fallback empty array so the site still builds even if git is unavailable
  fs.writeFileSync(OUT_PATH, JSON.stringify([], null, 2), "utf-8");
}
