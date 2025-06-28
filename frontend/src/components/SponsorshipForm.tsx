import React, { useState } from 'react';
import { X, DollarSign, Heart, Building } from 'lucide-react';
import { Competition } from '../types';

interface SponsorshipFormProps {
  competition: Competition;
  onClose: () => void;
  onSubmit: (amount: number, competitionId: string) => void;
}

const SponsorshipForm: React.FC<SponsorshipFormProps> = ({ competition, onClose, onSubmit }) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Digite um valor válido maior que zero');
      return false;
    }
    if (numAmount < 100) {
      setError('Valor mínimo de contribuição é R$ 100,00');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAmount()) {
      onSubmit(parseFloat(amount), competition.id);
    }
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value.replace(/[^\d]/g, '')) / 100;
    return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
    if (error) setError('');
  };

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Contribuir com Patrocínio</h2>
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
          {/* Competition Info */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Building className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium text-gray-900">Detalhes do Evento</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Data:</strong> {new Date(competition.date).toLocaleDateString('pt-BR')}</p>
              <p><strong>Local:</strong> {competition.location}</p>
              <p><strong>Participantes:</strong> {competition.registrations}/{competition.maxParticipants}</p>
            </div>
          </div>

          {/* Predefined Amounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Valores Sugeridos
            </label>
            <div className="grid grid-cols-2 gap-2">
              {predefinedAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount((value * 100).toString())}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    parseInt(amount) === value * 100
                      ? 'bg-purple-100 border-purple-500 text-purple-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {formatCurrency((value * 100).toString())}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline h-4 w-4 mr-2" />
              Valor da Contribuição *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                R$
              </span>
              <input
                type="text"
                id="amount"
                value={amount ? formatCurrency(amount) : ''}
                onChange={handleAmountChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0,00"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Valor mínimo: R$ 100,00
            </p>
          </div>

          {/* Impact Message */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-green-900">Impacto da sua contribuição</h3>
            </div>
            <p className="text-sm text-green-700">
              Sua contribuição ajudará a cobrir custos de infraestrutura, premiação e 
              materiais para as participantes, promovendo a inclusão feminina na tecnologia.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium"
            >
              Confirmar Patrocínio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SponsorshipForm;