import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabase";
import nodemailer from "nodemailer";

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
    if (messages) {
      const normalized = messages.map((m: any) => ({
        ...m,
        createdAt: m.createdAt || m.created_at,
      }));
      return NextResponse.json(normalized);
    }
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

    // Fetch the message so we have the original submitter's email
    let originalEmail = "";
    let originalName = "";
    let originalSubject = "";

    try {
      const db = getSupabase();
      const { data: msg } = await db.from("messages").select("*").eq("id", id).single();
      if (msg) {
        originalEmail = msg.email;
        originalName = msg.name;
        originalSubject = msg.subject;
      }
    } catch {}

    if (!originalEmail) {
      // Fallback: local file
      try {
        const fs = await import("fs");
        const path = await import("path");
        const raw = fs.readFileSync(path.join(process.cwd(), "data", "messages.json"), "utf-8");
        const msgs: any[] = JSON.parse(raw);
        const found = msgs.find((m) => m.id === id);
        if (found) {
          originalEmail = found.email;
          originalName = found.name;
          originalSubject = found.subject;
        }
      } catch {}
    }

    // Save the reply to the database
    try {
      const db = getSupabase();
      const updates: Record<string, any> = {};
      if (read !== undefined) updates.read = read;
      if (reply !== undefined) updates.reply = reply;
      const { error } = await db.from("messages").update(updates).eq("id", id);
      if (!error) {
        // Send reply email before returning
        if (reply && originalEmail) sendReplyEmail(originalEmail, originalSubject, reply);
        return NextResponse.json({ success: true });
      }
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

    // If a reply was added, send it as an email to the original submitter
    if (reply && originalEmail) sendReplyEmail(originalEmail, originalSubject, reply);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

function sendReplyEmail(to: string, subject: string, replyText: string) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
  });

  transporter.sendMail({
    from: `"Mohsin Raza" <${user}>`,
    to,
    replyTo: user,
    subject: `Re: [Portfolio] ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="color: #3b82f6;">Reply to your message</h2>
        <p style="color: #333; line-height: 1.6;">${replyText.replace(/\n/g, "<br>")}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="color: #666; font-size: 12px;">— Mohsin Raza</p>
      </div>
    `,
  }).catch((err) => console.error("Failed to send reply email:", err));
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
