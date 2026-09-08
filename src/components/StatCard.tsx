import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Card } from "./Card";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography } from "@/theme/tokens";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: "up" | "down" | "flat";
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit, trend, accentColor }) => {
  const { colors } = useAppTheme();

  return (
    <Card style={styles.card}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: accentColor ?? colors.textPrimary }]}>{value}</Text>
        {unit ? <Text style={[styles.unit, { color: colors.textSecondary }]}> {unit}</Text> : null}
      </View>
      {trend ? (
        <Text style={[styles.trend, { color: trend === "up" ? colors.success : colors.danger }]}>
          {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"}
        </Text>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 140, marginBottom: spacing.md },
  label: { ...typography.caption, textTransform: "uppercase", marginBottom: spacing.sm },
  valueRow: { flexDirection: "row", alignItems: "flex-end" },
  value: { ...typography.h1 },
  unit: { ...typography.body, marginBottom: 2 },
  trend: { position: "absolute", top: spacing.lg, right: spacing.lg, fontSize: 12 },
});
