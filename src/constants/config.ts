export const APP_CONFIG = {
  name: "Vital AI",
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://api.vitalai.example.com/v1",
  otpLength: 6,
  sessionStorageKey: "vitalai_session",
  refreshTokenKey: "vitalai_refresh_token",
  // Payments/subscriptions are intentionally disabled per product scope.
  featureFlags: {
    payments: false,
    subscriptions: false,
    googleLogin: true,
    appleLogin: true,
    microsoftLogin: true,
    otpLogin: true,
    voiceAssistant: true,
    labReportOCR: true,
  },
};

export const ROUTES = {
  auth: {
    splash: "Splash",
    onboarding: "Onboarding",
    login: "Login",
    signup: "Signup",
    otp: "OTP",
    forgotPassword: "ForgotPassword",
  },
  main: {
    home: "Home",
    aiChat: "AIChat",
    health: "Health",
    appointments: "Appointments",
    profile: "Profile",
  },
} as const;
