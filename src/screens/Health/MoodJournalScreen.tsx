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
import { MoodEntry } from "@/types";

const MOODS: { key: MoodEntry["mood"]; glyph: string; label: string }[] = [
  { key: "great", glyph: "😄", label: "Great" },
  { key: "good", glyph: "🙂", label: "Good" },
  { key: "okay", glyph: "😐", label: "Okay" },
  { key: "low", glyph: "😔", label: "Low" },
  { key: "bad", glyph: "😣", label: "Bad" },
];

export const MoodJournalScreen = () => {
  const { colors } = useAppTheme();
  const queryClient = useQueryClient();
  const [mood, setMood] = useState<MoodEntry["mood"] | null>(null);
  const [note, setNote] = useState("");

  const { data: history } = useQuery<MoodEntry[]>({
    queryKey: ["mood-history"],
    queryFn: () => healthService.getMoodHistory(),
  });

  const logMutation = useMutation({
    mutationFn: () => healthService.logMood({ mood: mood!, note }),
    onSuccess: () => {
      setMood(null);
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["mood-history"] });
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Mood Journal</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>How are you feeling today?</Text>

        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <Text
              key={m.key}
              onPress={() => setMood(m.key)}
              style={[
                styles.moodOption,
                {
                  backgroundColor: mood === m.key ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {m.glyph}
            </Text>
          ))}
        </View>

        <Card style={{ marginTop: spacing.lg, marginBottom: spacing.lg }}>
          <TextField
            label="Add a note (optional)"
            value={note}
            onChangeText={setNote}
            multiline
            style={{ height: 80, textAlignVertical: "top" }}
          />
          <Button
            label="Save Entry"
            onPress={() => logMutation.mutate()}
            loading={logMutation.isPending}
            disabled={!mood}
          />
        </Card>

        <Text style={[styles.subheading, { color: colors.textPrimary }]}>History</Text>
        {(history ?? []).map((entry: MoodEntry) => (
          <Card key={entry.id} style={styles.historyRow}>
            <Text style={{ fontSize: 20, marginRight: spacing.md }}>
              {MOODS.find((m) => m.key === entry.mood)?.glyph}
            </Text>
            <View style={{ flex: 1 }}>
              {entry.note ? <Text style={{ color: colors.textPrimary }}>{entry.note}</Text> : null}
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {new Date(entry.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: { ...typography.display, marginBottom: spacing.xs },
  subtitle: { ...typography.body, marginBottom: spacing.xl },
  moodRow: { flexDirection: "row", justifyContent: "space-between" },
  moodOption: {
    fontSize: 28,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  subheading: { ...typography.h2, marginBottom: spacing.md },
  historyRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
});
