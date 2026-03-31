import { createClient } from "./client";
import { products as localProducts } from "@/data/products";
import type { Product } from "@/data/products";

const supabase = createClient();

export interface DBProduct {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  cost_price: number;
  selling_price: number;
  old_price: number | null;
  margin_percentage: number;
  features: { name: string; value: string }[];
  images: string[];
  in_stock: boolean;
  stock_quantity: number;
  is_featured: boolean;
  badge: string | null;
  rating: number;
  review_count: number;
  supplier_url: string | null;
  shipping_time_days: number | null;
  category?: { name: string; slug: string };
}

function dbProductToLocal(p: DBProduct): Product {
  const price = p.selling_price.toLocaleString("pt-PT", {
    minimumFractionDigits: 2,
  }) + " €";
  const oldPrice = p.old_price
    ? p.old_price.toLocaleString("pt-PT", { minimumFractionDigits: 2 }) + " €"
    : undefined;

  return {
    id: typeof p.id === "string" ? parseInt(p.id.replace(/\D/g, "").slice(0, 6), 10) || 1 : 1,
    name: p.title,
    category: p.category?.name || "Geral",
    price,
    oldPrice,
    rating: p.rating || 4.5,
    img: p.images?.[0] || "",
    gallery: p.images?.slice(1),
    description: p.description || undefined,
    badge: p.badge || undefined,
    features: p.features || undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .order("is_featured", { ascending: false });

  if (error || !data || data.length === 0) {
    return localProducts;
  }

  return data.map(dbProductToLocal);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("is_featured", true)
    .limit(8);

  if (error || !data || data.length === 0) {
    return localProducts.slice(0, 8);
  }

  return data.map(dbProductToLocal);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return dbProductToLocal(data);
}
