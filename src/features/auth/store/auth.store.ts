// src/shared/store/authStore.ts
import { create } from 'zustand';
import { User } from '../types/auth.types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (payload: { token: string; user: User }) => void;
  logout: () => void;
}

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
console.log('user del local storage', user);

export const useAuthStore = create<AuthState>((set) => ({
    token: token,
    user: (user) ? JSON.parse(user) : null,
    isAuthenticated: false,
  
    setAuth: ({ token, user }) => {
      // 👉 Guardamos el token en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
  
      set({ token, user, isAuthenticated: true });
    },
  
    logout: () => {
      // 🧼 Limpiamos localStorage al cerrar sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  
      set({ token: null, user: null, isAuthenticated: false });
    },
  }));
  
