import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";
import { generateInvoiceHtml, generateInvoiceNumber } from "@/lib/invoice";
import { verifyInvoiceToken } from "@/lib/invoice-token";

// CRIT-3 do audit Cyber Neo 2026-04-25 + follow-up 2026-04-26.
// 3 caminhos de auth, na ordem em que são tentados:
//   1) Signed token (?token=...) — emitido no checkout-success, expira 90d.
//      Cobre guest checkouts sem partir privacy.
//   2) Admin (role='admin' em profiles) — uso interno.
//   3) Session user dono (order.user_id === user.id).
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id");
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const token = request.nextUrl.searchParams.get("token");

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
  // 1) Signed token (caminho guest)
  let authorisedByToken = false;
  if (token) {
    const verified = verifyInvoiceToken(token);
    if (verified.ok) {
      const orderRef = (order as { id?: string }).id;
      const sessionRef = (order as { stripe_session_id?: string }).stripe_session_id;
      if (
        (verified.kind === "order" && verified.ref === orderRef) ||
        (verified.kind === "session" && verified.ref === sessionRef)
      ) {
        authorisedByToken = true;
      }
    }
  }

  if (!authorisedByToken) {
    // 2) Admin
    const adminGuard = await requireAdmin();
    if (!adminGuard.ok) {
      // 3) Session user dono
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
