import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Clock, Users, FileText} from 'lucide-react';
import { CompetitionFormData } from '../types';
import { api } from '../api/api';

interface CompetitionFormProps {
  onClose: () => void;
  onSubmit: (data: CompetitionFormData) => void;
}

const CompetitionForm: React.FC<CompetitionFormProps> = ({ onClose, onSubmit }) => {
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState<CompetitionFormData>({
    name: '',
    date: '',
    location: '',
    time: '',
    maxParticipants: 50,
    description: '',
    teamId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await api.get('/equipes');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = res.data.map((e: any) => ({
          id: e.id_equipe.toString(),
          name: e.nome,
        }));
        setTeams(data);
      } catch (err) {
        console.error('Erro ao buscar equipes:', err);
      }
    }
    fetchTeams();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da competição é obrigatório';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Data deve ser futura';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Local é obrigatório';
    }

    if (!formData.time) {
      newErrors.time = 'Horário é obrigatório';
    }

    if (formData.maxParticipants < 10) {
      newErrors.maxParticipants = 'Mínimo de 10 participantes';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.teamId) {
      newErrors.teamId = 'Selecione uma equipe responsável';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof CompetitionFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Criar Nova Competição</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-1">Preencha os dados da nova competição de programação</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-2" />
              Nome da Competição *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Maratona Feminina de Programação 2024"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-2" />
                Data *
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-2" />
                Horário *
              </label>
              <input
                type="time"
                id="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-2" />
              Local *
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: São Paulo, SP"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Max Participants */}
          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline h-4 w-4 mr-2" />
              Número Máximo de Participantes *
            </label>
            <input
              type="number"
              id="maxParticipants"
              min="10"
              max="500"
              value={formData.maxParticipants}
              onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.maxParticipants && <p className="text-red-500 text-sm mt-1">{errors.maxParticipants}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-2" />
              Descrição *
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Descreva os objetivos, regras e informações importantes da competição..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Team Selection */}
          <div>
            <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline h-4 w-4 mr-2" />
              Equipe Responsável *
            </label>
            <select
              id="teamId"
              value={formData.teamId}
              onChange={(e) => handleInputChange('teamId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.teamId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma equipe</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {errors.teamId && <p className="text-red-500 text-sm mt-1">{errors.teamId}</p>}
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
            >
              Criar Competição
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompetitionForm;