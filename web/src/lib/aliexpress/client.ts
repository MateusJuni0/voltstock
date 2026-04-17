import { aeTimestamp, signParams } from "./signing";

export interface AliExpressClientConfig {
  appKey: string;
  appSecret: string;
  /** Default endpoint is the global sync gateway. Override for region-specific. */
  endpoint?: string;
  /** Current access token (optional — required for seller-scoped APIs). */
  accessToken?: string;
  /** Optional logger hook — called with { method, params, response } on every call. */
  logger?: (info: { method: string; params: Record<string, unknown>; ok: boolean; response: unknown }) => void;
  /** Request timeout in ms (default 30s). */
  timeoutMs?: number;
}

export interface AliExpressResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string; subCode?: string; subMessage?: string; requestId?: string };
  raw: unknown;
}

const DEFAULT_ENDPOINT = "https://api-sg.aliexpress.com/sync";

/**
 * AliExpress Open Platform client — stateless, reusable, dependency-free.
 *
 * Usage:
 *   const ae = new AliExpressClient({ appKey, appSecret, accessToken });
 *   const res = await ae.call("aliexpress.ds.product.get", { product_id: 123 });
 */
export class AliExpressClient {
  private readonly appKey: string;
  private readonly appSecret: string;
  private readonly endpoint: string;
  private accessToken?: string;
  private readonly logger?: AliExpressClientConfig["logger"];
  private readonly timeoutMs: number;

  constructor(config: AliExpressClientConfig) {
    if (!config.appKey) throw new Error("AliExpressClient: appKey is required");
    if (!config.appSecret) throw new Error("AliExpressClient: appSecret is required");
    this.appKey = config.appKey;
    this.appSecret = config.appSecret;
    this.endpoint = config.endpoint ?? DEFAULT_ENDPOINT;
    this.accessToken = config.accessToken;
    this.logger = config.logger;
    this.timeoutMs = config.timeoutMs ?? 30_000;
  }

  setAccessToken(token: string | undefined): void {
    this.accessToken = token;
  }

  /**
   * Call any AE API method by name with business params.
   * System params (method, app_key, timestamp, sign_method, sign, v, format, session) are auto-filled.
   */
  async call<T = unknown>(
    method: string,
    businessParams: Record<string, string | number | boolean | undefined> = {},
  ): Promise<AliExpressResponse<T>> {
    const systemParams: Record<string, string> = {
      method,
      app_key: this.appKey,
      timestamp: aeTimestamp(),
      sign_method: "sha256",
      format: "json",
      v: "2.0",
    };
    if (this.accessToken) systemParams.session = this.accessToken;

    const allParams: Record<string, string> = { ...systemParams };
    for (const [k, v] of Object.entries(businessParams)) {
      if (v === undefined || v === null) continue;
      allParams[k] = String(v);
    }
    allParams.sign = signParams(allParams, this.appSecret);

    const body = new URLSearchParams(allParams).toString();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    let raw: unknown;
    let ok = false;
    let data: T | undefined;
    let error: AliExpressResponse<T>["error"];

    try {
      const res = await fetch(this.endpoint, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded; charset=utf-8" },
        body,
        signal: controller.signal,
      });
      raw = await res.json();
      // AE error envelope: { error_response: { code, msg, sub_code, sub_msg, request_id } }
      if (raw && typeof raw === "object" && "error_response" in raw) {
        const e = (raw as { error_response: Record<string, string> }).error_response;
        error = {
          code: e.code ?? "UNKNOWN",
          message: e.msg ?? "Unknown error",
          subCode: e.sub_code,
          subMessage: e.sub_msg,
          requestId: e.request_id,
        };
      } else {
        ok = true;
        data = raw as T;
      }
    } catch (err) {
      error = {
        code: "NETWORK_ERROR",
        message: err instanceof Error ? err.message : String(err),
      };
    } finally {
      clearTimeout(timeout);
    }

    this.logger?.({ method, params: businessParams, ok, response: raw });
    return { ok, data, error, raw };
  }
}
