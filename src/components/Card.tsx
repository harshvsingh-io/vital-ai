import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { useAppTheme } from "@/theme/ThemeContext";
import { radius, spacing, shadowPreset } from "@/theme/tokens";

interface CardProps extends ViewProps {
  glass?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({ glass, padded = true, style, children, ...rest }) => {
  const { colors, isDark } = useAppTheme();

  if (glass) {
    return (
      <BlurView
        intensity={40}
        tint={isDark ? "dark" : "light"}
        style={[
          styles.base,
          { borderColor: colors.border, padding: padded ? spacing.lg : 0 },
          style,
        ]}
        {...rest}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.base,
        shadowPreset.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          padding: padded ? spacing.lg : 0,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
});
