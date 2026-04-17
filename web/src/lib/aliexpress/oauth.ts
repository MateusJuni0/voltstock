import { aeTimestamp, signParams } from "./signing";

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

const REST_BASE = "https://api-sg.aliexpress.com/rest";

/**
 * Build the AE OAuth authorization URL.
 */
export function buildAuthorizeUrl(opts: {
  appKey: string;
  redirectUri: string;
  state?: string;
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
 * Call an AE REST system API (e.g. /auth/token/create).
 * These APIs use a different signing scheme: the API path is prepended
 * to the sorted-params concat before HMAC.
 */
async function callSystemApi<T>(
  path: string,
  appKey: string,
  appSecret: string,
  businessParams: Record<string, string | number | boolean | undefined>,
): Promise<{ ok: boolean; data?: T; error?: { code: string; message: string; subCode?: string; subMessage?: string; requestId?: string }; raw: unknown }> {
  const params: Record<string, string> = {
    app_key: appKey,
    timestamp: aeTimestamp(),
    sign_method: "sha256",
  };
  for (const [k, v] of Object.entries(businessParams)) {
    if (v === undefined || v === null) continue;
    params[k] = String(v);
  }
  params.sign = signParams(params, appSecret, path);

  const body = new URLSearchParams(params).toString();
  const res = await fetch(`${REST_BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded; charset=utf-8" },
    body,
  });
  const raw = (await res.json()) as unknown;

  if (raw && typeof raw === "object" && "error_response" in raw) {
    const e = (raw as { error_response: Record<string, string> }).error_response;
    return {
      ok: false,
      raw,
      error: {
        code: e.code ?? "UNKNOWN",
        message: e.msg ?? "Unknown error",
        subCode: e.sub_code,
        subMessage: e.sub_msg,
        requestId: e.request_id,
      },
    };
  }
  // REST system API flat error format: { code, type, message, request_id }
  if (raw && typeof raw === "object" && "code" in raw && "message" in raw && !("access_token" in raw)) {
    const e = raw as Record<string, string>;
    return {
      ok: false,
      raw,
      error: {
        code: e.code ?? "UNKNOWN",
        message: e.message ?? "Unknown error",
        subCode: e.type,
        requestId: e.request_id,
      },
    };
  }
  // AE sometimes returns a wrapper: { <snake_case>_response: {...} } — unwrap.
  if (raw && typeof raw === "object") {
    const keys = Object.keys(raw as Record<string, unknown>);
    const respKey = keys.find((k) => k.endsWith("_response"));
    if (respKey) {
      return { ok: true, data: (raw as Record<string, T>)[respKey], raw };
    }
  }
  return { ok: true, data: raw as T, raw };
}

/**
 * Exchange an authorization `code` for an access token.
 */
export async function exchangeCodeForToken(opts: {
  appKey: string;
  appSecret: string;
  code: string;
  redirectUri?: string;
}): Promise<{ ok: boolean; token?: OAuthTokenResponse; error?: { code: string; message: string; subCode?: string; subMessage?: string; requestId?: string } }> {
  const res = await callSystemApi<OAuthTokenResponse>(
    "/auth/token/create",
    opts.appKey,
    opts.appSecret,
    { code: opts.code },
  );
  if (!res.ok || !res.data || !res.data.access_token) {
    return {
      ok: false,
      error: res.error ?? {
        code: "NO_TOKEN",
        message: "AE did not return access_token",
        subMessage: JSON.stringify(res.raw).slice(0, 600),
      },
    };
  }
  return { ok: true, token: res.data };
}

/**
 * Refresh an expired access token using the stored refresh_token.
 */
export async function refreshAccessToken(opts: {
  appKey: string;
  appSecret: string;
  refreshToken: string;
}): Promise<{ ok: boolean; token?: OAuthTokenResponse; error?: { code: string; message: string; subCode?: string; subMessage?: string; requestId?: string } }> {
  const res = await callSystemApi<OAuthTokenResponse>(
    "/auth/token/refresh",
    opts.appKey,
    opts.appSecret,
    { refresh_token: opts.refreshToken },
  );
  if (!res.ok || !res.data?.access_token) {
    return {
      ok: false,
      error: res.error ?? { code: "NO_TOKEN", message: "AE did not return refreshed access_token" },
    };
  }
  return { ok: true, token: res.data };
}
