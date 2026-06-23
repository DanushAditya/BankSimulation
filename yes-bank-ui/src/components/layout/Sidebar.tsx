import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DashboardRounded as DashboardRoundedIcon } from '@mui/icons-material';
import { PeopleRounded as PeopleRoundedIcon } from '@mui/icons-material';
import { SwapHorizRounded as SwapHorizRoundedIcon } from '@mui/icons-material';
import { PersonAddRounded as PersonAddRoundedIcon } from '@mui/icons-material';
import { BarChartRounded as BarChartRoundedIcon } from '@mui/icons-material';
import { HomeRounded as HomeRoundedIcon } from '@mui/icons-material';
import { AddCircleRounded as AddCircleRoundedIcon } from '@mui/icons-material';
import { SendRounded as SendRoundedIcon } from '@mui/icons-material';
import { HistoryRounded as HistoryRoundedIcon } from '@mui/icons-material';
import { LogoutRounded as LogoutRoundedIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../utils/format';
import { YesBankLogo } from '../ui/YesBankLogo';

const ADMIN_NAV = [
  { icon: DashboardRoundedIcon, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: PeopleRoundedIcon, label: 'Customers', path: '/admin/customers' },
  { icon: SwapHorizRoundedIcon, label: 'Transactions', path: '/admin/transactions' },
  { icon: PersonAddRoundedIcon, label: 'Create Account', path: '/admin/create-account' },
  { icon: BarChartRoundedIcon, label: 'Analytics', path: '/admin/analytics' },
];

const CUSTOMER_NAV = [
  { icon: HomeRoundedIcon, label: 'Overview', path: '/customer/overview' },
  { icon: AddCircleRoundedIcon, label: 'Deposit', path: '/customer/deposit' },
  { icon: SendRoundedIcon, label: 'Transfer', path: '/customer/transfer' },
  { icon: HistoryRoundedIcon, label: 'History', path: '/customer/history' },
];

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, account, logout } = useAuthStore();
  const navItems = role === 'admin' ? ADMIN_NAV : CUSTOMER_NAV;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = role === 'admin' ? 'Administrator' : (account?.name ?? 'Customer');
  const displaySub = role === 'admin' ? 'admin@yesbank.in' : (account?.email ?? '');

  return (
    <Box
      className={`sidebar${collapsed ? ' collapsed' : ''}`}
      component="nav"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Box className="sidebar-logo">
        <YesBankLogo white size={collapsed ? 'sm' : 'md'} collapsed={collapsed} />
      </Box>

      {/* Nav Items */}
      <List className="sidebar-nav" disablePadding>
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/admin/dashboard' && item.path !== '/customer/overview' &&
              location.pathname.startsWith(item.path));

          const btn = (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.3 }}
            >
              <ListItemButton
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 3,
                  minHeight: 48,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1.5 : 2,
                  bgcolor: isActive ? 'rgba(255,255,255,0.95)' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.12)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 40,
                    color: isActive ? '#1D4ED8' : 'rgba(255,255,255,0.85)',
                  }}
                >
                  <item.icon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#1D4ED8' : 'rgba(255,255,255,0.90)',
                      className: 'sidebar-label',
                    }}
                  />
                )}
              </ListItemButton>
            </motion.div>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} title={item.label} placement="right">
                <span>{btn}</span>
              </Tooltip>
            );
          }
          return btn;
        })}
      </List>

      {/* Bottom — Profile */}
      <Box className="sidebar-bottom">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.10)',
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.25)',
              color: '#fff',
              fontWeight: 700,
              width: 38,
              height: 38,
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            {getInitials(displayName)}
          </Avatar>
          {!collapsed && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '0.7rem',
                  fontFamily: 'Inter',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {displaySub}
              </Typography>
            </Box>
          )}
          <Tooltip title="Logout" placement={collapsed ? 'right' : 'top'}>
            <IconButton
              onClick={handleLogout}
              size="small"
              aria-label="Logout"
              sx={{ color: 'rgba(255,255,255,0.70)', '&:hover': { color: '#fff' } }}
            >
              <LogoutRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
