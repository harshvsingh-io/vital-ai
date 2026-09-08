import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography, radius } from "@/theme/tokens";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { healthService } from "@/services/healthService";
import { VitalReading } from "@/types";

const VITAL_TYPES: { type: VitalReading["type"]; label: string; unit: string }[] = [
  { type: "heartRate", label: "Heart Rate", unit: "bpm" },
  { type: "bloodPressure", label: "Blood Pressure", unit: "mmHg" },
  { type: "bloodSugar", label: "Blood Sugar", unit: "mg/dL" },
  { type: "steps", label: "Steps", unit: "steps" },
  { type: "sleep", label: "Sleep", unit: "hrs" },
  { type: "water", label: "Water Intake", unit: "L" },
];

export const VitalsTrackerScreen = () => {
  const { colors } = useAppTheme();
  const [selected, setSelected] = useState<VitalReading["type"]>("heartRate");
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();

  const { data: readings } = useQuery<VitalReading[]>({
    queryKey: ["vitals", selected],
    queryFn: () => healthService.getVitals(selected),
  });

  const logMutation = useMutation({
    mutationFn: () =>
      healthService.logVital({
        type: selected,
        value: Number(value),
        unit: VITAL_TYPES.find((v) => v.type === selected)!.unit,
        recordedAt: new Date().toISOString(),
      }),
    onSuccess: () => {
      setValue("");
      queryClient.invalidateQueries({ queryKey: ["vitals", selected] });
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Vitals Tracker</Text>

        <View style={styles.chipsRow}>
          {VITAL_TYPES.map((v) => (
            <Text
              key={v.type}
              onPress={() => setSelected(v.type)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected === v.type ? colors.primary : colors.surface,
                  color: selected === v.type ? colors.textInverse : colors.textPrimary,
                  borderColor: colors.border,
                },
              ]}
            >
              {v.label}
            </Text>
          ))}
        </View>

        <Card style={{ marginTop: spacing.lg, marginBottom: spacing.lg }}>
          <TextField
            label={`Log ${VITAL_TYPES.find((v) => v.type === selected)?.label}`}
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
            placeholder={`Value in ${VITAL_TYPES.find((v) => v.type === selected)?.unit}`}
          />
          <Button
            label="Save Reading"
            onPress={() => logMutation.mutate()}
            loading={logMutation.isPending}
            disabled={!value}
          />
        </Card>

        <Text style={[styles.subheading, { color: colors.textPrimary }]}>Recent Readings</Text>
        {(readings ?? []).length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>No readings logged yet.</Text>
        ) : (
          readings!.map((r: VitalReading) => (
            <Card key={r.id} style={styles.readingRow}>
              <Text style={{ color: colors.textPrimary }}>
                {r.value} {r.unit}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {new Date(r.recordedAt).toLocaleString()}
              </Text>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: { ...typography.display, marginBottom: spacing.xl },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    fontSize: 13,
    fontWeight: "600",
    overflow: "hidden",
  },
  subheading: { ...typography.h2, marginBottom: spacing.md },
  readingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
});
