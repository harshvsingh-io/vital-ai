import { apiClient } from "./apiClient";
import { Appointment, Doctor } from "@/types";

export const appointmentService = {
  async searchDoctors(query: string, specialty?: string): Promise<Doctor[]> {
    const { data } = await apiClient.get<{ data: Doctor[] }>("/doctors/search", {
      params: { query, specialty },
    });
    return data.data;
  },

  async getNearbyHospitals(lat: number, lng: number): Promise<{ id: string; name: string; distanceKm: number }[]> {
    const { data } = await apiClient.get("/hospitals/nearby", { params: { lat, lng } });
    return data.data;
  },

  async getMyAppointments(): Promise<Appointment[]> {
    const { data } = await apiClient.get<{ data: Appointment[] }>("/appointments");
    return data.data;
  },

  async bookAppointment(input: {
    doctorId: string;
    date: string;
    time: string;
    mode: "in-person" | "video";
  }): Promise<Appointment> {
    const { data } = await apiClient.post<{ data: Appointment }>("/appointments", input);
    return data.data;
  },

  async cancelAppointment(id: string): Promise<void> {
    await apiClient.post(`/appointments/${id}/cancel`);
  },

  async triggerEmergencySOS(lat: number, lng: number): Promise<void> {
    await apiClient.post("/emergency/sos", { lat, lng });
  },
};
