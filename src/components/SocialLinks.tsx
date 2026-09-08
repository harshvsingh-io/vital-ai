import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, radius } from "@/theme/tokens";

interface SocialLinksProps {
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

const LINK_META: { key: keyof SocialLinksProps; label: string; glyph: string }[] = [
  { key: "instagramUrl", label: "Instagram", glyph: "◎" },
  { key: "linkedinUrl", label: "LinkedIn", glyph: "in" },
  { key: "twitterUrl", label: "Twitter", glyph: "𝕏" },
];

export const SocialLinks: React.FC<SocialLinksProps> = (props) => {
  const { colors } = useAppTheme();
  const links = LINK_META.filter((m) => props[m.key]);

  if (links.length === 0) return null;

  return (
    <View style={styles.row}>
      {links.map((m) => (
        <Pressable
          key={m.key}
          onPress={() => Linking.openURL(props[m.key] as string)}
          style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.textPrimary, fontWeight: "700", marginRight: 6 }}>{m.glyph}</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{m.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
