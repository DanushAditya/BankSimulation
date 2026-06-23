import React from 'react';
import { Box, Typography } from '@mui/material';
import { VerifiedUserRounded as VerifiedUserRoundedIcon } from '@mui/icons-material';

interface LogoProps {
  white?: boolean;
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
}

const sizeMap = {
  sm: { icon: 20, yes: '1.1rem', bank: '1rem' },
  md: { icon: 26, yes: '1.5rem', bank: '1.35rem' },
  lg: { icon: 40, yes: '2.4rem', bank: '2.2rem' },
};

export const YesBankLogo: React.FC<LogoProps> = ({ white = false, size = 'md', collapsed = false }) => {
  const s = sizeMap[size];
  const yesColor = white ? '#ffffff' : '#2563EB';
  const bankColor = white ? 'rgba(255,255,255,0.80)' : '#60A5FA';
  const iconColor = white ? '#ffffff' : '#2563EB';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <VerifiedUserRoundedIcon sx={{ color: iconColor, fontSize: s.icon }} />
      {!collapsed && (
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          <Typography
            className="sidebar-logo-text"
            sx={{
              fontWeight: 800,
              fontSize: s.yes,
              color: yesColor,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              fontFamily: '"Inter", system-ui, sans-serif',
            }}
          >
            YES
          </Typography>
          <Typography
            className="sidebar-logo-text"
            sx={{
              fontWeight: 300,
              fontSize: s.bank,
              color: bankColor,
              letterSpacing: '0.1em',
              lineHeight: 1,
              fontFamily: '"Inter", system-ui, sans-serif',
            }}
          >
            BANK
          </Typography>
        </Box>
      )}
    </Box>
  );
};
