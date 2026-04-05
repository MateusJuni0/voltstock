import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  items: number[];
  toggleItem: (productId: number) => void;
  hasItem: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (productId) => {
        const currentItems = get().items;
        const exists = currentItems.includes(productId);
        set({
          items: exists
            ? currentItems.filter((id) => id !== productId)
            : [...currentItems, productId],
        });
      },

      hasItem: (productId) => {
        return get().items.includes(productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "voltstock-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
