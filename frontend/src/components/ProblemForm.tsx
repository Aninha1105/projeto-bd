import React, { useState } from 'react';
import { Problem } from '../types';

interface ProblemFormProps {
  problem: Problem | null;
  onClose: () => void;
  onSubmit: (data: Omit<Problem, 'id_problema'>) => void;
}

const ProblemForm: React.FC<ProblemFormProps> = ({ problem, onClose, onSubmit }) => {
  const [titulo, setTitulo] = useState(problem?.titulo || '');
  const [nivel, setNivel] = useState(problem?.nivel || 'fácil');
  const [link, setLink] = useState(problem?.link || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ titulo, nivel, link, id_competicao: problem?.id_competicao || 0 } as any);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">{problem ? 'Editar Problema' : 'Adicionar Problema'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
            <select
              value={nivel}
              onChange={e => setNivel(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="fácil">Fácil</option>
              <option value="médio">Médio</option>
              <option value="difícil">Difícil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link do Enunciado</label>
            <input
              type="url"
              value={link}
              onChange={e => setLink(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProblemForm; 