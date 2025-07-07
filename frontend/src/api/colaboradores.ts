import { api } from './api';

export interface Colaborador {
  id_usuario: number;
  papel: string;
  id_equipe: number | null;
  instituicao: string | null;
  num_competicoes: number;
  nome_equipe: string | null;
  usuario: {
    id_usuario: number;
    nome: string;
    email: string;
    tipo: string;
    foto: string | null;
  };
}

export const colaboradoresApi = {
  // Buscar todos os colaboradores
  getColaboradores: async (): Promise<Colaborador[]> => {
    const response = await api.get('/colaboradores/');
    return response.data;
  },

  // Buscar colaborador específico
  getColaborador: async (id: number): Promise<Colaborador> => {
    const response = await api.get(`/colaboradores/${id}`);
    return response.data;
  },

  // Buscar colaboradores disponíveis (sem equipe)
  getColaboradoresDisponiveis: async (): Promise<Colaborador[]> => {
    const response = await api.get('/colaboradores/');
    return response.data.filter((colaborador: Colaborador) => !colaborador.id_equipe);
  }
}; 