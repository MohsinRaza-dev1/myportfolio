import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "CDN-Cache-Control": "no-cache",
  "Vercel-CDN-Cache-Control": "no-cache",
};

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Try Supabase first (direct REST API — more reliable on serverless)
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/site_content?id=eq.1&select=data`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0 && rows[0].data) {
          return NextResponse.json(rows[0].data, { headers: CACHE_HEADERS });
        }
      } else {
        console.error("Supabase REST error:", res.status, await res.text());
      }
    } catch (e) {
      console.error("Supabase REST exception:", e);
    }
  }

  // Fallback: read from local file
  try {
    const fs = await import("fs");
    const path = await import("path");
    const contentPath = path.join(process.cwd(), "data", "content.json");
    const raw = fs.readFileSync(contentPath, "utf-8");
    return NextResponse.json(JSON.parse(raw), { headers: CACHE_HEADERS });
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}
