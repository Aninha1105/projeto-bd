import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CompetitionsList from './components/CompetitionsList';
import CompetitionDetail from './components/CompetitionDetail';
import CompetitionForm from './components/CompetitionForm';
import Statistics from './components/Statistics';
import Profile from './components/Profile';
import TeamManagement from './components/TeamManagement';
import { Competition, CompetitionFormData } from './types';
import { api } from './api/api';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [showCompetitionForm, setShowCompetitionForm] = useState(false);

  const handleScreenChange = (screen: string) => {
    if (screen === 'create-competition') {
      setShowCompetitionForm(true);
      return;
    }
    
    setCurrentScreen(screen);
    setSelectedCompetition(null);
    setShowCompetitionForm(false);
  };

  const handleViewCompetitionDetails = (competition: Competition) => {
    setSelectedCompetition(competition);
    setCurrentScreen('competition-detail');
    setShowCompetitionForm(false);
  };

  const handleBackToCompetitions = () => {
    setCurrentScreen('competitions');
    setSelectedCompetition(null);
    setShowCompetitionForm(false);
  };

  const handleCreateCompetition = () => {
    setShowCompetitionForm(true);
  };

  const handleCompetitionFormSubmit = async (data: CompetitionFormData) => {
    try {
      await api.post('/competicoes', {
        nome: data.name,
        data: data.date,
        local: data.location,
        horario: data.time,
        max_participantes: data.maxParticipants,
        descricao: data.description,
        id_equipe: parseInt(data.teamId, 10),
      });

      setShowCompetitionForm(false);
      setCurrentScreen('competitions');
    } catch (err) {
      console.error('Erro ao criar competição:', err);
      alert('Erro ao criar competição. Verifique os dados e tente novamente.');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'competitions':
        return (
          <CompetitionsList 
            onViewDetails={handleViewCompetitionDetails}
            onCreateCompetition={handleCreateCompetition}
          />
        );
      case 'competition-detail':
        return selectedCompetition ? (
          <CompetitionDetail 
            competition={selectedCompetition} 
            onBack={handleBackToCompetitions}
          />
        ) : (
          <CompetitionsList 
            onViewDetails={handleViewCompetitionDetails}
            onCreateCompetition={handleCreateCompetition}
          />
        );
      case 'teams':
        return <TeamManagement />;
      case 'registrations':
        if (user?.role === 'admin') {
          return <CompetitionsList onViewDetails={handleViewCompetitionDetails} />;
        } else if (user?.role === 'organizer') {
          return (
            <CompetitionsList 
              onViewDetails={handleViewCompetitionDetails}
              onCreateCompetition={handleCreateCompetition}
            />
          );
        } else {
          // For participants, show competitions they can register for
          return <CompetitionsList onViewDetails={handleViewCompetitionDetails} />;
        }
      case 'statistics':
        return <Statistics />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout currentScreen={currentScreen} onScreenChange={handleScreenChange}>
      {renderScreen()}
      
      {/* Competition Form Modal */}
      {showCompetitionForm && (
        <CompetitionForm
          onClose={() => setShowCompetitionForm(false)}
          onSubmit={handleCompetitionFormSubmit}
        />
      )}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;