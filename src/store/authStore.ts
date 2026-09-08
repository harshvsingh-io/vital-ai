import { create } from "zustand";
import { User } from "@/types";
import { authService } from "@/services/authService";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyOtp: (identifier: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  hydrate: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const user = await authService.login(email, password);
    set({ user, isAuthenticated: true });
  },

  signup: async (name, email, password) => {
    const user = await authService.signup(name, email, password);
    set({ user, isAuthenticated: true });
  },

  verifyOtp: async (identifier, code) => {
    const user = await authService.verifyOtp(identifier, code);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
