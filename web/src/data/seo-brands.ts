import { products } from "./products";

export interface SeoBrand {
  slug: string;
  name: string;
  productCount: number;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[!.]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Build list of all brands with 2+ products */
function buildBrandList(): SeoBrand[] {
  const brandMap = new Map<string, number>();

  for (const product of products) {
    if (product.brand) {
      brandMap.set(product.brand, (brandMap.get(product.brand) ?? 0) + 1);
    }
  }

  const brands: SeoBrand[] = [];
  for (const [name, count] of brandMap) {
    if (count >= 2) {
      brands.push({
        slug: slugify(name),
        name,
        productCount: count,
      });
    }
  }

  return brands.sort((a, b) => b.productCount - a.productCount);
}

export const seoBrands: SeoBrand[] = buildBrandList();

export function getBrandBySlug(slug: string): SeoBrand | undefined {
  return seoBrands.find((b) => b.slug === slug);
}
