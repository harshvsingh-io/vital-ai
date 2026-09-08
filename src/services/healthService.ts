import { apiClient } from "./apiClient";
import { HealthProfile, MedicationReminder, MoodEntry, VitalReading } from "@/types";

const fallbackHealthProfile: HealthProfile = {
  age: 24,
  heightCm: 178,
  weightKg: 72,
  bmi: 22.7,
  bloodGroup: "O+",
  allergies: ["Penicillin", "Dust mites"],
  chronicConditions: ["None"],
  familyHistory: ["Hypertension (Paternal)"],
  emergencyContact: {
    name: "Vikram Singh",
    phone: "+91 98765 43210",
    relation: "Father",
  },
  lifestyle: {
    smoking: false,
    alcohol: false,
    exerciseFrequency: "moderate",
  },
};

let fallbackVitals: VitalReading[] = [
  { id: "vr-1", type: "heartRate", value: 72, unit: "bpm", recordedAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "vr-2", type: "heartRate", value: 68, unit: "bpm", recordedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "vr-3", type: "bloodPressure", value: 120, secondaryValue: 80, unit: "mmHg", recordedAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "vr-4", type: "bloodSugar", value: 95, unit: "mg/dL", recordedAt: new Date(Date.now() - 14400000).toISOString() },
  { id: "vr-5", type: "steps", value: 8420, unit: "steps", recordedAt: new Date().toISOString() },
  { id: "vr-6", type: "sleep", value: 7.5, unit: "hrs", recordedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "vr-7", type: "water", value: 2.2, unit: "L", recordedAt: new Date().toISOString() },
];

let fallbackReminders: MedicationReminder[] = [
  { id: "mr-1", name: "Vitamin D3 (60K IU)", dosage: "1 Capsule", frequency: "Weekly", times: ["10:00 AM"], active: true },
  { id: "mr-2", name: "Omega 3 Fish Oil", dosage: "1000mg", frequency: "Daily", times: ["01:00 PM"], active: true },
  { id: "mr-3", name: "Multivitamin Active", dosage: "1 Tablet", frequency: "Daily with breakfast", times: ["09:00 AM"], active: true },
];

let fallbackMoodHistory: MoodEntry[] = [
  { id: "mh-1", mood: "great", note: "Feeling energetic after morning workout and meditation!", createdAt: new Date().toISOString() },
  { id: "mh-2", mood: "good", note: "Focused day, finished all planned tasks.", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "mh-3", mood: "okay", note: "A bit tired in the afternoon.", createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const healthService = {
  async getHealthProfile(): Promise<HealthProfile> {
    try {
      const { data } = await apiClient.get<{ data: HealthProfile }>("/health/profile");
      return data.data;
    } catch {
      return fallbackHealthProfile;
    }
  },

  async updateHealthProfile(profile: Partial<HealthProfile>): Promise<HealthProfile> {
    try {
      const { data } = await apiClient.patch<{ data: HealthProfile }>("/health/profile", profile);
      return data.data;
    } catch {
      Object.assign(fallbackHealthProfile, profile);
      return fallbackHealthProfile;
    }
  },

  async logVital(reading: Omit<VitalReading, "id">): Promise<VitalReading> {
    try {
      const { data } = await apiClient.post<{ data: VitalReading }>("/health/vitals", reading);
      return data.data;
    } catch {
      const newReading: VitalReading = {
        id: "vr-" + Date.now(),
        ...reading,
      };
      fallbackVitals = [newReading, ...fallbackVitals];
      return newReading;
    }
  },

  async getVitals(type: VitalReading["type"], rangeDays = 7): Promise<VitalReading[]> {
    try {
      const { data } = await apiClient.get<{ data: VitalReading[] }>("/health/vitals", {
        params: { type, rangeDays },
      });
      return data.data;
    } catch {
      return fallbackVitals.filter((v) => v.type === type);
    }
  },

  async getMedicationReminders(): Promise<MedicationReminder[]> {
    try {
      const { data } = await apiClient.get<{ data: MedicationReminder[] }>("/health/medications");
      return data.data;
    } catch {
      return fallbackReminders;
    }
  },

  async addMedicationReminder(
    reminder: Omit<MedicationReminder, "id">
  ): Promise<MedicationReminder> {
    try {
      const { data } = await apiClient.post<{ data: MedicationReminder }>(
        "/health/medications",
        reminder
      );
      return data.data;
    } catch {
      const newReminder: MedicationReminder = {
        id: "mr-" + Date.now(),
        ...reminder,
      };
      fallbackReminders = [newReminder, ...fallbackReminders];
      return newReminder;
    }
  },

  async logMood(entry: Omit<MoodEntry, "id" | "createdAt">): Promise<MoodEntry> {
    try {
      const { data } = await apiClient.post<{ data: MoodEntry }>("/health/mood", entry);
      return data.data;
    } catch {
      const newEntry: MoodEntry = {
        id: "mh-" + Date.now(),
        createdAt: new Date().toISOString(),
        ...entry,
      };
      fallbackMoodHistory = [newEntry, ...fallbackMoodHistory];
      return newEntry;
    }
  },

  async getMoodHistory(rangeDays = 30): Promise<MoodEntry[]> {
    try {
      const { data } = await apiClient.get<{ data: MoodEntry[] }>("/health/mood", {
        params: { rangeDays },
      });
      return data.data;
    } catch {
      return fallbackMoodHistory;
    }
  },
};
