import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-guard";
import { sendShippingNotification } from "@/lib/email";

// ── GET: List all orders (admin only) ──────────────────────────────────────

export async function GET(request: NextRequest) {
  // Auth guard: verifica session + role='admin' em profiles.
  // ANTES: só verificava role se header 'x-user-id' presente — sem header, request passava sem auth.
  // CRIT-2 do audit Cyber Neo 2026-04-25.
  const guard = await requireAdmin();
  if (!guard.ok) {
    const status = guard.reason === "unauthenticated" ? 401 : 403;
    return NextResponse.json({ error: "Forbidden" }, { status });
  }

  const supabase = getSupabaseAdmin();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = 50;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: orders, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch order items for each order
  const orderIds = (orders ?? []).map((o) => o.id);
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  // Group items by order
  const allItems = items ?? [];
  const itemsByOrder: Record<string, typeof allItems> = {};
  for (const item of allItems) {
    if (!itemsByOrder[item.order_id]) {
      itemsByOrder[item.order_id] = [];
    }
    itemsByOrder[item.order_id]!.push(item);
  }

  const ordersWithItems = (orders ?? []).map((order) => ({
    ...order,
    items: itemsByOrder[order.id] ?? [],
  }));

  return NextResponse.json({
    orders: ordersWithItems,
    total: count ?? 0,
    page,
    limit,
  });
}

// ── PATCH: Update order status/tracking ────────────────────────────────────

export async function PATCH(request: NextRequest) {
  // Auth guard: PATCH altera status, tracking_code, tracking_url, notes e dispara
  // email de shipping ao cliente. ANTES: ZERO auth — qualquer request mudava state.
  // CRIT-2 do audit Cyber Neo 2026-04-25.
  const guard = await requireAdmin();
  if (!guard.ok) {
    const status = guard.reason === "unauthenticated" ? 401 : 403;
    return NextResponse.json({ error: "Forbidden" }, { status });
  }

  const supabase = getSupabaseAdmin();
  const body = await request.json();

  const { orderId, status, trackingCode, trackingUrl, notes } = body;

  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (trackingCode !== undefined) updateData.tracking_code = trackingCode;
  if (trackingUrl !== undefined) updateData.tracking_url = trackingUrl;
  if (notes !== undefined) updateData.notes = notes;

  const { data: updated, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If marked as shipped, send shipping notification to customer
  if (status === "shipped" && updated) {
    const shippingAddress =
      typeof updated.shipping_address === "string"
        ? JSON.parse(updated.shipping_address)
        : updated.shipping_address;

    const customerName = shippingAddress?.fullName ?? updated.shipping_name ?? "Cliente";
    const customerEmail = updated.email;

    if (customerEmail) {
      try {
        await sendShippingNotification(
          customerEmail,
          customerName,
          updated.id,
          trackingCode,
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Email error";
        console.error(`[admin-orders] Shipping email failed: ${msg}`);
      }
    }
  }

  return NextResponse.json({ order: updated });
}
