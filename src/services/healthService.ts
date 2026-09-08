import { apiClient } from "./apiClient";
import { HealthProfile, MedicationReminder, MoodEntry, VitalReading } from "@/types";

export const healthService = {
  async getHealthProfile(): Promise<HealthProfile> {
    const { data } = await apiClient.get<{ data: HealthProfile }>("/health/profile");
    return data.data;
  },

  async updateHealthProfile(profile: Partial<HealthProfile>): Promise<HealthProfile> {
    const { data } = await apiClient.patch<{ data: HealthProfile }>("/health/profile", profile);
    return data.data;
  },

  async logVital(reading: Omit<VitalReading, "id">): Promise<VitalReading> {
    const { data } = await apiClient.post<{ data: VitalReading }>("/health/vitals", reading);
    return data.data;
  },

  async getVitals(type: VitalReading["type"], rangeDays = 7): Promise<VitalReading[]> {
    const { data } = await apiClient.get<{ data: VitalReading[] }>("/health/vitals", {
      params: { type, rangeDays },
    });
    return data.data;
  },

  async getMedicationReminders(): Promise<MedicationReminder[]> {
    const { data } = await apiClient.get<{ data: MedicationReminder[] }>("/health/medications");
    return data.data;
  },

  async addMedicationReminder(
    reminder: Omit<MedicationReminder, "id">
  ): Promise<MedicationReminder> {
    const { data } = await apiClient.post<{ data: MedicationReminder }>(
      "/health/medications",
      reminder
    );
    return data.data;
  },

  async logMood(entry: Omit<MoodEntry, "id" | "createdAt">): Promise<MoodEntry> {
    const { data } = await apiClient.post<{ data: MoodEntry }>("/health/mood", entry);
    return data.data;
  },

  async getMoodHistory(rangeDays = 30): Promise<MoodEntry[]> {
    const { data } = await apiClient.get<{ data: MoodEntry[] }>("/health/mood", {
      params: { rangeDays },
    });
    return data.data;
  },
};
