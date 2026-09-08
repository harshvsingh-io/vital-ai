import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography, radius } from "@/theme/tokens";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { useAuthStore } from "@/store/authStore";
import { aiService } from "@/services/aiService";

export const HomeScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);

  const { data: suggestions } = useQuery({
    queryKey: ["daily-suggestions"],
    queryFn: aiService.getDailySuggestions,
  });

  const quickActions = [
    { label: "Log Vitals", glyph: "♥", onPress: () => navigation.navigate("Health", { screen: "VitalsTracker" }) },
    { label: "AI Assistant", glyph: "✦", onPress: () => navigation.navigate("AIChat") },
    { label: "Find Doctor", glyph: "⌘", onPress: () => navigation.navigate("Appointments", { screen: "DoctorSearch" }) },
    { label: "Emergency SOS", glyph: "!", onPress: () => navigation.navigate("EmergencySOS"), danger: true },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good morning</Text>
            <Text style={[styles.name, { color: colors.textPrimary }]}>{user?.name ?? "there"}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Heart Rate" value="72" unit="bpm" trend="flat" accentColor={colors.primary} />
          <StatCard label="Steps Today" value="6,240" unit="steps" trend="up" accentColor={colors.accent} />
          <StatCard label="Sleep" value="7h 20m" trend="up" />
          <StatCard label="Water" value="1.4" unit="L" trend="down" accentColor={colors.warning} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Pressable key={action.label} onPress={action.onPress} style={{ width: "48%" }}>
              <Card style={styles.actionCard}>
                <Text style={[styles.actionGlyph, { color: action.danger ? colors.danger : colors.primary }]}>
                  {action.glyph}
                </Text>
                <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>{action.label}</Text>
              </Card>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today's AI Suggestions</Text>
        <Card>
          {(suggestions ?? [
            "Stay hydrated — aim for 2.5L of water today.",
            "A 20-minute walk after lunch can help stabilize blood sugar.",
            "Try winding down 30 minutes earlier tonight for better sleep.",
          ]).map((tip, i) => (
            <Text key={i} style={[styles.tip, { color: colors.textSecondary }]}>
              •  {tip}
            </Text>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  header: { marginBottom: spacing.xl },
  greeting: { ...typography.body },
  name: { ...typography.display },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginBottom: spacing.lg },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md, marginTop: spacing.md },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: spacing.md },
  actionCard: { alignItems: "flex-start", marginBottom: spacing.md },
  actionGlyph: { fontSize: 22, marginBottom: spacing.sm },
  actionLabel: { ...typography.bodyMedium },
  tip: { ...typography.body, marginBottom: spacing.sm, lineHeight: 21 },
});
