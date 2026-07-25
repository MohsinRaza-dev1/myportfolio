import { NextResponse } from "next/server";
import { getSupabase } from "../../../lib/supabase";
// trigger deploy

export async function GET() {
  // Try Supabase first
  try {
    const db = getSupabase();
    const { data, error } = await db
      .from("site_content")
      .select("data")
      .eq("id", 1)
      .single();

    if (!error && data) {
      return NextResponse.json(data.data);
    }
  } catch {
    // fall through
  }

  // Fallback: read from local file
  try {
    const fs = await import("fs");
    const path = await import("path");
    const contentPath = path.join(process.cwd(), "data", "content.json");
    const raw = fs.readFileSync(contentPath, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}
