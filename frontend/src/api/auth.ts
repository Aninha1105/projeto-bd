import { api } from './api';

// 1. Definimos a interface para o payload de login
interface LoginPayload {
  email: string;
  password: string;
}

// 2. Definimos a interface User, de acordo com o que o backend retorna
export interface User {
  id: string;
  email: string;
  role: string;
}

/**
 * 3. Função login:
 *    - Recebe e-mail e senha.
 *    - Envia requisição POST para '/auth/login'.
 *    - Retorna o objeto User com os dados do usuário em caso de sucesso.
 */
export const login = async (
  email: string,
  password: string
): Promise<User> => {
  const payload: LoginPayload = { email, password };

  // Chama o endpoint de login e assume que o servidor retorna apenas o usuário
  const response = await api.post<User>('/auth/login', payload);

  // Retorna o usuário diretamente
  return response.data;
};
