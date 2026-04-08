// ---------------------------------------------------------------------------
// GA4 + Meta Pixel analytics helpers
// ---------------------------------------------------------------------------

// --- GA4 helpers ---

function gtag(...args: unknown[]): void {
  if (typeof window !== "undefined" && (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag(...args);
  }
}

interface ViewItemProduct {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface CartProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
}

interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
}

export function trackViewItem(product: ViewItemProduct): void {
  gtag("event", "view_item", {
    currency: "EUR",
    value: product.price,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

export function trackAddToCart(product: CartProduct): void {
  gtag("event", "add_to_cart", {
    currency: "EUR",
    value: product.price * product.quantity,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
}

export function trackBeginCheckout(items: ReadonlyArray<CheckoutItem>, total: number): void {
  gtag("event", "begin_checkout", {
    currency: "EUR",
    value: total,
    items: items.map((item, index) => ({
      item_id: String(index),
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

export function trackPurchase(
  orderId: string,
  total: number,
  items: ReadonlyArray<CheckoutItem>,
): void {
  gtag("event", "purchase", {
    transaction_id: orderId,
    currency: "EUR",
    value: total,
    items: items.map((item, index) => ({
      item_id: String(index),
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

// --- Meta Pixel helpers ---

function fbq(...args: unknown[]): void {
  if (typeof window !== "undefined" && (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq) {
    (window as unknown as { fbq: (...a: unknown[]) => void }).fbq(...args);
  }
}

export function fbTrackViewContent(product: ViewItemProduct): void {
  fbq("track", "ViewContent", {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_category: product.category,
    content_type: "product",
    value: product.price,
    currency: "EUR",
  });
}

export function fbTrackAddToCart(product: {
  id: number;
  name: string;
  price: number;
  quantity: number;
}): void {
  fbq("track", "AddToCart", {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: "product",
    value: product.price * product.quantity,
    currency: "EUR",
  });
}

export function fbTrackInitiateCheckout(total: number, numItems: number): void {
  fbq("track", "InitiateCheckout", {
    value: total,
    currency: "EUR",
    num_items: numItems,
  });
}

export function fbTrackPurchase(total: number, orderId: string): void {
  fbq("track", "Purchase", {
    value: total,
    currency: "EUR",
    content_type: "product",
    order_id: orderId,
  });
}
