import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Users, Plus, Code, Award, DollarSign, Heart, Edit, CheckCircle } from 'lucide-react';
import { Competition, Participant, Sponsorship, Problem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import RegistrationForm from './RegistrationForm';
import SponsorshipForm from './SponsorshipForm';
import { api } from '../api/api';
import { inscricoesApi } from '../api/inscricoes';
import CompetitionEditForm from './CompetitionEditForm';
import { problemasApi } from '../api/api';
import ProblemForm from './ProblemForm';

interface CompetitionDetailProps {
  competition: Competition;
  onBack: () => void;
  onUpdate?: (competition: Competition) => void;
  onDelete?: (competitionId: string) => void;
}

const CompetitionDetail: React.FC<CompetitionDetailProps> = ({ competition, onBack, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showSponsorshipForm, setShowSponsorshipForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  console.log(user);

  useEffect(() => {
    if (!competition) return;

    const fetchRelatedData = async () => {
      try {
        const [inscricoes, patrocRes] = await Promise.all([
          inscricoesApi.getInscricoesByCompeticao(competition.id),
          api.get(`/competicaopatrocinador/competicao/${competition.id}`)
        ]);

        // Mapear os dados recebidos para o formato usado nos components
        const participantesAtualizados = inscricoes.map((inscricao) => ({
          id: inscricao.participante.id_usuario.toString(),
          name: inscricao.participante.usuario.nome,
          email: inscricao.participante.usuario.email,
          photo: inscricao.participante.usuario.foto,
          university: inscricao.participante.instituicao || 'Não informado',
        }));
        setParticipants(participantesAtualizados);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSponsorships(patrocRes.data.map((patrocinio: any) => ({
          id: patrocinio.id_link,
          sponsorName: patrocinio.patrocinador.usuario.nome,
          sponsorEmail: patrocinio.patrocinador.usuario.email,
          // sponsorPhoto: patrocinio.patrocinador.usuario.foto, // Comentado para evitar erro
          amount: patrocinio.contribuicao,
        })));

      } catch (error) {
        console.error("Erro ao carregar dados relacionados:", error);
      }
    };

    fetchRelatedData();
  }, [competition]);

  useEffect(() => {
    if (competition.finalizada) {
      problemasApi.getProblemasByCompeticao(Number(competition.id)).then(setProblems);
    }
  }, [competition]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

  const canAddRegistration = () =>
    !competition.finalizada && (user?.role === 'admin' || (user?.role === 'colaborador' && competition.collaborators?.includes(user.id)));

  const canEditCompetition = () => {
    return user?.role === 'admin' || 
           (user?.role === 'colaborador'); 
            //&& competition.collaborators?.includes(user.id));
  };

  const canSponsor = () => user?.role === 'patrocinador';
  const canRegisterAsParticipant = () => user?.role === 'participante';

  const totalSponsorship = sponsorships.reduce((sum, s) => sum + s.amount, 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditSubmit = async (data: any) => {
    try {
      // A API já foi chamada no CompetitionEditForm, aqui apenas atualizamos o estado local
      const updatedCompetition = { ...competition, ...data };
      console.log('Updated competition:', updatedCompetition);
      if (onUpdate) {
        onUpdate(updatedCompetition);
      }
      setShowEditForm(false);
    } catch (error) {
      console.error('Erro ao atualizar competição:', error);
    }
  };

  const handleDelete = async () => {
    try {
      // A API já foi chamada no CompetitionEditForm, aqui apenas atualizamos o estado local
      console.log('Deleting competition:', competition.id);
      if (onDelete) {
        onDelete(competition.id);
      }
      onBack();
    } catch (error) {
      console.error('Erro ao excluir competição:', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRegistrationSubmit = async (data: any) => {
    try {
      setShowRegistrationForm(false);
      // Recarregar a lista de participantes
      const inscricoes = await inscricoesApi.getInscricoesByCompeticao(competition.id);
      const participantesAtualizados = inscricoes.map((inscricao) => ({
        id: inscricao.participante.id_usuario.toString(),
        name: inscricao.participante.usuario.nome,
        email: inscricao.participante.usuario.email,
        photo: inscricao.participante.usuario.foto,
        university: inscricao.participante.instituicao || 'Não informado',
      }));
      setParticipants(participantesAtualizados);
    } catch (err) {
      console.error('Erro ao atualizar lista de participantes', err);
    }
  };

  const handleSponsorshipSubmit = async (amount: number, competitionId: string) => {
    try {
      const res = await api.post('/competicaopatrocinador', {
        id_competicao: parseInt(competitionId),
        id_usuario_patro: parseInt(user.id), // use o ID do usuário logado
        contribuicao: amount
      });

      console.log('Patrocínio registrado com sucesso:', res.data);
      setShowSponsorshipForm(false);
      // opcional: mostrar toast, atualizar dados etc.
    } catch (err) {
      console.error('Erro ao registrar patrocínio:', err);
    }
  };

  const handleFinalize = async () => {
    try {
      await api.put(`/competicoes/${competition.id}`, {
        nome: competition.name,
        local: competition.location,
        data: competition.date,
        id_equipe: Number(competition.teamId),
        horario: competition.time || null,
        max_participantes: competition.maxParticipants,
        descricao: competition.description,
        finalizada: true
      });
      if (onUpdate) {
        onUpdate({ ...competition, finalizada: true });
      }
    } catch (err) {
      alert('Erro ao finalizar competição');
    }
  };

  const handleAddProblem = () => {
    setEditingProblem(null);
    setShowProblemForm(true);
  };

  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    setShowProblemForm(true);
  };

  const handleDeleteProblem = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este problema?')) {
      await problemasApi.excluirProblema(id);
      setProblems(problems.filter(p => p.id_problema !== id));
    }
  };

  const handleProblemFormSubmit = async (data: any) => {
    if (editingProblem) {
      const updated = await problemasApi.editarProblema(editingProblem.id_problema, data);
      setProblems(problems.map(p => p.id_problema === updated.id_problema ? updated : p));
    } else {
      const created = await problemasApi.criarProblema({ ...data, id_competicao: Number(competition.id) });
      setProblems([...problems, created]);
    }
    setShowProblemForm(false);
    setEditingProblem(null);
  };

  return (
     <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-purple-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{competition.name}</h1>
            <p className="text-lg text-gray-600 mt-1">{formatDate(competition.date)}</p>
            <span className={`ml-2 px-3 py-1 text-xs rounded-full font-medium ${competition.finalizada ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
              {competition.finalizada ? 'Finalizada' : 'Em andamento'}
            </span>
          </div>
        </div>
        
        {/* Edit/Delete Actions */}
        <div className="flex items-center space-x-2">
          {canEditCompetition() && (
            <button
              onClick={() => setShowEditForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </button>
          )}
          {user?.role === 'admin' && !competition.finalizada && (
            <button
              onClick={handleFinalize}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Finalizar</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informações Gerais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Local</p>
                  <p className="font-medium text-gray-900">{competition.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Clock className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Horário</p>
                  <p className="font-medium text-gray-900">{competition.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Participantes</p>
                  <p className="font-medium text-gray-900">
                    {competition.registrations}/{competition.maxParticipants}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Code className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Modalidade</p>
                  <p className="font-medium text-gray-900">Programação Competitiva</p>
                </div>
              </div>
            </div>
            {competition.description && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-gray-700">{competition.description}</p>
              </div>
            )}
          </div>

          {/* Problemas da competição (apenas para finalizadas) */}
          {competition.finalizada && (
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Problemas da competição</h2>
                {user?.role === 'admin' && (
                  <button
                    onClick={handleAddProblem}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Problema</span>
                  </button>
                )}
              </div>
              {problems.length === 0 ? (
                <p className="text-gray-500">Nenhum problema cadastrado ainda.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {problems.map(problem => (
                    <li key={problem.id_problema} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{problem.titulo}</span>
                        <span className="ml-2 text-xs text-gray-500">{problem.nivel}</span>
                        <a href={problem.link} target="_blank" rel="noopener noreferrer" className="ml-4 text-purple-600 underline">Ver enunciado</a>
                      </div>
                      {user?.role === 'admin' && (
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditProblem(problem)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded">Editar</button>
                          <button onClick={() => handleDeleteProblem(problem.id_problema)} className="px-3 py-1 bg-red-100 text-red-700 rounded">Excluir</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {/* Modal de formulário de problema */}
              {showProblemForm && (
                <ProblemForm
                  problem={editingProblem}
                  onClose={() => { setShowProblemForm(false); setEditingProblem(null); }}
                  onSubmit={handleProblemFormSubmit}
                />
              )}
            </div>
          )}

          {/* Patrocínios */}
          {sponsorships.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Patrocínios</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total arrecadado</p>
                  <p className="text-2xl font-bold text-green-600">
                    {sponsorships.reduce((sum, s) => sum + s.amount, 0)
                      .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {sponsorships.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Heart className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        {/*
                        <img
                          src={s.sponsorPhoto || "https://via.placeholder.com/40"}
                          alt={s.sponsorName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        */}
                        <p className="font-medium text-gray-900">{s.sponsorName}</p>
                        <p className="text-sm text-gray-600">{s.sponsorEmail}</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">
                      {s.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Participants */}
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Participantes</h2>
              <div className="flex space-x-2">
                {canRegisterAsParticipant() && !competition.finalizada && (
                  <button
                    onClick={() => setShowRegistrationForm(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Me Inscrever</span>
                  </button>
                )}
                {canAddRegistration() && (
                  <button
                    onClick={() => setShowRegistrationForm(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Inscrição</span>
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {participants.map(p => (
                <div key={p.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img
                    src={p.photo || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'}
                    alt={p.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{p.name}</h3>
                    <p className="text-sm text-gray-600">{p.email}</p>
                    <p className="text-sm text-purple-600 font-medium">{p.university}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sponsor Action */}
          {canSponsor() && (
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Patrocinar Evento</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contribua para o sucesso desta competição e apoie o empoderamento feminino na tecnologia.
              </p>
              <button
                onClick={() => setShowSponsorshipForm(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
              >
                <DollarSign className="h-5 w-5" />
                <span>Contribuir</span>
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Estatísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Inscritos</span>
                <span className="font-medium text-gray-900">{competition.registrations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vagas Disponíveis</span>
                <span className="font-medium text-gray-900">{competition.maxParticipants - competition.registrations}</span>
              </div>
              {totalSponsorship > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Patrocínio Total</span>
                  <span className="font-medium text-green-600">
                    {totalSponsorship.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa de Ocupação</span>
                <span className="font-medium text-gray-900">
                  {Math.round((competition.registrations / competition.maxParticipants) * 100)}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(competition.registrations / competition.maxParticipants) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Competition Rules */}
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Regras da Competição</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <Award className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Competição individual</span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Duração: 5 horas</span>
              </div>
              <div className="flex items-start space-x-2">
                <Code className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Linguagens permitidas: C++, Java, Python</span>
              </div>
              <div className="flex items-start space-x-2">
                <Users className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Exclusivo para mulheres</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {(canAddRegistration() || user?.role === 'admin') && (
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
                  Exportar Lista de Participantes
                </button>
                <button className="w-full px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors text-sm font-medium">
                  Enviar Comunicado
                </button>
                <button className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                  Gerar Relatório
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      {/* Registration Form Modal */}
      {showRegistrationForm && !competition.finalizada && (
        <RegistrationForm
          competition={competition}
          onClose={() => setShowRegistrationForm(false)}
          onSubmit={handleRegistrationSubmit}
        />
      )}
      {/* Sponsorship Form Modal */}
      {showSponsorshipForm && (
        <SponsorshipForm
          competition={competition}
          onClose={() => setShowSponsorshipForm(false)}
          onSubmit={handleSponsorshipSubmit}
        />
      )}
      {/* Edit Competition Modal */}
      {showEditForm && (
        <CompetitionEditForm
          competition={competition}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleEditSubmit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default CompetitionDetail;