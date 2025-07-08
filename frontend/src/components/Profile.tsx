/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Edit3, Mail, GraduationCap, Camera, X, User, Code, Award, Trophy, Trash2, AlertTriangle, Users, FileText, DollarSign, Building, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/api';

const Profile: React.FC = () => {
  const { logout, user: authUser } = useAuth();

  const [user, setUser] = useState({
    name: '',
    email: '',
    university: '',
    role: '',
    photo: null as string | null,
    collaboratorRole: ''
  });

  const [activityStats, setActivityStats] = useState<{ [key: string]: string | number }>({});

  const [editForm, setEditForm] = useState({
    name: '',
    photo: null as File | null,
    // Campos específicos por tipo de usuário
    university: (user.role === 'participante' || user.role === 'colaborador') ? user.university : undefined,
    collaboratorRole: user.role === 'colaborador' ? user.collaboratorRole : undefined,
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser) return;
      try {
        const response = await api.get(`/usuarios/${authUser.id}`);
        const u = response.data;

        let university = '';
        let collaboratorRole = '';
        const stats: { [key: string]: string | number } = {};

        if (u.tipo === 'participante') {
          const res = await api.get(`/participantes/${authUser.id}`);
          university = res.data.instituicao;
          // Corrija o acesso aos campos aninhados
          stats.numInscricoes = res.data.num_competicoes;
          stats.numSubmissoes = res.data.num_submissoes;
        } else if (u.tipo === 'colaborador') {
          const res = await api.get(`/colaboradores/${authUser.id}`);
          university = res.data.instituicao;
          collaboratorRole = res.data.papel;
          stats.nomeEquipe = res.data.nome_equipe || 'Não vinculado';
          stats.numCompeticoes = res.data.num_competicoes;
        } else if (u.tipo === 'patrocinador') {
          const res = await api.get(`/patrocinadores/${authUser.id}`);
          stats.numCompeticoes = res.data.num_competicoes;
          stats.totalContribuido = res.data.total_contribuicao;
        }

        setUser({
          name: u.nome,
          email: u.email,
          university,
          role: u.tipo,
          photo: u.foto ? `data:image/jpeg;base64,${u.foto}` : null,
          collaboratorRole: collaboratorRole,
        });

        setEditForm({
          name: u.nome,
          university,
          photo: null,
          collaboratorRole
        });

        setActivityStats(stats);
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      }
    };

    fetchUserProfile();
  }, [authUser]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;

    try {
      console.log('Dados para update:', {
        nome: editForm.name,
        universidade: editForm.university,
        role: user.role,
        collaboratorRole: editForm.collaboratorRole
      });

      if (user.role === 'colaborador') {
        const colaboradorPayload: any = {
          instituicao: editForm.university
        };
        if (editForm.collaboratorRole) {
          colaboradorPayload.papel = editForm.collaboratorRole;
        }
        await api.put(`/colaboradores/${authUser.id}`, colaboradorPayload);
      } else if (user.role === 'participante') {
        await api.put(`/participantes/${authUser.id}`, {
          instituicao: editForm.university
        });
      }

      if (editForm.photo) {
        const photoForm = new FormData();
        photoForm.append('foto', editForm.photo);
        await api.post(`/usuarios/${authUser.id}/foto`, photoForm, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      await api.put(`/usuarios/${authUser.id}`, {
        nome: editForm.name
      });

      setShowEditModal(false);
      window.location.reload();
    } catch (error: any) {
      if (error.response) {
        console.error('Erro ao atualizar perfil:', error.response.data);
      } else {
        console.error('Erro ao atualizar perfil:', error);
      }
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        setEditForm({ ...editForm, photo: file });
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!authUser) return;
    try {
      await api.delete(`/usuarios/${authUser.id}`);
      logout();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
    }
  };

  if (!user.name) {
    return <p className="text-gray-500">Carregando perfil...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Perfil do Usuário</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e acadêmicas</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-4 left-6 flex items-center space-x-2 text-white">
            <Code className="h-5 w-5" />
            <span className="text-sm font-medium">Programação Competitiva</span>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            {/* Profile Photo */}
            <div className="relative -mt-16 mb-4 sm:mb-0">
              <img
                src={user.photo || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-purple-600 rounded-full p-2">
                <Code className="h-4 w-4 text-white" />
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">
                    {user.university}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-pink-600" />
                  <span className="text-sm font-medium text-pink-600 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                <Edit3 className="h-4 w-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir Conta</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Informações da Conta</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nome Completo</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Mail className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">E-mail</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            {user.role != 'patrocinador' && user.role != 'admin' && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Universidade</p>
                <p className="font-medium text-gray-900">{user.university}</p>
              </div>
            </div>
            )}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cargo</p>
                <p className="font-medium text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo de Atividades</h3>
          <div className="space-y-4">
            {user.role === 'participante' && (
              <>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Inscrições</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{activityStats.numInscricoes || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-pink-600" />
                    <span className="text-sm font-medium text-gray-700">Submissões</span>
                  </div>
                  <span className="text-lg font-bold text-pink-600">{activityStats.numSubmissoes || 0}</span>
                </div>
              </>
            )}
            {user.role === 'colaborador' && (
              <>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Equipe</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{activityStats.nomeEquipe || '—'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">Competições Organizadas</span>
                  </div>
                  <span className="text-lg font-bold text-indigo-600">{activityStats.numCompeticoes || 0}</span>
                </div>
              </>
            )}
            {user.role === 'patrocinador' && (
              <>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Competições Patrocinadas</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{activityStats.numCompeticoes || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Total Contribuído</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">R$ {activityStats.totalContribuido || '0,00'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Editar Perfil</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="editName"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Campos específicos para Participante */}
              {user.role === 'participante' && (
                <div>
                  <label htmlFor="editUniversity" className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="inline h-4 w-4 mr-2" />
                    Universidade
                  </label>
                  <input
                    type="text"
                    id="editUniversity"
                    value={editForm.university || ''}
                    onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Campos específicos para Colaborador */}
              {user.role === 'colaborador' && (
                <>
                  <div>
                    <label htmlFor="editInstitution" className="block text-sm font-medium text-gray-700 mb-2">
                      <Building className="inline h-4 w-4 mr-2" />
                      Instituição
                    </label>
                    <input
                      type="text"
                      id="editInstitution"
                      value={editForm.university || ''}
                      onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="editCollaboratorRole" className="block text-sm font-medium text-gray-700 mb-2">
                      <UserCheck className="inline h-4 w-4 mr-2" />
                      Papel do Colaborador
                    </label>
                    <select
                      id="editCollaboratorRole"
                      value={editForm.collaboratorRole || ''}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(e) => setEditForm({ ...editForm, collaboratorRole: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione o papel</option>
                      <option value="setter">Setter</option>
                      <option value="tester">Tester</option>
                      <option value="organizador">Organizador</option>
                      <option value="professor">Professor</option>
                    </select>
                  </div>
                </>
              )}

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="inline h-4 w-4 mr-2" />
                  Foto de Perfil
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src={editForm.photo ? URL.createObjectURL(editForm.photo) : user.photo || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Camera className="h-4 w-4" />
                    <span>Alterar Foto</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Excluir Conta
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-800">Consequências da exclusão:</p>
                    <ul className="text-sm text-red-700 mt-1 space-y-1">
                      <li>• Perda de acesso a todas as competições</li>
                      <li>• Remoção de histórico de participações</li>
                      <li>• Cancelamento de inscrições ativas</li>
                      <li>• Dados não poderão ser recuperados</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Excluir Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;