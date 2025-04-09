import ClientLayout from '@/features/client/layouts/ClientLayout';
import PrivateRoute from './PrivateRoute';
import LoginPage from '@/features/auth/pages/LoginPage';
import HomePage from '@/features/home/pages/HomePage';
import AdminLayout from '@/shared/layouts/AdminLayout';
import MainLayout from '@/shared/layouts/MainLayout';
import AdminDashboard from '@/features/admin/pages/AdminDashboard';
import ClientHomePage from '@/features/client/pages/ClientHomePage';
import { createBrowserRouter } from 'react-router-dom';
import SimulatorPage from '@/features/simulator/pages/SimulatorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage/> },
      { path: '/simulator', element: <SimulatorPage/> },
    ],
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute roles={['ADMIN']}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
    ],
  },
  {
    path: '/client',
    element: (
      <PrivateRoute roles={['CLIENT']}>
        <ClientLayout />
      </PrivateRoute>
    ),
    children: [
      { path: 'home', element: <ClientHomePage /> },
    ],
  },
]);
