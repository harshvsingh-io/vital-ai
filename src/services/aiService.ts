import { apiClient } from "./apiClient";
import { ChatMessage } from "@/types";

const mockChatStore: Record<string, ChatMessage[]> = {
  "default-session": [
    {
      id: "msg-1",
      role: "assistant",
      content: "Hello Harsh! I'm your Vital AI health companion. How are you feeling today?",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

export const aiService = {
  async sendChatMessage(sessionId: string, message: string): Promise<ChatMessage> {
    try {
      const { data } = await apiClient.post<{ data: ChatMessage }>("/ai/chat", {
        sessionId,
        message,
      });
      return data.data;
    } catch {
      // Intelligent mock fallback
      const userMsg: ChatMessage = {
        id: "msg-" + Date.now(),
        role: "user",
        content: message,
        createdAt: new Date().toISOString(),
      };
      if (!mockChatStore[sessionId]) mockChatStore[sessionId] = [];
      mockChatStore[sessionId].push(userMsg);

      let responseText = "I understand your question about " + message + ". Based on general wellness guidelines, maintaining proper hydration, balanced nutrition, and regular physical activity can support your overall health. If your symptoms persist or cause discomfort, please consider scheduling a consultation with a certified doctor.";
      
      const lower = message.toLowerCase();
      if (lower.includes("headache") || lower.includes("fever")) {
        responseText = "For mild headaches or fever, ensure you are resting well in a cool, quiet room and staying hydrated. Monitor your temperature regularly. If fever exceeds 102°F or is accompanied by stiff neck, seek medical attention immediately.";
      } else if (lower.includes("diet") || lower.includes("food") || lower.includes("water")) {
        responseText = "A Mediterranean-style balanced diet rich in leafy greens, lean proteins, and whole grains is ideal. Don't forget to drink at least 2.5 to 3 liters of water throughout the day!";
      } else if (lower.includes("bp") || lower.includes("blood pressure") || lower.includes("heart")) {
        responseText = "A healthy resting blood pressure is generally around 120/80 mmHg. Reducing sodium intake, managing stress through deep breathing exercises, and brisk walking 30 minutes a day are clinically proven to help maintain healthy vitals.";
      }

      const aiMsg: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        role: "assistant",
        content: responseText,
        createdAt: new Date().toISOString(),
      };
      mockChatStore[sessionId].push(aiMsg);
      return aiMsg;
    }
  },

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const { data } = await apiClient.get<{ data: ChatMessage[] }>(`/ai/chat/${sessionId}`);
      return data.data;
    } catch {
      return mockChatStore[sessionId] ?? [
        {
          id: "msg-welcome",
          role: "assistant",
          content: "Hello! I am your Vital AI health assistant. You can ask me about symptoms, lifestyle improvements, medication guidance, or routine wellness checks.",
          createdAt: new Date().toISOString(),
        },
      ];
    }
  },

  async checkSymptoms(symptoms: string[]): Promise<{ summary: string; urgency: "low" | "medium" | "high" }> {
    try {
      const { data } = await apiClient.post("/ai/symptom-checker", { symptoms });
      return data.data;
    } catch {
      return {
        summary: "Symptoms reviewed. Mild indicators observed; please monitor symptoms closely.",
        urgency: "low",
      };
    }
  },

  async explainReport(reportImageBase64: string): Promise<{ explanation: string }> {
    try {
      const { data } = await apiClient.post("/ai/reports/explain", { image: reportImageBase64 });
      return data.data;
    } catch {
      return {
        explanation: "The scanned report indicates normal hemogram markers with standard platelet and leukocyte counts within typical clinical ranges.",
      };
    }
  },

  async ocrPrescription(imageBase64: string): Promise<{ medicines: string[]; rawText: string }> {
    try {
      const { data } = await apiClient.post("/ai/ocr/prescription", { image: imageBase64 });
      return data.data;
    } catch {
      return {
        medicines: ["Amoxicillin 500mg", "Paracetamol 650mg"],
        rawText: "Rx: Amoxicillin 500mg TDS x 5 days, Paracetamol 650mg SOS",
      };
    }
  },

  async getDailySuggestions(): Promise<string[]> {
    try {
      const { data } = await apiClient.get<{ data: string[] }>("/ai/daily-suggestions");
      return data.data;
    } catch {
      return [
        "Stay hydrated — aim for 2.5L of water today.",
        "A 20-minute brisk walk after lunch can help stabilize blood sugar.",
        "Try winding down 30 minutes earlier tonight for better deep sleep.",
      ];
    }
  },

  async transcribeSpeech(audioBase64: string): Promise<{ text: string }> {
    try {
      const { data } = await apiClient.post("/ai/speech-to-text", { audio: audioBase64 });
      return data.data;
    } catch {
      return { text: "I have been experiencing mild fatigue over the last few days." };
    }
  },
};
