import React, { useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import type { Transaction } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { DonutLargeRounded as DonutLargeRoundedIcon } from '@mui/icons-material';

const COLORS: Record<string, string> = {
  DEPOSIT: '#10B981',
  WITHDRAWAL: '#EF4444',
  TRANSFER: '#2563EB',
};

const RADIAN = Math.PI / 180;
const renderLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: any) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface Props {
  transactions: Transaction[];
}

export const TransactionTypeChart: React.FC<Props> = ({ transactions }) => {
  const data = useMemo(() => {
    const counts: Record<string, number> = { DEPOSIT: 0, WITHDRAWAL: 0, TRANSFER: 0 };
    transactions.forEach((t) => {
      counts[t.transactionType] = (counts[t.transactionType] ?? 0) + 1;
    });
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <GlassCard delay={0.35}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Transaction Types
      </Typography>
      {data.length === 0 ? (
        <Box className="empty-state">
          <DonutLargeRoundedIcon sx={{ fontSize: 48, opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            No data yet
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderLabel}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name] ?? '#94A3B8'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(37,99,235,0.15)',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(37,99,235,0.12)',
                fontSize: 12,
              }}
              formatter={(val, name) => [`${val} transactions`, name]}
            />
            <Legend
              formatter={(value) => (
                <span style={{ fontSize: 12, fontWeight: 600 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
};
