import { NextResponse } from "next/server";
import { getSupabase } from "../../../lib/supabase";

export async function GET() {
  try {
    const db = getSupabase();
    const { data, error } = await db
      .from("site_content")
      .select("data")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
    }

    return NextResponse.json(data.data);
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}
