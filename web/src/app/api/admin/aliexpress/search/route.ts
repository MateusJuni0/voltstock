import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getAeClientForSeller } from "@/lib/aliexpress/get-client";
import { DropshippingApi } from "@/lib/aliexpress";

interface SearchItem {
  ae_product_id: string;
  title: string;
  price: string | null;
  image: string | null;
  url: string | null;
}

interface AeRaw {
  [k: string]: unknown;
}

function pick(obj: AeRaw, keys: string[]): unknown {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}

function asString(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return null;
}

function normalizeItems(payload: unknown): SearchItem[] {
  if (!payload || typeof payload !== "object") return [];
  // Drill into known AE response shapes
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
  // Prefer arrays that look like product lists (contain something resembling product_id/title)
  const candidates = arrays
    .map((arr) => ({
      arr,
      score: arr.filter(
        (r) =>
          pick(r, ["product_id", "productId", "ae_product_id"]) !== undefined &&
          pick(r, ["product_title", "title", "subject", "name"]) !== undefined,
      ).length,
    }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = candidates[0]?.arr ?? [];
  return best
    .map<SearchItem | null>((raw) => {
      const id = asString(pick(raw, ["product_id", "productId", "ae_product_id", "itemId"]));
      if (!id) return null;
      return {
        ae_product_id: id,
        title: asString(pick(raw, ["product_title", "title", "subject", "name"])) ?? "",
        price: asString(pick(raw, ["target_sale_price", "sale_price", "price", "app_sale_price"])),
        image: asString(
          pick(raw, ["product_main_image_url", "main_image_url", "product_image_url", "image", "image_url"]),
        ),
        url: asString(pick(raw, ["product_detail_url", "promotion_link", "url"])),
      };
    })
    .filter((x): x is SearchItem => x !== null);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.reason ?? "forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  if (!q) {
    return NextResponse.json({ items: [], page, total: 0 });
  }

  try {
    const client = await getAeClientForSeller();
    const ds = new DropshippingApi(client);

    // Attempt 1: text search
    const textSearch = await ds.call("aliexpress.ds.text.search", {
      keywords: q,
      ship_to_country: "PT",
      target_currency: "EUR",
      target_language: "PT",
      page_no: page,
      page_size: 20,
    });

    let items: SearchItem[] = [];
    let rawForDebug: unknown = textSearch.raw;

    if (textSearch.ok) {
      items = normalizeItems(textSearch.raw);
    }

    // Fallback: recommend feed
    if (items.length === 0) {
      const feeds = await ds.listFeeds({ page_no: 1, page_size: 50 });
      let feedName = "DS_VoltstockSelection";
      if (feeds.ok) {
        const feedList = normalizeFeedNames(feeds.raw);
        if (feedList.length > 0) feedName = feedList[0]!;
      }
      const feedItems = await ds.getFeedItems({
        feed_name: feedName,
        page_no: page,
        page_size: 20,
        target_currency: "EUR",
        target_language: "PT",
        country: "PT",
      });
      if (feedItems.ok) {
        items = normalizeItems(feedItems.raw);
        rawForDebug = feedItems.raw;
      }
    }

    return NextResponse.json({
      items,
      page,
      total: items.length,
      debug: process.env.NODE_ENV !== "production" ? rawForDebug : undefined,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "search_failed";
    console.error(`[ae-search] ${msg}`);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function normalizeFeedNames(payload: unknown): string[] {
  const out: string[] = [];
  const stack: unknown[] = [payload];
  while (stack.length) {
    const node = stack.pop();
    if (Array.isArray(node)) {
      for (const v of node) stack.push(v);
      continue;
    }
    if (node && typeof node === "object") {
      const rec = node as AeRaw;
      const name = rec.feed_name ?? rec.promo_name ?? rec.name;
      if (typeof name === "string") out.push(name);
      for (const v of Object.values(rec)) stack.push(v);
    }
  }
  return Array.from(new Set(out));
}
