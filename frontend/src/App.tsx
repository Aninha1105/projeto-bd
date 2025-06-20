import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CompetitionsList from './components/CompetitionsList';
import CompetitionDetail from './components/CompetitionDetail';
import Statistics from './components/Statistics';
import Profile from './components/Profile';
import { Competition } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  const handleScreenChange = (screen: string) => {
    setCurrentScreen(screen);
    setSelectedCompetition(null);
  };

  const handleViewCompetitionDetails = (competition: Competition) => {
    setSelectedCompetition(competition);
    setCurrentScreen('competition-detail');
  };

  const handleBackToCompetitions = () => {
    setCurrentScreen('competitions');
    setSelectedCompetition(null);
  };

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

  return (
    <Layout currentScreen={currentScreen} onScreenChange={handleScreenChange}>
      {renderScreen()}
    </Layout>
  );
}

export default App;