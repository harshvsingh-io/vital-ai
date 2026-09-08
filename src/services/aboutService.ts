import { apiClient } from "./apiClient";
import { FounderProfile, TeamMember } from "@/types";

// Everything here is admin/CMS driven from the backend (Admin Panel -> CMS -> Team).
// The app never hardcodes founder or team details — admins manage name, photo,
// position, and social links (Instagram/LinkedIn/Twitter) from the Admin Panel,
// and this screen simply renders whatever is published.

export const aboutService = {
  async getFounder(): Promise<FounderProfile> {
    const { data } = await apiClient.get<{ data: FounderProfile }>("/cms/about/founder");
    return data.data;
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    const { data } = await apiClient.get<{ data: TeamMember[] }>("/cms/about/team");
    // Backend is expected to return members pre-sorted by `order`,
    // but we sort defensively in case that changes.
    return [...data.data].sort((a, b) => a.order - b.order);
  },
};
