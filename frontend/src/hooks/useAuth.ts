import { api } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { CartItem, User } from "@/types";

export function useAuth() {
  const { setToken, setUser, logout: storeLogout } = useAuthStore();
  const { items: localCart, setItems, clearCart } = useCartStore();

  const login = async (email: string, password: string) => {
    // 1. Login
    const params = new URLSearchParams({ username: email, password });
    const { data: tokenData } = await api.post<{ access_token: string }>(
      "/auth/login",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    setToken(tokenData.access_token);

    // 2. Buscar dados do usuário
    const { data: userData } = await api.get<User>("/users/me");
    setUser(userData);

    // 3. Buscar carrinho do servidor
    const { data: serverCart } = await api.get<{ items: CartItem[]; total: number }>(
      "/cart"
    );

    // 4. Merge: local + servidor
    const merged = mergeCart(localCart, serverCart.items);

    // 5. Sync merged para servidor
    await api.patch("/cart", { items: merged });

    // 6. Atualizar store
    setItems(merged);
  };

  const register = async (email: string, password: string, full_name: string) => {
    await api.post("/auth/register", { email, password, full_name });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignora erros no logout
    } finally {
      storeLogout();
      clearCart();
    }
  };

  return { login, register, logout };
}

function mergeCart(local: CartItem[], server: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  // Adiciona itens do servidor
  for (const item of server) {
    merged.set(item.product_id, { ...item });
  }

  // Merge com itens locais (soma quantities se mesmo product_id)
  for (const item of local) {
    if (merged.has(item.product_id)) {
      merged.get(item.product_id)!.quantity += item.quantity;
    } else {
      merged.set(item.product_id, { ...item });
    }
  }

  return Array.from(merged.values());
}
