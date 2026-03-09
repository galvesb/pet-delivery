import { useCallback, useRef } from "react";
import { api } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

export function useCart() {
  const { user } = useAuthStore();
  const store = useCartStore();
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncToServer = useCallback(() => {
    if (!user) return;
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(async () => {
      try {
        await api.patch("/cart", { items: useCartStore.getState().items });
      } catch {
        // sync silencioso — não quebra UX
      }
    }, 500);
  }, [user]);

  const addItem = useCallback(
    (product: Product) => {
      store.addItem(product);
      syncToServer();
    },
    [store, syncToServer]
  );

  const removeItem = useCallback(
    (product_id: string) => {
      store.removeItem(product_id);
      syncToServer();
    },
    [store, syncToServer]
  );

  const clearCart = useCallback(async () => {
    store.clearCart();
    if (user) {
      try {
        await api.delete("/cart");
      } catch {
        // ignora
      }
    }
  }, [store, user]);

  return {
    items: store.items,
    isOpen: store.isOpen,
    getTotal: store.getTotal,
    getTotalItems: store.getTotalItems,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    addItem,
    removeItem,
    clearCart,
  };
}
