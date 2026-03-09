import { create } from "zustand";
import type { User } from "@/types";
import { setAuthToken } from "@/api/client";

interface AuthState {
  user: User | null;
  accessToken: string | null; // NUNCA no localStorage — apenas em memória
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setToken: (accessToken) => {
    setAuthToken(accessToken);
    set({ accessToken });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    setAuthToken(null);
    set({ user: null, accessToken: null });
  },
}));
