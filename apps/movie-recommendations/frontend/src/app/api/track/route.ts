import { NextResponse } from "next/server";
import { SHAPED_API_ENDPOINTS } from "@/constants/shaped";
import { getInteractionsFromServerCookie } from "@/lib/interactions";

interface TrackPayload {
  event_value: string;
  movieId: string | number;
  timestamp: string;
  userId: string;
}

export async function POST(req: Request) {
  try {
    const payload: TrackPayload = await req.json();
    
    // Get interactions from cookies
    const cookieHeader = req.headers.get('cookie') || '';
    const interactions = getInteractionsFromServerCookie(cookieHeader);
    
    console.log("/api/track called", {
      event_value: payload?.event_value,
      movieId: payload?.movieId,
      timestamp: payload?.timestamp,
      userId: payload?.userId,
      interactionsCount: interactions.length,
      recentInteractions: interactions.slice(-5) // Log last 5 interactions for debugging
    });

    // TODO: Call Shaped tracking API with server-side secret (SHAPED_API_KEY).
    // Example (to be implemented later):
    const res = await fetch(SHAPED_API_ENDPOINTS.EVENTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.SHAPED_API_KEY_WRITE ?? "",
      },
      body: JSON.stringify({
        data: [
          {...payload}
        ]
      }),
    });

    const data = await res.text()
    console.log({data})

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch (err) {
    console.error("Track route error:", err);
    return NextResponse.json({ error: "Failed to track event" }, { status: 400 });
  }
}


