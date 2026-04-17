import { createHmac } from "node:crypto";

/**
 * AliExpress Open Platform request signing (HMAC-SHA256).
 *
 * Algorithm:
 *   1. Collect all params (system + business), EXCLUDING the `sign` field.
 *   2. Sort keys alphabetically.
 *   3. Concatenate as `${k1}${v1}${k2}${v2}...`.
 *   4. HMAC-SHA256 with `app_secret` as key, over the concatenated string.
 *   5. Upper-case hex.
 *
 * Ref: https://openservice.aliexpress.com/doc/doc.htm#?nodeId=27493&docId=118641
 */
export function signParams(
  params: Record<string, string | number | boolean | undefined>,
  appSecret: string,
): string {
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || k === "sign") continue;
    clean[k] = String(v);
  }
  const sortedKeys = Object.keys(clean).sort();
  const concat = sortedKeys.map((k) => `${k}${clean[k]}`).join("");
  return createHmac("sha256", appSecret).update(concat, "utf8").digest("hex").toUpperCase();
}

/** Milliseconds since epoch, as a string — required by AE system params. */
export function aeTimestamp(): string {
  return Date.now().toString();
}
