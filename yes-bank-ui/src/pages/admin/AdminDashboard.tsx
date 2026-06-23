import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import { PeopleRounded as PeopleRoundedIcon } from '@mui/icons-material';
import { AccountBalanceWalletRounded as AccountBalanceWalletRoundedIcon } from '@mui/icons-material';
import { SwapHorizRounded as SwapHorizRoundedIcon } from '@mui/icons-material';
import { AccountBalanceRounded as AccountBalanceRoundedIcon } from '@mui/icons-material';

import toast from 'react-hot-toast';
import { bankApi } from '../../api/bankApi';
import type { Account, Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { StatCard } from '../../components/ui/StatCard';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { TransactionVolumeChart } from '../../components/charts/TransactionVolumeChart';
import { TransactionTypeChart } from '../../components/charts/TransactionTypeChart';

export const AdminDashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [allTxns, setAllTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accs = await bankApi.getAllAccounts();
      setAccounts(accs);

      const histories = await Promise.all(accs.map((a) => bankApi.getHistory(a.accountNumber).catch(() => [])));
      const flat = histories.flat();
      // Deduplicate by id
      const seen = new Set<number>();
      const unique = flat.filter((t) => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });
      setAllTxns(unique);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load data';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const recentTxns = [...allTxns]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  if (error && !loading) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }} action={<Button onClick={loadData} size="small">Retry</Button>}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Stats */}
      <Box className="stats-grid">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: 3 }} />
          ))
        ) : (
          <>
            <StatCard icon={PeopleRoundedIcon} label="Total Customers" value={accounts.length} delay={0} />
            <StatCard icon={AccountBalanceRoundedIcon} label="Total Accounts" value={accounts.length} delay={0.08} />
            <StatCard icon={AccountBalanceWalletRoundedIcon} label="Total Balance" value={totalBalance} delay={0.16} isCurrency />
            <StatCard icon={SwapHorizRoundedIcon} label="Total Transactions" value={allTxns.length} delay={0.24} />
          </>
        )}
      </Box>

      {/* Charts */}
      <Box className="charts-grid">
        {loading ? (
          <>
            <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
          </>
        ) : (
          <>
            <TransactionVolumeChart transactions={allTxns} />
            <TransactionTypeChart transactions={allTxns} />
          </>
        )}
      </Box>

      {/* Recent Transactions */}
      <GlassCard delay={0.4}>
        <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 700 }}>
          Recent Transactions
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <TableCell key={j}><Skeleton variant="text" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : recentTxns.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box className="empty-state">
                          <SwapHorizRoundedIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                          <Typography variant="body2" color="text.secondary">No transactions yet</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                : recentTxns.map((t, i) => (
                    <TableRow key={t.id}>
                      <TableCell sx={{ color: 'text.muted', fontSize: '0.8rem' }}>{i + 1}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {t.fromAccountNumber.slice(-6)}
                      </TableCell>
                      <TableCell><Badge type={t.transactionType} /></TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatCurrency(t.amount)}
                      </TableCell>
                      <TableCell><Badge type={t.status} /></TableCell>
                      <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                        {formatDate(t.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>
    </Box>
  );
};
