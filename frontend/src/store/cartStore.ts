import { create } from "zustand";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (product_id: string) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  getTotal: () => number;
  getTotalItems: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product: Product) => {
    set((state) => {
      const existing = state.items.find((i) => i.product_id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product_id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            product_id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.cover_url,
            quantity: 1,
          },
        ],
      };
    });
  },

  removeItem: (product_id: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.product_id !== product_id),
    }));
  },

  clearCart: () => set({ items: [] }),

  setItems: (items: CartItem[]) => set({ items }),

  getTotal: () => {
    const { items } = get();
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((acc, item) => acc + item.quantity, 0);
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
