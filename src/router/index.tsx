import ClientLayout from '@/features/client/layouts/ClientLayout';
import PrivateRoute from './PrivateRoute';
import LoginPage from '@/features/auth/pages/LoginPage';
import HomePage from '@/features/home/pages/HomePage';
import GeneralLayout from '@/shared/layouts/GeneralLayout';
import MainLayout from '@/shared/layouts/MainLayout';
import AdminDashboard from '@/features/admin/pages/AdminDashboard';
import ClientHomePage from '@/features/client/pages/ClientHomePage';
import { createBrowserRouter } from 'react-router-dom';
import SimulatorPage from '@/features/simulator/pages/SimulatorPage';
import UserListPage from '@/features/user/pages/UserListPage';
import AdminLayout from '@/features/admin/pages/AdminLayout';
import ClientListPage from '@/features/client/pages/ClientListPage';
import CashLoanListPage from '@/features/cash-loans/pages/CashLoanListPage';
import EquipmentListPage from '@/features/equipment/pages/EquipmentListPage';
import EquipmentStatusListPage from '@/features/equipment-status/pages/EquipmentStatusListPage';
import EquipmentCategoryListPage from '@/features/equipment-category/pages/EquipmentCategoryListPage';

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
      { path: 'users', element: <UserListPage /> },
      { path: 'clients', element: <ClientListPage /> },
      { path: 'cash-loans', element: <CashLoanListPage /> },
      { path: 'equipment', element: <EquipmentListPage /> },
      { path: 'equipment-status', element: <EquipmentStatusListPage /> },
      { path: 'equipment-category', element: <EquipmentCategoryListPage /> },
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
