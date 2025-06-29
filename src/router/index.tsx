import { RouteObject } from 'react-router-dom';
import MainLayout from '@/shared/layouts/MainLayout';
import AuthLayout from '@/shared/layouts/AuthLayout';
import HomePage from '@/features/home/pages/HomePage';
import LoginPage from '@/features/auth/pages/LoginPage';
import ChangePasswordPage from '@/features/auth/pages/ChangePasswordPage';
import RecoverPasswordPage from '@/features/auth/pages/RecoverPasswordPage';
import AdminLayout from '@/features/admin/pages/AdminLayout';
import AdminDashboard from '@/features/admin/pages/AdminDashboard';
import AdminRequestListPage from '@/features/admin/pages/AdminRequestListPage';
import AdminBrandPage from '@/features/brand/pages/AdminBrandPage';
import AdminGeneralCategoryPage from '@/features/general-category/pages/AdminGeneralCategoryPage';
import EquipmentCategoryListPage from '@/features/equipment-category/pages/EquipmentCategoryListPage';
import EquipmentStatusListPage from '@/features/equipment-status/pages/EquipmentStatusListPage';
import EquipmentFeatureListPage from '@/features/equipment-feature/pages/EquipmentFeatureListPage';
import EquipmentListPage from '@/features/equipment/pages/EquipmentListPage';
import ClientLayout from '@/features/client/layouts/ClientLayout';
import ClientHomePage from '@/features/client/pages/ClientHomePage';
import ClientDashBoardPage from '@/features/client/pages/ClientDashBoardPage';
import ClientRequestListPage from '@/features/client/pages/ClientRequestListPage';
import ClientRequestDetailPage from '@/features/client/pages/ClientRequestDetailPage';
import ClientListPage from '@/features/client/pages/ClientListPage';
import UserListPage from '@/features/user/pages/UserListPage';
import PrivateRoute from './PrivateRoute';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';
import WorkerLayout from '@/features/worker/layouts/WorkerLayout';
import WorkerDashboard from '@/features/worker/pages/WorkerDashboard';
import UpdateProfilePage from '@/features/profile/pages/UpdateProfilePage';
import SimulatorPage from '@/features/simulator/pages/SimulatorPage';
import EquipmentGeneral from '@/features/equipment/pages/EquipmentGeneral';
import RequestFormPage from '@/features/request/pages/RequestFormPage';
import AdminRequestFormPage from '@/features/request/pages/AdminRequestFormPage';
import RequestWizardPage from '@/features/request/pages/RequestWizardPage';
import AdminCashLoanListPage from '@/features/cash-loans/pages/AdminCashLoanListPage';
import AdminEquipmentLoanListPage from '@/features/equipment-loan/pages/EquipmentLoanListPage';
import AdminEquipmentFinancingListPage from '@/features/equipment-financing/pages/EquipmentFinancingListPage';
import CashLoanListPage from '@/features/client/pages/CashLoanListPage';
import EquipmentLoanListPage from '@/features/client/pages/EquipmentLoanListPage';
import EquipmentFinancingListPage from '@/features/client/pages/EquipmentFinancingListPage';
import ClientHelpPage from '@/features/client/pages/ClientHelpPage';
import ClientFinancingStatusPage from '@/features/client/pages/ClientFinancingStatusPage';

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/simulador', element: <SimulatorPage /> },
      { path: '/equipment', element: <EquipmentGeneral /> },
      //{ path: '/solicitud', element: <RequestWizardPage /> },
      //{ path: '/request-wizard', element: <RequestWizardPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        ),
      },
      { path: '/recover-password', element: <RecoverPasswordPage /> },
    ],
  },
  {
    path: '/general',
    children: [
      { path: 'change-password', element: <ChangePasswordPage /> },
      { path: 'request-wizard', element: <RequestWizardPage /> },
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
      { path: 'requests', element: <AdminRequestListPage /> },
      { path: 'brands', element: <AdminBrandPage /> },
      { path: 'general-categories', element: <AdminGeneralCategoryPage /> },
      { path: 'equipment-categories', element: <EquipmentCategoryListPage /> },
      { path: 'equipment-status', element: <EquipmentStatusListPage /> },
      { path: 'equipment-features', element: <EquipmentFeatureListPage /> },
      { path: 'equipment', element: <EquipmentListPage /> },
      { path: 'equipment-loans', element: <AdminEquipmentLoanListPage /> },
      { path: 'equipment-financing', element: <AdminEquipmentFinancingListPage /> },
      { path: 'cash-loans', element: <AdminCashLoanListPage /> },
      { path: 'clients', element: <ClientListPage /> },
      { path: 'users', element: <UserListPage /> },
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
      { path: 'dashboard', element: <ClientDashBoardPage /> },
      { path: 'requests', element: <ClientRequestListPage /> },
      { path: 'requests/:id', element: <ClientRequestDetailPage /> },
      { path: 'requests/new', element: <RequestFormPage /> },
      { path: 'cash-loans', element: <CashLoanListPage /> },
      { path: 'equipment-loans', element: <EquipmentLoanListPage /> },
      { path: 'equipment-financing', element: <EquipmentFinancingListPage /> },
      { path: 'help', element: <ClientHelpPage /> },
      { path: 'financing-status', element: <ClientFinancingStatusPage /> },
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
    ],
  },
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <UpdateProfilePage />
      </PrivateRoute>
    ),
  },
];
