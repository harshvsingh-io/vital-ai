import { storage } from "@/utils/storage";
import { apiClient } from "./apiClient";
import { APP_CONFIG } from "@/constants/config";
import { User } from "@/types";

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

async function persistSession(res: AuthResponse) {
  await storage.setItem(APP_CONFIG.sessionStorageKey, res.accessToken);
  await storage.setItem(APP_CONFIG.refreshTokenKey, res.refreshToken);
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
    await persistSession(data);
    return data.user;
  },

  async signup(name: string, email: string, password: string): Promise<User> {
    const { data } = await apiClient.post<AuthResponse>("/auth/signup", { name, email, password });
    await persistSession(data);
    return data.user;
  },

  async requestOtp(phoneOrEmail: string): Promise<void> {
    await apiClient.post("/auth/otp/request", { identifier: phoneOrEmail });
  },

  async verifyOtp(phoneOrEmail: string, code: string): Promise<User> {
    const { data } = await apiClient.post<AuthResponse>("/auth/otp/verify", {
      identifier: phoneOrEmail,
      code,
    });
    await persistSession(data);
    return data.user;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/reset-password", { token, newPassword });
  },

  async socialLogin(provider: "google" | "apple" | "microsoft", idToken: string): Promise<User> {
    const { data } = await apiClient.post<AuthResponse>(`/auth/social/${provider}`, { idToken });
    await persistSession(data);
    return data.user;
  },

  async logout(): Promise<void> {
    await storage.deleteItem(APP_CONFIG.sessionStorageKey);
    await storage.deleteItem(APP_CONFIG.refreshTokenKey);
  },

  async getCurrentUser(): Promise<User | null> {
    const token = await storage.getItem(APP_CONFIG.sessionStorageKey);
    if (!token) return null;
    const { data } = await apiClient.get<{ data: User }>("/auth/me");
    return data.data;
  },
};
