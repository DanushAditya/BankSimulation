import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Skeleton, Alert, Button, ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import toast from 'react-hot-toast';
import { SwapHorizRounded as SwapHorizRoundedIcon } from '@mui/icons-material';
import { bankApi } from '../../api/bankApi';
import type { Transaction, TransactionType } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, formatDate } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { GlassCard } from '../../components/ui/GlassCard';

export const CustomerHistory: React.FC = () => {
  const { account } = useAuthStore();
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [page, setPage] = useState(0);

  const load = useCallback(async () => {
    if (!account) return;
    setLoading(true); setError(null);
    try {
      const data = await bankApi.getHistory(account.accountNumber);
      setTxns(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load history';
      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  }, [account?.accountNumber]);

  useEffect(() => { load(); }, [load]);

  const filtered = txns
    .filter((t) => filter === 'ALL' || t.transactionType === filter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const paginated = filtered.slice(page * 10, page * 10 + 10);

  return (
    <Box>
      <GlassCard delay={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Transaction History</Typography>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, v) => { if (v) { setFilter(v); setPage(0); } }}
            size="small"
            aria-label="Filter transactions"
          >
            {(['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'] as const).map((f) => (
              <ToggleButton key={f} value={f} aria-label={f}>{f}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }} action={<Button onClick={load} size="small">Retry</Button>}>{error}</Alert>}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>{Array.from({ length: 5 }).map((__, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>
                  ))
                : paginated.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Box className="empty-state">
                          <SwapHorizRoundedIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                          <Typography variant="body2" color="text.secondary">
                            {filter !== 'ALL' ? `No ${filter.toLowerCase()} transactions found.` : 'No transactions yet. Make your first deposit!'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                : paginated.map((t) => {
                    const isCredit = t.transactionType === 'DEPOSIT' || (t.transactionType === 'TRANSFER' && t.toAccountNumber === account?.accountNumber);
                    return (
                      <TableRow key={t.id}>
                        <TableCell><Badge type={t.transactionType} /></TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.83rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.description || '—'}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: 700, color: isCredit ? 'success.main' : 'error.main' }}
                        >
                          {isCredit ? '+' : '-'}{formatCurrency(t.amount)}
                        </TableCell>
                        <TableCell><Badge type={t.status} /></TableCell>
                        <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{formatDate(t.timestamp)}</TableCell>
                      </TableRow>
                    );
                  })
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
        />
      </GlassCard>
    </Box>
  );
};
