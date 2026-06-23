import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { AnimatePresence, motion } from 'framer-motion';

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/customers': 'Customers',
  '/admin/transactions': 'Transactions',
  '/admin/create-account': 'Create Account',
  '/admin/analytics': 'Analytics',
  '/customer/overview': 'Overview',
  '/customer/deposit': 'Deposit',
  '/customer/transfer': 'Transfer',
  '/customer/history': 'Transaction History',
};

export const Shell: React.FC = () => {
  const location = useLocation();
  const isTablet = typeof window !== 'undefined' && window.innerWidth <= 1023;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const title = PAGE_TITLES[location.pathname] ?? 'YES BANK';

  return (
    <Box className="shell">
      {/* Desktop Sidebar */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Sidebar collapsed={isTablet} />
      </Box>

      {/* Mobile Drawer */}
      <Box
        component="nav"
        sx={{ display: { xs: 'block', sm: 'none' } }}
        aria-label="Mobile navigation"
      >
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 200,
            display: mobileNavOpen ? 'block' : 'none',
          }}
          onClick={() => setMobileNavOpen(false)}
        />
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: 260,
            zIndex: 201,
            transform: mobileNavOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
          }}
        >
          <Sidebar collapsed={false} />
        </Box>
      </Box>

      {/* Main Content */}
      <Box className="shell-main">
        <TopNav title={title} onMenuClick={() => setMobileNavOpen(true)} />
        <Box className="shell-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ height: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};
