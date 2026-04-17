import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getAeClientForSeller } from "@/lib/aliexpress/get-client";
import { DropshippingApi } from "@/lib/aliexpress";
import { products as localProducts } from "@/data/products";

interface AeRaw {
  [k: string]: unknown;
}

interface Candidate {
  ae_product_id: string;
  title: string;
  price_eur: number | null;
  image: string | null;
  url: string | null;
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

function pick(obj: AeRaw, keys: string[]): unknown {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}

function extractCandidates(payload: unknown, max = 3): Candidate[] {
  if (!payload || typeof payload !== "object") return [];
  const stack: unknown[] = [payload];
  const arrays: AeRaw[][] = [];
  while (stack.length) {
    const node = stack.pop();
    if (Array.isArray(node)) {
      if (node.length > 0 && typeof node[0] === "object") {
        arrays.push(node as AeRaw[]);
      }
      continue;
    }
    if (node && typeof node === "object") {
      for (const v of Object.values(node as AeRaw)) stack.push(v);
    }
  }
  const ranked = arrays
    .map((arr) => ({
      arr,
      score: arr.filter(
        (r) =>
          pick(r, ["product_id", "productId", "ae_product_id", "itemId"]) !== undefined &&
          pick(r, ["product_title", "title", "subject", "name"]) !== undefined,
      ).length,
    }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = ranked[0]?.arr ?? [];
  return best
    .slice(0, max)
    .map<Candidate | null>((raw) => {
      const id = asString(pick(raw, ["product_id", "productId", "ae_product_id", "itemId"]));
      if (!id) return null;
      return {
        ae_product_id: id,
        title: asString(pick(raw, ["product_title", "title", "subject", "name"])) ?? "",
        price_eur: asNumber(
          pick(raw, ["target_sale_price", "sale_price", "price", "app_sale_price"]),
        ),
        image: asString(
          pick(raw, [
            "product_main_image_url",
            "main_image_url",
            "product_image_url",
            "image",
            "image_url",
          ]),
        ),
        url: asString(pick(raw, ["product_detail_url", "promotion_link", "url"])),
      };
    })
    .filter((x): x is Candidate => x !== null);
}

/** crude name-similarity heuristic — tokens in common / max tokens, 0..1 */
function nameConfidence(a: string, b: string): number {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1);
  const ta = new Set(norm(a));
  const tb = new Set(norm(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let common = 0;
  for (const t of ta) if (tb.has(t)) common += 1;
  return Math.round((common / Math.max(ta.size, tb.size)) * 1000) / 1000;
}

function parsePriceEur(price: string): number | null {
  // "2.599,99 €" → 2599.99
  const cleaned = price.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
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

interface AutoMatchBody {
  limit?: number;
  offset?: number;
  force?: boolean; // re-run even if candidates exist
  category?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await authorize(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason ?? "forbidden" }, { status: 403 });
  }

  let body: AutoMatchBody = {};
  try {
    body = (await request.json()) as AutoMatchBody;
  } catch {
    // allow empty body
  }

  const limit = Math.min(body.limit ?? 20, 200);
  const offset = Math.max(body.offset ?? 0, 0);
  const force = body.force === true;

  const supabase = getSupabaseAdmin();
  const client = await getAeClientForSeller();
  const ds = new DropshippingApi(client);

  // Candidate product list
  let targets = [...localProducts];
  if (body.category) targets = targets.filter((p) => p.category === body.category);
  targets = targets.slice(offset, offset + limit);

  const summary: Array<{
    local_id: number;
    name: string;
    category: string;
    status: "matched" | "no_results" | "skipped" | "error";
    top_confidence?: number;
    candidates?: number;
    error?: string;
  }> = [];

  for (const p of targets) {
    if (!force) {
      const { data: existing } = await supabase
        .from("ae_match_candidates")
        .select("id, status")
        .eq("local_product_id", p.id)
        .limit(1);
      if (existing && existing.length > 0) {
        summary.push({
          local_id: p.id,
          name: p.name,
          category: p.category,
          status: "skipped",
        });
        continue;
      }
    }

    try {
      const res = await ds.call("aliexpress.ds.text.search", {
        keywords: p.name,
        ship_to_country: "PT",
        target_currency: "EUR",
        target_language: "PT",
        page_no: 1,
        page_size: 10,
      });

      if (!res.ok) {
        summary.push({
          local_id: p.id,
          name: p.name,
          category: p.category,
          status: "error",
          error: res.error?.message ?? "ae_search_failed",
        });
        continue;
      }

      const candidates = extractCandidates(res.raw, 3);
      if (candidates.length === 0) {
        summary.push({
          local_id: p.id,
          name: p.name,
          category: p.category,
          status: "no_results",
        });
        continue;
      }

      const localPrice = parsePriceEur(p.price);

      const rows = candidates.map((c, idx) => ({
        local_product_id: p.id,
        local_name: p.name,
        local_category: p.category,
        local_price_eur: localPrice,
        ae_product_id: c.ae_product_id,
        ae_title: c.title,
        ae_price_eur: c.price_eur,
        ae_image: c.image,
        ae_url: c.url,
        rank: idx + 1,
        confidence: nameConfidence(p.name, c.title),
        status: "pending" as const,
      }));

      const { error: insErr } = await supabase
        .from("ae_match_candidates")
        .upsert(rows, { onConflict: "local_product_id,ae_product_id" });

      if (insErr) {
        summary.push({
          local_id: p.id,
          name: p.name,
          category: p.category,
          status: "error",
          error: insErr.message,
        });
        continue;
      }

      summary.push({
        local_id: p.id,
        name: p.name,
        category: p.category,
        status: "matched",
        top_confidence: rows[0]?.confidence,
        candidates: rows.length,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "auto_match_error";
      summary.push({
        local_id: p.id,
        name: p.name,
        category: p.category,
        status: "error",
        error: msg,
      });
    }
  }

  const counts = {
    matched: summary.filter((s) => s.status === "matched").length,
    no_results: summary.filter((s) => s.status === "no_results").length,
    skipped: summary.filter((s) => s.status === "skipped").length,
    error: summary.filter((s) => s.status === "error").length,
  };

  return NextResponse.json({
    processed: targets.length,
    offset,
    limit,
    counts,
    summary,
  });
}
