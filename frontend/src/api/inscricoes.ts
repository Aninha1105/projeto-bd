import { api } from './api';

export interface InscricaoData {
  name: string;
  email: string;
  birthDate: string;
  university: string;
  photo?: File | null;
}

export interface InscricaoResponse {
  id_inscricao: number;
  categoria?: string;
  id_usuario: number;
  id_competicao: number;
  participante: {
    id_usuario: number;
    instituicao?: string;
    num_submissoes: number;
    num_competicoes: number;
    usuario: {
      id_usuario: number;
      nome: string;
      email: string;
      tipo: string;
      foto?: string;
    };
  };
}

export const inscricoesApi = {
  // Criar nova inscrição
  async createInscricao(competitionId: string, data: InscricaoData): Promise<InscricaoResponse> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('birthDate', data.birthDate);
    formData.append('university', data.university);
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const response = await api.post(`/inscricoes/competicao/${competitionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Buscar inscrições por competição
  async getInscricoesByCompeticao(competitionId: string): Promise<InscricaoResponse[]> {
    const response = await api.get(`/inscricoes/competicao/${competitionId}`);
    return response.data;
  },

  // Buscar todas as inscrições
  async getAllInscricoes(): Promise<InscricaoResponse[]> {
    const response = await api.get('/inscricoes');
    return response.data;
  },

  // Buscar inscrição específica
  async getInscricao(inscricaoId: number): Promise<InscricaoResponse> {
    const response = await api.get(`/inscricoes/${inscricaoId}`);
    return response.data;
  },

  // Atualizar inscrição
  async updateInscricao(inscricaoId: number, data: Partial<InscricaoData>): Promise<InscricaoResponse> {
    const response = await api.put(`/inscricoes/${inscricaoId}`, data);
    return response.data;
  },

  // Deletar inscrição
  async deleteInscricao(inscricaoId: number): Promise<void> {
    await api.delete(`/inscricoes/${inscricaoId}`);
  },
}; 