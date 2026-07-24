import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const hasCredentials = !!(supabaseUrl && supabaseServiceKey);

export const supabase = hasCredentials
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export function getSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return supabase;
}
