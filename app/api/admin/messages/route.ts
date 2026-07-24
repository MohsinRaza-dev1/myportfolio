import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const messagesPath = path.join(process.cwd(), "data", "messages.json");

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function readMessages(): any[] {
  try {
    return JSON.parse(fs.readFileSync(messagesPath, "utf-8"));
  } catch {
    return [];
  }
}

function writeMessages(messages: any[]) {
  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2), "utf-8");
}

// GET /api/admin/messages — list all messages
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (token !== process.env.ADMIN_PASSWORD) return unauthorized();

  const messages = readMessages();
  return NextResponse.json(messages);
}

// PUT /api/admin/messages — update a message (mark as read, add reply)
export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (token !== process.env.ADMIN_PASSWORD) return unauthorized();

  try {
    const { id, read, reply } = await request.json();
    const messages = readMessages();
    const idx = messages.findIndex((m) => m.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (read !== undefined) messages[idx].read = read;
    if (reply !== undefined) messages[idx].reply = reply;

    writeMessages(messages);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/admin/messages — delete a message
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (token !== process.env.ADMIN_PASSWORD) return unauthorized();

  try {
    const { id } = await request.json();
    let messages = readMessages();
    const idx = messages.findIndex((m) => m.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    messages.splice(idx, 1);
    writeMessages(messages);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
