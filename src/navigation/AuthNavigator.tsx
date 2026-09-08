import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingScreen } from "@/screens/Auth/OnboardingScreen";
import { LoginScreen } from "@/screens/Auth/LoginScreen";
import { SignupScreen } from "@/screens/Auth/SignupScreen";
import { OTPScreen } from "@/screens/Auth/OTPScreen";
import { ForgotPasswordScreen } from "@/screens/Auth/ForgotPasswordScreen";

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  OTP: { identifier: string };
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="OTP" component={OTPScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);
