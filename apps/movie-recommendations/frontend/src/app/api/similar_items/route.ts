import { NextResponse } from "next/server";
import { SHAPED_API_ENDPOINTS } from "@/constants/shaped";
import { getInteractionsFromServerCookie } from "@/lib/interactions";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Get interactions from cookies
    const cookieHeader = req.headers.get('cookie') || '';
    const interactions = getInteractionsFromServerCookie(cookieHeader);
    
    console.log("/api/similar_items called", {
      payload,
      interactionsCount: interactions.length
    });

    // TODO: Call Shaped tracking API with server-side secret (SHAPED_API_KEY).
    // Example (to be implemented later):
    if (payload?.item_id) {
      const res = await fetch(SHAPED_API_ENDPOINTS.SIMILAR_ITEMS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.SHAPED_API_KEY ?? "",
        },
        body: JSON.stringify({
          item_id: String(payload.item_id),
          return_metadata: true,
        }),
      });

      if (!res.ok) {
        console.error(`Shaped API error: ${res.status} ${res.statusText}`);
        const errorText = await res.text();
        console.error("Shaped API error response:", errorText);
        return NextResponse.json({ ok: false, error: `Shaped API error: ${res.status}` }, { status: 400 });
      }

      const data = await res.json();
      console.log("Shaped API response:", data);
      return NextResponse.json({ ok: true, data }, { status: 202 });
    } else {
        return NextResponse.json({ ok: false, error: "Bad request: item_id is missing" }, { status: 400 });
    }
  } catch (err) {
    console.error("similar_items route error:", err);
    return NextResponse.json(
      { error: "Failed to get similar items" },
      { status: 400 }
    );
  }
}
