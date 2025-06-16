import { api } from '@/shared/utils/api';
import { LoginDto, AuthResponse, ChangePasswordDto } from '../types/auth.types';
import { apiRequest } from '@/shared/utils/apiHelper';

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  console.log('Datos del backend ', response);
  return response.data;
};

export const changePassword = async (data: ChangePasswordDto): Promise<void> => {
  return apiRequest(
    api.post('/auth/change-password', data),
    {
      loading: 'Actualizando contraseña...',
      success: 'Contraseña actualizada correctamente',
      error: 'No se pudo actualizar la contraseña',
    }
  );
};
