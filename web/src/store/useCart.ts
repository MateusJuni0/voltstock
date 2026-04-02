import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  /** True once Zustand has rehydrated from localStorage. */
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== productId) })),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set((state) => ({ items: state.items.filter((item) => item.id !== productId) }));
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((acc, item) => {
          const price = parseFloat(
            item.price.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')
          );
          return acc + (isNaN(price) ? 0 : price) * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'voltstock-cart',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
