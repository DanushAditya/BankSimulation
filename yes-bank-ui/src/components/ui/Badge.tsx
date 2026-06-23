import React from 'react';
import { Chip } from '@mui/material';
import type { TransactionType, TransactionStatus } from '../../types';

type BadgeType = TransactionType | TransactionStatus;

const colorMap: Record<BadgeType, { color: 'success' | 'error' | 'primary' | 'warning' | 'default'; label: string }> = {
  DEPOSIT: { color: 'success', label: 'Deposit' },
  WITHDRAWAL: { color: 'error', label: 'Withdrawal' },
  TRANSFER: { color: 'primary', label: 'Transfer' },
  SUCCESS: { color: 'success', label: 'Success' },
  FAILED: { color: 'error', label: 'Failed' },
};

interface BadgeProps {
  type: BadgeType;
}

export const Badge: React.FC<BadgeProps> = ({ type }) => {
  const { color, label } = colorMap[type] ?? { color: 'default' as const, label: type };
  return <Chip label={label} color={color} size="small" />;
};
