import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, TextField, InputAdornment, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Skeleton, Alert, Button, ToggleButtonGroup, ToggleButton, Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AccountBalanceWalletRounded as AccountBalanceWalletRoundedIcon } from '@mui/icons-material';
import { CallReceivedRounded as CallReceivedRoundedIcon } from '@mui/icons-material';
import { SwapHorizRounded as SwapHorizRoundedIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { bankApi } from '../../api/bankApi';
import type { Transaction, TransactionType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { GlassCard } from '../../components/ui/GlassCard';

interface OpCardProps {
  id: string;
  icon: React.ElementType;
  title: string;
  color: string;
  action: (acn: string, amount: number) => Promise<number>;
  label: string;
  successMsg: (v: number) => string;
}

const OpCard: React.FC<OpCardProps> = ({ icon: Icon, title, color, action, label, successMsg }) => {
  const [acn, setAcn] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handle = async () => {
    const amtNum = parseFloat(amount);
    if (!acn.trim()) { setResult({ type: 'error', msg: 'Enter account number' }); return; }
    if (!amount || isNaN(amtNum) || amtNum <= 0) { setResult({ type: 'error', msg: 'Enter valid positive amount' }); return; }
    setLoading(true);
    setResult(null);
    try {
      const newBal = await action(acn.trim(), amtNum);
      setResult({ type: 'success', msg: successMsg(newBal) });
      setAcn(''); setAmount('');
    } catch (err) {
      setResult({ type: 'error', msg: err instanceof Error ? err.message : 'Operation failed' });
    } finally {
      setLoading(false);
      setTimeout(() => setResult(null), 5000);
    }
  };

  return (
    <GlassCard>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon sx={{ color, fontSize: 22 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
      </Box>
      <TextField label="Account Number" value={acn} onChange={(e) => setAcn(e.target.value)} size="small" sx={{ mb: 1.5 }} />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        size="small"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
        }}
      />
      <LoadingButton variant="contained" fullWidth loading={loading} onClick={handle} aria-label={label}>{label}</LoadingButton>
      {result && (
        <Alert severity={result.type} sx={{ mt: 1.5, borderRadius: 2 }} onClose={() => setResult(null)}>
          {result.msg}
        </Alert>
      )}
    </GlassCard>
  );
};

const TransferCard: React.FC = () => {
  const [fromAcn, setFromAcn] = useState('');
  const [toAcn, setToAcn] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handle = async () => {
    const amtNum = parseFloat(amount);
    if (!fromAcn.trim() || !toAcn.trim()) { setResult({ type: 'error', msg: 'Enter both account numbers' }); return; }
    if (fromAcn.trim() === toAcn.trim()) { setResult({ type: 'error', msg: 'Cannot transfer to same account' }); return; }
    if (!amount || isNaN(amtNum) || amtNum <= 0) { setResult({ type: 'error', msg: 'Enter valid amount' }); return; }
    setLoading(true); setResult(null);
    try {
      const msg = await bankApi.transfer(fromAcn.trim(), toAcn.trim(), amtNum);
      setResult({ type: 'success', msg: msg || 'Transfer successful!' });
      setFromAcn(''); setToAcn(''); setAmount('');
    } catch (err) {
      setResult({ type: 'error', msg: err instanceof Error ? err.message : 'Transfer failed' });
    } finally {
      setLoading(false);
      setTimeout(() => setResult(null), 5000);
    }
  };

  return (
    <GlassCard>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: '#2563EB18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SwapHorizRoundedIcon sx={{ color: '#2563EB', fontSize: 22 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Transfer Money</Typography>
      </Box>
      <TextField label="From Account" value={fromAcn} onChange={(e) => setFromAcn(e.target.value)} size="small" sx={{ mb: 1.5 }} />
      <TextField label="To Account" value={toAcn} onChange={(e) => setToAcn(e.target.value)} size="small" sx={{ mb: 1.5 }} />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        size="small"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
        }}
      />
      <LoadingButton variant="contained" fullWidth loading={loading} onClick={handle} aria-label="Transfer">Transfer</LoadingButton>
      {result && <Alert severity={result.type} sx={{ mt: 1.5, borderRadius: 2 }} onClose={() => setResult(null)}>{result.msg}</Alert>}
    </GlassCard>
  );
};

