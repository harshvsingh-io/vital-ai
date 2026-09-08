import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeContext";
import { radius, spacing, typography } from "@/theme/tokens";

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ label, error, style, ...rest }) => {
  const { colors } = useAppTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textSecondary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          {
            borderColor: error ? colors.danger : focused ? colors.primary : colors.border,
            color: colors.textPrimary,
            backgroundColor: colors.surface,
          },
          style,
        ]}
        {...rest}
      />
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: { ...typography.caption, marginBottom: spacing.xs, textTransform: "uppercase" },
  input: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  error: { ...typography.caption, marginTop: spacing.xs },
});
