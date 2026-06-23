import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

import type { SvgIconComponent } from '@mui/icons-material';
import { useCountUp } from '../../utils/format';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  icon: SvgIconComponent;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  delay?: number;
  isCurrency?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  prefix = '',
  suffix = '',
  color = '#2563EB',
  delay = 0,
  isCurrency = false,
}) => {
  const animatedValue = useCountUp(Math.round(value), 1200);

  const displayValue = isCurrency
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(animatedValue)
    : `${prefix}${animatedValue.toLocaleString('en-IN')}${suffix}`;

  return (
    <GlassCard delay={delay}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: `${color}18`,
            width: 52,
            height: 52,
            border: `1.5px solid ${color}30`,
          }}
        >
          <Icon sx={{ color, fontSize: 26 }} />
        </Avatar>
        <Box
          sx={{
            px: 1.2,
            py: 0.4,
            borderRadius: 2,
            bgcolor: 'success.light',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 700, fontSize: '0.7rem' }}>
            ↑ Live
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'text.primary',
          mb: 0.5,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.2,
        }}
      >
        {displayValue}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
        {label}
      </Typography>
    </GlassCard>
  );
};
