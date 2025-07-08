// src/types/index.tsx

export interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  time: string;
  registrations: number;
  maxParticipants: number;
  description?: string;
  teamId: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  finalizada: boolean;
  createdBy?: string;
  collaborators?: string[];
  sponsorships?: Sponsorship[];
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  university: string;
  photo?: string;
}

export interface Team {
  id: string;
  name: string;
  memberCount: number;
  collaborators: string[];
}


export interface AuthUser {
  id: string;
  email: string;
  password: string;
  name: string;
  university: string;
  photo?: string;
  role: 'admin' | 'colaborador' | 'participante' | 'patrocinador';
}

export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  photo?: string;
  role: 'admin' | 'colaborador' | 'participante' | 'patrocinador';
}

export interface Sponsorship {
  id: string;
  sponsorId: string;
  sponsorName: string;
  sponsorEmail: string;
  sponsorPhoto: string;
  amount: number;
}

export interface DashboardStats {
  totalCompetitions: number;
  activeParticipants: number;
  registeredTeams: number;
  monthlyRegistrations: { month: string; count: number }[];
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface CompetitionFormData {
  name: string;
  date: string;
  location: string;
  time: string;
  maxParticipants: number;
  description: string;
  teamId: string; // <--- novo campo
}

export interface SponsorshipData {
  id_competicao: number;
  id_usuario_patro: number;
  contribuicao: number;
}

export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'organizer' | 'participant' | 'sponsor';
  photo?: File | null;
  collaboratorRole?: 'setter' | 'tester' | 'organizador' | 'professor';
  institution?: string;
  teamId?: number;
}

export interface Problem {
  id_problema: number;
  titulo: string;
  nivel: string;
  link: string;
  id_competicao: number;
}