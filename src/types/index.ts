export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface HealthProfile {
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  familyHistory: string[];
  emergencyContact: { name: string; phone: string; relation: string };
  lifestyle: {
    smoking: boolean;
    alcohol: boolean;
    exerciseFrequency: "none" | "light" | "moderate" | "intense";
  };
}

export interface VitalReading {
  id: string;
  type: "heartRate" | "bloodPressure" | "bloodSugar" | "steps" | "sleep" | "water" | "calories";
  value: number;
  secondaryValue?: number; // e.g. diastolic BP
  unit: string;
  recordedAt: string;
}

export interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  active: boolean;
}

export interface MoodEntry {
  id: string;
  mood: "great" | "good" | "okay" | "low" | "bad";
  note?: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  distanceKm?: number;
  avatarUrl?: string;
  nextAvailable?: string;
}

export interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  time: string;
  mode: "in-person" | "video";
  status: "upcoming" | "completed" | "cancelled";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface FounderProfile {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photoUrl: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  order: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
