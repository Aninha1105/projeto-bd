import React, { useState } from 'react';
import { Menu, X, Home, Trophy, Users, BarChart3, User, Code, LogOut/*, Plus*/ } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentScreen, onScreenChange }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', name: 'Dashboard', icon: Home, roles: ['admin', 'colaborador', 'participante', 'patrocinador'] },
      { id: 'competitions', name: 'Competições', icon: Trophy, roles: ['admin', 'colaborador', 'participante', 'patrocinador'] },
    ];

    const roleSpecificItems = [];

    if (user?.role === 'admin') {
      roleSpecificItems.push(
        { id: 'teams', name: 'Equipes', icon: Users, roles: ['admin'] },
        //{ id: 'registrations', name: 'Inscrições', icon: UserPlus, roles: ['admin'] },
        { id: 'statistics', name: 'Estatísticas', icon: BarChart3, roles: ['admin'] }
        //{ id: 'create-competition', name: 'Criar Evento', icon: Plus, roles: ['admin'] }
      );
    } else if (user?.role === 'colaborador') {
      roleSpecificItems.push(
        { id: 'teams', name: 'Equipes', icon: Users, roles: ['colaborador'] },
        { id: 'statistics', name: 'Estatísticas', icon: BarChart3, roles: ['colaborador'] }
        //{ id: 'create-competition', name: 'Criar Evento', icon: Plus, roles: ['colaborador'] },
        //{ id: 'registrations', name: 'Minhas Inscrições', icon: UserPlus, roles: ['colaborador'] }
      );
    } else if (user?.role === 'participante') {
      roleSpecificItems.push(
        //{ id: 'registrations', name: 'Minhas Inscrições', icon: UserPlus, roles: ['participante'] }
      );
    } else if (user?.role === 'patrocinador') {
      // Patrocinadores têm acesso apenas ao dashboard e competições
    }

    const profileItem = { id: 'profile', name: 'Perfil', icon: User, roles: ['admin', 'colaborador', 'participante', 'patrocinador'] };

    return [...baseItems, ...roleSpecificItems, profileItem].filter(item =>
      item.roles.includes(user?.role || '')
    );
  };

  const navigation = getNavigationItems();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { text: 'Admin', color: 'bg-red-100 text-red-800' };
      case 'colaborador':
        return { text: 'Colaborador', color: 'bg-blue-100 text-blue-800' };
      case 'participante':
        return { text: 'Participante', color: 'bg-green-100 text-green-800' };
      case 'patrocinador':
        return { text: 'Patrocinador', color: 'bg-purple-100 text-purple-800' };
      default:
        return { text: role, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const roleBadge = user ? getRoleBadge(user.role) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Maratonas Femininas
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onScreenChange(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      currentScreen === item.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    {roleBadge && (
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${roleBadge.color}`}>
                        {roleBadge.text}
                      </span>
                    )}
                  </div>
                  {/*
                    // Futuro: exibir foto do usuário
                    // <img
                    //   src={user.photo}
                    //   alt={user.email}
                    //   className="w-8 h-8 rounded-full object-cover"
                    // />
                  */}
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sair"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-purple-100">
            <div className="px-4 py-2 space-y-1">
              {/* User Info Mobile */}
              {user && (
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg mb-4">
                  {/*
                    // Futuro: exibir foto do usuário
                    // <img
                    //   src={user.photo}
                    //   alt={user.email}
                    //   className="w-10 h-10 rounded-full object-cover"
                    // />
                  */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    {roleBadge && (
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${roleBadge.color}`}>
                        {roleBadge.text}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onScreenChange(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentScreen === item.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}

              {/* Logout Button Mobile */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
