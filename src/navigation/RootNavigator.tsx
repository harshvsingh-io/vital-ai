import React, { useEffect } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SplashScreen } from "@/screens/Auth/SplashScreen";
import { AuthNavigator } from "./AuthNavigator";
import { MainTabNavigator } from "./MainTabNavigator";
import { EmergencySOSScreen } from "@/screens/Emergency/EmergencySOSScreen";
import { useAuthStore } from "@/store/authStore";
import { useAppTheme } from "@/theme/ThemeContext";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  EmergencySOS: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, hydrate } = useAuthStore();
  const { isDark, colors } = useAppTheme();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      border: colors.border,
      primary: colors.primary,
      text: colors.textPrimary,
    },
  };

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="EmergencySOS"
              component={EmergencySOSScreen}
              options={{ presentation: "fullScreenModal", animation: "fade" }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
