import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function verifyAuth(token: string): Promise<boolean> {
  try {
    const db = getSupabase();
    const { data } = await db.from("admin_settings").select("password").eq("id", 1).single();
    if (data && token === data.password) return true;
  } catch {}
  return token === process.env.ADMIN_PASSWORD;
}

export async function PUT(request: NextRequest) {
  const token = (request.headers.get("authorization") || "").replace("Bearer ", "");
  if (!(await verifyAuth(token))) return unauthorized();

  try {
    const body = await request.json();

    // Always write to local file first (reliable fallback)
    try {
      const fs = await import("fs");
      const path = await import("path");
      fs.writeFileSync(path.join(process.cwd(), "data", "content.json"), JSON.stringify(body, null, 2), "utf-8");
    } catch (e) {
      console.error("Local file write failed:", e);
    }

    // Also write to Supabase
    try {
      const db = getSupabase();
      const { error } = await db.from("site_content").upsert({
        id: 1, data: body, updated_at: new Date().toISOString(),
      });
      if (error) console.error("Supabase write error:", error.message);
    } catch (e) {
      console.error("Supabase write exception:", e);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
