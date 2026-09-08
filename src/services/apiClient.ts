import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { APP_CONFIG } from "@/constants/config";

export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync(APP_CONFIG.sessionStorageKey);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = await SecureStore.getItemAsync(APP_CONFIG.refreshTokenKey);
          const { data } = await axios.post(`${APP_CONFIG.apiBaseUrl}/auth/refresh`, {
            refreshToken,
          });
          await SecureStore.setItemAsync(APP_CONFIG.sessionStorageKey, data.accessToken);
          pendingQueue.forEach((resolve) => resolve());
          pendingQueue = [];
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        pendingQueue.push(() => resolve(apiClient(originalRequest)));
      });
    }

    return Promise.reject(error);
  }
);
