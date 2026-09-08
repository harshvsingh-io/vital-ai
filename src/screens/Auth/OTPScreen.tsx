import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography, radius } from "@/theme/tokens";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { APP_CONFIG } from "@/constants/config";

export const OTPScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const verifyOtp = useAuthStore((s) => s.verifyOtp);

  const [identifier, setIdentifier] = useState(route.params?.identifier ?? "");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (sent) inputRef.current?.focus();
  }, [sent]);

  const requestCode = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.requestOtp(identifier);
      setSent(true);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Could not send code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(identifier, code);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {sent ? "Enter the code" : "Sign in with OTP"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {sent
            ? `We sent a ${APP_CONFIG.otpLength}-digit code to ${identifier}`
            : "Enter your phone number or email to receive a one-time code"}
        </Text>

        {!sent ? (
          <TextField
            label="Phone or Email"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
          />
        ) : (
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={APP_CONFIG.otpLength}
            style={[
              styles.otpInput,
              { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface },
            ]}
            placeholder="••••••"
            placeholderTextColor={colors.textSecondary}
          />
        )}

        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

        <Button
          label={sent ? "Verify & Continue" : "Send Code"}
          onPress={sent ? confirmCode : requestCode}
          loading={loading}
          style={{ marginTop: spacing.xl }}
        />

        {sent && (
          <Text style={[styles.resend, { color: colors.primary }]} onPress={requestCode}>
            Resend code
          </Text>
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
  otpInput: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    fontSize: 28,
    textAlign: "center",
    letterSpacing: 12,
  },
  error: { ...typography.body, marginTop: spacing.md },
  resend: { ...typography.bodyMedium, textAlign: "center", marginTop: spacing.xl },
});
