import { NextResponse } from "next/server";
import { getSupabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  // Try Supabase first
  try {
    const db = getSupabase();
    const { data, error } = await db
      .from("site_content")
      .select("data")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Supabase read error:", error.message);
    }

    if (!error && data) {
      return NextResponse.json(data.data, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      });
    }
  } catch (e) {
    console.error("Supabase read exception:", e);
  }

  // Fallback: read from local file
  try {
    const fs = await import("fs");
    const path = await import("path");
    const contentPath = path.join(process.cwd(), "data", "content.json");
    const raw = fs.readFileSync(contentPath, "utf-8");
    return NextResponse.json(JSON.parse(raw), {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}
