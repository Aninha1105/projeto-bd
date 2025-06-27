export interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  time: string;
  registrations: number;
  maxParticipants: number;
  description?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  createdBy?: string;
  collaborators?: string[];
  sponsorships?: Sponsorship[];
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  university: string;
  photo?: string;
  registrationStatus: 'confirmed' | 'pending' | 'cancelled';
  registrationDate: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  memberCount: number;
  totalSubmissions: number;
  approvedSubmissions: number;
  averageTime: string;
  ranking: number;
}

export interface Submission {
  id: string;
  participantId: string;
  participantName: string;
  competitionId: string;
  problemsSolved: number;
  totalProblems: number;
  timeSpent: string;
  ranking: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  university: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  photo?: string;
  role: 'admin' | 'organizer' | 'participant' | 'sponsor';
}

export interface Sponsorship {
  id: string;
  sponsorId: string;
  sponsorName: string;
  amount: number;
  contributedAt: string;
}

export interface DashboardStats {
  totalCompetitions: number;
  activeParticipants: number;
  registeredTeams: number;
  monthlyRegistrations: { month: string; count: number }[];
}

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  name: string;
  university: string;
  photo?: string;
  role: 'admin' | 'organizer' | 'participant' | 'sponsor';
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
  collaborators: string[];
}</parameter>