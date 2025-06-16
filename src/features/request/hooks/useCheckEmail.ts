import { useCallback } from 'react';
import { api } from '@/shared/utils/api';
import { apiRequest } from '@/shared/utils/apiHelper';

export function useCheckEmail() {
  return useCallback(async (email: string): Promise<boolean> => {
    const response = await apiRequest<{ emailExists:{emailExists : boolean} }>(
      api.get(`/auth/check-email?email=${encodeURIComponent(email)}`),
      {
        loading: 'Verificando correo...',
        error: 'Error al verificar el correo',
      }
    );

    console.log("Respuesta de verificacion " , response);
    console.log("Respuesta de verificacion " + response.emailExists.emailExists);

    return response.emailExists.emailExists;
  }, []);
}