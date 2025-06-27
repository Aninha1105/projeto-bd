// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, User as ApiUser } from '../api/auth';

// Ajusta o shape do usuário para nossa aplicação
export interface AuthUser {
  id: ApiUser['id_usuario'];
  email: ApiUser['email'];
  role: ApiUser['tipo'];
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ao montar, carrega usuário do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const apiUser = await loginService(email, password);
      // Mapeia propriedades retornadas pelo backend para o nosso AuthUser
      const authUser: AuthUser = {
        id: apiUser.id_usuario,
        email: apiUser.email,
        role: apiUser.tipo,
      };
      setUser(authUser);
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      return true;
    } catch (err) {
      console.error('Login error', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
