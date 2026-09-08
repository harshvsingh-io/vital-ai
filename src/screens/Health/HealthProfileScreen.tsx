import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography } from "@/theme/tokens";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { healthService } from "@/services/healthService";

export const HealthProfileScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();

  const { data: profile } = useQuery({
    queryKey: ["health-profile"],
    queryFn: healthService.getHealthProfile,
  });

  const rows: [string, string][] = profile
    ? [
        ["Age", `${profile.age} yrs`],
        ["Height", `${profile.heightCm} cm`],
        ["Weight", `${profile.weightKg} kg`],
        ["BMI", `${profile.bmi.toFixed(1)}`],
        ["Blood Group", profile.bloodGroup],
        ["Allergies", profile.allergies.join(", ") || "None reported"],
        ["Chronic Conditions", profile.chronicConditions.join(", ") || "None reported"],
        ["Family History", profile.familyHistory.join(", ") || "None reported"],
      ]
    : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Health Profile</Text>

        <Card style={{ marginBottom: spacing.lg }}>
          {rows.map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
              <Text style={[styles.rowValue, { color: colors.textPrimary }]}>{value}</Text>
            </View>
          ))}
          {!profile && (
            <Text style={{ color: colors.textSecondary }}>
              Complete your health profile to get personalized AI insights.
            </Text>
          )}
        </Card>

        {profile && (
          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={[styles.subheading, { color: colors.textPrimary }]}>Emergency Contact</Text>
            <Text style={{ color: colors.textSecondary }}>
              {profile.emergencyContact.name} ({profile.emergencyContact.relation}) —{" "}
              {profile.emergencyContact.phone}
            </Text>
          </Card>
        )}

        <Button label="Edit Health Profile" variant="outline" onPress={() => {}} />
        <Button
          label="Vitals Tracker"
          onPress={() => navigation.navigate("VitalsTracker")}
          style={{ marginTop: spacing.md }}
        />
        <Button
          label="Medication Reminders"
          variant="secondary"
          onPress={() => navigation.navigate("MedicationReminder")}
          style={{ marginTop: spacing.md }}
        />
        <Button
          label="Mood Journal"
          variant="secondary"
          onPress={() => navigation.navigate("MoodJournal")}
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: { ...typography.display, marginBottom: spacing.xl },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  rowLabel: { ...typography.body },
  rowValue: { ...typography.bodyMedium },
  subheading: { ...typography.h2, marginBottom: spacing.sm },
});
