import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // Try Supabase first
    try {
      const db = getSupabase();
      const { data, error } = await db
        .from("admin_settings")
        .select("password")
        .eq("id", 1)
        .single();

      if (!error && data && password === data.password) {
        return NextResponse.json({ success: true });
      }
    } catch {
      // Supabase not available, fall through
    }

    // Fallback: check ADMIN_PASSWORD env var (works on Vercel without Supabase setup)
    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
