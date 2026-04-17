import { type NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { buildAuthorizeUrl } from "@/lib/aliexpress/oauth";

/**
 * GET /api/aliexpress/auth
 *
 * Kicks off the AE OAuth flow. Generates a CSRF `state` cookie, builds the
 * authorize URL, and 302-redirects the caller to AE's consent page.
 *
 * AE will redirect back to `/api/aliexpress/callback?code=...&state=...`.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const redirectUri =
    process.env.ALIEXPRESS_REDIRECT_URI ?? new URL("/api/aliexpress/callback", req.url).toString();

  if (!appKey) {
    return NextResponse.json(
      { error: "ALIEXPRESS_APP_KEY not configured on this deployment" },
      { status: 500 },
    );
  }

  const state = randomBytes(24).toString("hex");
  const authUrl = buildAuthorizeUrl({ appKey, redirectUri, state });

  const res = NextResponse.redirect(authUrl);
  res.cookies.set("ae_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });
  return res;
}
