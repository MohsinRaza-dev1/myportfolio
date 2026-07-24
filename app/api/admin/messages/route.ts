import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabase";

export async function GET(request: NextRequest) {
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

  const { data: messages, error } = await db
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(messages || []);
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  const db2 = getSupabase();
  const { data: settings } = await db2
    .from("admin_settings")
    .select("password")
    .eq("id", 1)
    .single();

  if (!settings || token !== settings.password) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, read, reply } = await request.json();

    const updates: Record<string, any> = {};
    if (read !== undefined) updates.read = read;
    if (reply !== undefined) updates.reply = reply;

    const { error } = await db2
      .from("messages")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  const db3 = getSupabase();
  const { data: settings } = await db3
    .from("admin_settings")
    .select("password")
    .eq("id", 1)
    .single();

  if (!settings || token !== settings.password) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    const { error } = await db3
      .from("messages")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
