import { Suspense } from "react";
import { ProductsPage } from "@/components/ProductsPage";

export const metadata = {
  title: "Catálogo de Produtos | VoltStock",
  description: "Navegue pelo nosso catálogo completo de hardware e periféricos.",
};

export default function Page() {
  return (
    <Suspense>
      <ProductsPage />
    </Suspense>
  );
}
