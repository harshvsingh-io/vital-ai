import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
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

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export const SignupScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();
  const signup = useAuthStore((s) => s.signup);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await signup(values.name, values.email, values.password);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.textPrimary }]}>Create your account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Start your personalized health journey
          </Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextField label="Full Name" value={value} onChangeText={onChange} error={errors.name?.message} />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Email"
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
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          {error ? <Text style={[styles.errorBanner, { color: colors.danger }]}>{error}</Text> : null}

          <Button label="Create Account" onPress={handleSubmit(onSubmit)} loading={loading} />

          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account?{" "}
            <Text style={{ color: colors.primary }} onPress={() => navigation.navigate("Login")}>
              Sign in
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
  footerText: { ...typography.body, textAlign: "center", marginTop: spacing.xxl },
});
