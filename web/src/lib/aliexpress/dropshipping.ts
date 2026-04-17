import type { AliExpressClient, AliExpressResponse } from "./client";

/**
 * Typed helpers for AE Dropshipping API surface.
 * Each helper wraps `client.call(method, params)` with sensible defaults.
 *
 * Full method reference: https://openservice.aliexpress.com/doc/api.htm?apiGroupId=35
 */

export interface DsProductGetParams {
  product_id: string | number;
  ship_to_country?: string; // ISO-2, e.g. "PT"
  target_currency?: string; // e.g. "EUR"
  target_language?: string; // e.g. "PT" | "EN"
  remove_personal_benefit?: boolean;
}

export interface DsFeedListParams {
  feed_name?: string;
  page_no?: number;
  page_size?: number; // max 50
}

export interface DsRecommendFeedItemsParams {
  feed_name: string;
  page_no?: number;
  page_size?: number;
  target_currency?: string;
  target_language?: string;
  country?: string;
  sort?: string;
}

export interface DsOrderCreateParams {
  /** JSON string of the order payload — schema: DsOrderCreateRequest */
  param_place_order_request4_open_api_d_t_o: string;
}

export interface DsLogisticsTrackingParams {
  logistics_no: string;
  origin?: string; // e.g. "CN"
  to_area?: string; // e.g. "PT"
  language?: string;
  out_ref?: string;
  service_name?: string;
}

export class DropshippingApi {
  constructor(private readonly client: AliExpressClient) {}

  /** Get detailed product info for a given product_id. */
  getProduct<T = unknown>(params: DsProductGetParams): Promise<AliExpressResponse<T>> {
    return this.client.call<T>("aliexpress.ds.product.get", params as unknown as Record<string, string | number | boolean>);
  }

  /** List available dropshipping feeds (curated product lists). */
  listFeeds<T = unknown>(params: DsFeedListParams = {}): Promise<AliExpressResponse<T>> {
    return this.client.call<T>("aliexpress.ds.feedname.get", params as unknown as Record<string, string | number | boolean>);
  }

  /** Get products inside a specific feed. */
  getFeedItems<T = unknown>(params: DsRecommendFeedItemsParams): Promise<AliExpressResponse<T>> {
    return this.client.call<T>(
      "aliexpress.ds.recommend.feed.get",
      params as unknown as Record<string, string | number | boolean>,
    );
  }

  /** Place a dropshipping order on the seller's behalf. */
  createOrder<T = unknown>(params: DsOrderCreateParams): Promise<AliExpressResponse<T>> {
    return this.client.call<T>(
      "aliexpress.ds.order.create",
      params as unknown as Record<string, string | number | boolean>,
    );
  }

  /** Query logistics tracking for a placed order. */
  getTracking<T = unknown>(params: DsLogisticsTrackingParams): Promise<AliExpressResponse<T>> {
    return this.client.call<T>(
      "aliexpress.ds.logistics.tracking.get",
      params as unknown as Record<string, string | number | boolean>,
    );
  }

  /** Generic escape hatch — pass any AE method name + params. */
  call<T = unknown>(
    method: string,
    params: Record<string, string | number | boolean | undefined> = {},
  ): Promise<AliExpressResponse<T>> {
    return this.client.call<T>(method, params);
  }
}
