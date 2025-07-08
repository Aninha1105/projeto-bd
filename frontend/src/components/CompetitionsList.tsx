import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, MapPin, Users, Eye, Clock, Plus } from 'lucide-react';
import { Competition } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/api';

interface CompetitionsListProps {
  onViewDetails: (competition: Competition) => void;
  onCreateCompetition?: () => void;
}

const CompetitionsList: React.FC<CompetitionsListProps> = ({ onViewDetails, onCreateCompetition }) => {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  console.log(onCreateCompetition);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await api.get<any[]>('/competicoes');
        const mapped = res.data.map(c => ({
          id: c.id_competicao.toString(),
          name: c.nome,
          location: c.local || '',
          date: c.data,
          time: c.horario || '',
          teamId: c.id_equipe?.toString() || '',
          description: c.descricao || '',
          registrations: c.num_inscritos || 0,
          maxParticipants: c.max_participantes || 0,
          finalizada: c.finalizada ?? false,
          status: c.finalizada ? 'completed' : (c.status ?? 'upcoming').toLowerCase(),
          createdBy: c.id_equipe?.toString(),
          collaborators: c.equipe?.colaboradores_ids?.map(String) || []
        }));
        setCompetitions(mapped);
      } catch (err) {
        console.error('Erro ao buscar competições', err);
      }
    }
    fetchCompetitions();
  }, []);

  const canCreate = () => user?.role === 'admin' || user?.role === 'colaborador';

  const filtered = useMemo(() => {
    return competitions.filter(c => {
      const name = c.name.toLowerCase();
      const loc = c.location.toLowerCase();
      const search = searchTerm.toLowerCase();
      return (
        (name.includes(search) || loc.includes(search)) &&
        (!locationFilter || loc.includes(locationFilter.toLowerCase())) &&
        (!dateFilter || c.date === dateFilter)
      );
    });
  }, [competitions, searchTerm, locationFilter, dateFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const current = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');
  const getStatusColor = (r: number, m: number) => {
    const pct = (r / m) * 100;
    return pct >= 90 ? 'text-red-600 bg-red-100'
      : pct >= 70 ? 'text-orange-600 bg-orange-100'
      : 'text-green-600 bg-green-100';
  };
  const getBadge = (s: string) => {
    switch (s) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Competições de Programação</h1>
        </div>
        {canCreate() && onCreateCompetition && (
          <button
            onClick={onCreateCompetition}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Competição</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou local..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filtrar por localidade"
              value={locationFilter}
              onChange={e => { setLocationFilter(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-x-auto">
        <table className="w-full min-w-max divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Competição</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Data & Horário</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Inscritos</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {current.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{c.name}</div>
                </td>
                <td className="px-6 py-4 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-900">{formatDate(c.date)}</div>
                    <div className="text-xs flex items-center text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />{c.time}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{c.location}</td>
                <td className="px-6 py-4 flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{c.registrations}/{c.maxParticipants}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(c.registrations, c.maxParticipants)}`}>{Math.round((c.registrations/c.maxParticipants)*100)}%</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${getBadge(c.status)}`}>
                    {c.finalizada ? 'Finalizada' : (c.status.charAt(0).toUpperCase() + c.status.slice(1))}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => onViewDetails(c)} className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                    <Eye className="h-4 w-4" />
                    <span>Detalhes</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">Nenhuma competição encontrada</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <span className="text-sm text-gray-700">Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length}</span>
          <div className="flex space-x-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Anterior</button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50">Próxima</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length===0 && (<div className="text-center py-12 text-gray-600">Nenhuma competição encontrada</div>)}
    </div>
  );
};

export default CompetitionsList;
