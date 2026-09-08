// Original design tokens for Vital AI. No third-party branding used.
export const palette = {
  emerald50: "#EAFBF3",
  emerald400: "#34D399",
  emerald500: "#10B981",
  emerald600: "#059669",
  indigo400: "#818CF8",
  indigo500: "#6366F1",
  slate900: "#0B0F14",
  slate800: "#12161C",
  slate700: "#1B2028",
  slate600: "#2A303B",
  slate400: "#8A93A3",
  slate200: "#D7DCE3",
  slate100: "#EEF1F5",
  white: "#FFFFFF",
  red500: "#F04438",
  amber500: "#F59E0B",
  black: "#000000",
};

export type ThemeColors = typeof lightColors;

export const lightColors = {
  background: palette.slate100,
  surface: palette.white,
  surfaceGlass: "rgba(255,255,255,0.6)",
  border: "rgba(15,23,42,0.08)",
  textPrimary: "#0B0F14",
  textSecondary: "#5B6472",
  textInverse: palette.white,
  primary: palette.emerald500,
  primaryGradient: [palette.emerald400, palette.indigo500],
  accent: palette.indigo500,
  danger: palette.red500,
  warning: palette.amber500,
  success: palette.emerald600,
  tabBar: "rgba(255,255,255,0.85)",
  shadow: "rgba(15,23,42,0.12)",
};

export const darkColors: ThemeColors = {
  background: palette.slate900,
  surface: palette.slate800,
  surfaceGlass: "rgba(18,22,28,0.6)",
  border: "rgba(255,255,255,0.08)",
  textPrimary: palette.white,
  textSecondary: palette.slate400,
  textInverse: palette.slate900,
  primary: palette.emerald400,
  primaryGradient: [palette.emerald500, palette.indigo400],
  accent: palette.indigo400,
  danger: palette.red500,
  warning: palette.amber500,
  success: palette.emerald400,
  tabBar: "rgba(18,22,28,0.85)",
  shadow: "rgba(0,0,0,0.4)",
};
