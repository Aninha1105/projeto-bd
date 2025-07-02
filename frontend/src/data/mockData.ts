import { Competition, Participant, Submission, User, DashboardStats, AuthUser } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Ana Carolina Silva',
  email: 'ana.silva@universidade.edu.br',
  university: 'Universidade de São Paulo',
  photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
  role: 'admin'
};

export const mockAuthUsers: AuthUser[] = [
  {
    id: '1',
    email: 'admin@maratonas.com',
    password: 'admin123',
    name: 'Ana Carolina Silva',
    university: 'Universidade de São Paulo',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    role: 'admin'
  },
  {
    id: '2',
    email: 'organizadora@maratonas.com',
    password: 'org123',
    name: 'Maria Fernanda Costa',
    university: 'Universidade Estadual de Campinas',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    role: 'organizer'
  },
  {
    id: '3',
    email: 'participante@maratonas.com',
    password: 'part123',
    name: 'Joana Lima Santos',
    university: 'Universidade Federal do Rio de Janeiro',
    photo: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    role: 'participant'
  },
  {
    id: '4',
    email: 'patrocinador@maratonas.com',
    password: 'sponsor123',
    name: 'Roberto Silva Empresário',
    university: 'Tech Solutions Inc.',
    photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    role: 'sponsor'
  }
];

export const mockCompetitions: Competition[] = [
  {
    id: '1',
    name: 'Maratona Feminina de Programação USP',
    date: '2024-03-15',
    location: 'São Paulo, SP',
    time: '09:00',
    registrations: 85,
    maxParticipants: 120,
    description: 'Competição de programação exclusiva para mulheres com foco em algoritmos e estruturas de dados.',
    status: 'upcoming',
    createdBy: '2',
    collaborators: ['2'],
    sponsorships: [
      {
        id: '1',
        sponsorId: '4',
        sponsorName: 'Roberto Silva Empresário',
        amount: 5000,
        contributedAt: '2024-01-10'
      }
    ]
  },
  {
    id: '2',
    name: 'CodeHer Challenge Rio',
    date: '2024-04-20',
    location: 'Rio de Janeiro, RJ',
    time: '14:00',
    registrations: 67,
    maxParticipants: 100,
    description: 'Desafio de programação com problemas de diferentes níveis de dificuldade.',
    status: 'upcoming',
    createdBy: '2',
    collaborators: ['2'],
    sponsorships: []
  },
  {
    id: '3',
    name: 'WomenInTech Programming Contest',
    date: '2024-05-10',
    location: 'Brasília, DF',
    time: '10:30',
    registrations: 92,
    maxParticipants: 150,
    description: 'Competição nacional de programação para estudantes universitárias.',
    status: 'upcoming',
    createdBy: '1',
    collaborators: ['1', '2'],
    sponsorships: []
  },
  {
    id: '4',
    name: 'Hackathon Feminino UNICAMP',
    date: '2024-02-28',
    location: 'Campinas, SP',
    time: '08:00',
    registrations: 45,
    maxParticipants: 60,
    description: 'Hackathon de 24 horas focado em soluções tecnológicas.',
    status: 'completed',
    createdBy: '2',
    collaborators: ['2'],
    sponsorships: []
  }
];

export const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'Maria Santos',
    email: 'maria.santos@usp.br',
    birthDate: '2000-05-15',
    university: 'Universidade de São Paulo',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Joana Lima',
    email: 'joana.lima@unicamp.br',
    birthDate: '1999-08-22',
    university: 'Universidade Estadual de Campinas',
    photo: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Carolina Ferreira',
    email: 'carolina.ferreira@ufrj.br',
    birthDate: '2001-12-03',
    university: 'Universidade Federal do Rio de Janeiro',
    photo: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'Beatriz Costa',
    email: 'beatriz.costa@unb.br',
    birthDate: '2000-09-18',
    university: 'Universidade de Brasília',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    participantId: '1',
    participantName: 'Maria Santos',
    competitionId: '4',
    problemsSolved: 8,
    totalProblems: 10,
    timeSpent: '4:32:15',
    ranking: 3,
    status: 'approved',
    submittedAt: '2024-02-28T12:30:00Z',
    university: 'Universidade de São Paulo'
  },
  {
    id: '2',
    participantId: '2',
    participantName: 'Joana Lima',
    competitionId: '4',
    problemsSolved: 9,
    totalProblems: 10,
    timeSpent: '3:45:22',
    ranking: 1,
    status: 'approved',
    submittedAt: '2024-02-28T11:15:00Z',
    university: 'Universidade Estadual de Campinas'
  },
  {
    id: '3',
    participantId: '3',
    participantName: 'Carolina Ferreira',
    competitionId: '4',
    problemsSolved: 7,
    totalProblems: 10,
    timeSpent: '5:12:45',
    ranking: 8,
    status: 'pending',
    submittedAt: '2024-02-28T13:45:00Z',
    university: 'Universidade Federal do Rio de Janeiro'
  }
];

export const mockUniversities = [
  'Universidade de São Paulo',
  'Universidade Estadual de Campinas',
  'Universidade Federal do Rio de Janeiro',
  'Universidade de Brasília',
  'Universidade Federal de Minas Gerais',
  'Universidade Federal do Rio Grande do Sul',
  'Universidade Estadual Paulista',
  'Pontifícia Universidade Católica do Rio de Janeiro'
];

export const mockDashboardStats: DashboardStats = {
  totalCompetitions: 15,
  activeParticipants: 287,
  registeredTeams: 12,
  monthlyRegistrations: [
    { month: 'Jan', count: 45 },
    { month: 'Fev', count: 62 },
    { month: 'Mar', count: 78 },
    { month: 'Abr', count: 55 },
    { month: 'Mai', count: 68 },
    { month: 'Jun', count: 42 }
  ]
};

export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Code Queens',
    memberCount: 3,
    collaborators: ['2', '5'],
  },
  {
    id: '2',
    name: 'Tech Sisters',
    memberCount: 2,
    collaborators: ['2', '6'],
  },
  {
    id: '3',
    name: 'Algorithm Angels',
    memberCount: 4,
    collaborators: ['2', '5', '6'],
  },
  {
    id: '4',
    name: 'Binary Butterflies',
    memberCount: 2,
    collaborators: ['5', '6'],
  }
];