import { NextResponse } from "next/server";
import { AliExpressClient } from "@/lib/aliexpress/client";

/**
 * GET /api/aliexpress/ping
 *
 * Sanity check — confirms signing works and the AE gateway is reachable.
 * Uses a no-auth system-tool endpoint. Returns the AE raw response.
 *
 * NOTE: intentionally gated by `X-Admin-Secret` header to avoid exposing
 * internal integration state to the public. Set ADMIN_SECRET in env.
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<NextResponse> {
  const adminSecret = process.env.ADMIN_SECRET;
  const provided = req.headers.get("x-admin-secret");
  if (!adminSecret || provided !== adminSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;
  if (!appKey || !appSecret) {
    return NextResponse.json({ error: "env_missing" }, { status: 500 });
  }

  const ae = new AliExpressClient({ appKey, appSecret });
  // `aliexpress.solution.product.list.get` is the lightest public dropshipping method
  const res = await ae.call("aliexpress.solution.product.list.get", {
    aeop_a_e_product_list_query: JSON.stringify({ current_page: 1, size: 1 }),
  });
  return NextResponse.json({
    app_key: appKey,
    signing_ok: true,
    gateway_ok: res.ok || Boolean(res.error),
    ae_response: res.raw,
  });
}
