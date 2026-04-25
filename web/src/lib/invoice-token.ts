/**
 * Invoice token — HMAC-signed access tokens for guest invoice download.
 *
 * Why this exists: `/api/invoice` returns HTML with PII (name, address, NIF).
 * Authenticated users (and admins) are checked via Supabase session. Guest
 * checkouts have no session — we issue a signed token at checkout-success
 * time so the customer can download their own invoice without leaking PII
 * to anyone who guesses an order UUID.
 *
 * Format (URL-safe):
 *   <base64url(payload)>.<base64url(hmac-sha256(payload, secret))>
 *
 * Payload (compact JSON):
 *   { o: <order_id|session_id>, e: <expiry_unix>, k: <kind: 'order'|'session'> }
 *
 * Refs: cyber-neo audit 2026-04-25 (CRIT-3 follow-up).
 */

import crypto from "node:crypto";

interface InvoiceTokenPayload {
  /** Order id or stripe session id (depending on kind). */
  o: string;
  /** Expiry as unix timestamp seconds. */
  e: number;
  /** Discriminates which field was signed. */
  k: "order" | "session";
}

export interface VerifiedInvoiceToken {
  ok: true;
  kind: "order" | "session";
  ref: string;
  expiresAt: number;
}

export interface InvalidInvoiceToken {
  ok: false;
  reason: "malformed" | "bad_signature" | "expired" | "no_secret";
}

/**
 * Days a freshly minted invoice token stays valid.
 * 90 days covers normal accounting/refund workflows.
 */
const DEFAULT_TTL_SECONDS = 90 * 24 * 60 * 60;

function getSecret(): string | null {
  const secret = process.env.INVOICE_SIGNING_SECRET?.trim();
  if (!secret || secret.length < 32) {
    return null;
  }
  return secret;
}

function base64UrlEncode(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
}

function hmac(secret: string, payloadB64: string): string {
  return base64UrlEncode(
    crypto.createHmac("sha256", secret).update(payloadB64).digest(),
  );
}

/**
 * Sign an invoice access token. Returns null if INVOICE_SIGNING_SECRET is not
 * configured — caller should fall back to login-required messaging.
 */
export function signInvoiceToken(
  ref: string,
  kind: "order" | "session",
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): string | null {
  const secret = getSecret();
  if (!secret) return null;

  const payload: InvoiceTokenPayload = {
    o: ref,
    e: Math.floor(Date.now() / 1000) + ttlSeconds,
    k: kind,
  };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(Buffer.from(payloadJson, "utf-8"));
  const sig = hmac(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

/**
 * Verify an invoice access token. Constant-time comparison.
 */
export function verifyInvoiceToken(
  token: string,
): VerifiedInvoiceToken | InvalidInvoiceToken {
  const secret = getSecret();
  if (!secret) return { ok: false, reason: "no_secret" };

  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false, reason: "malformed" };
  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return { ok: false, reason: "malformed" };

  const expectedSig = hmac(secret, payloadB64);
  // Constant-time compare
  const a = Buffer.from(sigB64);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: "bad_signature" };
  }

  let payload: InvoiceTokenPayload;
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64).toString("utf-8")) as InvoiceTokenPayload;
  } catch {
    return { ok: false, reason: "malformed" };
  }

  if (
    typeof payload.o !== "string" ||
    typeof payload.e !== "number" ||
    (payload.k !== "order" && payload.k !== "session")
  ) {
    return { ok: false, reason: "malformed" };
  }

  if (payload.e < Math.floor(Date.now() / 1000)) {
    return { ok: false, reason: "expired" };
  }

  return {
    ok: true,
    kind: payload.k,
    ref: payload.o,
    expiresAt: payload.e,
  };
}
