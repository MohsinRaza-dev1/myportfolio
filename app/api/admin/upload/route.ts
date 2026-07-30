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

export async function POST(request: NextRequest) {
  const token = (request.headers.get("authorization") || "").replace("Bearer ", "");
  if (!(await verifyAuth(token))) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = new Uint8Array(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}.${ext}`;

    // Try Supabase Storage first
    try {
      const db = getSupabase();
      const { error: uploadError } = await db.storage.from("uploads").upload(fileName, buffer, {
        contentType: file.type, upsert: true,
      });
      if (!uploadError) {
        const { data: urlData } = db.storage.from("uploads").getPublicUrl(fileName);
        return NextResponse.json({ url: urlData.publicUrl });
      }
    } catch {}

    // Try local filesystem (works in dev, fails on Vercel serverless)
    try {
      const fs = await import("fs");
      const p = await import("path");
      const uploadDir = p.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(p.join(uploadDir, fileName), buffer);
      return NextResponse.json({ url: `/uploads/${fileName}` });
    } catch {}

    // Ultimate fallback: inline base64 — works everywhere (Vercel, local, etc.)
    const base64 = Buffer.from(buffer).toString("base64");
    return NextResponse.json({ url: `data:${file.type};base64,${base64}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
