import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";

interface WishlistStore {
  items: number[];
  toggleItem: (productId: number) => void;
  hasItem: (productId: number) => boolean;
  clearWishlist: () => void;
  syncWithSupabase: (userId: string) => Promise<void>;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (productId) => {
        const currentItems = get().items;
        const exists = currentItems.includes(productId);
        const newItems = exists
          ? currentItems.filter((id) => id !== productId)
          : [...currentItems, productId];

        set({ items: newItems });

        // Fire-and-forget Supabase sync for logged-in users
        syncToggleToSupabase(productId, !exists).catch(() => {
          // Silently ignore — localStorage is the primary source of truth
        });
      },

      hasItem: (productId) => {
        return get().items.includes(productId);
      },

      clearWishlist: () => set({ items: [] }),

      syncWithSupabase: async (userId: string) => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from("wishlists")
            .select("product_id")
            .eq("user_id", userId);

          if (error) {
            // Table may not exist yet — silently ignore
            if (
              error.code === "42P01" ||
              error.message?.includes("does not exist") ||
              error.message?.includes("relation")
            ) {
              return;
            }
            return;
          }

          const remoteIds = (data ?? []).map(
            (row: { product_id: number }) => row.product_id
          );
          const localIds = get().items;

          // Merge: union of local + remote (no duplicates)
          const merged = Array.from(new Set([...localIds, ...remoteIds]));
          set({ items: merged });

          // Push any local-only items to Supabase
          const localOnly = localIds.filter((id) => !remoteIds.includes(id));
          if (localOnly.length > 0) {
            const inserts = localOnly.map((productId) => ({
              user_id: userId,
              product_id: productId,
            }));
            await supabase.from("wishlists").upsert(inserts, {
              onConflict: "user_id,product_id",
              ignoreDuplicates: true,
            });
          }
        } catch {
          // Network error — localStorage remains the source of truth
        }
      },
    }),
    {
      name: "voltstock-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/** Sync a single toggle action to Supabase if user is logged in */
async function syncToggleToSupabase(
  productId: number,
  added: boolean
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  if (added) {
    await supabase.from("wishlists").upsert(
      { user_id: user.id, product_id: productId },
      { onConflict: "user_id,product_id", ignoreDuplicates: true }
    );
  } else {
    await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
  }
}
