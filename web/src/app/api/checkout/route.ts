import { NextRequest, NextResponse } from "next/server";
import { getStripe, formatAmountForStripe } from "@/lib/stripe";
import { products } from "@/data/products";

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

function parseProductPrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^\d,]/g, "").replace(",", "."));
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutBody = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "O carrinho está vazio." },
        { status: 400 },
      );
    }

    // Validate each item against the real product catalog (server-side price check)
    const lineItems = body.items.map((item) => {
      const catalogProduct = products.find((p) => p.id === item.id);

      if (!catalogProduct) {
        throw new Error(`Produto com ID ${item.id} não encontrado no catálogo.`);
      }

      if (catalogProduct.inStock === false) {
        throw new Error(`Produto "${catalogProduct.name}" está esgotado.`);
      }

      if (item.quantity < 1 || item.quantity > 10) {
        throw new Error(`Quantidade inválida para "${catalogProduct.name}". Máximo: 10 unidades.`);
      }

      // Use the SERVER-SIDE price from the catalog, NEVER the client-sent price
      const serverPrice = parseProductPrice(catalogProduct.price);

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: catalogProduct.name,
            images: catalogProduct.img.startsWith("http") ? [catalogProduct.img] : [],
          },
          unit_amount: formatAmountForStripe(serverPrice),
        },
        quantity: item.quantity,
      };
    });

    // Calculate shipping server-side based on actual subtotal
    const subtotal = lineItems.reduce(
      (acc, item) => acc + (item.price_data.unit_amount / 100) * item.quantity,
      0,
    );
    const postalCode = body.shippingAddress.postalCode || "";
    const isIslands = postalCode.startsWith("9");
    const shippingCost = isIslands
      ? (subtotal >= 100 ? 0 : 9.99)
      : (subtotal >= 50 ? 0 : 4.99);

    // Add shipping as a separate line item if > 0
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Envio",
            images: [],
          },
          unit_amount: formatAmountForStripe(shippingCost),
        },
        quantity: 1,
      });
    }

    const session = await getStripe().checkout.sessions.create({
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
    const message =
      err instanceof Error ? err.message : "Erro interno do servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
