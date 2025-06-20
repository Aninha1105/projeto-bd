import React from 'react';
import { Trophy, Users, Code, Award } from 'lucide-react';
import { mockDashboardStats } from '../data/mockData';

const Dashboard: React.FC = () => {
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
          value={stats.totalCompetitions}
          icon={Trophy}
          color="bg-purple-500"
          description="Eventos cadastrados"
        />
        <StatCard
          title="Participantes Ativas"
          value={stats.activeParticipants}
          icon={Users}
          color="bg-pink-500"
          description="Programadoras registradas"
        />
        <StatCard
          title="Equipes Cadastradas"
          value={stats.registeredTeams}
          icon={Code}
          color="bg-indigo-500"
          description="Times participantes"
        />
      </div>

      {/* Monthly Registrations Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Inscrições por Mês</h2>
          <p className="text-gray-600">Evolução das inscrições nos últimos 6 meses</p>
        </div>
        
        <div className="space-y-4">
          {stats.monthlyRegistrations.map((month) => (
            <div key={month.month} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-600">
                {month.month}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
                  style={{ width: `${(month.count / maxRegistrations) * 100}%` }}
                >
                  <span className="text-white text-sm font-medium">
                    {month.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-left group">
            <Trophy className="h-6 w-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-gray-900">Nova Competição</h3>
            <p className="text-sm text-gray-600">Cadastrar novo evento</p>
          </button>
          <button className="p-4 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors text-left group">
            <Users className="h-6 w-6 text-pink-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-gray-900">Aprovar Inscrições</h3>
            <p className="text-sm text-gray-600">Revisar participantes</p>
          </button>
          <button className="p-4 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-left group">
            <Code className="h-6 w-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-gray-900">Resultados</h3>
            <p className="text-sm text-gray-600">Validar submissões</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-full">
              <Trophy className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Nova competição criada</p>
              <p className="text-xs text-gray-600">Maratona Feminina de Programação USP</p>
            </div>
            <span className="text-xs text-gray-500">2h atrás</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-pink-50 rounded-lg">
            <div className="p-2 bg-pink-100 rounded-full">
              <Users className="h-4 w-4 text-pink-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">15 novas inscrições</p>
              <p className="text-xs text-gray-600">CodeHer Challenge Rio</p>
            </div>
            <span className="text-xs text-gray-500">4h atrás</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-indigo-50 rounded-lg">
            <div className="p-2 bg-indigo-100 rounded-full">
              <Award className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Resultados aprovados</p>
              <p className="text-xs text-gray-600">Hackathon Feminino UNICAMP</p>
            </div>
            <span className="text-xs text-gray-500">1d atrás</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;