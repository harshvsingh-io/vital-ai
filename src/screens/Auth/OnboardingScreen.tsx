import React, { useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography } from "@/theme/tokens";
import { Button } from "@/components/Button";

const { width } = Dimensions.get("window");

const slides = [
  {
    title: "Meet your AI Health Assistant",
    body: "Ask health questions, understand symptoms, and get lifestyle guidance in plain language.",
    glyph: "✦",
  },
  {
    title: "Track everything that matters",
    body: "Heart rate, blood pressure, sugar, sleep, water, and steps — all in one clean timeline.",
    glyph: "♥",
  },
  {
    title: "Doctors and hospitals, nearby",
    body: "Search specialists, book appointments, and reach emergency help in seconds.",
    glyph: "⌘",
  },
];

export const OnboardingScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const next = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.glyphCircle, { backgroundColor: colors.primary }]}>
              <Text style={styles.glyph}>{item.glyph}</Text>
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>{item.body}</Text>
          </View>
        )}
      />
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === index ? colors.primary : colors.border, width: i === index ? 24 : 8 },
            ]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <Button label={index === slides.length - 1 ? "Get Started" : "Next"} onPress={next} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xxl },
  glyphCircle: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },
  glyph: { fontSize: 40, color: "#fff" },
  title: { ...typography.h1, textAlign: "center", marginBottom: spacing.md },
  body: { ...typography.body, textAlign: "center", lineHeight: 22 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginBottom: spacing.xl },
  dot: { height: 8, borderRadius: 4 },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
});
