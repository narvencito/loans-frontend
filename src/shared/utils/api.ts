import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { handleTokenRefresh, isTokenExpired } from '@/utils/tokenUtils';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor para las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    
    // Si hay un token y está expirado, intentar refrescarlo antes de la solicitud
    if (token && isTokenExpired(token)) {
      return handleTokenRefresh()
        .then((newToken) => {
          config.headers.Authorization = `Bearer ${newToken}`;
          return config;
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const isFormData = config.data instanceof FormData;
    if (!isFormData && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
api.interceptors.response.use(
  (response) => {
    const contentType = response.headers['content-type'];

    // Si es un PDF (blob), lo devolvemos tal cual
    if (contentType && contentType.includes('application/pdf')) {
      return response;
    }
    
    const res = response.data;

    if (res?.success === true) {
      return res; 
    }

    return Promise.reject({
      message: res?.message || 'Error desconocido',
      status: response.status,
    });
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await handleTokenRefresh();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, el handleTokenRefresh ya se encarga de limpiar la autenticación
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
