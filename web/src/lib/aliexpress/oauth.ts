import { AliExpressClient } from "./client";

export interface OAuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_valid_time: number;
  user_id: string;
  account_platform?: string;
  account?: string;
  havana_id?: string;
  seller_id?: string;
}

/**
 * Build the AE OAuth authorization URL.
 * The seller visits this URL, grants consent, and is redirected to `redirectUri`
 * with `?code=<auth_code>&state=<state>`.
 *
 * Example:
 *   buildAuthorizeUrl({
 *     appKey: "532324",
 *     redirectUri: "https://voltstock.pt/api/aliexpress/callback",
 *     state: "csrf-token-xyz",
 *   })
 */
export function buildAuthorizeUrl(opts: {
  appKey: string;
  redirectUri: string;
  state?: string;
  /** For AE dropshipping: "global" (default). */
  forceAuth?: boolean;
}): string {
  const url = new URL("https://api-sg.aliexpress.com/oauth/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", opts.appKey);
  url.searchParams.set("redirect_uri", opts.redirectUri);
  url.searchParams.set("sp", "ae");
  if (opts.state) url.searchParams.set("state", opts.state);
  if (opts.forceAuth) url.searchParams.set("force_auth", "true");
  return url.toString();
}

/**
 * Exchange an authorization `code` (from the redirect callback) for an access token.
 * Uses the signed `/auth/token/create` method on the standard /sync gateway.
 */
export async function exchangeCodeForToken(opts: {
  appKey: string;
  appSecret: string;
  code: string;
  /** Must match the redirect_uri used to obtain the code. */
  redirectUri?: string;
}): Promise<{ ok: boolean; token?: OAuthTokenResponse; error?: { code: string; message: string } }> {
  const client = new AliExpressClient({ appKey: opts.appKey, appSecret: opts.appSecret });
  const res = await client.call<{ access_token?: string } & OAuthTokenResponse>("/auth/token/create", {
    code: opts.code,
    uuid: opts.redirectUri,
  });
  if (!res.ok || !res.data || !res.data.access_token) {
    return {
      ok: false,
      error: res.error ?? { code: "NO_TOKEN", message: "AE did not return access_token" },
    };
  }
  return { ok: true, token: res.data as OAuthTokenResponse };
}

/**
 * Refresh an expired access token using the stored refresh_token.
 */
export async function refreshAccessToken(opts: {
  appKey: string;
  appSecret: string;
  refreshToken: string;
}): Promise<{ ok: boolean; token?: OAuthTokenResponse; error?: { code: string; message: string } }> {
  const client = new AliExpressClient({ appKey: opts.appKey, appSecret: opts.appSecret });
  const res = await client.call<OAuthTokenResponse>("/auth/token/refresh", {
    refresh_token: opts.refreshToken,
  });
  if (!res.ok || !res.data?.access_token) {
    return {
      ok: false,
      error: res.error ?? { code: "NO_TOKEN", message: "AE did not return refreshed access_token" },
    };
  }
  return { ok: true, token: res.data };
}
