import { SHAPED_API_ENDPOINTS } from "@/constants/shaped";
import { NextResponse } from "next/server";
import { getInteractionsFromServerCookie } from "@/lib/interactions";

const token = process.env.SHAPED_API_KEY ?? "";

export async function POST(req: Request) { 
    try {
        const payload = await req.json();
        
        // Get interactions from cookies
        const cookieHeader = req.headers.get('cookie') || '';
        const interactions = getInteractionsFromServerCookie(cookieHeader);
        
        console.log("/api/retrieve called", {
            payload,
            interactionsCount: interactions.length,
        });
        
        const res = await fetch(SHAPED_API_ENDPOINTS.RETRIEVE, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": token,
            },
            body: JSON.stringify({
                ...payload,
            }
        )
        })
        const data = await res.json()
        return NextResponse.json({ ok: true, data }, { status: 202 });
    } catch (error) {
        console.error('Error in rank API:', error);
        return NextResponse.json(
            { ok: false, error: 'Internal server error' }, 
            { status: 500 }
        );
    }
}