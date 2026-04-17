import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendOrderConfirmation, sendSellerNotification } from "@/lib/email";
import { products as catalogProducts } from "@/data/products";
import { placeDropshipOrder, type DropshipAeItem } from "@/lib/aliexpress/place-dropship-order";
import type Stripe from "stripe";

// ── Types ───────────────────────────────────────────────────────────────────

interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  district: string;
  phone: string;
  nif?: string;
}

interface OrderRecord {
  stripe_session_id: string;
  stripe_payment_intent: string | null;
  user_id: string | null;
  status: string;
  total: number;
  shipping_cost: number;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  shipping_district: string | null;
  shipping_phone: string | null;
  shipping_nif: string | null;
}

interface OrderItemRecord {
  order_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function parseShippingAddress(metadata: Stripe.Metadata | null): ShippingAddress | null {
  if (!metadata?.shipping_address) {
    return null;
  }

  try {
    return JSON.parse(metadata.shipping_address) as ShippingAddress;
  } catch {
    return null;
  }
}

function buildOrderRecord(
  session: Stripe.Checkout.Session,
  shipping: ShippingAddress | null,
): OrderRecord {
  const paymentIntent = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id ?? null;

  // Total from Stripe (cents -> EUR)
  const total = session.amount_total ? session.amount_total / 100 : 0;

  // Shipping cost: look for the "Envio" line item added by checkout API.
  // We'll extract this from line items in the persist function instead,
  // since session object doesn't include line items by default.
  // For now, set 0 and update after fetching line items.
  return {
    stripe_session_id: session.id,
    stripe_payment_intent: paymentIntent,
    user_id: (session.metadata?.user_id) || null,
    status: "paid",
    total,
    shipping_cost: 0,
    shipping_name: shipping?.fullName ?? null,
    shipping_address: shipping
      ? [shipping.line1, shipping.line2].filter(Boolean).join(", ")
      : null,
    shipping_city: shipping?.city ?? null,
    shipping_postal_code: shipping?.postalCode ?? null,
    shipping_district: shipping?.district ?? null,
    shipping_phone: shipping?.phone ?? null,
    shipping_nif: shipping?.nif ?? null,
  };
}

// ── Main persistence logic ──────────────────────────────────────────────────

async function persistOrder(session: Stripe.Checkout.Session): Promise<void> {
  const supabase = getSupabaseAdmin();
  const shipping = parseShippingAddress(session.metadata);
  const orderData = buildOrderRecord(session, shipping);

  // Fetch line items from Stripe to get product details + shipping cost
  const lineItems = await getStripe().checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  // Separate shipping from product items and calculate shipping cost
  let shippingCost = 0;
  const productItems: OrderItemRecord[] = [];

  for (const item of lineItems.data) {
    if (item.description === "Envio") {
      shippingCost = item.amount_total ? item.amount_total / 100 : 0;
      continue;
    }

    const unitPrice = item.price?.unit_amount ? item.price.unit_amount / 100 : 0;
    const quantity = item.quantity ?? 1;

    productItems.push({
      order_id: "", // placeholder — filled after order insert
      product_name: item.description ?? "Produto",
      quantity,
      unit_price: unitPrice,
      total_price: unitPrice * quantity,
    });
  }

  // Update shipping cost on the order record
  const finalOrder: OrderRecord = {
    ...orderData,
    shipping_cost: shippingCost,
  };

  // Insert order
  const { data: insertedOrder, error: orderError } = await supabase
    .from("orders")
    .insert(finalOrder)
    .select("id")
    .single();

  if (orderError) {
    // If it's a unique constraint violation, the order was already processed
    if (orderError.code === "23505") {
      return;
    }
    throw new Error(`Failed to insert order: ${orderError.message}`);
  }

  if (!insertedOrder?.id) {
    throw new Error("Order inserted but no ID returned.");
  }

  // Insert order items
  if (productItems.length > 0) {
    const itemsWithOrderId = productItems.map((item) => ({
      ...item,
      order_id: insertedOrder.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsError) {
      throw new Error(`Failed to insert order items: ${itemsError.message}`);
    }
  }

  // Decrement stock for purchased products
  for (const item of productItems) {
    const catalogProduct = catalogProducts.find((p) => p.name === item.product_name);
    if (catalogProduct) {
      // Decrement stock_quantity in product_overrides
      // Use raw SQL via rpc for atomic decrement
      await supabase.rpc("decrement_stock", {
        p_local_id: catalogProduct.id,
        p_quantity: item.quantity,
      });
    }
  }

  // ── AliExpress dropship auto-order (silent fallback on failure) ───────────
  try {
    const productNames = productItems.map((p) => p.product_name);
    if (productNames.length > 0 && shipping) {
      const { data: aeMatches } = await supabase
        .from("ae_products")
        .select("ae_product_id, name")
        .in("name", productNames)
        .eq("active", true);

      const matches = (aeMatches ?? []) as Array<{ ae_product_id: string; name: string }>;
      if (matches.length > 0) {
        const aeItems: DropshipAeItem[] = productItems
          .map((p) => {
            const match = matches.find((m) => m.name === p.product_name);
            if (!match) return null;
            return {
              ae_product_id: match.ae_product_id,
              quantity: p.quantity,
            } satisfies DropshipAeItem;
          })
          .filter((x): x is DropshipAeItem => x !== null);

        if (aeItems.length > 0) {
          // Tag order_items with ae_product_id for downstream tracking sync
          for (const ae of aeItems) {
            const match = matches.find((m) => m.ae_product_id === ae.ae_product_id);
            if (!match) continue;
            await supabase
              .from("order_items")
              .update({ ae_product_id: ae.ae_product_id })
              .eq("order_id", insertedOrder.id)
              .eq("product_name", match.name);
          }

          const placed = await placeDropshipOrder(
            insertedOrder.id,
            supabase,
            aeItems,
            shipping,
          );
          if (!placed.ok) {
            console.error(
              `[stripe-webhook] AE dropship FAILED for order ${insertedOrder.id}: ${placed.error}`,
            );
          }
        }
      }
    }
  } catch (aeErr) {
    const msg = aeErr instanceof Error ? aeErr.message : "ae_step_error";
    console.error(`[stripe-webhook] AE dropship step error for ${insertedOrder.id}: ${msg}`);
  }

  // Send order confirmation email to customer + notification to seller
  const customerEmail = session.customer_details?.email;
  if (customerEmail && shipping) {
    const emailData = {
      orderId: insertedOrder.id,
      customerEmail,
      customerName: shipping.fullName,
      items: productItems,
      subtotal: finalOrder.total - shippingCost,
      shippingCost,
      total: finalOrder.total,
      shippingAddress: {
        line1: shipping.line1,
        line2: shipping.line2,
        city: shipping.city,
        postalCode: shipping.postalCode,
        district: shipping.district,
      },
      nif: shipping.nif,
    };

    // Send both emails in parallel — don't fail the order if either fails
    const results = await Promise.allSettled([
      sendOrderConfirmation(emailData),
      sendSellerNotification(emailData),
    ]);

    for (const result of results) {
      if (result.status === "rejected") {
        const msg = result.reason instanceof Error ? result.reason.message : "Unknown email error";
        console.error(`[stripe-webhook] Email failed for order ${insertedOrder.id}: ${msg}`);
      }
    }
  }
}

// ── Route Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Assinatura ou segredo do webhook em falta." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erro na verificação do webhook";
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        await persistOrder(session);
      } catch (err: unknown) {
        // Still return 200 to Stripe to prevent retries that could
        // create duplicate orders. Log the error for manual reconciliation.
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`[stripe-webhook] persistOrder failed for session ${session.id}: ${msg}`);
      }

      break;
    }

    default:
      // Unhandled event type — acknowledge receipt
      break;
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
