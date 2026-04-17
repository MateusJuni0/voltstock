import type { SupabaseClient } from "@supabase/supabase-js";
import { getAeClientForSeller } from "./get-client";
import { DropshippingApi } from "./dropshipping";

export interface DropshipShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  district: string;
  phone: string;
  country?: string; // ISO-2, default PT
}

export interface DropshipAeItem {
  ae_product_id: string;
  quantity: number;
  ae_sku_attr?: string | null;
  logistics_service_name?: string;
}

interface AeRaw {
  [k: string]: unknown;
}

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) return { first: full, last: full };
  const first = parts[0] ?? full;
  const last = parts.slice(1).join(" ");
  return { first, last };
}

function buildLogisticsAddress(ship: DropshipShippingAddress): Record<string, string> {
  const { first, last } = splitName(ship.fullName);
  return {
    address: ship.line1,
    address2: ship.line2 ?? "",
    city: ship.city,
    contact_person: ship.fullName,
    country: ship.country ?? "PT",
    full_name: ship.fullName,
    first_name: first,
    last_name: last,
    mobile_no: ship.phone,
    phone_country: "+351",
    province: ship.district,
    zip: ship.postalCode,
    locale: "pt_PT",
  };
}

function deepFind(root: unknown, keys: string[]): unknown {
  const stack: unknown[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (Array.isArray(node)) {
      for (const v of node) stack.push(v);
      continue;
    }
    if (node && typeof node === "object") {
      const rec = node as AeRaw;
      for (const k of keys) {
        if (rec[k] !== undefined && rec[k] !== null) return rec[k];
      }
      for (const v of Object.values(rec)) stack.push(v);
    }
  }
  return undefined;
}

export interface PlaceDropshipResult {
  ok: boolean;
  ae_order_id: string | null;
  error?: string;
  raw?: unknown;
}

/**
 * Places a dropship order on AE for the given items + shipping address,
 * updating `orders.ae_order_id` on success.
 *
 * Errors are returned, NOT thrown — the caller MUST NOT fail the Stripe
 * webhook on AE failure (customer already paid).
 */
export async function placeDropshipOrder(
  orderId: string,
  supabase: SupabaseClient,
  aeItems: DropshipAeItem[],
  shipping: DropshipShippingAddress,
): Promise<PlaceDropshipResult> {
  if (aeItems.length === 0) {
    return { ok: false, ae_order_id: null, error: "no_ae_items" };
  }

  try {
    const client = await getAeClientForSeller();
    const ds = new DropshippingApi(client);

    const payload = {
      logistics_address: buildLogisticsAddress(shipping),
      product_items: aeItems.map((i) => ({
        product_id: i.ae_product_id,
        product_count: i.quantity,
        sku_attr: i.ae_sku_attr ?? undefined,
        logistics_service_name: i.logistics_service_name ?? undefined,
      })),
    };

    const res = await ds.createOrder({
      param_place_order_request4_open_api_d_t_o: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        ok: false,
        ae_order_id: null,
        error: res.error?.message ?? "ae_order_create_failed",
        raw: res.raw,
      };
    }

    const aeOrderId =
      (deepFind(res.raw, ["order_list", "orderList"]) as unknown) ??
      deepFind(res.raw, ["order_id", "orderId"]);

    let idStr: string | null = null;
    if (Array.isArray(aeOrderId) && aeOrderId.length > 0) {
      const first = aeOrderId[0];
      if (typeof first === "string" || typeof first === "number") idStr = String(first);
      else if (first && typeof first === "object") {
        const inner = (first as AeRaw).order_id ?? (first as AeRaw).orderId;
        if (inner !== undefined) idStr = String(inner);
      }
    } else if (typeof aeOrderId === "string" || typeof aeOrderId === "number") {
      idStr = String(aeOrderId);
    }

    if (idStr) {
      await supabase
        .from("orders")
        .update({
          ae_order_id: idStr,
          ae_order_status: "placed",
          ae_last_synced_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    }

    return { ok: true, ae_order_id: idStr, raw: res.raw };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "place_dropship_failed";
    return { ok: false, ae_order_id: null, error: msg };
  }
}
