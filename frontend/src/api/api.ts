import axios from 'axios';
console.log('VITE_API_URL →', import.meta.env.VITE_API_URL);


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const problemasApi = {
  async getProblemasByCompeticao(id_competicao: number) {
    const response = await api.get(`/problemas?comp_id=${id_competicao}`);
    return response.data;
  },
  async criarProblema(data: any) {
    const response = await api.post('/problemas/', data);
    return response.data;
  },
  async editarProblema(id: number, data: any) {
    const response = await api.put(`/problemas/${id}`, data);
    return response.data;
  },
  async excluirProblema(id: number) {
    await api.delete(`/problemas/${id}`);
  },
};
