import "react-native-gesture-handler";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/theme/ThemeContext";
import { RootNavigator } from "@/navigation/RootNavigator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <View style={styles.webContainer}>
              <StatusBar style="auto" />
              <RootNavigator />
            </View>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0B0F14",
  },
  webContainer: Platform.select({
    web: {
      flex: 1,
      width: "100%",
      maxWidth: 500,
      marginHorizontal: "auto",
      height: "100%",
      position: "relative" as const,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.08)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 28,
    },
    default: {
      flex: 1,
    },
  }),
});
