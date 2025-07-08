import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, Building, Camera } from 'lucide-react';
import { UserRegistrationData } from '../types';
import { api } from '../api/api';

interface UserRegistrationProps {
  onClose: () => void;
  onSubmit: () => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<UserRegistrationData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'participant',
    collaboratorRole: undefined,
    institution: '',
    photo: null,
    teamId: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<{ id_equipe: number; nome: string }[]>([]);
  
  // Carregar equipes para seleção opcional
  useEffect(() => {
    api.get('/equipes')
      .then(res => setTeams(res.data))
      .catch(() => console.warn('Erro ao buscar equipes'));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    else if (formData.password.length < 5) newErrors.password = 'Senha deve ter pelo menos 5 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem';
    if (['organizer', 'participant'].includes(formData.role) && !formData.institution?.trim()) {
      newErrors.institution = 'Instituição/Empresa é obrigatória';
    }
    if (formData.role === 'organizer' && !formData.collaboratorRole) {
      newErrors.collaboratorRole = 'Papel do colaborador é obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof UserRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png'].includes(file.type)) {
      setErrors(prev => ({ ...prev, photo: 'Formato inválido. Somente JPG ou PNG.' }));
      return;
    }
    handleInputChange('photo', file);
  };

  const submitToApi = async () => {
    setLoading(true);
    try {
      const roleMap = {
        organizer: 'colaborador',
        participant: 'participante',
        sponsor: 'patrocinador',
      };

      const userPayload = {
        nome: formData.name,
        email: formData.email,
        senha_hash: formData.password,
        tipo: roleMap[formData.role],
      };

      const userRes = await api.post('http://localhost:8000/usuarios/', userPayload);
      const userId = userRes.data.id_usuario;

      if (formData.photo) {
        const photoForm = new FormData();
        photoForm.append('foto', formData.photo);
        await api.post(`/usuarios/${userId}/foto`, photoForm, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (formData.role === 'participant') {
        console.log('POST /participantes payload:', {
          id_usuario: userId,
          instituicao: formData.institution
        });
        await api.post('/participantes', { id_usuario: userId, instituicao: formData.institution });
      } else if (formData.role === 'sponsor') {
        await api.post('/patrocinadores', { id_usuario: userId});
      } else if (formData.role === 'organizer') {
        await api.post('/colaboradores', {
          id_usuario: userId,
          papel: formData.collaboratorRole as string,
          instituicao: formData.institution,
          id_equipe: formData.teamId ?? null,
        });
      }

      onSubmit();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Erro de cadastro:', err.response?.data || err);
    }finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit!');
    if (validateForm()) submitToApi();
  };

  const handleRoleChange = (role: UserRegistrationData['role']) => {
    setFormData({
      ...formData,
      role,
      collaboratorRole: undefined,
      institution: '',
      teamId: undefined,
    });
    setErrors({});
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'organizer': return 'Colaborador';
      case 'participant': return 'Participante';
      case 'sponsor': return 'Patrocinador';
      default: return role;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Cadastro de Usuário</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-1">Preencha os dados para criar uma nova conta</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Informações Básicas
            </h3>

            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-2" />
                Nome Completo *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Digite seu nome completo"
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
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Digite seu e-mail"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Senhas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Senha *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Tipo de Usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Usuário *
              </label>
              <div className="flex items-center justify-between mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['organizer', 'participant', 'sponsor'] as const).map((role) => (
                  <label key={role} className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={() => handleRoleChange(role)}
                      className="sr-only"
                    />
                    <div className={`p-3 border-2 rounded-lg text-center transition-all ${
                      formData.role === role
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <div className="text-sm font-medium">{getRoleLabel(role)}</div>
                    </div>
                  </label>
                ))}
              </div>
              </div>
            </div>
          </div>

          {/* Campos Específicos por Tipo de Usuário */}
          {formData.role === 'organizer' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informações do Colaborador
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Papel do Colaborador *
                </label>
                <select
                  value={formData.collaboratorRole || ''}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e) => handleInputChange('collaboratorRole', e.target.value as any)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.collaboratorRole ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o papel</option>
                  <option value="setter">Setter</option>
                  <option value="tester">Tester</option>
                  <option value="organizador">Organizador</option>
                  <option value="professor">Professor</option>
                </select>
                {errors.collaboratorRole && <p className="text-red-500 text-sm mt-1">{errors.collaboratorRole}</p>}
              </div>

              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-2" />
                  Instituição *
                </label>
                <input
                  type="text"
                  id="institution"
                  value={formData.institution || ''}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.institution ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite o nome da instituição"
                />
                {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selecionar Equipe (Opcional)</label>
                <select
                  value={formData.teamId ?? ''}
                  onChange={(e) => handleInputChange('teamId', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sem equipe</option>
                  {teams.map(team => <option key={team.id_equipe} value={team.id_equipe}>{team.nome}</option>)}
                </select>
              </div>
            </div>
          )}

          {formData.role === 'participant' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informações Acadêmicas
              </h3>

              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-2" />
                  Instituição *
                </label>
                <input
                  type="text"
                  id="institution"
                  value={formData.institution || ''}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.institution ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite o nome da instituição"
                />
                {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
              </div>
            </div>
          )}

          {/* Foto de Perfil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Camera className="inline h-4 w-4 mr-2" />
              Foto de Perfil (Opcional)
            </label>
            <div className="flex items-center space-x-4">
              {formData.photo && (
                <img
                  src={URL.createObjectURL(formData.photo)}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Camera className="h-4 w-4" />
                <span>Selecionar Foto</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
          </div>

          {/* Actions */}
          {errors.form && <p className="text-red-500 text-center">{errors.form}</p>}
          <div className="flex space-x-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;