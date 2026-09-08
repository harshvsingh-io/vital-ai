import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/theme/ThemeContext";
import { typography } from "@/theme/tokens";

export const SplashScreen = () => {
  const { colors, isDark } = useAppTheme();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.15, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1,
      true
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <LinearGradient
      colors={isDark ? ["#0B0F14", "#12161C"] : ["#EAFBF3", "#EEF1F5"]}
      style={styles.container}
    >
      <Animated.View style={[styles.logo, animatedStyle]}>
        <Text style={styles.logoGlyph}>♥</Text>
      </Animated.View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Vital AI</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your intelligent health companion</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoGlyph: { fontSize: 36, color: "#fff" },
  title: { ...typography.display },
  subtitle: { ...typography.body, marginTop: 6 },
});
