import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography } from "@/theme/tokens";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export const MedicalRecordsScreen = () => {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Medical Records</Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={{ color: colors.textSecondary }}>
            Store lab reports and prescriptions here. Vital AI's OCR engine can automatically read and
            summarize scanned documents once uploaded.
          </Text>
        </Card>
        <Button label="Upload Lab Report" onPress={() => {}} />
        <Button label="Upload Prescription" variant="outline" onPress={() => {}} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: { ...typography.display, marginBottom: spacing.xl },
});
