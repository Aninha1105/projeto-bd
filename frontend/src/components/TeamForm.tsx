import React, { useState } from 'react';
import { X, Users, User, Check } from 'lucide-react';
import { Team } from '../types';
import { mockAuthUsers } from '../data/mockData';

interface TeamFormProps {
  team?: Team | null;
  onClose: () => void;
  onSubmit: (data: { name: string; collaborators: string[] }) => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ team, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    collaborators: team?.collaborators || []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // TODO: fetch organizers from API
  const organizers = mockAuthUsers.filter(user => user.role === 'colaborador');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da equipe é obrigatório';
    }

    if (formData.collaborators.length === 0) {
      newErrors.collaborators = 'Selecione pelo menos um colaborador';
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
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleCollaboratorToggle = (collaboratorId: string) => {
    const updatedCollaborators = formData.collaborators.includes(collaboratorId)
      ? formData.collaborators.filter(id => id !== collaboratorId)
      : [...formData.collaborators, collaboratorId];
    
    handleInputChange('collaborators', updatedCollaborators);
  };

  const isEditing = !!team;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Editar Equipe' : 'Criar Nova Equipe'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Edite as informações da equipe' : 'Preencha os dados da nova equipe'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Team Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline h-4 w-4 mr-2" />
              Nome da Equipe *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Equipe Alpha"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Collaborators Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-2" />
              Colaboradores *
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {organizers.length > 0 ? (
                organizers.map((organizer) => (
                  <label key={organizer.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.collaborators.includes(organizer.id)}
                        onChange={() => handleCollaboratorToggle(organizer.id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      {formData.collaborators.includes(organizer.id) && (
                        <Check className="absolute inset-0 h-4 w-4 text-purple-600 pointer-events-none" />
                      )}
                    </div>
                    <img
                      src={organizer.photo || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'}
                      alt={organizer.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{organizer.name}</p>
                      <p className="text-xs text-gray-500">{organizer.university}</p>
                    </div>
                  </label>
                ))
              ) : (
                <div className="text-center py-4">
                  <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhum colaborador disponível</p>
                </div>
              )}
            </div>
            {errors.collaborators && <p className="text-red-500 text-sm mt-1">{errors.collaborators}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Selecione os colaboradores que farão parte desta equipe ({formData.collaborators.length} selecionados)
            </p>
          </div>

          {/* Selected Collaborators Preview */}
          {formData.collaborators.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Colaboradores Selecionados ({formData.collaborators.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.collaborators.map(collaboratorId => {
                  const collaborator = organizers.find(o => o.id === collaboratorId);
                  return collaborator ? (
                    <div key={collaboratorId} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border">
                      <img
                        src={collaborator.photo || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'}
                        alt={collaborator.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-700">{collaborator.name}</span>
                      <button
                        type="button"
                        onClick={() => handleCollaboratorToggle(collaboratorId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

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
              {isEditing ? 'Salvar Alterações' : 'Criar Equipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;