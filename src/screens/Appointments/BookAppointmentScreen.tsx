import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography, radius } from "@/theme/tokens";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { appointmentService } from "@/services/appointmentService";

const TIME_SLOTS = ["09:00 AM", "11:00 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

export const BookAppointmentScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { doctorId } = route.params;

  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [mode, setMode] = useState<"in-person" | "video">("in-person");

  const bookMutation = useMutation({
    mutationFn: () => appointmentService.bookAppointment({ doctorId, date, time, mode }),
    onSuccess: () => navigation.navigate("AppointmentsList"),
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Book Appointment</Text>

        <Card style={{ marginBottom: spacing.lg }}>
          <TextField label="Date" placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Time Slot</Text>
          <View style={styles.chipsRow}>
            {TIME_SLOTS.map((slot) => (
              <Text
                key={slot}
                onPress={() => setTime(slot)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: time === slot ? colors.primary : colors.background,
                    color: time === slot ? colors.textInverse : colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
              >
                {slot}
              </Text>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: spacing.lg }]}>
            Consultation Mode
          </Text>
          <View style={styles.chipsRow}>
            {(["in-person", "video"] as const).map((m) => (
              <Text
                key={m}
                onPress={() => setMode(m)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: mode === m ? colors.primary : colors.background,
                    color: mode === m ? colors.textInverse : colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
              >
                {m === "in-person" ? "In Person" : "Video Call"}
              </Text>
            ))}
          </View>
        </Card>

        <Button
          label="Confirm Booking"
          onPress={() => bookMutation.mutate()}
          loading={bookMutation.isPending}
          disabled={!date}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: { ...typography.display, marginBottom: spacing.xl },
  label: { ...typography.caption, textTransform: "uppercase", marginBottom: spacing.sm },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    fontSize: 13,
    overflow: "hidden",
  },
});
