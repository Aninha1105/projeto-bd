import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Users, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockTeams, mockAuthUsers } from '../data/mockData';
import { Team } from '../types';
import TeamForm from './TeamForm';

const TeamManagement: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState(mockTeams);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // TODO: fetch teams from API
  const collaborators = mockAuthUsers.filter(u => u.role === 'colaborador');

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManageTeams = () => {
    return user?.role === 'admin' || user?.role === 'colaborador';
  };

  const handleCreateTeam = (teamData: { name: string; collaborators: string[] }) => {
    // TODO: create team via API
    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamData.name,
      memberCount: teamData.collaborators.length,
      collaborators: teamData.collaborators,
    };
    
    setTeams([...teams, newTeam]);
    setShowTeamForm(false);
    console.log('Team created:', newTeam);
  };

  const handleEditTeam = (teamData: { name: string; collaborators: string[] }) => {
    if (!editingTeam) return;
    
    // TODO: update team via API
    const updatedTeam = {
      ...editingTeam,
      name: teamData.name,
      collaborators: teamData.collaborators,
      memberCount: teamData.collaborators.length
    };
    
    setTeams(teams.map(team => 
      team.id === editingTeam.id ? updatedTeam : team
    ));
    setEditingTeam(null);
    setShowTeamForm(false);
    console.log('Team updated:', updatedTeam);
  };

  const handleDeleteTeam = (teamId: string) => {
    // TODO: delete team via API
    setTeams(teams.filter(team => team.id !== teamId));
    setShowDeleteConfirm(null);
    console.log('Team deleted:', teamId);
  };


  if (!canManageTeams()) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gerenciamento de Equipes</h1>
            <p className="text-gray-600">Crie e gerencie equipes de colaboradores</p>
          </div>
          <button
            onClick={() => {
              setEditingTeam(null);
              setShowTeamForm(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Equipe</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar equipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div key={team.id} className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{team.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <Users className="h-4 w-4" />
                  <span>{team.memberCount} colaboradores</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingTeam(team);
                    setShowTeamForm(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar equipe"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(team.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir equipe"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Colaboradores:</p>
              <div className="text-sm text-gray-600">
                {team.collaborators.length > 0 ? (
                  <div className="space-y-1">
                    {team.collaborators.slice(0, 3).map(collaboratorId => {
                      const collaborator = collaborators.find(c => c.id === collaboratorId);
                      return collaborator ? (
                        <div key={collaboratorId} className="flex items-center space-x-2">
                          <User className="h-3 w-3" />
                          <span>{collaborator.name}</span>
                        </div>
                      ) : null;
                    })}
                    {team.collaborators.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{team.collaborators.length - 3} outros
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">Nenhum colaborador</span>
                )}
              </div>
            </div>

            {/* Team Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Submissões</p>
                  <p className="font-medium text-gray-900">{team.totalSubmissions}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ranking</p>
                  <p className="font-medium text-gray-900">#{team.ranking}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchTerm ? 'Nenhuma equipe encontrada' : 'Nenhuma equipe cadastrada'}
          </p>
        </div>
      )}

      {/* Team Form Modal */}
      {showTeamForm && (
        <TeamForm
          team={editingTeam}
          onClose={() => {
            setShowTeamForm(false);
            setEditingTeam(null);
          }}
          onSubmit={editingTeam ? handleEditTeam : handleCreateTeam}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Excluir Equipe
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteTeam(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;