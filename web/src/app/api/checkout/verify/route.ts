import { NextRequest, NextResponse } from "next/server";
import { getStripe, formatAmountFromStripe } from "@/lib/stripe";
import { signInvoiceToken } from "@/lib/invoice-token";
import { z } from "zod";

const bodySchema = z.object({
  session_id: z.string().min(1, "session_id obrigatório"),
});

export async function POST(request: NextRequest) {
  try {
    const raw: unknown = await request.json();
    const parsed = bodySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { valid: false, error: "session_id em falta ou inválido." },
        { status: 400 },
      );
    }

    const { session_id } = parsed.data;

    const session = await getStripe().checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { valid: false, error: "Pagamento não confirmado." },
        { status: 400 },
      );
    }

    // Issue an invoice access token (cyber-neo CRIT-3 follow-up).
    // Lets the customer download their invoice without auth, expires 90d.
    // Returns null if INVOICE_SIGNING_SECRET is not configured — client
    // falls back to authenticated path.
    const invoiceToken = signInvoiceToken(session_id, "session");

    return NextResponse.json({
      valid: true,
      customer_email: session.customer_details?.email ?? null,
      amount_total: session.amount_total
        ? formatAmountFromStripe(session.amount_total)
        : null,
      invoice_token: invoiceToken,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erro interno do servidor";

    // Stripe throws for invalid / expired session IDs
    const isNotFound =
      message.includes("No such checkout.session") ||
      message.includes("resource_missing");

    return NextResponse.json(
      {
        valid: false,
        error: isNotFound
          ? "Sessão de pagamento não encontrada ou expirada."
          : message,
      },
      { status: isNotFound ? 404 : 500 },
    );
  }
}
