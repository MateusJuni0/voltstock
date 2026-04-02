import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | VoltStock",
  description: "Finalize a sua encomenda de forma segura na VoltStock.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
