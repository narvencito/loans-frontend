import { LoginDto, AuthResponse, ChangePasswordDto, RefreshTokenRequest, RefreshTokenResponse } from '../types/auth.types';
import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    try {
      return await apiRequest(
        api.post('/auth/login', credentials),
        {
          loading: 'Iniciando sesión...',
          error: 'Error al iniciar sesión',
        }
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new AuthError('Credenciales inválidas');
      }
      throw error;
    }
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    try {
      return await apiRequest(
        api.post('/auth/refresh-token', data),
        {
          error: 'Error al refrescar el token',
        }
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new AuthError('Sesión expirada');
      }
      throw new AuthError('Error al refrescar la sesión');
    }
  },

  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    try {
      return await apiRequest(
        api.post('/auth/change-password', data),
        {
          loading: 'Cambiando contraseña...',
          success: 'Contraseña cambiada exitosamente',
          error: 'Error al cambiar la contraseña',
        }
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new AuthError('No autorizado para cambiar la contraseña');
      }
      throw error;
    }
  },

};
