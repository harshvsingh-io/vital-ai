import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography } from "@/theme/tokens";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { healthService } from "@/services/healthService";

export const MedicationReminderScreen = () => {
  const { colors } = useAppTheme();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");

  const { data: reminders } = useQuery({
    queryKey: ["medications"],
    queryFn: healthService.getMedicationReminders,
  });

  const addMutation = useMutation({
    mutationFn: () =>
      healthService.addMedicationReminder({
        name,
        dosage,
        frequency,
        times: ["09:00"],
        active: true,
      }),
    onSuccess: () => {
      setName("");
      setDosage("");
      setFrequency("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Medication Reminders</Text>

        {(reminders ?? []).map((r) => (
          <Card key={r.id} style={styles.medRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.medName, { color: colors.textPrimary }]}>{r.name}</Text>
              <Text style={{ color: colors.textSecondary }}>
                {r.dosage} • {r.frequency} • {r.times.join(", ")}
              </Text>
            </View>
            <Switch value={r.active} trackColor={{ true: colors.primary }} />
          </Card>
        ))}

        {(reminders ?? []).length === 0 && !showForm && (
          <Text style={{ color: colors.textSecondary, marginBottom: spacing.lg }}>
            No medication reminders yet.
          </Text>
        )}

        {showForm ? (
          <Card style={{ marginTop: spacing.lg }}>
            <TextField label="Medicine Name" value={name} onChangeText={setName} />
            <TextField label="Dosage" value={dosage} onChangeText={setDosage} placeholder="e.g. 500mg" />
            <TextField
              label="Frequency"
              value={frequency}
              onChangeText={setFrequency}
              placeholder="e.g. Twice daily"
            />
            <Button
              label="Save Reminder"
              onPress={() => addMutation.mutate()}
              loading={addMutation.isPending}
              disabled={!name || !dosage}
            />
          </Card>
        ) : (
          <Button label="+ Add Medication" variant="outline" onPress={() => setShowForm(true)} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: { ...typography.display, marginBottom: spacing.xl },
  medRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  medName: { ...typography.bodyMedium, marginBottom: 2 },
});
