import { useState } from 'react';
import { LoginDto } from '@/features/auth/types/auth.types';
import { login } from '../services/authService';

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const loginUser = async (credentials: LoginDto) => {
    setLoading(true);
    try {
      const data = await login(credentials);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading };
}
