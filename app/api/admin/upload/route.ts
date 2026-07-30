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

    // Create the uploads bucket if it doesn't exist, then retry
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && supabaseKey) {
        // Try creating bucket first
        await fetch(`${supabaseUrl}/storage/v1/bucket`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: "uploads", public: true }),
        });
        // Upload via raw REST
        const uploadRes = await fetch(
          `${supabaseUrl}/storage/v1/object/uploads/${fileName}`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": file.type,
            },
            body: file,
          }
        );
        if (uploadRes.ok) {
          return NextResponse.json({
            url: `${supabaseUrl}/storage/v1/object/public/uploads/${fileName}`,
          });
        }
      }
    } catch {}

    // Fallback: write to public/uploads (works locally, also committed to git)
    try {
      const fs = await import("fs");
      const p = await import("path");
      const uploadDir = p.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(p.join(uploadDir, fileName), buffer);
      return NextResponse.json({ url: `/uploads/${fileName}` });
    } catch {}

    return NextResponse.json({ error: "Upload failed. Create 'uploads' bucket in Supabase Storage dashboard." }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
