import { useAuthStore } from '@/features/auth/store/auth.store';
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
  roles?: string[]; // Roles permitidos
}

export default function PrivateRoute({ children, roles }: Props) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.name?.toUpperCase();

  if (roles && (!userRole || !roles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace />; // o simplemente "/"
  }

  return children;
}
