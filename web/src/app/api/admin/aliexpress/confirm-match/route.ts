import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getAeClientForSeller } from "@/lib/aliexpress/get-client";
import { DropshippingApi } from "@/lib/aliexpress";

interface AeRaw {
  [k: string]: unknown;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function asString(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return null;
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^0-9.,-]/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function deepFind(root: unknown, predicate: (val: AeRaw) => unknown): unknown {
  const stack: unknown[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (Array.isArray(node)) {
      for (const v of node) stack.push(v);
      continue;
    }
    if (node && typeof node === "object") {
      const found = predicate(node as AeRaw);
      if (found !== undefined && found !== null) return found;
      for (const v of Object.values(node as AeRaw)) stack.push(v);
    }
  }
  return undefined;
}

function extractArray(root: unknown, key: string): unknown[] {
  const out: unknown[] = [];
  const stack: unknown[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (Array.isArray(node)) {
      for (const v of node) stack.push(v);
      continue;
    }
    if (node && typeof node === "object") {
      const rec = node as AeRaw;
      if (Array.isArray(rec[key])) {
        for (const v of rec[key] as unknown[]) out.push(v);
      }
      for (const v of Object.values(rec)) stack.push(v);
    }
  }
  return out;
}

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

interface ConfirmBody {
  /** Single-candidate confirm */
  candidate_id?: number;
  /** Batch confirm — list of candidate ids */
  candidate_ids?: number[];
  /** Reject instead of confirm (defaults to confirm) */
  action?: "confirm" | "reject";
  /** Optional margin override for the import step */
  margin_percentage?: number;
  /** Optional notes */
  notes?: string;
}

interface CandidateRow {
  id: number;
  local_product_id: number;
  local_name: string;
  local_price_eur: number | null;
  ae_product_id: string;
  ae_title: string | null;
  status: string;
}

async function importCandidate(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  ds: DropshippingApi,
  row: CandidateRow,
  margin: number,
): Promise<{ ok: boolean; error?: string; inserted_id?: number }> {
  const res = await ds.getProduct({
    product_id: row.ae_product_id,
    ship_to_country: "PT",
    target_currency: "EUR",
    target_language: "PT",
  });
  if (!res.ok) {
    return { ok: false, error: res.error?.message ?? "ae_fetch_failed" };
  }

  const title = asString(deepFind(res.raw, (r) => r.subject ?? r.product_title ?? r.title)) ?? row.local_name;
  const cost =
    asNumber(
      deepFind(
        res.raw,
        (r) =>
          r.target_sale_price ??
          r.sale_price ??
          r.app_sale_price ??
          r.original_price ??
          r.price,
      ),
    ) ?? 0;
  const currency = asString(deepFind(res.raw, (r) => r.target_sale_price_currency ?? r.currency_code)) ?? "EUR";
  const mainImage =
    asString(
      deepFind(res.raw, (r) => r.product_main_image_url ?? r.main_image_url ?? r.image_url ?? r.pic_url),
    ) ?? null;
  const galleryRaw = deepFind(res.raw, (r) => r.image_urls ?? r.product_small_image_urls ?? r.gallery);
  let gallery: string[] = [];
  if (typeof galleryRaw === "string") {
    gallery = galleryRaw.split(/[;,\n]/).map((s) => s.trim()).filter(Boolean);
  } else if (Array.isArray(galleryRaw)) {
    gallery = galleryRaw
      .map((g) => (typeof g === "string" ? g : asString((g as AeRaw).url)))
      .filter((s): s is string => typeof s === "string" && s.length > 0);
  }
  const category = asString(deepFind(res.raw, (r) => r.category_name ?? r.category_id));
  const description = asString(deepFind(res.raw, (r) => r.detail ?? r.product_description));
  const supplierUrl =
    asString(deepFind(res.raw, (r) => r.product_detail_url ?? r.promotion_link)) ??
    `https://www.aliexpress.com/item/${row.ae_product_id}.html`;
  const skus = extractArray(res.raw, "ae_sku_property_dtos").concat(extractArray(res.raw, "sku_list"));
  const stockRaw = asNumber(deepFind(res.raw, (r) => r.stock ?? r.available_stock ?? r.lots_info));
  const stock = Math.max(0, Math.round(stockRaw ?? 0));

  // Curated local values beat AE values for customer-facing fields
  const finalName = row.local_name; // always use curated name for webhook match
  const finalSelling =
    row.local_price_eur !== null && row.local_price_eur > 0
      ? row.local_price_eur
      : Math.round(cost * (1 + margin / 100) * 100) / 100;

  const slug = slugify(finalName) || `ae-${row.ae_product_id}`;

  const { data: existingSlug } = await supabase
    .from("ae_products")
    .select("id")
    .eq("slug", slug)
    .neq("ae_product_id", row.ae_product_id)
    .maybeSingle();
  const finalSlug = existingSlug ? `${slug}-${row.ae_product_id}` : slug;

  const payload = {
    ae_product_id: row.ae_product_id,
    slug: finalSlug,
    name: finalName,
    category: category ?? null,
    cost_price: Math.round(cost * 100) / 100,
    selling_price: finalSelling,
    margin_percentage: margin,
    currency,
    main_image: mainImage,
    gallery,
    description,
    features: [],
    supplier_url: supplierUrl,
    stock_quantity: stock,
    sku_list: skus,
    ship_to_country: "PT",
    local_product_id: row.local_product_id,
    active: true,
    raw_ae_response: res.raw as unknown,
  };

  const { data: inserted, error } = await supabase
    .from("ae_products")
    .upsert(payload, { onConflict: "ae_product_id" })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, inserted_id: (inserted as { id: number }).id };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await authorize(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason ?? "forbidden" }, { status: 403 });
  }

  let body: ConfirmBody;
  try {
    body = (await request.json()) as ConfirmBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const ids: number[] = body.candidate_id
    ? [body.candidate_id]
    : Array.isArray(body.candidate_ids)
      ? body.candidate_ids
      : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "candidate_id_or_candidate_ids_required" }, { status: 400 });
  }

  const action = body.action === "reject" ? "reject" : "confirm";
  const margin = Number.isFinite(body.margin_percentage) ? Number(body.margin_percentage) : 80;

  const supabase = getSupabaseAdmin();
  const { data: candidates, error } = await supabase
    .from("ae_match_candidates")
    .select("id, local_product_id, local_name, local_price_eur, ae_product_id, ae_title, status")
    .in("id", ids);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const rows = (candidates ?? []) as CandidateRow[];
  if (rows.length === 0) {
    return NextResponse.json({ error: "no_candidates_found" }, { status: 404 });
  }

  const results: Array<{
    candidate_id: number;
    local_product_id: number;
    ae_product_id: string;
    action: "confirm" | "reject";
    ok: boolean;
    error?: string;
    imported_id?: number;
  }> = [];

  if (action === "reject") {
    await supabase
      .from("ae_match_candidates")
      .update({ status: "rejected", reviewed_at: new Date().toISOString(), notes: body.notes ?? null })
      .in("id", ids);
    for (const r of rows) {
      results.push({
        candidate_id: r.id,
        local_product_id: r.local_product_id,
        ae_product_id: r.ae_product_id,
        action: "reject",
        ok: true,
      });
    }
    return NextResponse.json({ action, processed: rows.length, results });
  }

  // Confirm path → import
  const client = await getAeClientForSeller();
  const ds = new DropshippingApi(client);

  for (const row of rows) {
    if (row.status === "imported") {
      results.push({
        candidate_id: row.id,
        local_product_id: row.local_product_id,
        ae_product_id: row.ae_product_id,
        action: "confirm",
        ok: true,
        error: "already_imported",
      });
      continue;
    }

    try {
      const imp = await importCandidate(supabase, ds, row, margin);
      if (!imp.ok) {
        results.push({
          candidate_id: row.id,
          local_product_id: row.local_product_id,
          ae_product_id: row.ae_product_id,
          action: "confirm",
          ok: false,
          error: imp.error,
        });
        continue;
      }

      // Mark this candidate imported, reject siblings (same local_product_id, other ranks)
      await supabase
        .from("ae_match_candidates")
        .update({ status: "imported", reviewed_at: new Date().toISOString() })
        .eq("id", row.id);
      await supabase
        .from("ae_match_candidates")
        .update({ status: "rejected", reviewed_at: new Date().toISOString() })
        .eq("local_product_id", row.local_product_id)
        .neq("id", row.id)
        .eq("status", "pending");

      results.push({
        candidate_id: row.id,
        local_product_id: row.local_product_id,
        ae_product_id: row.ae_product_id,
        action: "confirm",
        ok: true,
        imported_id: imp.inserted_id,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "confirm_error";
      results.push({
        candidate_id: row.id,
        local_product_id: row.local_product_id,
        ae_product_id: row.ae_product_id,
        action: "confirm",
        ok: false,
        error: msg,
      });
    }
  }

  return NextResponse.json({
    action,
    processed: rows.length,
    successes: results.filter((r) => r.ok).length,
    failures: results.filter((r) => !r.ok).length,
    results,
  });
}
