import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { OAuthTokenResponse } from "./oauth";
import { refreshAccessToken } from "./oauth";
import { AliExpressClient } from "./client";

/**
 * Server-side token store for AliExpress OAuth sessions.
 *
 * Persists access_token + refresh_token per (app_key, ae_user_id) into the
 * `public.aliexpress_tokens` Supabase table. Service-role only.
 */

const TABLE = "aliexpress_tokens";

/** Leeway (seconds) before actual expiry to trigger a proactive refresh. */
const REFRESH_LEEWAY_SECONDS = 300;

export interface StoredAliExpressToken {
  id: string;
  app_key: string;
  ae_user_id: string;
  ae_account: string | null;
  ae_seller_id: string | null;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  refresh_expires_at: string | null;
  scope: string | null;
  raw: unknown;
  created_at: string;
  updated_at: string;
}

function expiresAtIso(expiresInSeconds: number): string {
  return new Date(Date.now() + expiresInSeconds * 1000).toISOString();
}

export async function saveToken(
  appKey: string,
  token: OAuthTokenResponse,
): Promise<StoredAliExpressToken> {
  const supabase = getSupabaseAdmin();
  const row = {
    app_key: appKey,
    ae_user_id: String(token.user_id),
    ae_account: token.account ?? null,
    ae_seller_id: token.seller_id ?? null,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expires_at: expiresAtIso(token.expires_in),
    refresh_expires_at: token.refresh_token_valid_time
      ? new Date(token.refresh_token_valid_time).toISOString()
      : null,
    scope: null,
    raw: token as unknown,
  };
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(row, { onConflict: "app_key,ae_user_id" })
    .select()
    .single();
  if (error) throw new Error(`saveToken: ${error.message}`);
  return data as StoredAliExpressToken;
}

export async function getToken(
  appKey: string,
  aeUserId: string,
): Promise<StoredAliExpressToken | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("app_key", appKey)
    .eq("ae_user_id", aeUserId)
    .maybeSingle();
  if (error) throw new Error(`getToken: ${error.message}`);
  return (data as StoredAliExpressToken | null) ?? null;
}

export async function listTokens(appKey: string): Promise<StoredAliExpressToken[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("app_key", appKey)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`listTokens: ${error.message}`);
  return (data ?? []) as StoredAliExpressToken[];
}

function isExpired(token: StoredAliExpressToken): boolean {
  const expMs = new Date(token.expires_at).getTime();
  return Date.now() + REFRESH_LEEWAY_SECONDS * 1000 >= expMs;
}

/**
 * Ensures the stored token for `aeUserId` is valid. Refreshes if near expiry.
 * Returns a fresh `access_token` ready to pass into AliExpressClient.
 */
export async function getValidAccessToken(
  appKey: string,
  appSecret: string,
  aeUserId: string,
): Promise<string> {
  const stored = await getToken(appKey, aeUserId);
  if (!stored) throw new Error(`No AE token stored for user ${aeUserId}`);
  if (!isExpired(stored)) return stored.access_token;

  const refreshed = await refreshAccessToken({
    appKey,
    appSecret,
    refreshToken: stored.refresh_token,
  });
  if (!refreshed.ok || !refreshed.token) {
    throw new Error(
      `Failed to refresh AE token for ${aeUserId}: ${refreshed.error?.message ?? "unknown"}`,
    );
  }
  const saved = await saveToken(appKey, refreshed.token);
  return saved.access_token;
}

/**
 * Convenience: get a fully-configured AliExpressClient for a given seller.
 * Handles refresh transparently.
 */
export async function getClientForUser(aeUserId: string): Promise<AliExpressClient> {
  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;
  if (!appKey || !appSecret) {
    throw new Error("ALIEXPRESS_APP_KEY and ALIEXPRESS_APP_SECRET must be set");
  }
  const accessToken = await getValidAccessToken(appKey, appSecret, aeUserId);
  return new AliExpressClient({ appKey, appSecret, accessToken });
}
