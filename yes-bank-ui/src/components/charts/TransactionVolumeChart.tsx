import React, { useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { Transaction } from '../../types';
import { formatShortDate } from '../../utils/format';
import { GlassCard } from '../ui/GlassCard';
import { BarChart as BarChartIcon } from '@mui/icons-material';

interface Props {
  transactions: Transaction[];
}

export const TransactionVolumeChart: React.FC<Props> = ({ transactions }) => {
  const data = useMemo(() => {
    if (!transactions.length) return [];

    // Get last 7 unique days
    const dayMap: Record<string, number> = {};
    transactions.forEach((t) => {
      const day = t.timestamp.slice(0, 10);
      dayMap[day] = (dayMap[day] ?? 0) + 1;
    });

    return Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([date, count]) => ({
        date: formatShortDate(date + 'T00:00:00'),
        count,
      }));
  }, [transactions]);

  return (
    <GlassCard delay={0.3}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Transaction Volume
      </Typography>
      {data.length === 0 ? (
        <Box className="empty-state">
          <BarChartIcon sx={{ fontSize: 48, color: 'text.muted', opacity: 0.4 }} />
          <Typography variant="body2" color="text.secondary">
            No transactions yet
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(37,99,235,0.08)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(37,99,235,0.15)',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(37,99,235,0.12)',
                fontSize: 12,
              }}
              formatter={(val) => [val, 'Transactions']}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#2563EB"
              strokeWidth={2.5}
              fill="url(#volumeGrad)"
              dot={{ r: 3, fill: '#2563EB', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
};
