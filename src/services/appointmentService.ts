import { apiClient } from "./apiClient";
import { Appointment, Doctor } from "@/types";

const fallbackDoctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiologist",
    hospital: "Apex Heart & Vascular Center",
    rating: 4.9,
    distanceKm: 2.3,
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&q=80",
    nextAvailable: "Tomorrow at 10:00 AM",
  },
  {
    id: "doc-2",
    name: "Dr. Raj Patel",
    specialty: "General Physician",
    hospital: "Metro Care Clinic",
    rating: 4.8,
    distanceKm: 1.1,
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80",
    nextAvailable: "Today at 3:30 PM",
  },
  {
    id: "doc-3",
    name: "Dr. Priya Sen",
    specialty: "Endocrinologist",
    hospital: "City Health Pavilion",
    rating: 4.9,
    distanceKm: 4.5,
    avatarUrl: "https://images.unsplash.com/photo-1594824813589-3c1264cfa4fb?w=150&q=80",
    nextAvailable: "Friday at 11:15 AM",
  },
];

let fallbackAppointments: Appointment[] = [
  {
    id: "apt-1",
    doctor: fallbackDoctors[0],
    date: "2026-09-15",
    time: "10:30 AM",
    mode: "video",
    status: "upcoming",
  },
  {
    id: "apt-2",
    doctor: fallbackDoctors[1],
    date: "2026-09-20",
    time: "02:00 PM",
    mode: "in-person",
    status: "upcoming",
  },
];

export const appointmentService = {
  async searchDoctors(query: string, specialty?: string): Promise<Doctor[]> {
    try {
      const { data } = await apiClient.get<{ data: Doctor[] }>("/doctors/search", {
        params: { query, specialty },
      });
      return data.data;
    } catch {
      let filtered = fallbackDoctors;
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter((d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q));
      }
      if (specialty) {
        filtered = filtered.filter((d) => d.specialty.toLowerCase() === specialty.toLowerCase());
      }
      return filtered;
    }
  },

  async getNearbyHospitals(lat: number, lng: number): Promise<{ id: string; name: string; distanceKm: number }[]> {
    try {
      const { data } = await apiClient.get("/hospitals/nearby", { params: { lat, lng } });
      return data.data;
    } catch {
      return [
        { id: "hosp-1", name: "Apex Multi-Specialty Hospital & Trauma Center", distanceKm: 1.8 },
        { id: "hosp-2", name: "Metro General Hospital Emergency Unit", distanceKm: 3.2 },
        { id: "hosp-3", name: "St. Jude Urgent Care Clinic", distanceKm: 4.0 },
      ];
    }
  },

  async getMyAppointments(): Promise<Appointment[]> {
    try {
      const { data } = await apiClient.get<{ data: Appointment[] }>("/appointments");
      return data.data;
    } catch {
      return fallbackAppointments;
    }
  },

  async bookAppointment(input: {
    doctorId: string;
    date: string;
    time: string;
    mode: "in-person" | "video";
  }): Promise<Appointment> {
    try {
      const { data } = await apiClient.post<{ data: Appointment }>("/appointments", input);
      return data.data;
    } catch {
      const doctor = fallbackDoctors.find((d) => d.id === input.doctorId) ?? fallbackDoctors[0];
      const newApt: Appointment = {
        id: "apt-" + Date.now(),
        doctor,
        date: input.date,
        time: input.time,
        mode: input.mode,
        status: "upcoming",
      };
      fallbackAppointments = [newApt, ...fallbackAppointments];
      return newApt;
    }
  },

  async cancelAppointment(id: string): Promise<void> {
    try {
      await apiClient.post(`/appointments/${id}/cancel`);
    } catch {
      fallbackAppointments = fallbackAppointments.filter((a) => a.id !== id);
    }
  },

  async triggerEmergencySOS(lat: number, lng: number): Promise<void> {
    try {
      await apiClient.post("/emergency/sos", { lat, lng });
    } catch {
      // Offline fallback simulation
    }
  },
};
