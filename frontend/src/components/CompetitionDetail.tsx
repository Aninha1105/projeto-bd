import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Users, Plus, Code, Award, DollarSign, Heart, Edit } from 'lucide-react';
import { Competition, Participant, Sponsorship } from '../types';
import { useAuth } from '../contexts/AuthContext';
import RegistrationForm from './RegistrationForm';
import SponsorshipForm from './SponsorshipForm';
import { api } from '../api/api';
import CompetitionEditForm from './CompetitionEditForm';

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

  console.log(user);

  useEffect(() => {
    if (!competition) return;

    const fetchRelatedData = async () => {
      try {
        const [inscRes, patrocRes] = await Promise.all([
          api.get(`/inscricoes/competicao/${competition.id}`),
          api.get(`/competicaopatrocinador/competicao/${competition.id}`)
        ]);

        // Mapear os dados recebidos para o formato usado nos components
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setParticipants(inscRes.data.map((inscricao: any) => ({
          id: inscricao.participante.id,
          name: inscricao.participante.usuario.nome,
          email: inscricao.participante.usuario.email,
          photo: inscricao.participante.usuario.foto,
          university: inscricao.participante.universidade,
        })));

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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

  const canAddRegistration = () =>
    user?.role === 'admin' ||
    (user?.role === 'colaborador' && competition.collaborators?.includes(user.id));

  const canEditCompetition = () => {
    return user?.role === 'admin' || 
           (user?.role === 'colaborador'); 
            //&& competition.collaborators?.includes(user.id));
  };

  const canSponsor = () => user?.role === 'patrocinador';
  const canRegisterAsParticipant = () => user?.role === 'participante';

  const totalSponsorship = sponsorships.reduce((sum, s) => sum + s.amount, 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditSubmit = (data: any) => {
    // TODO: update competition via API
    const updatedCompetition = { ...competition, ...data };
    console.log('Updated competition:', updatedCompetition);
    if (onUpdate) {
      onUpdate(updatedCompetition);
    }
    setShowEditForm(false);
  };

  const handleDelete = () => {
    // TODO: delete competition via API
    console.log('Deleting competition:', competition.id);
    if (onDelete) {
      onDelete(competition.id);
    }
    onBack();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRegistrationSubmit = async (data: any) => {
    try {
      await api.post(`/competicoes/${competition.id}/inscricoes`, data);
      setShowRegistrationForm(false);
      const res = await api.get(`/inscricoes/competicao/${competition.id}`);
      setParticipants(res.data);
    } catch (err) {
      console.error('Erro ao registrar participante', err);
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
          </div>
        </div>
        
        {/* Edit/Delete Actions */}
        {canEditCompetition() && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </button>
          </div>
        )}
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
                {canRegisterAsParticipant() && (
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
      {showRegistrationForm && (
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