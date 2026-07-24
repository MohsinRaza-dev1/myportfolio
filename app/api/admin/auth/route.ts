import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const db = getSupabase();
    const { data, error } = await db
      .from("admin_settings")
      .select("password")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (password === data.password) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
