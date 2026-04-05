import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client using the service role key.
 * Use this for server-side operations that run without user context
 * (webhooks, cron jobs, background tasks).
 *
 * NEVER use this on the client side — the service role key bypasses RLS.
 */

let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) {
    return _adminClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
    );
  }

  _adminClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _adminClient;
}
