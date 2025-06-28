// src/components/CompetitionsList.tsx
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

  // Fetch and map competitions on mount
  useEffect(() => {
    async function fetchCompetitions() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await api.get<any[]>('/competicoes');
        // Map API fields to front-end model
        const mapped = res.data.map(c => ({
          id: c.id_competicao,
          name: c.nome,
          location: c.local || '',
          date: c.data,
          time: c.horario || '',
          registrations: c.num_inscritos || 0,
          maxParticipants: c.max_participantes || 0,
          status: (c.status ?? '').toLowerCase(),
          createdBy: c.id_equipe,
          collaborators: c.equipe?.colaboradores_ids || []
        }));
        setCompetitions(mapped);
      } catch (err) {
        console.error('Erro ao buscar competições', err);
      }
    }
    fetchCompetitions();
  }, []);

  const filteredCompetitions = competitions.filter((competition) => {
  const name = competition.name ?? '';
  const location = competition.location ?? '';
  const date = competition.date ?? '';

  const matchesSearch =
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesLocation =
    !locationFilter || location.includes(locationFilter);

  const matchesDate = !dateFilter || date >= dateFilter;

  return matchesSearch && matchesLocation && matchesDate;
  });


  // Derive unique locations
  const uniqueLocations = useMemo(() => [
    ...new Set(competitions.map(c => c.location))
  ], [competitions]);

  // Role-based view
  const visible = competitions;

  // Filters
  const filtered = visible.filter(c => {
    const name = c.name.toLowerCase();
    const loc = c.location.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      (name.includes(search) || loc.includes(search)) &&
      (!locationFilter || c.location === locationFilter) &&
      (!dateFilter || c.date === dateFilter)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const current = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helpers
  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');
  const getStatusColor = (r: number, m: number) => {
    const pct = (r/m)*100;
    return pct >= 90 ? 'text-red-600 bg-red-100'
      : pct >= 70 ? 'text-orange-600 bg-orange-100'
      : 'text-green-600 bg-green-100';
  };
  const getBadge = (s: string) => {
    switch(s) {
      case 'próxima': return 'bg-blue-100 text-blue-800';
      case 'hoje':    return 'bg-green-100 text-green-800';
      case 'finalizada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const canCreate = () => user?.role === 'admin' || user?.role === 'colaborador';
  const title = user?.role === 'colaborador' ? 'Minhas Competições'
    : user?.role === 'participante' ? 'Competições Disponíveis'
    : user?.role === 'patrocinador' ? 'Competições para Patrocinar'
    : 'Competições de Programação';
  const desc = user?.role === 'colaborador' ? 'Gerencie as competições que você criou ou colabora'
    : user?.role === 'participante' ? 'Explore e se inscreva nas competições disponíveis'
    : user?.role === 'patrocinador' ? 'Encontre competições para patrocinar e apoiar'
    : 'Gerencie todas as competições femininas de programação';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 border border-purple-100">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">{title}</h1>
            <p className="text-gray-600">{desc}</p>
          </div>
          {canCreate() && onCreateCompetition && (
            <button onClick={onCreateCompetition} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
              <Plus /><span>Nova Competição</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6 border border-purple-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Buscar por nome ou local..." value={searchTerm}
              onChange={e=>{setSearchTerm(e.target.value);setCurrentPage(1);}}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={locationFilter} onChange={e=>{setLocationFilter(e.target.value);setCurrentPage(1);}}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
              <option value="">Todas as localidades</option>
              {uniqueLocations.map(loc=><option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="date" value={dateFilter} onChange={e=>{setDateFilter(e.target.value);setCurrentPage(1);}}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-purple-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data & Horário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscritos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {current.map(c=>(
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><div className="text-sm font-medium">{c.name}</div><div className="text-sm text-gray-500">Programação Competitiva</div></td>
                  <td className="px-6 py-4 flex items-center space-x-2"><Calendar className="h-4 w-4 text-gray-400"/><div><div className="text-sm">{formatDate(c.date)}</div><div className="text-xs flex items-center"><Clock className="h-3 w-3 mr-1"/>{c.time}</div></div></td>
                  <td className="px-6 py-4 text-sm text-gray-900">{c.location}</td>
                  <td className="px-6 py-4 flex items-center space-x-2"><Users className="h-4 w-4 text-gray-400"/><span className="text-sm">{c.registrations}/{c.maxParticipants}</span><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(c.registrations,c.maxParticipants)}`}>{Math.round((c.registrations/c.maxParticipants)*100)}%</span></td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 text-xs rounded-full font-medium ${getBadge(c.status)}`}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span></td>
                  <td className="px-6 py-4"><button onClick={()=>onViewDetails(c)} className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"><Eye className="h-4 w-4"/><span>Detalhes</span></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages>1 && (
          <div className="px-6 py-4 border-t flex justify-between">
            <span className="text-sm text-gray-700">Mostrando {(currentPage-1)*itemsPerPage+1} a {Math.min(currentPage*itemsPerPage, filteredCompetitions.length)} de {filteredCompetitions.length}</span>
            <div className="flex space-x-2">
              <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="px-4 py-2 border rounded text-sm disabled:opacity-50">Anterior</button>
              <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded text-sm disabled:opacity-50">Próxima</button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredCompetitions.length===0 && (<div className="text-center py-12 text-gray-600">Nenhuma competição encontrada</div>)}
      </div>
    </div>
  );
};

export default CompetitionsList;
