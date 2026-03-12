import { useCallback, useEffect, useRef } from "react";
import { api } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { CartItem, Product } from "@/types";

export function useCart() {
  const { user } = useAuthStore();
  const store = useCartStore();
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedRef = useRef<string | null>(null);

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

  const updateQuantity = useCallback(
    (product_id: string, delta: number) => {
      store.updateQuantity(product_id, delta);
      syncToServer();
    },
    [store, syncToServer]
  );

  // Hidratação: quando o usuário faz login, reconcilia localStorage com servidor
  useEffect(() => {
    if (!user) return;
    if (hydratedRef.current === user.id) return; // já hidratou para este usuário
    hydratedRef.current = user.id;

    api.get<{ items: CartItem[] }>("/cart")
      .then((res) => {
        const serverItems = res.data.items ?? [];
        const localItems = useCartStore.getState().items;
        if (localItems.length === 0 && serverItems.length > 0) {
          // local vazio, servidor tem itens → usa servidor
          store.setItems(serverItems);
        } else if (localItems.length > 0) {
          // local tem itens → mantém local, sincroniza servidor
          api.patch("/cart", { items: localItems }).catch(() => {});
        }
      })
      .catch(() => {});
  }, [user, store]);

  const clearCart = useCallback(async () => {
    store.clearCart();
    hydratedRef.current = null;
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
    getTotalSavings: store.getTotalSavings,
    getTotalItems: store.getTotalItems,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
