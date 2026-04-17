import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

async function authorize(request: NextRequest): Promise<{ ok: boolean; reason?: string }> {
  const authHeader = request.headers.get("authorization");
  const adminSecret = process.env.ADMIN_SECRET;
  if (adminSecret && authHeader === `Bearer ${adminSecret}`) {
    return { ok: true };
  }
  const guard = await requireAdmin();
  if (guard.ok) return { ok: true };
  return { ok: false, reason: guard.reason ?? "forbidden" };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await authorize(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason ?? "forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "pending";
  const category = url.searchParams.get("category");
  const minConfidence = parseFloat(url.searchParams.get("min_confidence") ?? "0");
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "500", 10), 2000);
  const rankOnly = url.searchParams.get("rank"); // e.g. "1" for top only

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("ae_match_candidates")
    .select(
      "id, local_product_id, local_name, local_category, local_price_eur, ae_product_id, ae_title, ae_price_eur, ae_image, ae_url, rank, confidence, status, notes, created_at, reviewed_at",
    )
    .order("local_product_id", { ascending: true })
    .order("rank", { ascending: true })
    .limit(limit);

  if (status !== "all") query = query.eq("status", status);
  if (category) query = query.eq("local_category", category);
  if (minConfidence > 0) query = query.gte("confidence", minConfidence);
  if (rankOnly) query = query.eq("rank", parseInt(rankOnly, 10));

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Aggregate stats
  const { data: stats } = await supabase
    .from("ae_match_candidates")
    .select("status", { count: "exact", head: false });

  const counts: Record<string, number> = { pending: 0, confirmed: 0, rejected: 0, imported: 0 };
  for (const row of stats ?? []) {
    const s = (row as { status: string }).status;
    if (s in counts) counts[s] = (counts[s] ?? 0) + 1;
  }

  return NextResponse.json({
    candidates: data ?? [],
    counts,
    filter: { status, category, min_confidence: minConfidence, rank: rankOnly, limit },
  });
}
