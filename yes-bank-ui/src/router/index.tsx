// YES BANK — React Router v6 configuration
// Admin routes require role='admin', customer routes require role='customer'

import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Pages
import { Login } from '../pages/Login';
import { Shell } from '../components/layout/Shell';

// Admin pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { Customers } from '../pages/admin/Customers';
import { Transactions } from '../pages/admin/Transactions';
import { CreateAccount } from '../pages/admin/CreateAccount';
import { Analytics } from '../pages/admin/Analytics';

// Customer pages
import { CustomerOverview } from '../pages/customer/CustomerOverview';
import { CustomerDeposit } from '../pages/customer/CustomerDeposit';
import { CustomerTransfer } from '../pages/customer/CustomerTransfer';
import { CustomerHistory } from '../pages/customer/CustomerHistory';

/* ─────────────── Guards ─────────────── */

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const role = useAuthStore((s) => s.role);
  if (role !== 'admin') return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const CustomerGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const role = useAuthStore((s) => s.role);
  if (role !== 'customer') return <Navigate to="/login" replace />;
  return <>{children}</>;
};

/* ─────────────── Router ─────────────── */

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  // Admin routes
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <Shell />
      </AdminGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'customers', element: <Customers /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'create-account', element: <CreateAccount /> },
      { path: 'analytics', element: <Analytics /> },
    ],
  },
  // Customer routes
  {
    path: '/customer',
    element: (
      <CustomerGuard>
        <Shell />
      </CustomerGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/customer/overview" replace /> },
      { path: 'overview', element: <CustomerOverview /> },
      { path: 'deposit', element: <CustomerDeposit /> },
      { path: 'transfer', element: <CustomerTransfer /> },
      { path: 'history', element: <CustomerHistory /> },
    ],
  },
  // Catch-all
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;
