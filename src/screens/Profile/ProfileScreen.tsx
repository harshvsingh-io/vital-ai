import React from "react";
import { Image, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography, radius } from "@/theme/tokens";
import { Card } from "@/components/Card";
import { useAuthStore } from "@/store/authStore";

const MENU_ITEMS: { label: string; route: string; glyph: string }[] = [
  { label: "Health Profile", route: "HealthProfile", glyph: "♥" },
  { label: "Medical Records & Reports", route: "MedicalRecords", glyph: "▤" },
  { label: "Vaccination Tracker", route: "Vaccinations", glyph: "✚" },
  { label: "Settings", route: "Settings", glyph: "⚙" },
  { label: "About Vital AI", route: "About", glyph: "i" },
];

export const ProfileScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Image
            source={{ uri: user?.avatarUrl ?? "https://api.dicebear.com/7.x/initials/png?seed=" + (user?.name ?? "U") }}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: colors.textPrimary }]}>{user?.name ?? "Guest User"}</Text>
          <Text style={{ color: colors.textSecondary }}>{user?.email}</Text>
        </View>

        <Card padded={false}>
          {MENU_ITEMS.map((item, i) => (
            <Pressable
              key={item.route}
              onPress={() => navigation.navigate(item.route)}
              style={[
                styles.menuRow,
                { borderBottomColor: colors.border, borderBottomWidth: i === MENU_ITEMS.length - 1 ? 0 : 1 },
              ]}
            >
              <Text style={[styles.menuGlyph, { color: colors.primary }]}>{item.glyph}</Text>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{item.label}</Text>
              <Text style={{ color: colors.textSecondary }}>›</Text>
            </Pressable>
          ))}
        </Card>

        <Pressable onPress={() => logout()} style={styles.logout}>
          <Text style={{ color: colors.danger, fontWeight: "600" }}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  header: { alignItems: "center", marginBottom: spacing.xl },
  avatar: { width: 84, height: 84, borderRadius: 42, marginBottom: spacing.md, backgroundColor: "#00000010" },
  name: { ...typography.h1 },
  menuRow: { flexDirection: "row", alignItems: "center", padding: spacing.lg, gap: spacing.md },
  menuGlyph: { width: 22, textAlign: "center", fontSize: 16 },
  menuLabel: { flex: 1, ...typography.bodyMedium },
  logout: { alignItems: "center", marginTop: spacing.xxl, padding: spacing.md },
});
