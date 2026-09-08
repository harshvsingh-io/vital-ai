import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

class MemoryStorage {
  private cache = new Map<string, string>();

  getItem(key: string): string | null {
    return this.cache.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.cache.set(key, value);
  }

  removeItem(key: string): void {
    this.cache.delete(key);
  }
}

const memoryFallback = new MemoryStorage();

export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          return window.localStorage.getItem(key);
        }
      } catch {
        // LocalStorage might be disabled in private browsing or iframe
      }
      return memoryFallback.getItem(key);
    }

    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return memoryFallback.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }
      } catch {
        // Fall back to memory
      }
      memoryFallback.setItem(key, value);
      return;
    }

    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      memoryFallback.setItem(key, value);
    }
  },

  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.removeItem(key);
          return;
        }
      } catch {
        // Fall back to memory
      }
      memoryFallback.removeItem(key);
      return;
    }

    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      memoryFallback.removeItem(key);
    }
  },
};