const BalanceCard: React.FC = () => {
  const [acn, setAcn] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handle = async () => {
    if (!acn.trim()) { setError('Enter account number'); return; }
    setLoading(true); setBalance(null); setError(null);
    try {
      const bal = await bankApi.getBalance(acn.trim());
      setBalance(bal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account not found');
    } finally { setLoading(false); }
  };

  return (
    <GlassCard>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: '#F59E0B18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AccountBalanceWalletRoundedIcon sx={{ color: '#F59E0B', fontSize: 22 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Check Balance</Typography>
      </Box>
      <TextField label="Account Number" value={acn} onChange={(e) => setAcn(e.target.value)} size="small" sx={{ mb: 2 }} />
      <LoadingButton variant="contained" fullWidth loading={loading} onClick={handle} aria-label="Check Balance">Check Balance</LoadingButton>
      {balance !== null && (
        <Alert severity="success" sx={{ mt: 1.5, borderRadius: 2 }}>
          Current Balance: <strong>{formatCurrency(balance)}</strong>
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2 }} onClose={() => setError(null)}>{error}</Alert>}
    </GlassCard>
  );
};

const OPS = [
  {
    id: 'deposit',
    icon: CallReceivedRoundedIcon,
    title: 'Deposit Money',
    color: '#10B981',
    action: (acn: string, amount: number) => bankApi.deposit(acn, amount),
    label: 'Deposit',
    successMsg: (v: number) => `Deposited successfully. New balance: ${formatCurrency(v)}`,
  },
  {
    id: 'withdraw',
    icon: AccountBalanceWalletRoundedIcon,
    title: 'Withdraw Money',
    color: '#EF4444',
    action: (acn: string, amount: number) => bankApi.withdraw(acn, amount),
    label: 'Withdraw',
    successMsg: (v: number) => `Withdrawn successfully. New balance: ${formatCurrency(v)}`,
  },
];

export const Transactions: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [allTxns, setAllTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [page, setPage] = useState(0);

  const loadAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const accs = await bankApi.getAllAccounts();
      const histories = await Promise.all(accs.map((a) => bankApi.getHistory(a.accountNumber).catch(() => [])));
      const flat = histories.flat();
      const seen = new Set<number>();
      setAllTxns(flat.filter((t) => { if (seen.has(t.id)) return false; seen.add(t.id); return true; }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed';
      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (tab === 1) loadAll(); }, [tab, loadAll]);

  const filtered = allTxns
    .filter((t) => filter === 'ALL' || t.transactionType === filter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const paginated = filtered.slice(page * 10, page * 10 + 10);

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="New Transaction" id="tab-new" aria-controls="tabpanel-new" />
        <Tab label="All Transactions" id="tab-all" aria-controls="tabpanel-all" />
      </Tabs>

      {tab === 0 && (
        <Box role="tabpanel" id="tabpanel-new" aria-labelledby="tab-new">
          <Grid container spacing={3}>
            {OPS.map((op) => (
              <Grid xs={12} md={6} key={op.id}>
                <OpCard {...op} />
              </Grid>
            ))}
            <Grid xs={12} md={6}><TransferCard /></Grid>
            <Grid xs={12} md={6}><BalanceCard /></Grid>
          </Grid>
        </Box>
      )}

      {tab === 1 && (
        <Box role="tabpanel" id="tabpanel-all" aria-labelledby="tab-all">
          <GlassCard delay={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>All Transactions</Typography>
              <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(_, v) => { if (v) { setFilter(v); setPage(0); } }}
                size="small"
              >
                {(['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'] as const).map((f) => (
                  <ToggleButton key={f} value={f} aria-label={f}>{f}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }} action={<Button onClick={loadAll} size="small">Retry</Button>}>{error}</Alert>}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>From Account</TableCell>
                    <TableCell>To Account</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>{Array.from({ length: 6 }).map((__, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>
                      ))
                    : paginated.length === 0
                    ? <TableRow><TableCell colSpan={6}><Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>No transactions found.</Typography></TableCell></TableRow>
                    : paginated.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{t.fromAccountNumber.slice(-6)}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{t.toAccountNumber?.slice(-6) ?? '—'}</TableCell>
                          <TableCell><Badge type={t.transactionType} /></TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(t.amount)}</TableCell>
                          <TableCell><Badge type={t.status} /></TableCell>
                          <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{formatDate(t.timestamp)}</TableCell>
                        </TableRow>
                      ))
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
      )}
    </Box>
  );
};
