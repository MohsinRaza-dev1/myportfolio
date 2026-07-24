import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getSupabase } from "../../../lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const newMsg = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      created_at: new Date().toISOString(),
      read: false,
      reply: null,
    };

    // Try Supabase first
    try {
      const db = getSupabase();
      const { error: dbError } = await db.from("messages").insert([newMsg]);
      if (!dbError) newMsg as any;
    } catch {
      // fall through
    }

    // Fallback: save to local file
    try {
      const fs = await import("fs");
      const path = await import("path");
      const messagesPath = path.join(process.cwd(), "data", "messages.json");
      let messages: any[] = [];
      try { messages = JSON.parse(fs.readFileSync(messagesPath, "utf-8")); } catch {}
      messages.unshift(newMsg);
      fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2), "utf-8");
    } catch (storageErr) {
      console.error("Failed to save message locally:", storageErr);
    }

    // Try sending email
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false,
          auth: { user, pass },
        });

        await transporter.sendMail({
          from: `"${name}" <${user}>`,
          to: user,
          replyTo: email,
          subject: `[Portfolio] ${subject}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h2 style="color: #3b82f6;">New Contact Message</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; font-weight: 600; color: #333;">Name</td><td style="padding: 8px;">${name}</td></tr>
                <tr><td style="padding: 8px; font-weight: 600; color: #333;">Email</td><td style="padding: 8px;">${email}</td></tr>
                <tr><td style="padding: 8px; font-weight: 600; color: #333;">Subject</td><td style="padding: 8px;">${subject}</td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
              <p style="color: #333; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Email send failed (message saved):", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
