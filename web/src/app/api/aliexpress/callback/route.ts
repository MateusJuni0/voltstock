import { type NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/aliexpress/oauth";
import { saveToken } from "@/lib/aliexpress/token-store";

/**
 * GET /api/aliexpress/callback?code=...&state=...
 *
 * Receives the OAuth redirect from AliExpress after a seller grants consent.
 * Validates the CSRF state cookie, exchanges the code for a token pair,
 * persists it, and redirects to a success page.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const aeError = searchParams.get("error");

  if (aeError) {
    return NextResponse.json(
      { ok: false, error: "ae_denied", detail: aeError, description: searchParams.get("error_description") },
      { status: 400 },
    );
  }

  if (!code) {
    return NextResponse.json({ ok: false, error: "missing_code" }, { status: 400 });
  }

  const cookieState = req.cookies.get("ae_oauth_state")?.value;
  if (!cookieState || cookieState !== state) {
    return NextResponse.json(
      { ok: false, error: "state_mismatch", hint: "CSRF cookie absent or mismatched" },
      { status: 400 },
    );
  }

  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;
  const redirectUri =
    process.env.ALIEXPRESS_REDIRECT_URI ?? new URL("/api/aliexpress/callback", req.url).toString();

  if (!appKey || !appSecret) {
    return NextResponse.json(
      { ok: false, error: "server_misconfigured", hint: "ALIEXPRESS_APP_KEY/SECRET not set" },
      { status: 500 },
    );
  }

  const exchanged = await exchangeCodeForToken({ appKey, appSecret, code, redirectUri });
  if (!exchanged.ok || !exchanged.token) {
    return NextResponse.json(
      { ok: false, error: "exchange_failed", detail: exchanged.error },
      { status: 400 },
    );
  }

  try {
    await saveToken(appKey, exchanged.token);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: "store_failed",
        detail: err instanceof Error ? err.message : String(err),
        token_ok: true,
      },
      { status: 500 },
    );
  }

  // Clear CSRF cookie
  const res = NextResponse.json({
    ok: true,
    ae_user_id: exchanged.token.user_id,
    ae_account: exchanged.token.account,
    seller_id: exchanged.token.seller_id,
    expires_in_seconds: exchanged.token.expires_in,
  });
  res.cookies.set("ae_oauth_state", "", { path: "/", maxAge: 0 });
  return res;
}
