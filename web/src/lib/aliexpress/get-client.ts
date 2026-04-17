import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { AliExpressClient } from "./client";
import { getClientForUser } from "./token-store";

/**
 * Primary seller — the AE account that owns the CMTec/VoltStock integration.
 * Test seller `ae_test_de_seller_0025@tmail.ws`.
 */
export const PRIMARY_AE_USER_ID = "6428917159";

/**
 * Returns an `AliExpressClient` for the given AE seller user id.
 * Handles token refresh transparently via `token-store.getClientForUser`.
 */
export async function getAeClientForUser(aeUserId: string): Promise<AliExpressClient> {
  return getClientForUser(aeUserId);
}

/**
 * Returns an `AliExpressClient` for the primary seller.
 * If `PRIMARY_AE_USER_ID` has no token stored, falls back to the most recent
 * row in `aliexpress_tokens` — useful when the seller account is rotated.
 */
export async function getAeClientForSeller(): Promise<AliExpressClient> {
  try {
    return await getClientForUser(PRIMARY_AE_USER_ID);
  } catch (err) {
    const fallbackId = await findLatestAeUserId();
    if (!fallbackId) {
      throw err instanceof Error
        ? err
        : new Error("No AE tokens available and no fallback seller found");
    }
    return getClientForUser(fallbackId);
  }
}

async function findLatestAeUserId(): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("aliexpress_tokens")
    .select("ae_user_id")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return (data as { ae_user_id: string }).ae_user_id;
}
