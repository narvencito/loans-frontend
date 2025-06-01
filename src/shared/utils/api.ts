import axios from 'axios';
import { useLoaderStore } from '../store/loader.store';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use(
  (config) => {
    useLoaderStore.getState().show();
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

     const isFormData = config.data instanceof FormData;
    if (!isFormData && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    useLoaderStore.getState().hide();

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
  (error) => {
    useLoaderStore.getState().hide();
    const message =
      error.response?.data?.message ||
      error.message ||
      'Error de red o servidor.';

    if (error.response?.status === 401) {
      console.warn('Sesión expirada, redirigiendo...');
    }

    return Promise.reject({ message });
  }
);
