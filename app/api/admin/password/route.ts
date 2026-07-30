import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../../lib/supabase";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function verifyAuth(token: string): Promise<boolean> {
  // Check env var first (fastest path, also works when Supabase is down)
  if (token === process.env.ADMIN_PASSWORD) return true;
  // Check Supabase
  try {
    const db = getSupabase();
    const { data } = await db.from("admin_settings").select("password").eq("id", 1).single();
    if (data && token === data.password) return true;
  } catch {}
  return false;
}

async function updatePasswordInSupabase(password: string): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Try raw REST first — more reliable on serverless
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/admin_settings?id=eq.1`,
        {
          method: "PUT",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify({ id: 1, password }),
        }
      );
      if (res.ok) return true;
      // If row doesn't exist, PUT returns 404 — try POST
      if (res.status === 404) {
        const insertRes = await fetch(
          `${supabaseUrl}/rest/v1/admin_settings`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
              Prefer: "resolution=merge-duplicates",
            },
            body: JSON.stringify({ id: 1, password }),
          }
        );
        if (insertRes.ok) return true;
      }
    } catch {}
  }

  // Fallback: Supabase JS client
  try {
    const db = getSupabase();
    const { error } = await db.from("admin_settings").upsert({
      id: 1, password,
    }, { onConflict: "id" });
    return !error;
  } catch {}

  return false;
}

export async function PUT(request: NextRequest) {
  const token = (request.headers.get("authorization") || "").replace("Bearer ", "");
  if (!(await verifyAuth(token))) return unauthorized();

  try {
    const { currentPassword, newPassword } = await request.json();

    // Verify current password
    if (currentPassword !== process.env.ADMIN_PASSWORD) {
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

    // Persist to Supabase
    const persisted = await updatePasswordInSupabase(newPassword);
    if (!persisted) {
      // Last resort: write to .env.local (only works locally)
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
      } catch {
        return NextResponse.json({ error: "Failed to update password. Check Supabase setup." }, { status: 500 });
      }
    }

    // Sync in-memory for this Lambda instance
    process.env.ADMIN_PASSWORD = newPassword;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
