import { useAuthStore } from '@/features/auth/store/auth.store';
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export default function RedirectIfAuthenticated({ children }: { children: JSX.Element }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (user?.mustChangePassword) {
      return <Navigate to="/general/change-password" replace />;
    }

    const role = user?.role?.name?.toUpperCase();

    switch (role) {
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      case 'CLIENT':
        return <Navigate to="/client/dashboard" replace />;
      case 'WORKER':
        return <Navigate to="/worker/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}
