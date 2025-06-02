import ClientLayout from '@/features/client/layouts/ClientLayout';
import PrivateRoute from './PrivateRoute';
import LoginPage from '@/features/auth/pages/LoginPage';
import HomePage from '@/features/home/pages/HomePage';
import AdminDashboard from '@/features/admin/pages/AdminDashboard';
import { createBrowserRouter } from 'react-router-dom';
import SimulatorPage from '@/features/simulator/pages/SimulatorPage';
import UserListPage from '@/features/user/pages/UserListPage';
import AdminLayout from '@/features/admin/pages/AdminLayout';
import ClientListPage from '@/features/client/pages/ClientListPage';
import CashLoanListPage from '@/features/cash-loans/pages/CashLoanListPage';
import EquipmentListPage from '@/features/equipment/pages/EquipmentListPage';
import EquipmentStatusListPage from '@/features/equipment-status/pages/EquipmentStatusListPage';
import EquipmentCategoryListPage from '@/features/equipment-category/pages/EquipmentCategoryListPage';
import EquipmentFeatureListPage from '@/features/equipment-feature/pages/EquipmentFeatureListPage';
import EquipmentFinancingListPage from '@/features/equipment-financing/pages/EquipmentFinancingListPage ';
import MainLayout from '@/shared/layouts/MainLayout';
import WorkerDashboard from '@/features/worker/pages/WorkerDashboard';
import WorkerLayout from '@/features/worker/layouts/WorkerLayout';
import ClientDashboardPage from '@/features/client/pages/ClientDashBoard';
import EquipmentGeneral from '@/features/equipment/pages/EquipmentGeneral';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage/> },
      { path: '/equipment', element: <EquipmentGeneral/> },
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
      { path: 'equipment-feature', element: <EquipmentFeatureListPage /> },
      { path: 'equipment-financing', element: <EquipmentFinancingListPage /> },
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
      { path: 'dashboard', element: <ClientDashboardPage /> },
    ],
  },
  {
    path: '/worker',
    element: (
      <PrivateRoute roles={['WORKER']}>
        <WorkerLayout />
      </PrivateRoute>
    ),
    children: [
      { path: 'dashboard', element: <WorkerDashboard /> },
      { path: 'clients', element: <ClientListPage /> },
      { path: 'cash-loans', element: <CashLoanListPage /> },
      { path: 'equipment', element: <EquipmentListPage /> },
      { path: 'equipment-feature', element: <EquipmentFeatureListPage /> },
      { path: 'equipment-financing', element: <EquipmentFinancingListPage /> },
    ],
  },
]);
