import React from 'react';
import { Trophy, Code, Award, Target } from 'lucide-react';
import { mockSubmissions, mockCompetitions } from '../data/mockData';

const Statistics: React.FC = () => {
  // TODO: fetch statistics from API
  const submissions = mockSubmissions;
  const competitions = mockCompetitions;

  // Calculate problem solving statistics
  const problemStats = submissions.reduce((acc, submission) => {
    const problemsSolved = submission.problemsSolved;
    const totalProblems = submission.totalProblems;
    const percentage = (problemsSolved / totalProblems) * 100;
    
    if (percentage >= 80) acc.excellent++;
    else if (percentage >= 60) acc.good++;
    else if (percentage >= 40) acc.average++;
    else acc.poor++;
    
    return acc;
  }, { excellent: 0, good: 0, average: 0, poor: 0 });

  // Calculate pie chart data for problem solving
  const pieData = [
    { name: 'Excelente (80%+)', value: problemStats.excellent, color: '#10B981', percentage: (problemStats.excellent / submissions.length) * 100 },
    { name: 'Bom (60-79%)', value: problemStats.good, color: '#3B82F6', percentage: (problemStats.good / submissions.length) * 100 },
    { name: 'Regular (40-59%)', value: problemStats.average, color: '#F59E0B', percentage: (problemStats.average / submissions.length) * 100 },
    { name: 'Baixo (<40%)', value: problemStats.poor, color: '#EF4444', percentage: (problemStats.poor / submissions.length) * 100 }
  ];

  // Participant rankings
  const participantRankings = submissions
    .sort((a, b) => a.ranking - b.ranking)
    .map((submission, index) => ({
      ...submission,
      position: index + 1,
      solvedPercentage: (submission.problemsSolved / submission.totalProblems) * 100
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Estatísticas por Competição</h1>
        <p className="text-gray-600">Análise de performance e resultados das participantes</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Submissões</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{submissions.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Code className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Competições Ativas</p>
              <p className="text-3xl font-bold text-pink-600 mt-2">{competitions.filter(c => c.status === 'upcoming').length}</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg">
              <Trophy className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Média de Problemas</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {Math.round(submissions.reduce((acc, s) => acc + s.problemsSolved, 0) / submissions.length)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {Math.round((submissions.reduce((acc, s) => acc + s.problemsSolved, 0) / submissions.reduce((acc, s) => acc + s.totalProblems, 0)) * 100)}%
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Award className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Distribuição de Performance</h2>
          
          {/* Simple pie chart representation */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {pieData.map((segment, index) => {
                  const startAngle = pieData.slice(0, index).reduce((sum, s) => sum + (s.percentage / 100) * 360, 0);
                  const endAngle = startAngle + (segment.percentage / 100) * 360;
                  const largeArcFlag = segment.percentage > 50 ? 1 : 0;
                  
                  const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                  
                  const pathData = [
                    'M', 50, 50,
                    'L', x1, y1,
                    'A', 40, 40, 0, largeArcFlag, 1, x2, y2,
                    'Z'
                  ].join(' ');
                  
                  return (
                    <path
                      key={segment.name}
                      d={pathData}
                      fill={segment.color}
                      className="hover:opacity-80 transition-opacity"
                    />
                  );
                })}
              </svg>
            </div>
            
            {/* Legend */}
            <div className="space-y-2">
              {pieData.map((segment) => (
                <div key={segment.name} className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {segment.name} ({segment.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competition Results */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Resultados por Competição</h2>
          
          <div className="space-y-4">
            {competitions.filter(c => c.status === 'completed').map((competition) => {
              const competitionSubmissions = submissions.filter(s => s.competitionId === competition.id);
              const avgProblems = competitionSubmissions.length > 0 
                ? competitionSubmissions.reduce((acc, s) => acc + s.problemsSolved, 0) / competitionSubmissions.length 
                : 0;
              
              return (
                <div key={competition.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{competition.name}</h3>
                    <span className="text-sm text-gray-500">{competitionSubmissions.length} participantes</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>Média: {avgProblems.toFixed(1)} problemas</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4" />
                      <span>{new Date(competition.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Rankings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Ranking Geral de Participantes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posição
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participante
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Universidade
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problemas Resolvidos
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tempo Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {participantRankings.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${
                      participant.position === 1 ? 'bg-yellow-500' : 
                      participant.position === 2 ? 'bg-gray-400' : 
                      participant.position === 3 ? 'bg-amber-600' : 'bg-purple-500'
                    }`}>
                      {participant.position}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{participant.participantName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{participant.university}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {participant.problemsSolved}/{participant.totalProblems}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{participant.timeSpent}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-200 rounded-full w-16 h-2">
                        <div
                          className={`h-2 rounded-full ${
                            participant.solvedPercentage >= 80 ? 'bg-green-500' :
                            participant.solvedPercentage >= 60 ? 'bg-blue-500' :
                            participant.solvedPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${participant.solvedPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {participant.solvedPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;