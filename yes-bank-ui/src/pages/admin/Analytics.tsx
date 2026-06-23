import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Skeleton, Alert, Button,
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
} from 'recharts';
import toast from 'react-hot-toast';
import { PeopleRounded as PeopleRoundedIcon } from '@mui/icons-material';
import { AccountBalanceWalletRounded as AccountBalanceWalletRoundedIcon } from '@mui/icons-material';
import { SwapHorizRounded as SwapHorizRoundedIcon } from '@mui/icons-material';
import { BarChartRounded as BarChartRoundedIcon } from '@mui/icons-material';
import { bankApi } from '../../api/bankApi';
import type { Account, Transaction } from '../../types';
import { formatCurrency, formatMonth } from '../../utils/format';
import { StatCard } from '../../components/ui/StatCard';
import { GlassCard } from '../../components/ui/GlassCard';

const TOOLTIP_STYLE = {
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(37,99,235,0.15)',
  borderRadius: 12,
  boxShadow: '0 8px 24px rgba(37,99,235,0.12)',
  fontSize: 12,
};

export const Analytics: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [allTxns, setAllTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const accs = await bankApi.getAllAccounts();
      setAccounts(accs);
      const histories = await Promise.all(accs.map((a) => bankApi.getHistory(a.accountNumber).catch(() => [])));
      const flat = histories.flat();
      const seen = new Set<number>();
      setAllTxns(flat.filter((t) => { if (seen.has(t.id)) return false; seen.add(t.id); return true; }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed';
      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const monthlyData = React.useMemo(() => {
    const map: Record<string, number> = {};
    allTxns.forEach((t) => {
      const m = formatMonth(t.timestamp);
      map[m] = (map[m] ?? 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  }, [allTxns]);

  const balanceData = accounts.map((a) => ({ name: a.name.split(' ')[0], balance: a.balance }));
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <Box>
      <Box className="stats-grid" sx={{ mb: 3 }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: 3 }} />)
          : (
            <>
              <StatCard icon={PeopleRoundedIcon} label="Total Customers" value={accounts.length} delay={0} />
              <StatCard icon={SwapHorizRoundedIcon} label="Total Transactions" value={allTxns.length} delay={0.08} />
              <StatCard icon={AccountBalanceWalletRoundedIcon} label="Total Balance" value={totalBalance} delay={0.16} isCurrency />
              <StatCard icon={BarChartRoundedIcon} label="Active Accounts" value={accounts.filter(a => a.balance > 0).length} delay={0.24} />
            </>
          )
        }
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} action={<Button onClick={load} size="small">Retry</Button>}>{error}</Alert>}

      <Box className="charts-grid">
        <GlassCard delay={0.3}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Monthly Transaction Volume</Typography>
          {monthlyData.length === 0 ? (
            <Box className="empty-state">
              <BarChartRoundedIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              <Typography variant="body2" color="text.secondary">No data yet</Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(37,99,235,0.08)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <RTooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [v, 'Transactions']} />
                <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        <GlassCard delay={0.35}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Balance by Account</Typography>
          {balanceData.length === 0 ? (
            <Box className="empty-state">
              <BarChartRoundedIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              <Typography variant="body2" color="text.secondary">No accounts yet</Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={balanceData} margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(37,99,235,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <RTooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [formatCurrency(v as number), 'Balance']} />
                <Bar dataKey="balance" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCard>
      </Box>

      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', mt: 1 }}>
        Analytics reflect all data currently in the system
      </Typography>
    </Box>
  );
};
