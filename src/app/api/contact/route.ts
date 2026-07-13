import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { contact } from "@/lib/content";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Call sign required.")
    .max(100, "Call sign too long."),
  email: z.string().trim().email("Invalid return channel path.").max(255),
  message: z
    .string()
    .trim()
    .min(1, "Transmission content empty.")
    .max(5000, "Transmission too long."),
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
// Per-instance, in-memory limiter: best-effort deterrent against a single
// abusive client, not a distributed rate limit. Fine at portfolio scale;
// Fluid Compute reuses this instance across requests so it isn't a no-op.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);

  if (timestamps.length > RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, timestamps);
    return true;
  }

  requestLog.set(ip, timestamps);
  // Bound memory growth: drop entries that have aged out entirely.
  for (const [key, value] of requestLog) {
    if (value.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
      requestLog.delete(key);
    }
  }
  return false;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many transmissions. Wait before retrying.",
      },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Invalid transmission.",
        },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error(
        "[Pit-to-car] RESEND_API_KEY not configured — transmission not delivered.",
      );
      return NextResponse.json(
        {
          success: false,
          error: "Comms relay not configured. Email directly instead.",
        },
        { status: 503 },
      );
    }

    const { name, email, message } = parsed.data;
    const resend = new Resend(apiKey);
    const { error: sendError } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: contact.email,
      replyTo: email,
      subject: `Pit-to-car transmission from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (sendError) {
      console.error("[Pit-to-car] Resend send failed:", sendError.message);
      return NextResponse.json(
        {
          success: false,
          error: "Transmission failed to relay. Try emailing directly.",
        },
        { status: 502 },
      );
    }

    // Deliberately not logging name/email/message: these are the sender's
    // personal data and have no reason to sit in server logs.
    console.log(
      `[Pit-to-car] transmission relayed at ${new Date().toISOString()}`,
    );

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      transmissionId: `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    });
  } catch (error) {
    console.error("Error handling telemetry transmission:", error);
    return NextResponse.json(
      { success: false, error: "Internal Telemetry Error" },
      { status: 500 },
    );
  }
}
