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

    // Try writable temp directory (/tmp on Vercel, public/uploads locally)
    try {
      const fs = await import("fs");
      const p = await import("path");
      // Try public/uploads first (works locally)
      const publicDir = p.join(process.cwd(), "public", "uploads");
      if (fs.existsSync(publicDir) || !process.env.VERCEL) {
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
        fs.writeFileSync(p.join(publicDir, fileName), buffer);
        return NextResponse.json({ url: `/uploads/${fileName}` });
      }
      // On Vercel: write to /tmp/uploads and serve via API
      const tmpDir = "/tmp/uploads";
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      fs.writeFileSync(p.join(tmpDir, fileName), buffer);
      return NextResponse.json({ url: `/api/uploads/${fileName}` });
    } catch {}

    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
