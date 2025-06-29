import { useAuthStore } from '@/features/auth/store/auth.store';
import { authService } from '@/features/auth/services/authService';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

export const handleTokenRefresh = () => {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    useAuthStore.getState().clearAuth();
    return Promise.reject(new Error('No refresh token available'));
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  return authService
    .refreshToken({ refresh_token: refreshToken })
    .then((response) => {
      const { access_token, refresh_token } = response;
      useAuthStore.getState().setAuth(
        access_token,
        refresh_token || refreshToken, // Mantener el refresh token anterior si no se recibe uno nuevo
        useAuthStore.getState().user!
      );
      processQueue(null, access_token);
      return access_token;
    })
    .catch((error) => {
      processQueue(error, null);
      useAuthStore.getState().clearAuth();
      throw error;
    })
    .finally(() => {
      isRefreshing = false;
    });
};

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convertir a milisegundos
    return Date.now() >= expirationTime;
  } catch {
    return true;
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convertir a milisegundos
  } catch {
    return null;
  }
};
