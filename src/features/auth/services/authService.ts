import { api } from '@/shared/utils/api';
import { LoginDto, AuthResponse } from '../types/auth.types';

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  console.log('Datos del backend ', response);
  return response.data;
};
