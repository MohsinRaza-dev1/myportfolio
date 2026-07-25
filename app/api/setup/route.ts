import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const supabase = createClient(url, key, { db: { schema: "public" } });
  const results: any[] = [];

  // Refresh schema cache by touching a known table and retrying
  for (let attempt = 1; attempt <= 10; attempt++) {
    // Use ADMIN_PASSWORD env var, fall back to a default only if not set
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";
    const { error } = await supabase
      .from("admin_settings")
      .upsert({ id: 1, password: adminPass }, { onConflict: "id" });

    if (!error) {
      results.push({ attempt, status: "success" });
      break;
    }
    
    // Tell PostgREST to reload its schema cache (make a request to _is_ready or similar)
    try {
      await fetch(`${url}/rest/v1/`, {
        headers: { "Accept": "application/json" }
      });
    } catch {}
    
    results.push({ attempt, error: error.message });
    await new Promise(r => setTimeout(r, 3000));
  }

  // Now also sync site_content if we can
  const { data: adminCheck } = await supabase
    .from("admin_settings")
    .select("password")
    .eq("id", 1)
    .single();

  // Sync content
  try {
    const fs = await import("fs");
    const path = await import("path");
    const contentPath = path.join(process.cwd(), "data", "content.json");
    const raw = fs.readFileSync(contentPath, "utf-8");
    const contentData = JSON.parse(raw);
    const { error: ce } = await supabase
      .from("site_content")
      .upsert({ id: 1, data: contentData, updated_at: new Date().toISOString() });
    results.push({ contentSync: ce?.message || "synced" });
  } catch (e: any) {
    results.push({ contentSync: "error: " + e.message });
  }

  return NextResponse.json({
    passwordSet: adminCheck?.password === "admin123",
    storedPassword: adminCheck?.password || null,
    results,
  });
}
