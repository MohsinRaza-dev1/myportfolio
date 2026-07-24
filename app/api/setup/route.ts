import { NextResponse } from "next/server";

export async function GET() {
  const results: any[] = [];
  let supabase: any = null;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      supabase = createClient(url, key);
    }
  } catch {}

  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  // Try to create tables via raw SQL query
  // First check if admin_settings exists
  const { error: checkError } = await supabase
    .from("admin_settings")
    .select("id")
    .eq("id", 1)
    .maybeSingle();

  if (checkError && checkError.code === "42P01") {
    // Table doesn't exist — need to create it via SQL
    // Use the pg_dump endpoint approach
    return NextResponse.json({
      needsSetup: true,
      message: "Tables don't exist yet. Run the SQL from sql/schema.sql in Supabase SQL Editor.",
      checkError: checkError.message,
      sql: `
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  reply TEXT
);

CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  password TEXT NOT NULL DEFAULT 'admin123',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO admin_settings (id, password)
VALUES (1, 'admin123')
ON CONFLICT (id) DO NOTHING;
      `.trim(),
    });
  }

  // Insert default password if missing
  const { data: existing } = await supabase
    .from("admin_settings")
    .select("password")
    .eq("id", 1)
    .maybeSingle();

  if (!existing) {
    const { error: insertError } = await supabase
      .from("admin_settings")
      .insert({ id: 1, password: "admin123" });

    results.push({ action: "inserted default admin123", error: insertError?.message || null });
  }

  // Verify auth
  const { data: verify } = await supabase
    .from("admin_settings")
    .select("password")
    .eq("id", 1)
    .single();

  return NextResponse.json({
    tablesExist: true,
    passwordSet: verify?.password === "admin123",
    actions: results,
  });
}
