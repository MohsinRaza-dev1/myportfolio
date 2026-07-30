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

export async function PUT(request: NextRequest) {
  const token = (request.headers.get("authorization") || "").replace("Bearer ", "");
  if (!(await verifyAuth(token))) return unauthorized();

  try {
    const { currentPassword, newPassword } = await request.json();

    // Verify current password against env var fallback too
    if (currentPassword !== process.env.ADMIN_PASSWORD) {
      // Also check Supabase
      try {
        const db = getSupabase();
        const { data } = await db.from("admin_settings").select("password").eq("id", 1).single();
        if (data && currentPassword !== data.password) {
          return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
    }

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ error: "New password must be at least 4 characters" }, { status: 400 });
    }

    // Try Supabase first
    let supabaseUpdated = false;
    try {
      const db = getSupabase();
      const { error } = await db.from("admin_settings").upsert({
        id: 1, password: newPassword,
      }, { onConflict: "id" });
      if (error) throw error;
      supabaseUpdated = true;
    } catch (e) {
      console.error("Supabase password update failed:", e);
      // Fallback: update .env.local (works locally)
      try {
        const fs = await import("fs");
        const path = await import("path");
        const envPath = path.join(process.cwd(), ".env.local");
        let envContent = "";
        try { envContent = fs.readFileSync(envPath, "utf-8"); } catch { envContent = ""; }
        if (envContent.includes("ADMIN_PASSWORD=")) {
          envContent = envContent.replace(/^ADMIN_PASSWORD=.*$/m, `ADMIN_PASSWORD=${newPassword}`);
        } else {
          envContent += `\nADMIN_PASSWORD=${newPassword}\n`;
        }
        fs.writeFileSync(envPath, envContent, "utf-8");
      } catch (fsErr) {
        console.error("File fallback password update failed:", fsErr);
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
      }
    }

    // Sync the env var so in-process auth checks work immediately
    process.env.ADMIN_PASSWORD = newPassword;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
