import { NextRequest, NextResponse } from "next/server";
import { stripe, formatAmountForStripe } from "@/lib/stripe";

interface CartItemPayload {
  id: number;
  name: string;
  price: number;
  quantity: number;
  img: string;
}

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

interface CheckoutBody {
  items: CartItemPayload[];
  shippingAddress: ShippingAddress;
  shippingCost: number;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutBody = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "O carrinho está vazio." },
        { status: 400 },
      );
    }

    // Validate all items have valid prices and quantities
    for (const item of body.items) {
      if (typeof item.price !== "number" || item.price <= 0) {
        return NextResponse.json(
          { error: "Preço de produto inválido." },
          { status: 400 },
        );
      }
      if (
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.quantity > 100
      ) {
        return NextResponse.json(
          { error: "Quantidade inválida." },
          { status: 400 },
        );
      }
      if (typeof item.name !== "string" || item.name.length === 0 || item.name.length > 500) {
        return NextResponse.json(
          { error: "Nome do produto inválido." },
          { status: 400 },
        );
      }
    }

    // Validate shipping cost is within expected bounds
    if (
      typeof body.shippingCost !== "number" ||
      body.shippingCost < 0 ||
      body.shippingCost > 50
    ) {
      return NextResponse.json(
        { error: "Custo de envio inválido." },
        { status: 400 },
      );
    }

    // Map cart items to Stripe line items
    const lineItems = body.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name.slice(0, 250),
          images: item.img.startsWith("https://") ? [item.img] : [],
        },
        unit_amount: formatAmountForStripe(item.price),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a separate line item if > 0
    if (body.shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Envio",
            images: [],
          },
          unit_amount: formatAmountForStripe(body.shippingCost),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: "pt",
      line_items: lineItems,
      success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/checkout/cancel`,
      metadata: {
        shipping_address: JSON.stringify(body.shippingAddress),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("[checkout] Error creating session:", err);
    const message =
      err instanceof Error ? err.message : "Erro interno do servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
