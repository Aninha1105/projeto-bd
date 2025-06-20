import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Users, Plus, Code, Award } from 'lucide-react';
import { Competition, Participant } from '../types';
import { mockParticipants } from '../data/mockData';
import RegistrationForm from './RegistrationForm';

interface CompetitionDetailProps {
  competition: Competition;
  onBack: () => void;
}

const CompetitionDetail: React.FC<CompetitionDetailProps> = ({ competition, onBack }) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  // TODO: fetch participants for this competition from API
  const participants = mockParticipants;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Competition Info */}
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

          {/* Participants */}
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Participantes</h2>
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Inscrição</span>
              </button>
            </div>

            <div className="space-y-4">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src={participant.photo || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'}
                    alt={participant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{participant.name}</h3>
                    <p className="text-sm text-gray-600">{participant.email}</p>
                    <p className="text-sm text-purple-600 font-medium">{participant.university}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(participant.registrationStatus)}`}>
                      {getStatusText(participant.registrationStatus)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(participant.registrationDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <RegistrationForm
          competition={competition}
          onClose={() => setShowRegistrationForm(false)}
          onSubmit={(data) => {
            // TODO: submit registration to API
            console.log('Registration data:', data);
            setShowRegistrationForm(false);
          }}
        />
      )}
    </div>
  );
};

export default CompetitionDetail;