import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { generateInvoiceHtml, generateInvoiceNumber } from "@/lib/invoice";

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
