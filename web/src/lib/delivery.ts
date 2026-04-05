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
