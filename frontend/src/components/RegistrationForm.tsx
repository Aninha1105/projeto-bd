import React, { useState } from 'react';
import { X, Upload, User, Mail, Calendar, GraduationCap, Camera } from 'lucide-react';
import { Competition } from '../types';
import { mockUniversities } from '../data/mockData';
import { inscricoesApi, InscricaoData } from '../api/inscricoes';
import Toast from './Toast';

interface RegistrationFormProps {
  competition: Competition;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ competition, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    university: '',
    photo: null as File | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  // TODO: fetch universities from API
  const universities = mockUniversities;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome completo é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (!formData.university) {
      newErrors.university = 'Seleção de universidade é obrigatória';
    }

    if (formData.photo && !['image/jpeg', 'image/png'].includes(formData.photo.type)) {
      newErrors.photo = 'Foto deve ser em formato JPG ou PNG';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const inscricaoData: InscricaoData = {
          name: formData.name,
          email: formData.email,
          birthDate: formData.birthDate,
          university: formData.university,
          photo: formData.photo
        };
        
        await inscricoesApi.createInscricao(competition.id, inscricaoData);
        setToast({
          message: 'Inscrição criada com sucesso!',
          type: 'success',
          isVisible: true
        });
        onSubmit(formData);
      } catch (error) {
        console.error('Erro ao criar inscrição:', error);
        setToast({
          message: 'Erro ao criar inscrição. Tente novamente.',
          type: 'error',
          isVisible: true
        });
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        setFormData({ ...formData, photo: file });
        setErrors({ ...errors, photo: '' });
      } else {
        setErrors({ ...errors, photo: 'Foto deve ser em formato JPG ou PNG' });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        setFormData({ ...formData, photo: file });
        setErrors({ ...errors, photo: '' });
      } else {
        setErrors({ ...errors, photo: 'Foto deve ser em formato JPG ou PNG' });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Nova Inscrição</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-1">{competition.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-2" />
              Nome Completo *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite o nome completo"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-2" />
              E-mail *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite o e-mail"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Birth Date */}
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-2" />
              Data de Nascimento *
            </label>
            <input
              type="date"
              id="birthDate"
              value={formData.birthDate}
              onChange={(e) => {
                setFormData({ ...formData, birthDate: e.target.value });
                if (errors.birthDate) setErrors({ ...errors, birthDate: '' });
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.birthDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
          </div>

          {/* University */}
          <div>
            <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="inline h-4 w-4 mr-2" />
              Universidade *
            </label>
            <select
              id="university"
              value={formData.university}
              onChange={(e) => {
                setFormData({ ...formData, university: e.target.value });
                if (errors.university) setErrors({ ...errors, university: '' });
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.university ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma universidade</option>
              {universities.map((university) => (
                <option key={university} value={university}>
                  {university}
                </option>
              ))}
            </select>
            {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Camera className="inline h-4 w-4 mr-2" />
              Foto do Participante
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
              } ${errors.photo ? 'border-red-500' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.photo ? (
                <div className="space-y-2">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden">
                    <img
                      src={URL.createObjectURL(formData.photo)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{formData.photo.name}</p>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photo: null })}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remover foto
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-gray-600">
                    Arraste uma foto aqui ou{' '}
                    <label className="text-purple-600 hover:text-purple-700 cursor-pointer">
                      clique para selecionar
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-sm text-gray-500">JPG ou PNG, máximo 5MB</p>
                </div>
              )}
            </div>
            {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
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
              Salvar Inscrição
            </button>
          </div>
        </form>
      </div>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default RegistrationForm;