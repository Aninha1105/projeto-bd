import { api } from './api';

export interface EquipeCreate {
  nome: string;
  colaboradores: number[];
}

export interface Equipe {
  id_equipe: number;
  nome: string;
}

export const equipesApi = {
  listarEquipes: async (): Promise<Equipe[]> => {
    const response = await api.get('/equipes/');
    return response.data;
  },

  criarEquipe: async (data: EquipeCreate) => {
    const response = await api.post('/equipes/', data);
    return response.data;
  },

  editarEquipe: async (id: number, data: EquipeCreate) => {
    const response = await api.put(`/equipes/${id}`, data);
    return response.data;
  },

  excluirEquipe: async (id: number) => {
    const response = await api.delete(`/equipes/${id}`);
    return response.data;
  },
}; 