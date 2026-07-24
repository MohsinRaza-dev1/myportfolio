import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabase";

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

export async function GET(request: NextRequest) {
  const token = (request.headers.get("authorization") || "").replace("Bearer ", "");
  if (!(await verifyAuth(token))) return unauthorized();

  try {
    const db = getSupabase();
    const { data: messages } = await db.from("messages").select("*").order("created_at", { ascending: false });
    if (messages) return NextResponse.json(messages);
  } catch {}

  // Fallback: local file
  try {
    const fs = await import("fs");
    const path = await import("path");
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "messages.json"), "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(request: NextRequest) {
  const token = (request.headers.get("authorization") || "").replace("Bearer ", "");
  if (!(await verifyAuth(token))) return unauthorized();

  try {
    const { id, read, reply } = await request.json();

    // Try Supabase first
    try {
      const db = getSupabase();
      const updates: Record<string, any> = {};
      if (read !== undefined) updates.read = read;
      if (reply !== undefined) updates.reply = reply;
      const { error } = await db.from("messages").update(updates).eq("id", id);
      if (!error) return NextResponse.json({ success: true });
    } catch {}

    // Fallback: local file
    const fs = await import("fs");
    const path = await import("path");
    const messagesPath = path.join(process.cwd(), "data", "messages.json");
    let messages: any[] = [];
    try { messages = JSON.parse(fs.readFileSync(messagesPath, "utf-8")); } catch {}
    const idx = messages.findIndex((m: any) => m.id === id);
    if (idx === -1) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    if (read !== undefined) messages[idx].read = read;
    if (reply !== undefined) messages[idx].reply = reply;
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const token = (request.headers.get("authorization") || "").replace("Bearer ", "");
  if (!(await verifyAuth(token))) return unauthorized();

  try {
    const { id } = await request.json();

    // Try Supabase first
    try {
      const db = getSupabase();
      const { error } = await db.from("messages").delete().eq("id", id);
      if (!error) return NextResponse.json({ success: true });
    } catch {}

    // Fallback: local file
    const fs = await import("fs");
    const path = await import("path");
    const messagesPath = path.join(process.cwd(), "data", "messages.json");
    let messages: any[] = [];
    try { messages = JSON.parse(fs.readFileSync(messagesPath, "utf-8")); } catch {}
    const idx = messages.findIndex((m: any) => m.id === id);
    if (idx === -1) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    messages.splice(idx, 1);
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
