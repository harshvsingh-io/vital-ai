import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/theme/ThemeContext";
import { radius, spacing, typography } from "@/theme/tokens";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled,
  style,
}) => {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? colors.primary : colors.textInverse} />
      ) : (
        <Text
          style={[
            styles.label,
            {
              color:
                variant === "outline"
                  ? colors.primary
                  : variant === "secondary"
                  ? colors.textPrimary
                  : colors.textInverse,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </>
  );

  const baseStyle: ViewStyle = {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    opacity: disabled ? 0.5 : 1,
    borderWidth: variant === "outline" ? 1.5 : 0,
    borderColor: colors.primary,
    backgroundColor:
      variant === "secondary" ? colors.surface : variant === "outline" ? "transparent" : undefined,
  };

  if (variant === "primary" || variant === "danger") {
    return (
      <AnimatedPressable
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, style]}
      >
        <LinearGradient
          colors={variant === "danger" ? [colors.danger, "#B91C1C"] : (colors.primaryGradient as [string, string])}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[baseStyle, { opacity: disabled ? 0.5 : 1 }]}
        >
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[baseStyle, animatedStyle, style]}
    >
      {content}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  label: { ...typography.bodyMedium, fontSize: 16 },
});
