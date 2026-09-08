import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography, radius } from "@/theme/tokens";
import { Card } from "@/components/Card";
import { TextField } from "@/components/TextField";
import { appointmentService } from "@/services/appointmentService";

export const DoctorSearchScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState("");

  const { data: doctors, isFetching } = useQuery({
    queryKey: ["doctor-search", query],
    queryFn: () => appointmentService.searchDoctors(query),
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Find a Doctor</Text>
        <TextField
          label="Search"
          placeholder="Name, specialty, or hospital"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={doctors ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isFetching ? (
            <Text style={{ color: colors.textSecondary, textAlign: "center" }}>
              Search by specialty (e.g. Cardiologist) or hospital name.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("BookAppointment", { doctorId: item.id })}
          >
            <Card style={styles.doctorCard}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.doctorName, { color: colors.textPrimary }]}>{item.name}</Text>
                <Text style={{ color: colors.textSecondary }}>
                  {item.specialty} • {item.hospital}
                </Text>
                {item.nextAvailable && (
                  <Text style={[styles.available, { color: colors.success }]}>
                    Next available: {item.nextAvailable}
                  </Text>
                )}
              </View>
              <Text style={[styles.rating, { color: colors.textPrimary }]}>★ {item.rating.toFixed(1)}</Text>
            </Card>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  title: { ...typography.display, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  doctorCard: { flexDirection: "row", alignItems: "flex-start", marginBottom: spacing.md },
  doctorName: { ...typography.bodyMedium, fontSize: 16 },
  available: { ...typography.caption, marginTop: spacing.xs },
  rating: { ...typography.bodyMedium },
});
