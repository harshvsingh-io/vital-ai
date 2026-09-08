import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography } from "@/theme/tokens";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export const VaccinationsScreen = () => {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Vaccination Tracker</Text>
        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={{ color: colors.textSecondary }}>
            Keep a record of past vaccinations and get reminders for upcoming doses.
          </Text>
        </Card>
        <Button label="+ Add Vaccination Record" onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: { ...typography.display, marginBottom: spacing.xl },
});
