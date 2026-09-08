import { storage } from "@/utils/storage";
import { apiClient } from "./apiClient";
import { APP_CONFIG } from "@/constants/config";
import { User } from "@/types";

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const CURRENT_USER_KEY = "vitalai_current_user";

function getMockUser(email: string, name?: string): User {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === "harshsingh23432@gmail.com") {
    return {
      id: "user-harsh",
      name: name?.trim() || "Harsh Vardhan Singh",
      email: "harshsingh23432@gmail.com",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      createdAt: new Date().toISOString(),
    };
  }

  const defaultName = cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: "user-" + Date.now(),
    name: name?.trim() || defaultName,
    email: cleanEmail,
    createdAt: new Date().toISOString(),
  };
}

async function persistSession(res: AuthResponse) {
  await storage.setItem(APP_CONFIG.sessionStorageKey, res.accessToken);
  await storage.setItem(APP_CONFIG.refreshTokenKey, res.refreshToken);
  await storage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user));
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
      await persistSession(data);
      return data.user;
    } catch {
      // Fallback for demo / preview mode when backend is not connected
      const mockUser = getMockUser(email);
      const mockResponse: AuthResponse = {
        user: mockUser,
        accessToken: "demo-jwt-token-" + Date.now(),
        refreshToken: "demo-refresh-token-" + Date.now(),
      };
      await persistSession(mockResponse);
      return mockUser;
    }
  },

  async signup(name: string, email: string, password: string): Promise<User> {
    try {
      const { data } = await apiClient.post<AuthResponse>("/auth/signup", { name, email, password });
      await persistSession(data);
      return data.user;
    } catch {
      // Fallback for demo / preview mode when backend is not connected
      const mockUser = getMockUser(email, name);
      const mockResponse: AuthResponse = {
        user: mockUser,
        accessToken: "demo-jwt-token-" + Date.now(),
        refreshToken: "demo-refresh-token-" + Date.now(),
      };
      await persistSession(mockResponse);
      return mockUser;
    }
  },

  async requestOtp(phoneOrEmail: string): Promise<void> {
    try {
      await apiClient.post("/auth/otp/request", { identifier: phoneOrEmail });
    } catch {
      // Simulation success
    }
  },

  async verifyOtp(phoneOrEmail: string, code: string): Promise<User> {
    try {
      const { data } = await apiClient.post<AuthResponse>("/auth/otp/verify", {
        identifier: phoneOrEmail,
        code,
      });
      await persistSession(data);
      return data.user;
    } catch {
      const mockUser = getMockUser(phoneOrEmail);
      const mockResponse: AuthResponse = {
        user: mockUser,
        accessToken: "demo-jwt-token-" + Date.now(),
        refreshToken: "demo-refresh-token-" + Date.now(),
      };
      await persistSession(mockResponse);
      return mockUser;
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post("/auth/forgot-password", { email });
    } catch {
      // Simulation success
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post("/auth/reset-password", { token, newPassword });
    } catch {
      // Simulation success
    }
  },

  async socialLogin(provider: "google" | "apple" | "microsoft", idToken: string): Promise<User> {
    try {
      const { data } = await apiClient.post<AuthResponse>(`/auth/social/${provider}`, { idToken });
      await persistSession(data);
      return data.user;
    } catch {
      const mockUser = getMockUser("harshsingh23432@gmail.com", "Harsh Vardhan Singh");
      const mockResponse: AuthResponse = {
        user: mockUser,
        accessToken: "demo-jwt-token-" + Date.now(),
        refreshToken: "demo-refresh-token-" + Date.now(),
      };
      await persistSession(mockResponse);
      return mockUser;
    }
  },

  async logout(): Promise<void> {
    await storage.deleteItem(APP_CONFIG.sessionStorageKey);
    await storage.deleteItem(APP_CONFIG.refreshTokenKey);
    await storage.deleteItem(CURRENT_USER_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    const token = await storage.getItem(APP_CONFIG.sessionStorageKey);
    if (!token) return null;
    try {
      const { data } = await apiClient.get<{ data: User }>("/auth/me");
      if (data?.data) {
        await storage.setItem(CURRENT_USER_KEY, JSON.stringify(data.data));
        return data.data;
      }
    } catch {
      // Backend offline, fallback to cached session
    }

    const cached = await storage.getItem(CURRENT_USER_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }

    // Default demo user if token is valid
    return getMockUser("harshsingh23432@gmail.com", "Harsh Vardhan Singh");
  },
};
