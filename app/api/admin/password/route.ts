import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabase";

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  try {
    const db = getSupabase();
    const { data: settings } = await db
      .from("admin_settings")
      .select("password")
      .eq("id", 1)
      .single();

    if (!settings || token !== settings.password) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (currentPassword !== settings.password) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ error: "New password must be at least 4 characters" }, { status: 400 });
    }

    const { error } = await db
      .from("admin_settings")
      .update({
        password: newPassword,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
