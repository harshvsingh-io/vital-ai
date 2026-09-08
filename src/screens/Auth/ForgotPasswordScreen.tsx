import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography } from "@/theme/tokens";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { authService } from "@/services/authService";

export const ForgotPasswordScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Reset your password</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {sent
            ? "Check your inbox for a link to reset your password."
            : "Enter your account email and we'll send you a reset link."}
        </Text>

        {!sent && (
          <TextField
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        )}

        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

        {!sent ? (
          <Button label="Send Reset Link" onPress={submit} loading={loading} />
        ) : (
          <Button label="Back to Sign In" onPress={() => navigation.navigate("Login")} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingTop: spacing.xxxl },
  title: { ...typography.display, marginBottom: spacing.xs },
  subtitle: { ...typography.body, marginBottom: spacing.xxl },
  error: { ...typography.body, marginBottom: spacing.md },
});
