import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabase";

export async function POST(request: NextRequest) {
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

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = new Uint8Array(await file.arrayBuffer());

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}.${ext}`;

    // Try Supabase Storage first (works on Vercel)
    const { error: uploadError } = await db.storage
      .from("uploads")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (!uploadError) {
      const { data: urlData } = db.storage
        .from("uploads")
        .getPublicUrl(fileName);

      return NextResponse.json({ url: urlData.publicUrl });
    }

    // Fallback: try local filesystem (works locally)
    try {
      const fs = await import("fs");
      const path = await import("path");
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      return NextResponse.json({ url: `/uploads/${fileName}` });
    } catch {
      return NextResponse.json({ error: "Upload failed - configure Supabase Storage bucket 'uploads'" }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
