"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ShoppingBag,
  Loader2,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import { toast } from "sonner";

interface WishlistProduct {
  wishlist_id: string;
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  img: string;
  category: string;
  rating: number | string;
  badge?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

function formatRating(rating: number | string): string {
  const num = typeof rating === "string" ? parseFloat(rating) : rating;
  return isNaN(num) ? "0.0" : num.toFixed(1);
}

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { addItem } = useCart();
  const { toggleItem, syncWithSupabase } = useWishlist();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchWishlist() {
      try {
        await syncWithSupabase(user!.id);

        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from("wishlists")
          .select(
            "id, product_id, products(id, name, price, old_price, img, category, rating, badge)"
          )
          .eq("user_id", user!.id);

        if (dbError) {
          if (
            dbError.code === "42P01" ||
            dbError.message?.includes("does not exist") ||
            dbError.message?.includes("relation")
          ) {
            setItems([]);
          } else {
            setError("Não foi possível carregar a lista de desejos.");
          }
          setLoading(false);
          return;
        }

        const mapped: WishlistProduct[] = (data ?? [])
          .filter((row: Record<string, unknown>) => row.products)
          .map((row: Record<string, unknown>) => {
            const p = row.products as Record<string, unknown>;
            return {
              wishlist_id: row.id as string,
              id: p.id as number,
              name: p.name as string,
              price: p.price as string,
              oldPrice: (p.old_price as string) ?? undefined,
              img: p.img as string,
              category: p.category as string,
              rating: p.rating as number | string,
              badge: (p.badge as string) ?? undefined,
            };
          });

        setItems(mapped);
      } catch {
        setError("Erro de ligação. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [user, authLoading, syncWithSupabase]);

  async function handleRemove(wishlistId: string) {
    if (!user) return;
    setRemovingId(wishlistId);
    try {
      const supabase = createClient();
      const item = items.find((i) => i.wishlist_id === wishlistId);

      const { error: dbError } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", wishlistId)
        .eq("user_id", user.id);
      if (dbError) throw dbError;

      setItems((prev) => prev.filter((i) => i.wishlist_id !== wishlistId));
      if (item) toggleItem(item.id);
      toast.success("Removido da lista de desejos");
    } catch {
      setError("Erro ao remover produto da lista.");
    } finally {
      setRemovingId(null);
    }
  }

  function handleAddToCart(product: WishlistProduct) {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      category: product.category,
      rating: product.rating,
      badge: product.badge,
    });
    toast.success(`${product.name} adicionado ao carrinho`, {
      description: "Continuar a comprar ou finalizar compra",
    });
    setAddedToCart((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedToCart((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  }

  if (authLoading || loading) {
    return <WishlistSkeleton />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-accent" style={{ fontFamily: "var(--font-outfit)" }}>
          Lista de Desejos
        </h1>
        <p className="text-sm text-accent/40 mt-1">
          {items.length > 0
            ? `${items.length} ${items.length === 1 ? "produto" : "produtos"} guardados`
            : "Guarde os seus produtos favoritos"}
        </p>
      </div>

      {error && (
        <div className="glass-card-immersive rounded-2xl p-4 mb-5 border-red-500/15">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400/40 text-xs mt-1 hover:text-red-400">Fechar</button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass-card-immersive rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 blur-[60px]" />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/15 to-orange-500/5 border border-rose-500/10 flex items-center justify-center mx-auto mb-5">
              <Heart size={28} className="text-rose-400/40" />
            </div>
            <h3 className="text-lg font-semibold text-accent/60 mb-2">
              A sua lista de desejos está vazia
            </h3>
            <p className="text-sm text-accent/30 mb-6 max-w-md mx-auto">
              Explore a loja e adicione os produtos que mais gosta.
            </p>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02]"
            >
              <ShoppingBag size={16} />
              Explorar Loja
            </Link>
          </div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
        >
          {items.map((product) => (
            <motion.div
              key={product.wishlist_id}
              variants={itemVariants}
              layout
              className="glass-card-immersive rounded-2xl overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-b from-white/[0.03] to-transparent flex items-center justify-center p-4">
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold rounded-full z-10 shadow-sm shadow-orange-500/20">
                    {product.badge}
                  </span>
                )}
                <Image
                  src={product.img}
                  alt={product.name}
                  width={180}
                  height={180}
                  className="object-contain max-h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-[11px] text-accent/30 mb-1 uppercase tracking-wider">{product.category}</p>
                <h3 className="text-sm font-semibold text-accent line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-orange-400 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 text-[11px] text-orange-400">
                    <Star size={11} className="fill-orange-400" />
                    {formatRating(product.rating)}
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg font-bold text-accent">{product.price}</span>
                  {product.oldPrice && (
                    <span className="text-xs text-accent/25 line-through">{product.oldPrice}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500/80 to-amber-500/80 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold rounded-xl transition-all duration-300 shadow-sm shadow-orange-500/10"
                  >
                    {addedToCart.has(product.id) ? (
                      <>
                        <ShoppingCart size={14} />
                        Adicionado!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={14} />
                        Adicionar ao Carrinho
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRemove(product.wishlist_id)}
                    disabled={removingId === product.wishlist_id}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.06] text-red-400/40 hover:text-red-400 hover:border-red-500/15 hover:bg-red-500/[0.06] transition-all duration-300 disabled:opacity-50"
                    aria-label="Remover da lista de desejos"
                  >
                    {removingId === product.wishlist_id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function WishlistSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 skeleton-shimmer rounded-lg mb-2" />
        <div className="h-4 w-56 skeleton-shimmer rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card-immersive rounded-2xl h-80 skeleton-shimmer" />
        ))}
      </div>
    </div>
  );
}
