import React from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography, radius } from "@/theme/tokens";
import { Card } from "@/components/Card";
import { SocialLinks } from "@/components/SocialLinks";
import { aboutService } from "@/services/aboutService";
import { FounderProfile, TeamMember } from "@/types";

// Founder details and every team member (position, name, photo, and social
// links) are fetched live from the Admin Panel's CMS. Admins add, edit,
// reorder, or remove team entries from the backend — nothing here is
// hardcoded, so the screen always reflects what's published.

export const AboutScreen = () => {
  const { colors } = useAppTheme();

  const { data: founder, isLoading: founderLoading } = useQuery<FounderProfile>({
    queryKey: ["about-founder"],
    queryFn: () => aboutService.getFounder(),
  });

  const { data: team, isLoading: teamLoading } = useQuery<TeamMember[]>({
    queryKey: ["about-team"],
    queryFn: () => aboutService.getTeamMembers(),
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>About Vital AI</Text>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Founder</Text>
        {founderLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
        ) : founder ? (
          <Card style={styles.founderCard}>
            <Image source={{ uri: founder.photoUrl }} style={styles.founderPhoto} />
            <Text style={[styles.founderName, { color: colors.textPrimary }]}>{founder.name}</Text>
            <Text style={[styles.founderRole, { color: colors.primary }]}>{founder.role}</Text>
            <Text style={[styles.founderBio, { color: colors.textSecondary }]}>{founder.bio}</Text>
            <SocialLinks
              instagramUrl={founder.instagramUrl}
              linkedinUrl={founder.linkedinUrl}
              twitterUrl={founder.twitterUrl}
            />
          </Card>
        ) : (
          <Text style={{ color: colors.textSecondary }}>Founder details coming soon.</Text>
        )}

        <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: spacing.xxl }]}>
          Team
        </Text>
        {teamLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
        ) : (team ?? []).length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>Team members coming soon.</Text>
        ) : (
          team!.map((member: TeamMember) => (
            <Card key={member.id} style={styles.teamRow}>
              <Image source={{ uri: member.photoUrl }} style={styles.teamPhoto} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.teamName, { color: colors.textPrimary }]}>{member.name}</Text>
                <Text style={{ color: colors.textSecondary }}>{member.position}</Text>
                <SocialLinks
                  instagramUrl={member.instagramUrl}
                  linkedinUrl={member.linkedinUrl}
                  twitterUrl={member.twitterUrl}
                />
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
  title: { ...typography.display, marginBottom: spacing.xl },
  sectionLabel: { ...typography.caption, textTransform: "uppercase", marginBottom: spacing.md },
  founderCard: { alignItems: "center", paddingVertical: spacing.xl },
  founderPhoto: {
    width: 96,
    height: 96,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    backgroundColor: "#00000010",
  },
  founderName: { ...typography.h1 },
  founderRole: { ...typography.bodyMedium, marginTop: 2, marginBottom: spacing.md },
  founderBio: { ...typography.body, textAlign: "center", lineHeight: 21 },
  teamRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: spacing.md, gap: spacing.md },
  teamPhoto: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: "#00000010" },
  teamName: { ...typography.bodyMedium, fontSize: 16 },
});
