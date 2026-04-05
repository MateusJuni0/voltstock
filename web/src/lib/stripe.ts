import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Pagamentos ainda não estão configurados. Contacte-nos via WhatsApp para finalizar a sua encomenda.");
  }
  return new Stripe(key, {
    apiVersion: "2026-03-25.dahlia",
    typescript: true,
  });
}

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = getStripeClient();
  }
  return _stripe;
}

export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}
