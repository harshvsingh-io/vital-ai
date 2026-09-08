import { apiClient } from "./apiClient";
import { ChatMessage } from "@/types";

// All AI requests are proxied through the backend AI gateway (NestJS),
// which fans out to OpenAI / Claude / Gemini server-side. The mobile
// app never calls model providers directly or holds provider API keys.

export const aiService = {
  async sendChatMessage(sessionId: string, message: string): Promise<ChatMessage> {
    const { data } = await apiClient.post<{ data: ChatMessage }>("/ai/chat", {
      sessionId,
      message,
    });
    return data.data;
  },

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    const { data } = await apiClient.get<{ data: ChatMessage[] }>(`/ai/chat/${sessionId}`);
    return data.data;
  },

  async checkSymptoms(symptoms: string[]): Promise<{ summary: string; urgency: "low" | "medium" | "high" }> {
    const { data } = await apiClient.post("/ai/symptom-checker", { symptoms });
    return data.data;
  },

  async explainReport(reportImageBase64: string): Promise<{ explanation: string }> {
    const { data } = await apiClient.post("/ai/reports/explain", { image: reportImageBase64 });
    return data.data;
  },

  async ocrPrescription(imageBase64: string): Promise<{ medicines: string[]; rawText: string }> {
    const { data } = await apiClient.post("/ai/ocr/prescription", { image: imageBase64 });
    return data.data;
  },

  async getDailySuggestions(): Promise<string[]> {
    const { data } = await apiClient.get<{ data: string[] }>("/ai/daily-suggestions");
    return data.data;
  },

  async transcribeSpeech(audioBase64: string): Promise<{ text: string }> {
    const { data } = await apiClient.post("/ai/speech-to-text", { audio: audioBase64 });
    return data.data;
  },
};
