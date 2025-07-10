export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  tags: string[];
  participants: number;
  maxParticipants: number;
  status: "upcoming" | "registration";
  difficulty: string;
  prizes: string;
  organizer: string;
  featured?: boolean;
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  idea: string;
  leader: {
    name: string;
    avatar?: string;
    university: string;
    major: string;
  };
  members: number;
  maxMembers: number;
  requiredSkills: string[];
  currentSkills: string[];
  category: string;
  stage: string;
  commitment: string;
  duration: string;
  featured?: boolean;
  tags: string[];
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  university: string;
  major: string;
  year: string;
  skills: string[];
  experience: string;
  projects: number;
  rating: number;
  bio: string;
  availability: string;
  createdAt: Date;
}

export interface AITeammateMatch {
  user: User;
  matchScore: number;
  commonInterests: string[];
  reasoning: string;
}
