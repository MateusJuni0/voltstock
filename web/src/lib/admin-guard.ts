import { createServerSupabase } from "@/lib/supabase/server";

export interface AdminGuardResult {
  ok: boolean;
  userId?: string;
  reason?: string;
}

/**
 * Server-side admin guard for API routes.
 * Verifies the current session user has role='admin' in profiles table.
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = (profile as { role?: string } | null)?.role;
    if (role !== "admin") return { ok: false, reason: "forbidden" };

    return { ok: true, userId: user.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "guard_error";
    return { ok: false, reason: msg };
  }
}
