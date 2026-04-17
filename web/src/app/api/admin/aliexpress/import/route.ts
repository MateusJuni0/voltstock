import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getAeClientForSeller } from "@/lib/aliexpress/get-client";
import { DropshippingApi } from "@/lib/aliexpress";

interface ImportBody {
  ae_product_id: string;
  margin_percentage?: number;
}

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

interface NormalizedAe {
  title: string;
  category: string | null;
  cost_price: number;
  currency: string;
  main_image: string | null;
  gallery: string[];
  description: string | null;
  features: string[];
  supplier_url: string;
  skus: unknown[];
  stock: number;
}

function normalizeAeProduct(raw: unknown, aeProductId: string): NormalizedAe {
  const title =
    asString(deepFind(raw, (r) => r.subject ?? r.product_title ?? r.title)) ?? "AE Product";
  const category = asString(deepFind(raw, (r) => r.category_name ?? r.category_id));
  const cost =
    asNumber(
      deepFind(
        raw,
        (r) =>
          r.target_sale_price ??
          r.sale_price ??
          r.app_sale_price ??
          r.original_price ??
          r.price,
      ),
    ) ?? 0;
  const currency = asString(deepFind(raw, (r) => r.target_sale_price_currency ?? r.currency_code)) ?? "EUR";
  const mainImage =
    asString(
      deepFind(raw, (r) => r.product_main_image_url ?? r.main_image_url ?? r.image_url ?? r.pic_url),
    ) ?? null;

  const galleryRaw = deepFind(raw, (r) => r.image_urls ?? r.product_small_image_urls ?? r.gallery);
  let gallery: string[] = [];
  if (typeof galleryRaw === "string") {
    gallery = galleryRaw.split(/[;,\n]/).map((s) => s.trim()).filter(Boolean);
  } else if (Array.isArray(galleryRaw)) {
    gallery = galleryRaw
      .map((g) => (typeof g === "string" ? g : asString((g as AeRaw).url)))
      .filter((s): s is string => typeof s === "string" && s.length > 0);
  }

  const description = asString(deepFind(raw, (r) => r.detail ?? r.product_description));
  const features: string[] = [];

  const supplierUrl =
    asString(deepFind(raw, (r) => r.product_detail_url ?? r.promotion_link)) ??
    `https://www.aliexpress.com/item/${aeProductId}.html`;

  const skus = extractArray(raw, "ae_sku_property_dtos").concat(extractArray(raw, "sku_list"));

  const stock = asNumber(deepFind(raw, (r) => r.stock ?? r.available_stock ?? r.lots_info)) ?? 0;

  return {
    title,
    category,
    cost_price: cost,
    currency,
    main_image: mainImage,
    gallery,
    description,
    features,
    supplier_url: supplierUrl,
    skus,
    stock: Math.max(0, Math.round(stock)),
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.reason ?? "forbidden" }, { status: 403 });
  }

  let body: ImportBody;
  try {
    body = (await request.json()) as ImportBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const aeProductId = String(body.ae_product_id ?? "").trim();
  if (!aeProductId) {
    return NextResponse.json({ error: "ae_product_id_required" }, { status: 400 });
  }
  const margin = Number.isFinite(body.margin_percentage)
    ? Number(body.margin_percentage)
    : 80;

  try {
    const client = await getAeClientForSeller();
    const ds = new DropshippingApi(client);

    const res = await ds.getProduct({
      product_id: aeProductId,
      ship_to_country: "PT",
      target_currency: "EUR",
      target_language: "PT",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: res.error?.message ?? "ae_fetch_failed", raw: res.raw },
        { status: 502 },
      );
    }

    const normalized = normalizeAeProduct(res.raw, aeProductId);
    const selling = Math.round(normalized.cost_price * (1 + margin / 100) * 100) / 100;

    const supabase = getSupabaseAdmin();
    let slug = slugify(normalized.title);
    if (!slug) slug = `ae-${aeProductId}`;

    // Ensure unique slug — append AE id if collision
    const { data: existing } = await supabase
      .from("ae_products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) slug = `${slug}-${aeProductId}`;

    const row = {
      ae_product_id: aeProductId,
      slug,
      name: normalized.title,
      category: normalized.category,
      cost_price: normalized.cost_price,
      selling_price: selling,
      margin_percentage: margin,
      currency: normalized.currency,
      main_image: normalized.main_image,
      gallery: normalized.gallery,
      description: normalized.description,
      features: normalized.features,
      supplier_url: normalized.supplier_url,
      stock_quantity: normalized.stock,
      sku_list: normalized.skus,
      ship_to_country: "PT",
      imported_by: guard.userId ?? null,
      active: true,
      raw_ae_response: res.raw as unknown,
    };

    const { data: inserted, error } = await supabase
      .from("ae_products")
      .upsert(row, { onConflict: "ae_product_id" })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, product: inserted });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "import_failed";
    console.error(`[ae-import] ${msg}`);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
