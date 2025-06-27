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
import EquipmentLoanListPage from '@/features/equipment-loan/pages/EquipmentLoanListPage';
import MainLayout from '@/shared/layouts/MainLayout';
import WorkerDashboard from '@/features/worker/pages/WorkerDashboard';
import WorkerLayout from '@/features/worker/layouts/WorkerLayout';
import ClientDashboardPage from '@/features/client/pages/ClientDashBoard';
import EquipmentGeneral from '@/features/equipment/pages/EquipmentGeneral';
import PersonalDataPage from '@/features/equipment/components/general/PersonalDataPage';
import ClientFinancingStatusPage from '@/features/client/pages/ClientFinancingStatusPage';
import ClientLoanListPage from '@/features/client/pages/ClientLoanListPage';
import ClientHelpPage from '@/features/client/pages/ClientHelpPage';
import ChangePasswordPage from '@/features/auth/pages/ChangePasswordPage';
import AuthLayout from '@/shared/layouts/AuthLayout';
import AdminRequestListPage from '@/features/admin/pages/AdminRequestListPage';
import ClientRequestListPage from '@/features/client/pages/ClientRequestListPage';
import ClientRequestDetailPage from '@/features/client/pages/ClientRequestDetailPage';
import EquipmentLoanDetailPage from '@/features/equipment-loan/pages/EquipmentLoanDetailPage';
import AdminGeneralCategoryPage from '@/features/general-category/pages/AdminGeneralCategoryPage';
import AdminBrandPage from '@/features/brand/pages/AdminBrandPage';
import { RequestWizardPage } from '@/features/request/pages/RequestWizardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/equipment', element: <EquipmentGeneral /> },
      { path: '/financing/personal-data', element: <PersonalDataPage /> },
      { path: '/simulator', element: <SimulatorPage /> },
    ],
  },
  {
    path: '/general',
    element: <AuthLayout />,
    children: [
      { path: 'change-password', element: <ChangePasswordPage /> },
      { path: 'request-wizard',element: <RequestWizardPage /> },
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
      { path: 'requests', element: <AdminRequestListPage /> },
      { path: 'cash-loans', element: <CashLoanListPage /> },
      { path: 'equipment', element: <EquipmentListPage /> },
      { path: 'equipment-status', element: <EquipmentStatusListPage /> },
      { path: 'equipment-categories', element: <EquipmentCategoryListPage /> },
      { path: 'equipment-feature', element: <EquipmentFeatureListPage /> },
      { path: 'equipment-financing', element: <EquipmentFinancingListPage /> },
      { path: 'equipment-loans', element: <EquipmentLoanListPage /> },
      { path: 'general-categories', element: <PrivateRoute><AdminGeneralCategoryPage /></PrivateRoute> },
      { path: 'brands', element: <PrivateRoute><AdminBrandPage /></PrivateRoute> },
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
      { path: '', element: <ClientDashboardPage /> },
      { path: 'requests', element: <ClientRequestListPage /> },
      { path: 'requests/:requestId', element: <ClientRequestDetailPage /> },
      { path: 'help', element: <ClientHelpPage /> },
      { path: 'financing-status', element: <ClientFinancingStatusPage /> },
      { path: 'loans', element: <ClientLoanListPage /> },
      { path: 'cash-loans', element: <CashLoanListPage /> },
      { path: 'equipment-financing', element: <EquipmentFinancingListPage /> },
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
      { path: 'equipment-loans', element: <EquipmentLoanListPage /> },
    ],
  },
  {
    path: '/equipment-loans/:id',
    element: <PrivateRoute><EquipmentLoanDetailPage /></PrivateRoute>
  },
]);
