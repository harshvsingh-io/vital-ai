import React from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography } from "@/theme/tokens";
import { Card } from "@/components/Card";

export const SettingsScreen = () => {
  const { colors, isDark, setMode } = useAppTheme();

  const Row = ({
    label,
    value,
    onValueChange,
  }: {
    label: string;
    value: boolean;
    onValueChange: (v: boolean) => void;
  }) => (
    <View style={styles.row}>
      <Text style={{ color: colors.textPrimary, ...typography.body }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primary }} />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Appearance</Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <Row label="Dark Mode" value={isDark} onValueChange={(v) => setMode(v ? "dark" : "light")} />
        </Card>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Notifications</Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <Row label="Medication Reminders" value={true} onValueChange={() => {}} />
          <Row label="Appointment Reminders" value={true} onValueChange={() => {}} />
          <Row label="Daily Health Tips" value={true} onValueChange={() => {}} />
        </Card>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Privacy</Text>
        <Card>
          <Row label="Share anonymized data for research" value={false} onValueChange={() => {}} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: { ...typography.display, marginBottom: spacing.xl },
  sectionLabel: { ...typography.caption, textTransform: "uppercase", marginBottom: spacing.sm },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm },
});
