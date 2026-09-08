export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const typography = {
  display: { fontSize: 32, fontWeight: "700" as const, letterSpacing: -0.5 },
  h1: { fontSize: 26, fontWeight: "700" as const, letterSpacing: -0.3 },
  h2: { fontSize: 20, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  bodyMedium: { fontSize: 15, fontWeight: "500" as const },
  caption: { fontSize: 12, fontWeight: "500" as const },
};

export const shadowPreset = {
  card: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 6,
  },
};
