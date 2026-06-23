import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Skeleton, Alert, List,
  ListItem, ListItemAvatar, ListItemText, Avatar,
} from '@mui/material';
import { CallReceivedRounded as CallReceivedRoundedIcon } from '@mui/icons-material';
import { CallMadeRounded as CallMadeRoundedIcon } from '@mui/icons-material';
import { SwapHorizRounded as SwapHorizRoundedIcon } from '@mui/icons-material';
import { CreditCardRounded as CreditCardRoundedIcon } from '@mui/icons-material';
import { AddCircleRounded as AddCircleRoundedIcon } from '@mui/icons-material';
import { SendRounded as SendRoundedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { bankApi } from '../../api/bankApi';
import type { Transaction } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, formatRelative, maskAccount, useCountUp } from '../../utils/format';

import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';

const TXN_ICON: Record<string, { icon: React.ElementType; color: string }> = {
  DEPOSIT: { icon: CallReceivedRoundedIcon, color: '#10B981' },
  WITHDRAWAL: { icon: CallMadeRoundedIcon, color: '#EF4444' },
  TRANSFER: { icon: SwapHorizRoundedIcon, color: '#2563EB' },
};

export const CustomerOverview: React.FC = () => {
  const navigate = useNavigate();
  const { account, updateAccount } = useAuthStore();
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animatedBalance = useCountUp(account?.balance ?? 0);

  const load = useCallback(async () => {
    if (!account) return;
    setLoading(true); setError(null);
    try {
      const [fresh, history] = await Promise.all([
        bankApi.getAccount(account.accountNumber),
        bankApi.getHistory(account.accountNumber),
      ]);
      updateAccount(fresh);
      setTxns(history);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load';
      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  }, [account?.accountNumber]);

  useEffect(() => { load(); }, [load]);

  const recent = [...txns].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
  const lastDeposit = txns.filter((t) => t.transactionType === 'DEPOSIT').sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  const lastWithdrawal = txns.filter((t) => t.transactionType === 'WITHDRAWAL').sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  if (error) return <Alert severity="error" action={<Button onClick={load}>Retry</Button>}>{error}</Alert>;

  return (
    <Box>
      {/* Balance Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box className="balance-hero">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCardRoundedIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 22 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em' }}>YES BANK</Typography>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontStyle: 'italic' }}>VISA</Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 500, mb: 0.5 }}>Available Balance</Typography>
          {loading ? (
            <Skeleton variant="text" width={220} height={60} sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} />
          ) : (
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', mb: 0.5, fontVariantNumeric: 'tabular-nums' }}>
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(animatedBalance)}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 2 }}>
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', mb: 0.25, letterSpacing: '0.12em' }}>ACCOUNT NUMBER</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.90)', fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '0.08em' }}>
                {maskAccount(account?.accountNumber ?? '')}
              </Typography>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.95rem' }}>
              {account?.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddCircleRoundedIcon />}
              onClick={() => navigate('/customer/deposit')}
              sx={{ bgcolor: 'rgba(255,255,255,0.20)', '&:hover': { bgcolor: 'rgba(255,255,255,0.30)' }, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', boxShadow: 'none' }}
              aria-label="Add Money"
            >
              Add Money
            </Button>
            <Button
              variant="contained"
              startIcon={<SendRoundedIcon />}
              onClick={() => navigate('/customer/transfer')}
              sx={{ bgcolor: 'rgba(255,255,255,0.20)', '&:hover': { bgcolor: 'rgba(255,255,255,0.30)' }, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', boxShadow: 'none' }}
              aria-label="Transfer"
            >
              Transfer
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Stats Row */}
      <Box className="stats-grid" sx={{ gridTemplateColumns: 'repeat(3,1fr)', mb: 3 }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 3 }} />)
        ) : (
          <>
            <StatCard icon={CallReceivedRoundedIcon} label="Last Deposit" value={lastDeposit?.amount ?? 0} delay={0} isCurrency />
            <StatCard icon={CallMadeRoundedIcon} label="Last Withdrawal" value={lastWithdrawal?.amount ?? 0} color="#EF4444" delay={0.08} isCurrency />
            <StatCard icon={SwapHorizRoundedIcon} label="Total Transactions" value={txns.length} delay={0.16} />
          </>
        )}
      </Box>

      {/* Recent Transactions */}
      <GlassCard delay={0.3}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Transactions</Typography>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={56} sx={{ mb: 0.5, borderRadius: 2 }} />)
        ) : recent.length === 0 ? (
          <Box className="empty-state">
            <SwapHorizRoundedIcon sx={{ fontSize: 40, opacity: 0.3 }} />
            <Typography variant="body2" color="text.secondary">No transactions yet. Make your first deposit!</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {recent.map((t, i) => {
              const cfg = TXN_ICON[t.transactionType] ?? TXN_ICON.TRANSFER;
              const isCredit = t.transactionType === 'DEPOSIT' || (t.transactionType === 'TRANSFER' && t.toAccountNumber === account?.accountNumber);
              return (
                <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <ListItem
                    disableGutters
                    sx={{
                      py: 1,
                      px: 1.5,
                      borderRadius: 2,
                      mb: 0.5,
                      '&:hover': { bgcolor: 'rgba(37,99,235,0.04)' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${cfg.color}18`, width: 40, height: 40 }}>
                        <cfg.icon sx={{ color: cfg.color, fontSize: 20 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={t.transactionType}
                      secondary={formatRelative(t.timestamp)}
                      primaryTypographyProps={{ sx: { fontWeight: 600, fontSize: '0.88rem' } }}
                      secondaryTypographyProps={{ sx: { fontSize: '0.76rem' } }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: isCredit ? 'success.main' : 'error.main' }}
                    >
                      {isCredit ? '+' : '-'}{formatCurrency(t.amount)}
                    </Typography>
                  </ListItem>
                </motion.div>
              );
            })}
          </List>
        )}
      </GlassCard>
    </Box>
  );
};
