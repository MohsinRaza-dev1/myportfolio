import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const supabase = createClient(url, key);
  const results: any[] = [];

  // Try to insert admin password with retries (schema cache may be stale)
  for (let attempt = 1; attempt <= 5; attempt++) {
    const { error: insertError } = await supabase
      .from("admin_settings")
      .upsert({ id: 1, password: "admin123" }, { onConflict: "id" });

    if (!insertError) {
      results.push({ attempt, status: "inserted" });
      break;
    }
    results.push({ attempt, error: insertError.message });
    if (attempt < 5) await new Promise(r => setTimeout(r, 2000));
  }

  // Verify
  const { data: verify } = await supabase
    .from("admin_settings")
    .select("password")
    .eq("id", 1)
    .single();

  // Also insert initial content if empty
  const { data: existingContent } = await supabase
    .from("site_content")
    .select("id")
    .eq("id", 1)
    .maybeSingle();

  if (!existingContent) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const contentPath = path.join(process.cwd(), "data", "content.json");
      const raw = fs.readFileSync(contentPath, "utf-8");
      const contentData = JSON.parse(raw);
      const { error: contentError } = await supabase
        .from("site_content")
        .upsert({ id: 1, data: contentData, updated_at: new Date().toISOString() });
      results.push({ contentSync: contentError ? "failed: " + contentError.message : "synced" });
    } catch (e: any) {
      results.push({ contentSync: "skipped: " + e.message });
    }
  }

  return NextResponse.json({
    passwordSet: verify?.password === "admin123",
    storedPassword: verify?.password || null,
    results,
  });
}
