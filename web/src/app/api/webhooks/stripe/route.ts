import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
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
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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

      let shippingAddress = null;
      try {
        shippingAddress = session.metadata?.shipping_address
          ? JSON.parse(session.metadata.shipping_address)
          : null;
      } catch {
        console.error("[Stripe Webhook] Failed to parse shipping address metadata");
      }

      // Log the completed order details
      // eslint-disable-next-line no-console
      console.log("[Stripe Webhook] Order completed:", {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        customerEmail: session.customer_details?.email,
        shippingAddress,
      });

      // Save order to database (Supabase)
      try {
        const { createServiceSupabase } = await import("@/lib/supabase/server");
        const supabase = await createServiceSupabase();

        await supabase.from("orders").insert({
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string,
          status: "paid",
          total: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency ?? "eur",
          customer_email: session.customer_details?.email ?? null,
          shipping_address: shippingAddress,
        });
      } catch (dbError) {
        // Log but don't fail the webhook — Stripe will retry
        console.error("[Stripe Webhook] Failed to save order to DB:", dbError);
      }

      break;
    }

    default:
      // Unhandled event type — acknowledge receipt
      break;
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
