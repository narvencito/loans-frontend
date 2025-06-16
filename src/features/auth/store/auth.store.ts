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
const storedUser = localStorage.getItem('user');
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

export const useAuthStore = create<AuthState>((set) => ({
  token,
  user: parsedUser,
  isAuthenticated: !!token && !!parsedUser,

  setAuth: ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));