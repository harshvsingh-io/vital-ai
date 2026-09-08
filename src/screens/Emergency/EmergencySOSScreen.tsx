import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { spacing, typography, radius } from "@/theme/tokens";
import { Button } from "@/components/Button";
import { appointmentService } from "@/services/appointmentService";

export const EmergencySOSScreen = () => {
  const navigation = useNavigation<any>();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const triggerSOS = async () => {
    setStatus("sending");
    try {
      const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
      let lat = 0;
      let lng = 0;
      if (permStatus === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        lat = loc.coords.latitude;
        lng = loc.coords.longitude;
      }
      await appointmentService.triggerEmergencySOS(lat, lng);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <LinearGradient colors={["#7F1D1D", "#0B0F14"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.subtitle}>
          {status === "sent"
            ? "Help is on the way. Your location has been shared with emergency contacts."
            : "This will alert your emergency contacts and share your live location."}
        </Text>

        <View style={styles.pulseCircle}>
          <Text style={styles.pulseGlyph}>!</Text>
        </View>

        <Button
          label={status === "sending" ? "Sending..." : status === "sent" ? "Alert Sent" : "Trigger SOS"}
          variant="danger"
          onPress={triggerSOS}
          loading={status === "sending"}
          disabled={status === "sent"}
          style={{ marginTop: spacing.xxl }}
        />

        {status === "error" && (
          <Text style={styles.error}>Could not send alert. Please call emergency services directly.</Text>
        )}

        <Text style={styles.cancel} onPress={() => navigation.goBack()}>
          Cancel
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  title: { ...typography.display, color: "#fff", marginBottom: spacing.md },
  subtitle: { ...typography.body, color: "rgba(255,255,255,0.8)", textAlign: "center", marginBottom: spacing.xxl },
  pulseCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  pulseGlyph: { fontSize: 56, color: "#fff", fontWeight: "700" },
  error: { color: "#FCA5A5", marginTop: spacing.lg, textAlign: "center" },
  cancel: { color: "rgba(255,255,255,0.7)", marginTop: spacing.xxl, ...typography.bodyMedium },
});
