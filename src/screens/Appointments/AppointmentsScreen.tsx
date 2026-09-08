import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography, radius } from "@/theme/tokens";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { appointmentService } from "@/services/appointmentService";
import { Appointment } from "@/types";

export const AppointmentsScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();

  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: () => appointmentService.getMyAppointments(),
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Appointments</Text>
        </View>

        <Button label="Find a Doctor" onPress={() => navigation.navigate("DoctorSearch")} />

        <Text style={[styles.subheading, { color: colors.textPrimary }]}>Upcoming</Text>
        {(appointments ?? []).filter((a: Appointment) => a.status === "upcoming").length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>No upcoming appointments.</Text>
        ) : (
          appointments!
            .filter((a: Appointment) => a.status === "upcoming")
            .map((a: Appointment) => (
              <Card key={a.id} style={styles.card}>
                <Text style={[styles.doctorName, { color: colors.textPrimary }]}>{a.doctor.name}</Text>
                <Text style={{ color: colors.textSecondary }}>{a.doctor.specialty}</Text>
                <View style={styles.metaRow}>
                  <Text style={[styles.badge, { backgroundColor: colors.primary, color: colors.textInverse }]}>
                    {a.mode === "video" ? "Video Call" : "In Person"}
                  </Text>
                  <Text style={{ color: colors.textSecondary }}>
                    {a.date} • {a.time}
                  </Text>
                </View>
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
  headerRow: { marginBottom: spacing.lg },
  title: { ...typography.display },
  subheading: { ...typography.h2, marginTop: spacing.xl, marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  doctorName: { ...typography.bodyMedium, fontSize: 17 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    fontSize: 11,
    fontWeight: "700",
    overflow: "hidden",
  },
});
