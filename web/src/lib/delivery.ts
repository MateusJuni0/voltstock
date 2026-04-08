// ---------------------------------------------------------------------------
// Delivery estimate by postal code region
// ---------------------------------------------------------------------------

export interface DeliveryEstimate {
  minDays: number;
  maxDays: number;
  label: string;
}

/**
 * Returns a delivery time estimate based on the Portuguese postal code.
 * - Mainland Portugal: 2-3 business days
 * - Islands (Azores/Madeira — postal codes starting with "9"): 4-7 business days
 */
export function getDeliveryEstimate(postalCode: string): DeliveryEstimate {
  const isIslands = postalCode.trim().startsWith("9");

  if (isIslands) {
    return { minDays: 4, maxDays: 7, label: "4-7 dias úteis" };
  }

  return { minDays: 2, maxDays: 3, label: "2-3 dias úteis" };
}

// ---------------------------------------------------------------------------
// Legacy: returns a formatted calendar date string
// ---------------------------------------------------------------------------

export function getEstimatedDelivery(postalCode?: string): string {
  const now = new Date();
  const cutoff = 14; // 14:00 order cutoff
  const isIsland = postalCode?.startsWith("9") ?? false;

  let daysToAdd = isIsland ? 5 : 2;

  // If past cutoff, add 1 day
  if (now.getHours() >= cutoff) daysToAdd += 1;

  const delivery = new Date(now);
  let added = 0;
  while (added < daysToAdd) {
    delivery.setDate(delivery.getDate() + 1);
    const day = delivery.getDay();
    if (day !== 0 && day !== 6) added++; // skip weekends
  }

  return delivery.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
