import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required transmission components." },
        { status: 400 }
      );
    }

    // Process submission: Log radio transmission in server logs
    console.log("\n====================================");
    console.log("🏎️  INCOMING PIT-TO-CAR TRANSMISSION");
    console.log(`[Time]  ${new Date().toISOString()}`);
    console.log(`[Call Sign]      ${name}`);
    console.log(`[Return Channel] ${email}`);
    console.log("------------------------------------");
    console.log("[Content]");
    console.log(message);
    console.log("====================================\n");

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      transmissionId: `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    });
  } catch (error) {
    console.error("Error handling telemetry transmission:", error);
    return NextResponse.json(
      { success: false, error: "Internal Telemetry Error" },
      { status: 500 }
    );
  }
}
