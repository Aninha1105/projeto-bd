import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CompetitionsList from './components/CompetitionsList';
import CompetitionDetail from './components/CompetitionDetail';
import Statistics from './components/Statistics';
import Profile from './components/Profile';
import { Competition } from './types';

// Componente que escolhe a tela conforme autenticação e navegação interna
const AppContent: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  // Troca de tela principal
  const handleScreenChange = (screen: string) => {
    setCurrentScreen(screen);
    setSelectedCompetition(null);
  };

  // Vai para detalhes da competição
  const handleViewCompetitionDetails = (competition: Competition) => {
    setSelectedCompetition(competition);
    setCurrentScreen('competition-detail');
  };

  // Volta para lista de competições
  const handleBackToCompetitions = () => {
    setCurrentScreen('competitions');
    setSelectedCompetition(null);
  };

  // Renderiza a tela selecionada
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'competitions':
        return <CompetitionsList onViewDetails={handleViewCompetitionDetails} />;
      case 'competition-detail':
        return selectedCompetition ? (
          <CompetitionDetail 
            competition={selectedCompetition} 
            onBack={handleBackToCompetitions}
          />
        ) : (
          <CompetitionsList onViewDetails={handleViewCompetitionDetails} />
        );
      case 'statistics':
        return <Statistics />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  // Enquanto carrega estado de autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, mostra a tela de login
  if (!user) {
    return <Login />;
  }

  // Quando logado, exibe layout com navegação
  return (
    <Layout
      currentScreen={currentScreen}
      onScreenChange={handleScreenChange}
      onLogout={logout} // adiciona ação de logout no layout
    >
      {renderScreen()}
    </Layout>
  );
};

// Componente raiz com provedor de autenticação
const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;