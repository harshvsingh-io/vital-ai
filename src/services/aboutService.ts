import { apiClient } from "./apiClient";
import { FounderProfile, TeamMember } from "@/types";

const fallbackFounder: FounderProfile = {
  name: "Harsh Vardhan Singh",
  role: "Founder & Lead Architect",
  bio: "Visionary behind Vital AI, building personalized, proactive, and accessible health intelligence designed for everyday longevity and wellness.",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  twitterUrl: "https://twitter.com/harshvsingh",
  linkedinUrl: "https://linkedin.com/in/harshvsingh",
  instagramUrl: "https://instagram.com/harshvsingh",
};

const fallbackTeam: TeamMember[] = [
  {
    id: "tm-1",
    name: "Dr. Ananya Sharma",
    position: "Chief Medical Officer",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    order: 1,
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
  },
  {
    id: "tm-2",
    name: "Marcus Vance",
    position: "Lead AI Research Scientist",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    order: 2,
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
  },
  {
    id: "tm-3",
    name: "Dr. Elena Rostova",
    position: "Head of Preventive Cardiology",
    photoUrl: "https://images.unsplash.com/photo-1594824813589-3c1264cfa4fb?w=400&q=80",
    order: 3,
    linkedinUrl: "https://linkedin.com",
  },
];

export const aboutService = {
  async getFounder(): Promise<FounderProfile> {
    try {
      const { data } = await apiClient.get<{ data: FounderProfile }>("/cms/about/founder");
      return data.data;
    } catch {
      return fallbackFounder;
    }
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const { data } = await apiClient.get<{ data: TeamMember[] }>("/cms/about/team");
      return [...data.data].sort((a, b) => a.order - b.order);
    } catch {
      return fallbackTeam;
    }
  },
};
