import { useAuthStore } from '@/features/auth/store/auth.store';
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
  roles?: string[]; // Roles permitidos
}

export default function PrivateRoute({ children, roles }: Props) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const userRole = user?.role?.name.toUpperCase();
  console.log(userRole);

  if (roles && !roles.includes(userRole!)) return <Navigate to="/" replace />;

  return children;
}
