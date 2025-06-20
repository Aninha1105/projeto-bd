import React, { useState } from 'react';
import { Edit3, Mail, GraduationCap, Camera, X, User, Code, Award, Trophy } from 'lucide-react';
import { mockUser } from '../data/mockData';

const Profile: React.FC = () => {
  const [user, setUser] = useState(mockUser);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    university: user.university,
    photo: null as File | null
  });

  // TODO: fetch user profile from API

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: update user profile via API
    setUser({
      ...user,
      name: editForm.name,
      university: editForm.university,
      // In a real app, photo would be uploaded and URL returned
    });
    setShowEditModal(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        setEditForm({ ...editForm, photo: file });
      }
    }
  };

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
            
            {/* Edit Button */}
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                <Edit3 className="h-4 w-4" />
                <span>Editar Perfil</span>
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
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Universidade</p>
                <p className="font-medium text-gray-900">{user.university}</p>
              </div>
            </div>
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
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Trophy className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Competições Organizadas</span>
              </div>
              <span className="text-lg font-bold text-purple-600">8</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-pink-600" />
                <span className="text-sm font-medium text-gray-700">Inscrições Aprovadas</span>
              </div>
              <span className="text-lg font-bold text-pink-600">156</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Code className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Submissões Validadas</span>
              </div>
              <span className="text-lg font-bold text-green-600">89</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Eventos Finalizados</span>
              </div>
              <span className="text-lg font-bold text-indigo-600">5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
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

              {/* University */}
              <div>
                <label htmlFor="editUniversity" className="block text-sm font-medium text-gray-700 mb-2">
                  Universidade
                </label>
                <input
                  type="text"
                  id="editUniversity"
                  value={editForm.university}
                  onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
    </div>
  );
};

export default Profile;