import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth.types';
import { authService } from '../services/authService';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token: string, refreshToken: string, user: User) =>
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
      logout: async () => {
          get().clearAuth();
      },
      getRefreshToken: () => get().refreshToken,
    }),
    {
      name: 'auth-storage',
    }
  )
);