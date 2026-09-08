import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography } from "@/theme/tokens";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { useAuthStore } from "@/store/authStore";
import { APP_CONFIG } from "@/constants/config";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export const LoginScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "harshsingh23432@gmail.com",
      password: "password123",
    },
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.email, values.password);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to continue to Vital AI
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Email"
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Password"
                placeholder="••••••••"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          {error ? <Text style={[styles.errorBanner, { color: colors.danger }]}>{error}</Text> : null}

          <Text
            style={[styles.link, { color: colors.primary }]}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            Forgot password?
          </Text>

          <Button label="Sign In" onPress={handleSubmit(onSubmit)} loading={loading} />

          {APP_CONFIG.featureFlags.otpLogin && (
            <Button
              label="Sign in with OTP instead"
              variant="outline"
              onPress={() => navigation.navigate("OTP", { identifier: "" })}
              style={{ marginTop: spacing.md }}
            />
          )}

          <View style={styles.socialRow}>
            {APP_CONFIG.featureFlags.googleLogin && (
              <Button label="Google" variant="secondary" onPress={() => {}} style={styles.socialBtn} />
            )}
            {APP_CONFIG.featureFlags.appleLogin && (
              <Button label="Apple" variant="secondary" onPress={() => {}} style={styles.socialBtn} />
            )}
            {APP_CONFIG.featureFlags.microsoftLogin && (
              <Button label="Microsoft" variant="secondary" onPress={() => {}} style={styles.socialBtn} />
            )}
          </View>

          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Don't have an account?{" "}
            <Text style={{ color: colors.primary }} onPress={() => navigation.navigate("Signup")}>
              Create one
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingTop: spacing.xxxl },
  title: { ...typography.display, marginBottom: spacing.xs },
  subtitle: { ...typography.body, marginBottom: spacing.xxl },
  errorBanner: { ...typography.body, marginBottom: spacing.md },
  link: { ...typography.bodyMedium, textAlign: "right", marginBottom: spacing.xl },
  socialRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xl },
  socialBtn: { flex: 1 },
  footerText: { ...typography.body, textAlign: "center", marginTop: spacing.xxl },
});
