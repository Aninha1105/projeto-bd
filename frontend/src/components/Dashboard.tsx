import React, { useEffect, useState } from 'react';
import { Trophy, Users, Code, Award } from 'lucide-react';
import { mockDashboardStats } from '../data/mockData';
import { api } from '../api/api';
import { inscricoesApi } from '../api/inscricoes';
import { equipesApi } from '../api/equipes';

const Dashboard: React.FC = () => {
  const [totalCompetitions, setTotalCompetitions] = useState(0);
  const [activeParticipants, setActiveParticipants] = useState(0);
  const [registeredTeams, setRegisteredTeams] = useState(0);

  useEffect(() => {
    // Buscar competições
    api.get('/competicoes/').then(res => setTotalCompetitions(res.data.length));
    // Buscar participantes
    inscricoesApi.getAllParticipantes().then(res => setActiveParticipants(res.length));
    // Buscar equipes
    equipesApi.listarEquipes().then(res => setRegisteredTeams(res.length));
  }, []);

  // TODO: fetch dashboard stats from API
  const stats = mockDashboardStats;

  const StatCard = ({ title, value, icon: Icon, color, description }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    description: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const maxRegistrations = Math.max(...stats.monthlyRegistrations.map(m => m.count));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Bem-vinda ao Dashboard</h1>
        <p className="text-purple-100 text-lg">
          Gerencie competições de programação e acompanhe o desempenho das participantes
        </p>
        <div className="mt-6 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span className="text-sm">Programação Competitiva</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span className="text-sm">Empoderamento Feminino</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total de Competições"
          value={totalCompetitions}
          icon={Trophy}
          color="bg-purple-500"
          description="Eventos cadastrados"
        />
        <StatCard
          title="Participantes Ativas"
          value={activeParticipants}
          icon={Users}
          color="bg-pink-500"
          description="Programadoras registradas"
        />
        <StatCard
          title="Equipes Cadastradas"
          value={registeredTeams}
          icon={Code}
          color="bg-indigo-500"
          description="Times participantes"
        />
      </div>
    </div>
  );
};

export default Dashboard;