import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getAeClientForSeller } from "@/lib/aliexpress/get-client";
import { DropshippingApi } from "@/lib/aliexpress";

interface AeRaw {
  [k: string]: unknown;
}

interface AeProductRow {
  id: number;
  ae_product_id: string;
  name: string;
  cost_price: number;
  selling_price: number;
  margin_percentage: number | null;
  stock_quantity: number | null;
  active: boolean;
}

interface SyncChange {
  ae_product_id: string;
  name: string;
  stock_before: number | null;
  stock_after: number;
  cost_before: number;
  cost_after: number;
  action: "updated" | "deactivated" | "reactivated" | "unchanged" | "fetch_failed";
  error?: string;
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

function asNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^0-9.,-]/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  return null;
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

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await authorize(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason ?? "forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50", 10) || 50, 200);
  const onlyActive = url.searchParams.get("all") !== "1";

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("ae_products")
    .select(
      "id, ae_product_id, name, cost_price, selling_price, margin_percentage, stock_quantity, active",
    )
    .order("last_synced_at", { ascending: true, nullsFirst: true })
    .limit(limit);
  if (onlyActive) query = query.eq("active", true);

  const { data: products, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (products ?? []) as AeProductRow[];
  if (rows.length === 0) {
    return NextResponse.json({ checked: 0, updated: 0, deactivated: 0, changes: [] });
  }

  const client = await getAeClientForSeller();
  const ds = new DropshippingApi(client);

  const changes: SyncChange[] = [];
  let updated = 0;
  let deactivated = 0;
  let reactivated = 0;

  for (const row of rows) {
    try {
      const res = await ds.getProduct({
        product_id: row.ae_product_id,
        ship_to_country: "PT",
        target_currency: "EUR",
        target_language: "PT",
      });

      if (!res.ok) {
        changes.push({
          ae_product_id: row.ae_product_id,
          name: row.name,
          stock_before: row.stock_quantity,
          stock_after: row.stock_quantity ?? 0,
          cost_before: row.cost_price,
          cost_after: row.cost_price,
          action: "fetch_failed",
          error: res.error?.message ?? "ae_fetch_failed",
        });
        continue;
      }

      const stockRaw = asNumber(
        deepFind(res.raw, (r) => r.stock ?? r.available_stock ?? r.lots_info ?? r.quantity),
      );
      const newStock = Math.max(0, Math.round(stockRaw ?? 0));

      const newCost =
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
        ) ?? row.cost_price;

      const margin = row.margin_percentage ?? 80;
      // Only recompute selling_price if cost drifted >2% AND we have override slot free.
      // To stay safe: we update cost + stock but DO NOT touch selling_price automatically
      // (price changes go through product_overrides table, audited manually).
      const updates: Record<string, unknown> = {
        stock_quantity: newStock,
        cost_price: Math.round(newCost * 100) / 100,
        last_synced_at: new Date().toISOString(),
        previous_stock: row.stock_quantity,
      };

      let action: SyncChange["action"] = "updated";

      // Auto-deactivate when stock drops to 0
      if (newStock === 0 && row.active) {
        updates.active = false;
        action = "deactivated";
        deactivated += 1;
      }
      // Auto-reactivate when stock returns and product was deactivated by previous sync
      else if (newStock > 0 && !row.active && row.stock_quantity === 0) {
        updates.active = true;
        action = "reactivated";
        reactivated += 1;
      }

      const stockChanged = (row.stock_quantity ?? 0) !== newStock;
      const costChanged = Math.abs(row.cost_price - newCost) > 0.01;

      if (stockChanged) {
        updates.last_stock_change_at = new Date().toISOString();
      }

      const { error: upErr } = await supabase.from("ae_products").update(updates).eq("id", row.id);
      if (!upErr) {
        updated += 1;
        if (!stockChanged && !costChanged && action === "updated") action = "unchanged";
        changes.push({
          ae_product_id: row.ae_product_id,
          name: row.name,
          stock_before: row.stock_quantity,
          stock_after: newStock,
          cost_before: row.cost_price,
          cost_after: Math.round(newCost * 100) / 100,
          action,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "sync_error";
      changes.push({
        ae_product_id: row.ae_product_id,
        name: row.name,
        stock_before: row.stock_quantity,
        stock_after: row.stock_quantity ?? 0,
        cost_before: row.cost_price,
        cost_after: row.cost_price,
        action: "fetch_failed",
        error: msg,
      });
      console.error(`[ae-stock-sync] product ${row.ae_product_id}: ${msg}`);
    }
  }

  return NextResponse.json({
    checked: rows.length,
    updated,
    deactivated,
    reactivated,
    changes,
  });
}
