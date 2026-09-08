import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppTheme } from "@/theme/ThemeContext";
import { spacing, typography, radius } from "@/theme/tokens";
import { aiService } from "@/services/aiService";
import { ChatMessage } from "@/types";
import { APP_CONFIG } from "@/constants/config";

const SESSION_ID = "default-session";

export const AIChatScreen = () => {
  const { colors } = useAppTheme();
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();

  const { data: messages } = useQuery({
    queryKey: ["chat-history", SESSION_ID],
    queryFn: () => aiService.getChatHistory(SESSION_ID),
    initialData: [] as ChatMessage[],
  });

  const sendMutation = useMutation({
    mutationFn: (message: string) => aiService.sendChatMessage(SESSION_ID, message),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat-history", SESSION_ID] }),
  });

  const handleSend = () => {
    if (!input.trim()) return;
    sendMutation.mutate(input.trim());
    setInput("");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>AI Health Assistant</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Not a substitute for professional medical advice
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === "user"
                ? { alignSelf: "flex-end", backgroundColor: colors.primary }
                : { alignSelf: "flex-start", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
            ]}
          >
            <Text style={{ color: item.role === "user" ? colors.textInverse : colors.textPrimary }}>
              {item.content}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            Ask about symptoms, medicines, lab reports, or daily wellness tips.
          </Text>
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          {APP_CONFIG.featureFlags.voiceAssistant && (
            <Pressable style={styles.iconBtn}>
              <Text style={{ color: colors.textSecondary }}>🎤</Text>
            </Pressable>
          )}
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask Vital AI anything..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.textPrimary }]}
            multiline
          />
          <Pressable style={[styles.sendBtn, { backgroundColor: colors.primary }]} onPress={handleSend}>
            <Text style={{ color: colors.textInverse, fontWeight: "700" }}>↑</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  title: { ...typography.h1 },
  subtitle: { ...typography.caption, marginTop: 2 },
  list: { padding: spacing.xl, gap: spacing.md, flexGrow: 1 },
  bubble: { maxWidth: "80%", padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.sm },
  empty: { ...typography.body, textAlign: "center", marginTop: spacing.xxxl },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  iconBtn: { padding: spacing.sm },
  input: { flex: 1, maxHeight: 100, fontSize: 15, paddingVertical: spacing.sm },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
