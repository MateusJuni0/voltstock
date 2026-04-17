import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getAeClientForSeller } from "@/lib/aliexpress/get-client";
import { DropshippingApi } from "@/lib/aliexpress";
import { sendShippingNotification } from "@/lib/email";

interface AeRaw {
  [k: string]: unknown;
}

interface OrderRow {
  id: string;
  user_id: string;
  ae_order_id: string;
  ae_tracking_number: string | null;
  status: string;
  shipping_name: string | null;
  shipping_email_sent_at: string | null;
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

function asString(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
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

async function getCustomerEmail(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
): Promise<string | null> {
  try {
    const { data } = await supabase.auth.admin.getUserById(userId);
    return data?.user?.email ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await authorize(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason ?? "forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      "id, user_id, ae_order_id, ae_tracking_number, status, shipping_name, shipping_email_sent_at",
    )
    .not("ae_order_id", "is", null)
    .in("status", ["paid", "processing", "shipped"])
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (orders ?? []) as OrderRow[];
  if (rows.length === 0) {
    return NextResponse.json({ checked: 0, updated: 0, emails_sent: 0 });
  }

  const client = await getAeClientForSeller();
  const ds = new DropshippingApi(client);

  let updated = 0;
  let emailsSent = 0;
  const emailErrors: string[] = [];

  for (const row of rows) {
    try {
      let trackingNo = row.ae_tracking_number ?? null;
      const previousStatus = row.status;

      if (!trackingNo && row.ae_order_id) {
        const orderInfo = await ds.call("aliexpress.ds.order.get", {
          order_id: row.ae_order_id,
        });
        if (orderInfo.ok) {
          trackingNo = asString(
            deepFind(orderInfo.raw, ["logistics_no", "tracking_number", "mail_no"]),
          );
        }
      }

      const updates: Record<string, unknown> = {
        ae_last_synced_at: new Date().toISOString(),
      };

      let newStatus: string | null = null;

      if (trackingNo) {
        updates.ae_tracking_number = trackingNo;
        const tracking = await ds.getTracking({
          logistics_no: trackingNo,
          origin: "CN",
          to_area: "PT",
          language: "PT",
        });
        if (tracking.ok) {
          const status = asString(
            deepFind(tracking.raw, ["logistics_status", "status_desc", "status"]),
          );
          const carrier = asString(
            deepFind(tracking.raw, ["carrier", "service_name", "provider"]),
          );
          if (status) updates.ae_order_status = status;
          if (carrier) updates.ae_carrier = carrier;
          const lower = (status ?? "").toLowerCase();
          if (lower.includes("deliver")) newStatus = "delivered";
          else if (lower.includes("ship") || lower.includes("transit")) newStatus = "shipped";
        }
      }

      if (newStatus) updates.status = newStatus;

      const { error: upErr } = await supabase.from("orders").update(updates).eq("id", row.id);
      if (!upErr) updated += 1;

      // Fire shipping email ONCE when transition to shipped + tracking available
      const becameShipped = newStatus === "shipped" && previousStatus !== "shipped";
      const neverEmailed = !row.shipping_email_sent_at;
      if (becameShipped && neverEmailed && trackingNo) {
        const email = await getCustomerEmail(supabase, row.user_id);
        if (email) {
          try {
            await sendShippingNotification(
              email,
              row.shipping_name ?? "Cliente",
              row.id,
              trackingNo,
            );
            await supabase
              .from("orders")
              .update({ shipping_email_sent_at: new Date().toISOString() })
              .eq("id", row.id);
            emailsSent += 1;
          } catch (mailErr) {
            const msg = mailErr instanceof Error ? mailErr.message : "email_error";
            emailErrors.push(`${row.id}: ${msg}`);
            console.error(`[ae-tracking-sync] email failed ${row.id}: ${msg}`);
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "sync_error";
      console.error(`[ae-tracking-sync] order ${row.id}: ${msg}`);
    }
  }

  return NextResponse.json({
    checked: rows.length,
    updated,
    emails_sent: emailsSent,
    email_errors: emailErrors.length > 0 ? emailErrors : undefined,
  });
}
