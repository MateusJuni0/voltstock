import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";
import { generateInvoiceHtml, generateInvoiceNumber } from "@/lib/invoice";

// CRIT-3 do audit Cyber Neo 2026-04-25: ANTES, qualquer pessoa com order UUID
// descarregava factura com nome/morada/NIF do cliente (PII / GDPR violation).
// Auth model:
//   - Admin (role='admin' em profiles) → pode ver qualquer factura.
//   - User logged in que é dono (order.user_id === user.id) → pode ver a sua.
//   - Guest checkout (order.user_id null) → bloqueado neste endpoint
//     (TODO follow-up: emitir signed token no email de confirmação Stripe).
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id");
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!orderId && !sessionId) {
    return NextResponse.json({ error: "order_id or session_id is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Fetch order by order_id or stripe_session_id
  const query = supabase.from("orders").select("*");
  const { data: order, error: orderError } = orderId
    ? await query.eq("id", orderId).single()
    : await query.eq("stripe_session_id", sessionId!).single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Encomenda não encontrada" }, { status: 404 });
  }

  // ── Auth guard ────────────────────────────────────────────────────────────
  // 1) Admin primeiro (uso interno: dashboard, scripts CMTec).
  const adminGuard = await requireAdmin();
  if (!adminGuard.ok) {
    // 2) Não é admin: tem que ser session user dono da order.
    const sb = await createServerSupabase();
    const {
      data: { user },
    } = await sb.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Autenticação necessária para aceder à factura." },
        { status: 401 },
      );
    }

    const orderUserId = (order as { user_id?: string | null }).user_id;
    if (!orderUserId || orderUserId !== user.id) {
      return NextResponse.json(
        { error: "Não tem permissão para aceder a esta factura." },
        { status: 403 },
      );
    }
  }
  // ── /Auth guard ───────────────────────────────────────────────────────────

  // Fetch order items
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  const orderItems = items ?? [];
  const date = new Date(order.created_at);
  const effectiveOrderId = orderId ?? order.id;
  const invoiceNumber = generateInvoiceNumber(effectiveOrderId, date);

  const subtotal = orderItems.reduce(
    (acc: number, item: { total_price: number }) => acc + item.total_price,
    0,
  );

  const html = generateInvoiceHtml({
    invoiceNumber,
    orderId: effectiveOrderId,
    date: date.toLocaleDateString("pt-PT"),
    customerName: order.shipping_name ?? "Cliente",
    customerEmail: "", // Not stored in order for privacy
    customerNif: order.shipping_nif ?? undefined,
    shippingAddress: {
      line1: order.shipping_address ?? "",
      city: order.shipping_city ?? "",
      postalCode: order.shipping_postal_code ?? "",
      district: order.shipping_district ?? "",
    },
    items: orderItems.map((item: { product_name: string; quantity: number; unit_price: number; total_price: number }) => ({
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    })),
    subtotal,
    shippingCost: order.shipping_cost ?? 0,
    total: order.total,
    ivaRate: 23,
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
