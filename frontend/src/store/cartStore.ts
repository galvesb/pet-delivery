import { create } from "zustand";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (product_id: string) => void;
  updateQuantity: (product_id: string, delta: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  getTotal: () => number;
  getTotalSavings: () => number;
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
        if (product.stock > 0 && existing.quantity >= product.stock) return state;
        return {
          items: state.items.map((i) =>
            i.product_id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      if (product.stock === 0) return state;
      return {
        items: [
          ...state.items,
          {
            product_id: product.id,
            name: product.name,
            price: product.effective_price,
            original_price: product.discount_price ? product.price : null,
            image_url: product.cover_url,
            quantity: 1,
            stock: product.stock,
          },
        ],
      };
    });
  },

  updateQuantity: (product_id: string, delta: number) => {
    set((state) => {
      const item = state.items.find((i) => i.product_id === product_id);
      if (!item) return state;
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return { items: state.items.filter((i) => i.product_id !== product_id) };
      }
      const capped = item.stock > 0 ? Math.min(newQty, item.stock) : newQty;
      return {
        items: state.items.map((i) =>
          i.product_id === product_id ? { ...i, quantity: capped } : i
        ),
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

  getTotalSavings: () => {
    const { items } = get();
    return items.reduce((acc, item) => {
      if (!item.original_price) return acc;
      return acc + (item.original_price - item.price) * item.quantity;
    }, 0);
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((acc, item) => acc + item.quantity, 0);
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
