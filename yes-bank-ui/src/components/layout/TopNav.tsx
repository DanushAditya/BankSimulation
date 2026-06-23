import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { NotificationsRounded as NotificationsRoundedIcon } from '@mui/icons-material';
import { DarkModeRounded as DarkModeRoundedIcon } from '@mui/icons-material';
import { LightModeRounded as LightModeRoundedIcon } from '@mui/icons-material';
import { MenuRounded as MenuRoundedIcon } from '@mui/icons-material';
import { LogoutRounded as LogoutRoundedIcon } from '@mui/icons-material';
import { PersonRounded as PersonRoundedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/authStore';
import { getInitials } from '../../utils/format';

interface TopNavProps {
  title: string;
  onMenuClick?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ title, onMenuClick }) => {
  const navigate = useNavigate();
  const { role, account, logout } = useAuthStore();
  const { darkMode, toggleDark } = useThemeStore();
  const isMobile = useMediaQuery('(max-width:767px)');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const displayName = role === 'admin' ? 'Administrator' : (account?.name ?? 'Customer');
  const displayEmail = role === 'admin' ? 'admin@yesbank.in' : (account?.email ?? '');

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  return (
    <Box className="topnav">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {isMobile && (
          <IconButton onClick={onMenuClick} aria-label="Open menu">
            <MenuRoundedIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Dark mode toggle */}
        <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
          <IconButton onClick={toggleDark} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            {darkMode ? (
              <LightModeRoundedIcon sx={{ color: 'text.secondary' }} />
            ) : (
              <DarkModeRoundedIcon sx={{ color: 'text.secondary' }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton aria-label="Notifications">
            <Badge badgeContent={0} color="error">
              <NotificationsRoundedIcon sx={{ color: 'text.secondary' }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Profile dropdown */}
        <Tooltip title="Account">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
            aria-label="Open account menu"
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {getInitials(displayName)}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: { mt: 1, minWidth: 220, borderRadius: 3 },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={700}>{displayName}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Inter' }}>
              {displayEmail}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)} aria-label="Profile">
            <PersonRoundedIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout} aria-label="Logout" sx={{ color: 'error.main' }}>
            <LogoutRoundedIcon sx={{ fontSize: 18, mr: 1.5 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};
