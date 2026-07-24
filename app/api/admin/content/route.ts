import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabase";

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  const db = getSupabase();
  const { data: settings } = await db
    .from("admin_settings")
    .select("password")
    .eq("id", 1)
    .single();

  if (!settings || token !== settings.password) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { error } = await db
      .from("site_content")
      .upsert({
        id: 1,
        data: body,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
