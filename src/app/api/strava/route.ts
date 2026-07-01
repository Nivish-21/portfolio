import { NextResponse } from "next/server";

interface TelemetryRun {
  name: string;
  distanceKm: number;
  paceMinKm: string;
  durationMin: string;
  avgHeartRate: number;
  avgCadence: number;
  zones: { z2: number; z3: number; z4: number };
  date: string;
  source: "live" | "mock";
}

const MOCK_RUN: TelemetryRun = {
  name: "Intervals // Tempo Optimisation",
  distanceKm: 8.2,
  paceMinKm: "4:28",
  durationMin: "36:38",
  avgHeartRate: 159,
  avgCadence: 174,
  zones: { z2: 15, z3: 35, z4: 50 },
  date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
  source: "mock",
};

export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    // Keys missing - return mock data with a fallback header
    return NextResponse.json(MOCK_RUN);
  }

  try {
    // 1. Refresh OAuth access token
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Strava token refresh failed.");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch latest runs
    const activitiesResponse = await fetch(
      "https://www.strava.com/api/v3/athlete/activities?per_page=3",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!activitiesResponse.ok) {
      throw new Error("Failed to fetch Strava activities.");
    }

    const activities = (await activitiesResponse.json()) as Array<{
      type: string;
      distance: number;
      moving_time: number;
      average_heartrate?: number;
      average_cadence?: number;
      name: string;
      start_date: string;
    }>;

    // 3. Find latest run activity
    const run = activities.find((act) => act.type === "Run");

    if (!run) {
      // Fallback if no runs in recent activities
      return NextResponse.json(MOCK_RUN);
    }

    const distanceKm = Number((run.distance / 1000).toFixed(2));
    const movingTimeSec = run.moving_time;
    const paceTotalSec = Math.round(movingTimeSec / distanceKm);
    const paceMin = Math.floor(paceTotalSec / 60);
    const paceSec = String(paceTotalSec % 60).padStart(2, "0");
    const paceMinKm = `${paceMin}:${paceSec}`;

    const durMin = Math.floor(movingTimeSec / 60);
    const durSec = String(movingTimeSec % 60).padStart(2, "0");
    const durationMin = `${durMin}:${durSec}`;

    const avgHeartRate = Math.round(run.average_heartrate || 145);
    const avgCadence = Math.round((run.average_cadence || 87) * 2); // Strava returns half-cadence (rpm vs spm)

    // Calculate approximate HR Zones distribution based on avg HR
    // Zone 2 (aerobic <140), Zone 3 (tempo 140-155), Zone 4 (threshold 155+)
    let zones = { z2: 60, z3: 30, z4: 10 };
    if (avgHeartRate >= 155) {
      zones = { z2: 15, z3: 35, z4: 50 };
    } else if (avgHeartRate >= 140) {
      zones = { z2: 30, z3: 50, z4: 20 };
    }

    const telemetry: TelemetryRun = {
      name: run.name,
      distanceKm,
      paceMinKm,
      durationMin,
      avgHeartRate,
      avgCadence,
      zones,
      date: run.start_date,
      source: "live",
    };

    return NextResponse.json(telemetry);
  } catch (error) {
    console.error("Strava API fetch error, falling back to mock:", error);
    return NextResponse.json(MOCK_RUN);
  }
}
