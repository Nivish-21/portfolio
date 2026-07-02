import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const LEADERBOARD_KEY = "race:leaderboard";
const MAX_NAME_LENGTH = 16;
const MAX_ENTRIES = 5;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ entries: [], offline: true });
  }
  try {
    const raw = await redis.zrange<unknown[]>(LEADERBOARD_KEY, 0, MAX_ENTRIES - 1, { withScores: true });
    const entries: { name: string; timeMs: number }[] = [];
    
    if (raw.length > 0) {
      if (typeof raw[0] === "object" && raw[0] !== null && "member" in raw[0]) {
        // If it's Array<{ member: string, score: number }>
        for (const item of raw) {
          const obj = item as Record<string, unknown>;
          entries.push({ name: String(obj.member), timeMs: Number(obj.score) });
        }
      } else {
        // Alternating flat array: [name, score, name, score]
        for (let i = 0; i < raw.length; i += 2) {
          if (raw[i] !== undefined && raw[i + 1] !== undefined) {
            entries.push({ name: String(raw[i]), timeMs: Number(raw[i + 1]) });
          }
        }
      }
    }
    
    return NextResponse.json({ entries, offline: false });
  } catch (err) {
    console.error("Leaderboard GET error:", err);
    return NextResponse.json({ entries: [], offline: true });
  }
}

export async function POST(request: NextRequest) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Leaderboard offline" }, { status: 503 });
  }

  try {
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("name" in body) ||
      !("timeMs" in body) ||
      typeof (body as { name: unknown }).name !== "string" ||
      typeof (body as { timeMs: unknown }).timeMs !== "number"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const name = (body as { name: string }).name.trim().slice(0, MAX_NAME_LENGTH);
    const timeMs = (body as { timeMs: number }).timeMs;
    if (!name || !Number.isFinite(timeMs) || timeMs <= 0 || timeMs > 10 * 60 * 1000) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // zadd with GT (only update if score is less, wait, Redis ZADD doesn't have GT for lower score, 
    // wait: in standard Redis, ZADD score is ascending, so a smaller lap time is better. 
    // zadd options: { nx: false, xx: false, ch: false, incr: false, lt: false, gt: false }
    // Wait! A lower score (shorter lap time) is better, so if a member already exists, we only want to 
    // update if the new time is LESS than the existing time.
    // In Redis ZADD, "LT" option means "Only update existing elements if the new score is less than the current score."
    // Yes! LT (Less Than) is the correct option for smaller lap times.
    await redis.zadd(LEADERBOARD_KEY, { lt: true }, { score: timeMs, member: name });
    await redis.zremrangebyrank(LEADERBOARD_KEY, MAX_ENTRIES, -1);
    
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Leaderboard POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
